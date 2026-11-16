
from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from coding.models import CodingQuestion, CodingSubmission
from interviews.models import Interview
from resumes.models import Resume

from admin_panel.permissions import IsSuperUser


User = get_user_model()

# ====================================
# Admin Dashboard
# ====================================

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

