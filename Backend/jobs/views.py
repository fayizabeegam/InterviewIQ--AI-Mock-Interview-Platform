from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from jobs.models import*
from jobs.serializers import*
from resumes.models import Skill


class JobDescriptionListCreateView(ListCreateAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(
            user=self.request.user,
            is_active=True
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class JobDescriptionDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return JobDescription.objects.filter(
            user=self.request.user
        )


class JobSkillAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        # Make sure the job belongs to the logged-in user
        try:
            job = JobDescription.objects.get(
                id=job_id,
                user=request.user
            )
        except JobDescription.DoesNotExist:
            return Response(
                {"detail": "Job description not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate AI result
        serializer = JobSkillAnalysisSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        skills_data = serializer.validated_data["skills"]

        # Replace old extracted skills
        job.job_skills.all().delete()

        for skill_data in skills_data:
            skill, _ = Skill.objects.get_or_create(
                name=skill_data["name"]
            )

            JobSkill.objects.create(
                job=job,
                skill=skill,
                priority=skill_data["priority"]
            )

        return Response(
            JobDescriptionSerializer(job).data,
            status=status.HTTP_200_OK
        )