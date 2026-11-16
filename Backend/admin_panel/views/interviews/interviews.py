from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from interviews.models import Interview
from admin_panel.permissions import IsSuperUser


User = get_user_model()


# ====================================
# Admin - Interviews
# ====================================

class AdminInterviewsListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        interviews = (
            Interview.objects
            .select_related("user")
            .order_by("-created_at")
        )

        data = []

        for interview in interviews:
            user = interview.user

            data.append({
                "id": str(interview.pk),
                "user_id": str(user.pk) if user else None,
                "user_name": (
                    user.get_full_name()
                    or user.email
                    if user else "Unknown User"
                ),
                "user_email": user.email if user else "",
                "interview_type": interview.interview_type,
                "difficulty": interview.difficulty,
                "total_questions": interview.total_questions,
                "duration_minutes": interview.duration_minutes,
                "status": interview.status,
                "started_at": interview.started_at,
                "completed_at": interview.completed_at,
                "created_at": interview.created_at,
            })

        return Response({
            "success": True,
            "count": len(data),
            "data": data,
        })



class AdminInterviewDetailView(APIView):
    """
    Retrieve complete interview information for admin review.
    Only authenticated superusers can access this endpoint.
    """

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request, pk):
        interview = get_object_or_404(
            Interview.objects
            .select_related("user", "resume", "job", "report")
            .prefetch_related("questions__answer"),
            pk=pk,
        )

        user = interview.user

        questions_data = []

        for question in interview.questions.all():
            answer = getattr(question, "answer", None)

            audio_url = None

            if answer and answer.audio_file:
                audio_url = request.build_absolute_uri(
                    answer.audio_file.url
                )

            questions_data.append({
                "id": str(question.id),
                "question": question.question,
                "question_type": question.question_type,
                "difficulty": question.difficulty,
                "question_order": question.question_order,
                "expected_answer": question.expected_answer,
                "skill_id": (
                    str(question.skill_id)
                    if question.skill_id else None
                ),
                "answer": {
                    "answer_text": answer.answer_text,
                    "audio_file": audio_url,
                    "answer_duration": answer.answer_duration,
                    "ai_score": answer.ai_score,
                    "strengths": answer.strengths,
                    "weaknesses": answer.weaknesses,
                    "feedback": answer.feedback,
                    "improvement_suggestions": (
                        answer.improvement_suggestions
                    ),
                    "submitted_at": answer.submitted_at,
                } if answer else None,
            })

        report = getattr(interview, "report", None)

        report_data = None

        if report:
            report_data = {
                "overall_score": report.overall_score,
                "technical_score": report.technical_score,
                "communication_score": report.communication_score,
                "confidence_score": report.confidence_score,
                "strengths": report.strengths,
                "weaknesses": report.weaknesses,
                "recommendations": report.recommendations,
                "result": report.result,
                "generated_at": report.generated_at,
            }

        data = {
            "id": str(interview.id),
            "candidate": {
                "id": str(user.id),
                "name": user.get_full_name() or user.username,
                "email": user.email,
            },
            "interview_type": interview.interview_type,
            "difficulty": interview.difficulty,
            "total_questions": interview.total_questions,
            "duration_minutes": interview.duration_minutes,
            "status": interview.status,
            "resume_id": (
                str(interview.resume_id)
                if interview.resume_id else None
            ),
            "job_id": (
                str(interview.job_id)
                if interview.job_id else None
            ),
            "started_at": interview.started_at,
            "completed_at": interview.completed_at,
            "created_at": interview.created_at,
            "questions": questions_data,
            "report": report_data,
        }

        return Response({
            "success": True,
            "data": data,
        })

