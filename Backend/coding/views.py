
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from coding.models import*
from coding.serializers import*


class CodingQuestionListAPIView(generics.ListAPIView):
    serializer_class = CodingQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = CodingQuestion.objects.select_related("skill").all()

        difficulty = self.request.query_params.get("difficulty")
        search = self.request.query_params.get("search")
        topic = self.request.query_params.get("topic")

        if difficulty:
            queryset = queryset.filter(
                difficulty__iexact=difficulty
            )

        if search:
            queryset = queryset.filter(title__icontains=search)

        if topic:
            queryset = queryset.filter(
                skill__name__icontains=topic
            )

        return queryset.order_by("title")


class CodingQuestionDetailAPIView(generics.RetrieveAPIView):
    queryset = CodingQuestion.objects.select_related("skill").all()
    serializer_class = CodingQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class CodingSubmissionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CodingSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CodingSubmission.objects.filter(
            user=self.request.user
        ).select_related("question", "interview").order_by("-submitted_at")

    def perform_create(self, serializer):
        interview = serializer.validated_data["interview"]

        # Ensure the interview belongs to the logged-in user.
        ownership_fields = [
            field.name
            for field in interview._meta.fields
        ]

        owner_field = next(
            (
                field
                for field in ("user", "candidate", "created_by")
                if field in ownership_fields
            ),
            None,
        )

        if owner_field is None:
            raise PermissionDenied(
                "Interview ownership cannot be verified. "
                "Configure the correct ownership field."
            )

        if getattr(interview, f"{owner_field}_id") != self.request.user.id:
            raise PermissionDenied(
                "You cannot submit code for another user's interview."
            )

        # Execution will be implemented separately.
        serializer.save(
            user=self.request.user,
            status="PENDING",
        )
