
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from coding.models import CodingQuestion, CodingSubmission
from interviews.models import Interview
from resumes.models import Resume

from admin_panel.permissions import IsSuperUser


User = get_user_model()


class AdminDashboardStatsView(APIView):
    """
    Return platform statistics for the admin dashboard.
    Only authenticated Django superusers can access this endpoint.
    """

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        total_users = User.objects.filter(
            is_superuser=False
        ).count()

        total_interviews = Interview.objects.count()
        total_coding_questions = CodingQuestion.objects.count()
        total_resumes = Resume.objects.count()

        interview_statuses = (
            Interview.objects.values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )

        coding_submission_statuses = (
            CodingSubmission.objects.values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )

        return Response({
            "success": True,
            "data": {
                "total_users": total_users,
                "total_interviews": total_interviews,
                "total_coding_questions": total_coding_questions,
                "total_resumes": total_resumes,
                "interview_statuses": {
                    item["status"]: item["total"]
                    for item in interview_statuses
                },
                "coding_submission_statuses": {
                    item["status"]: item["total"]
                    for item in coding_submission_statuses
                },
            },
        })



class AdminUsersListView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        users = (
            User.objects
            .filter(is_superuser=False)
            .order_by("-date_joined")
        )

        data = [
            {
                "id": str(user.id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "name": user.get_full_name() or user.username,
                "email": user.email,
                "date_joined": user.date_joined,
                "is_active": user.is_active,
                "is_email_verified": user.is_email_verified,
            }
            for user in users
        ]

        return Response({
            "success": True,
            "count": len(data),
            "data": data,
        })


class AdminUserStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def patch(self, request, pk):
        user = get_object_or_404(
            User.objects.filter(is_superuser=False),
            pk=pk,
        )

        is_active = request.data.get("is_active")

        if not isinstance(is_active, bool):
            return Response(
                {"message": "is_active must be true or false."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = is_active
        user.save(update_fields=["is_active"])

        return Response(
            {
                "success": True,
                "message": (
                    "User activated successfully."
                    if is_active
                    else "User deactivated successfully."
                ),
                "data": {
                    "id": str(user.id),
                    "is_active": user.is_active,
                },
            },
            status=status.HTTP_200_OK,
        )


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
