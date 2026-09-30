from django.db import transaction
from rest_framework import status
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from resumes.models import*
from resumes.serializers import*
from core.responses import success_response
from resumes.services import extract_resume_text


class ResumeUploadView(CreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume = serializer.save(user=request.user,
            upload_status="PROCESSING")

        try:
            parsed_text = extract_resume_text(resume)

            resume.parsed_text = parsed_text
            resume.upload_status = "COMPLETED"

            resume.save(
                update_fields=[
                    "parsed_text",
                    "upload_status",
                    "updated_at",
                ]
            )

        except Exception:
            resume.upload_status = "FAILED"

            resume.save(
                update_fields=[
                    "upload_status",
                    "updated_at",
                ]
            )

            raise

        return success_response(
            message="Resume uploaded and processed successfully.",
            data=ResumeSerializer(
                resume,
                context={"request": request}
            ).data,
            status_code=status.HTTP_201_CREATED,
        )


class ResumeListView(ListAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        )


class ResumeDetailView(RetrieveAPIView):
    serializer_class = ResumeDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        )


class ResumeParsedDataView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, resume_id):
        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user
            )
        except Resume.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeParsedDataSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        with transaction.atomic():

            # Remove old parsed records if resume is analyzed again
            resume.educations.all().delete()
            resume.certifications.all().delete()
            resume.languages.all().delete()
            resume.experiences.all().delete()
            resume.projects.all().delete()
            resume.skills.all().delete()

            # -------------------------
            # Education
            # -------------------------

            for education in data["education"]:

                # Education.start_date is required in your model.
                # Skip incomplete AI records instead of saving invalid data.
                if not education.get("start_date"):
                    continue

                Education.objects.create(
                    resume=resume,
                    institution=education["institution"],
                    degree=education["degree"],
                    field_of_study=education.get(
                        "field_of_study",
                        ""
                    ),
                    start_date=education["start_date"],
                    end_date=education.get("end_date")
                )


            # -------------------------
            # Certifications
            # -------------------------

            for certification in data["certifications"]:
                Certification.objects.create(
                    resume=resume,
                    name=certification["name"],
                    issuer=certification.get(
                        "issuer",
                        ""
                    ),
                    start_date=certification.get(
                        "start_date"
                    ),
                    end_date=certification.get(
                        "end_date"
                    )
                )


            # -------------------------
            # Languages
            # -------------------------

            for language in data["languages"]:
                Language.objects.create(
                    resume=resume,
                    name=language["name"],
                    proficiency=language.get(
                        "proficiency",
                        ""
                    )
                )

            # -------------------------
            # Experience
            # -------------------------

            for experience in data["experience"]:

                # Experience.start_date is required in your model.
                if not experience.get("start_date"):
                    continue

                Experience.objects.create(
                    resume=resume,
                    company=experience["company"],
                    designation=experience["designation"],
                    employment_type=experience[
                        "employment_type"
                    ],
                    location=experience.get(
                        "location",
                        ""
                    ),
                    start_date=experience["start_date"],
                    end_date=experience.get("end_date"),
                    currently_working=experience.get(
                        "currently_working",
                        False
                    ),
                    description=experience.get(
                        "description",
                        ""
                    )
                )

            # -------------------------
            # Projects
            # -------------------------

            for project in data["projects"]:

                technologies = ", ".join(
                    project.get("technologies", [])
                )

                Project.objects.create(
                    resume=resume,
                    title=project["title"],
                    description=project.get(
                        "description",
                        ""
                    ),
                    github_url=project.get(
                        "github_url",
                        ""
                    ),
                    live_url=project.get(
                        "live_url",
                        ""
                    ),
                    technologies=technologies,
                    start_date=project.get(
                        "start_date"
                    ),
                    end_date=project.get(
                        "end_date"
                    )
                )

            # -------------------------
            # Skills
            # -------------------------

            for skill_data in data["skills"]:

                skill, created = Skill.objects.update_or_create(
                    name=skill_data["name"],
                    defaults={
                        "category": skill_data["category"],
                         "is_active": True,
                    }
                )

                UserSkill.objects.get_or_create(
                    resume=resume,
                    skill=skill
                )

        return Response(
            {
                "success": True,
                "message": "Resume parsed data saved successfully."
            },
            status=status.HTTP_200_OK
        )
    

class ResumeATSAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get_resume(self, resume_id, user):
        try:
            return Resume.objects.get(
                id=resume_id,
                user=user
            )
        except Resume.DoesNotExist:
            return None

    def get(self, request, resume_id):
        resume = self.get_resume(
            resume_id,
            request.user
        )

        if not resume:
            return Response(
                {
                    "success": False,
                    "message": "Resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            analysis = resume.ats_analysis
        except ATSAnalysis.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "ATS analysis not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ATSAnalysisSerializer(analysis)

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, request, resume_id):
        resume = self.get_resume(
            resume_id,
            request.user
        )

        if not resume:
            return Response(
                {
                    "success": False,
                    "message": "Resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ATSAnalysisInputSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        with transaction.atomic():
            analysis, created = ATSAnalysis.objects.update_or_create(
                resume=resume,
                defaults={
                    "score": data["ats_score"],
                    "summary": data.get("summary", ""),
                    "strengths": data.get("strengths", []),
                    "weaknesses": data.get("weaknesses", []),
                    "suggestions": data.get("suggestions", []),
                    "section_scores": data["section_scores"],
                }
            )

            resume.ats_score = data["ats_score"]

            resume.save(
                update_fields=[
                    "ats_score",
                    "updated_at"
                ]
            )

        output_serializer = ATSAnalysisSerializer(
            analysis
        )

        return Response(
            {
                "success": True,
                "message": "ATS analysis saved successfully.",
                "data": output_serializer.data
            },
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            )
        )