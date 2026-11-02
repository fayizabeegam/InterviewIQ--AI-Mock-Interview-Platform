import io
import wave
import time
from functools import lru_cache
from piper import PiperVoice

from django.conf import settings
from django.http import FileResponse
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from interviews.models import*
from interviews.serializers import*
from interviews.services import*


class InterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class StartInterviewView(generics.GenericAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            interview = Interview.objects.get(
                id=id,
                user=request.user
            )
        except Interview.DoesNotExist:
            return Response(
                {"detail": "Interview not found."},
                status=404
            )

        if interview.status != "PENDING":
            return Response(
                {"detail": "Interview has already been started."},
                status=400
            )

        interview.status = "IN_PROGRESS"
        interview.started_at = timezone.now()
        interview.save(
            update_fields=["status", "started_at"]
        )

        serializer = self.get_serializer(interview)

        return Response(
            serializer.data,
            status=200
        )




class CompleteInterviewView(generics.GenericAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            interview = Interview.objects.get(
                id=id,
                user=request.user
            )
        except Interview.DoesNotExist:
            return Response(
                {"detail": "Interview not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if interview.status != "IN_PROGRESS":
            return Response(
                {
                    "detail": (
                        "Only interviews in progress can be completed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        interview.status = "COMPLETED"
        interview.completed_at = timezone.now()

        interview.save(
            update_fields=["status", "completed_at"]
        )

        serializer = self.get_serializer(interview)

        return Response(
            {
                "detail": "Interview completed successfully.",
                "interview": serializer.data
            },
            status=status.HTTP_200_OK
        )


class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            user=self.request.user
        )



class SaveInterviewQuestionsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            interview = Interview.objects.get(
                id=id,
                user=request.user
            )
        except Interview.DoesNotExist:
            return Response(
                {"detail": "Interview not found."},
                status=404
            )

        questions = request.data.get("questions", [])

        if not questions:
            return Response(
                {"detail": "No questions provided."},
                status=400
            )

        if len(questions) != interview.total_questions:
            return Response(
                {
                    "detail": (
                        f"Expected {interview.total_questions} questions, "
                        f"but received {len(questions)}."
                    )
                },
                status=400
            )

        if interview.questions.exists():
            return Response(
                {"detail": "Questions already exist for this interview."},
                status=400
            )

        created_questions = []

        for index, question_data in enumerate(questions, start=1):
            question = InterviewQuestion.objects.create(
                interview=interview,
                question=question_data.get("question", ""),
                question_type=question_data.get(
                    "question_type",
                    "TECHNICAL"
                ),
                difficulty=question_data.get(
                    "difficulty",
                    interview.difficulty
                ),
                expected_answer=question_data.get(
                    "expected_answer",
                    ""
                ),
                question_order=index,
            )

            created_questions.append(question)

        serializer = InterviewQuestionSerializer(
            created_questions,
            many=True
        )

        return Response(
            serializer.data,
            status=201
        )


class TranscribeInterviewAudioView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            interview = Interview.objects.get(
                id=id,
                user=request.user
            )
        except Interview.DoesNotExist:
            return Response(
                {"detail": "Interview not found."},
                status=404
            )

        audio_file = request.FILES.get("audio")

        if not audio_file:
            return Response(
                {"detail": "Audio file is required."},
                status=400
            )

        try:
            transcript = transcribe_audio(audio_file)

            return Response(
                {
                    "transcript": transcript
                },
                status=200
            )

        except Exception as error:
            print("Whisper error:", error)

            return Response(
                {
                    "detail": "Unable to transcribe audio."
                },
                status=500
            )




@lru_cache(maxsize=1)
def get_piper_voice():
    voice_model = (
        settings.BASE_DIR
        / "voices"
        / "en_US-amy-medium.onnx"
    )
    return PiperVoice.load(str(voice_model))


class PiperTextToSpeechView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        text = request.data.get("text", "")

        if not isinstance(text, str) or not text.strip():
            return Response(
                {"detail": "Text is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        text = text.strip()

        if len(text) > 5000:
            return Response(
                {"detail": "Text must not exceed 5000 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        start_time = time.perf_counter()

        try:
            voice = get_piper_voice()

            audio_buffer = io.BytesIO()

            with wave.open(audio_buffer, "wb") as wav_file:
                voice.synthesize_wav(text, wav_file)

            audio_buffer.seek(0)

            print(
                f"Piper generation took "
                f"{time.perf_counter() - start_time:.2f} seconds"
            )

            return FileResponse(
                audio_buffer,
                content_type="audio/wav",
                filename="interviewer.wav"
            )

        except Exception as error:
            print("Piper error:", error)

            return Response(
                {"detail": "Unable to generate speech."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


