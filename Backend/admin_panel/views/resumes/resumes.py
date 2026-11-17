
from django.db.models import Avg, Count, Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import status
from django.http import FileResponse

from resumes.models import Resume
from admin_panel.permissions import IsSuperUser


# ====================================
# Admin - Resume Overview Statistics
# ====================================

class AdminResumeOverviewAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):

        resumes = Resume.objects.all()

        # --------------------------------
        # Resume Status Statistics
        # --------------------------------

        total_resumes = resumes.count()

        completed = resumes.filter(
            upload_status="COMPLETED"
        ).count()

        processing = resumes.filter(
            upload_status="PROCESSING"
        ).count()

        failed = resumes.filter(
            upload_status="FAILED"
        ).count()

        pending = resumes.filter(
            upload_status="PENDING"
        ).count()

        # --------------------------------
        # Average ATS Score
        # --------------------------------

        average_ats_score = resumes.filter(
            upload_status="COMPLETED"
        ).aggregate(
            average=Avg("ats_score")
        )["average"] or 0

        # --------------------------------
        # ATS Score Distribution
        # --------------------------------

        score_distribution = resumes.filter(
            upload_status="COMPLETED"
        ).aggregate(
            excellent=Count(
                "id",
                filter=Q(ats_score__gte=80)
            ),
            good=Count(
                "id",
                filter=Q(ats_score__gte=60, ats_score__lt=80)
            ),
            needs_improvement=Count(
                "id",
                filter=Q(ats_score__lt=60)
            ),
        )

        # --------------------------------
        # Final Response
        # --------------------------------

        return Response({
            "success": True,
            "data": {
                "total_resumes": total_resumes,
                "completed": completed,
                "processing": processing,
                "failed": failed,
                "pending": pending,

                "average_ats_score": round(
                    float(average_ats_score), 2
                ),

                "score_distribution": {
                    "excellent": score_distribution["excellent"],
                    "good": score_distribution["good"],
                    "needs_improvement": score_distribution[
                        "needs_improvement"
                    ],
                },
            }
        })



# ====================================
# Admin - List All Resumes
# ====================================

class AdminResumesListAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):

        # --------------------------------
        # Base Queryset
        # --------------------------------

        resumes = (
            Resume.objects
            .select_related("user")
            .order_by("-created_at")
        )

        # --------------------------------
        # Search
        # --------------------------------

        search = request.query_params.get("search", "").strip()

        if search:
            resumes = resumes.filter(
                Q(title__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__username__icontains=search)
            )

        # --------------------------------
        # Status Filter
        # --------------------------------

        upload_status = request.query_params.get("status", "").upper()

        valid_statuses = [
            "PENDING",
            "PROCESSING",
            "COMPLETED",
            "FAILED",
        ]

        if upload_status:
            if upload_status not in valid_statuses:
                return Response({
                    "success": False,
                    "message": "Invalid upload status."
                }, status=400)

            resumes = resumes.filter(
                upload_status=upload_status
            )

        # --------------------------------
        # ATS Score Filter
        # --------------------------------

        score_filter = request.query_params.get("score", "").upper()

        if score_filter == "HIGH":
            resumes = resumes.filter(
                ats_score__gte=80,
                upload_status="COMPLETED"
            )

        elif score_filter == "MEDIUM":
            resumes = resumes.filter(
                ats_score__gte=60,
                ats_score__lt=80,
                upload_status="COMPLETED"
            )

        elif score_filter == "LOW":
            resumes = resumes.filter(
                ats_score__lt=60,
                upload_status="COMPLETED"
            )

        elif score_filter not in ["", "ALL"]:
            return Response({
                "success": False,
                "message": "Invalid ATS score filter."
            }, status=400)

        # --------------------------------
        # Upload Date Filter
        # --------------------------------

        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if date_from:
            parsed_date = parse_date(date_from)

            if not parsed_date:
                return Response({
                    "success": False,
                    "message": "Invalid date_from. Use YYYY-MM-DD."
                }, status=400)

            resumes = resumes.filter(
                created_at__date__gte=parsed_date
            )

        if date_to:
            parsed_date = parse_date(date_to)

            if not parsed_date:
                return Response({
                    "success": False,
                    "message": "Invalid date_to. Use YYYY-MM-DD."
                }, status=400)

            resumes = resumes.filter(
                created_at__date__lte=parsed_date
            )

        # --------------------------------
        # Pagination
        # --------------------------------

        try:
            page_number = int(request.query_params.get("page", 1))
            page_size = int(request.query_params.get("page_size", 10))

            if page_number < 1 or page_size < 1:
                raise ValueError

            if page_size > 100:
                page_size = 100

        except (ValueError, TypeError):
            return Response({
                "success": False,
                "message": "Invalid pagination parameters."
            }, status=400)

        paginator = Paginator(resumes, page_size)
        page_obj = paginator.get_page(page_number)

        # --------------------------------
        # Serialize Resume Data
        # --------------------------------

        data = []

        for resume in page_obj.object_list:

            user = resume.user

            resume_file_url = None

            if resume.resume_file:
                resume_file_url = request.build_absolute_uri(
                    resume.resume_file.url
                )

            data.append({
                "id": str(resume.id),

                "user": {
                    "id": str(user.id),
                    "name": (
                        user.get_full_name()
                        or user.username
                        or user.email
                    ),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },

                "title": resume.title,
                "resume_file": resume_file_url,
                "file_name": resume.resume_file.name.split("/")[-1]
                if resume.resume_file else None,

                "ats_score": float(resume.ats_score),
                "upload_status": resume.upload_status,

                "created_at": resume.created_at,
                "updated_at": resume.updated_at,
            })

        # --------------------------------
        # Final Response
        # --------------------------------

        return Response({
            "success": True,
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "page_size": page_size,
            "next_page": (
                page_obj.next_page_number()
                if page_obj.has_next()
                else None
            ),
            "previous_page": (
                page_obj.previous_page_number()
                if page_obj.has_previous()
                else None
            ),
            "data": data,
        })


# ====================================
# Admin - Resume Details
# ====================================

class AdminResumeDetailAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request, pk):

        # --------------------------------
        # Get Resume
        # --------------------------------

        resume = get_object_or_404(
            Resume.objects
            .select_related("user", "ats_analysis")
            .prefetch_related(
                "educations",
                "experiences",
                "projects",
                "skills__skill",
                "certifications",
                "languages",
            ),
            pk=pk
        )

        user = resume.user

        # --------------------------------
        # Resume File
        # --------------------------------

        resume_file_url = None

        if resume.resume_file:
            resume_file_url = request.build_absolute_uri(
                resume.resume_file.url
            )

        # --------------------------------
        # ATS Analysis
        # --------------------------------

        try:
            analysis = resume.ats_analysis

            analysis_data = {
                "score": float(analysis.score),
                "summary": analysis.summary,
                "strengths": analysis.strengths,
                "weaknesses": analysis.weaknesses,
                "suggestions": analysis.suggestions,
                "section_scores": analysis.section_scores,
                "created_at": analysis.created_at,
                "updated_at": analysis.updated_at,
            }

        except Resume.ats_analysis.RelatedObjectDoesNotExist:
            analysis_data = None

        # --------------------------------
        # Education
        # --------------------------------

        education_data = []

        for education in resume.educations.all():

            education_data.append({
                "id": str(education.id),
                "institution": education.institution,
                "degree": education.degree,
                "field_of_study": education.field_of_study,
                "start_date": education.start_date,
                "end_date": education.end_date,
            })

        # --------------------------------
        # Experience
        # --------------------------------

        experience_data = []

        for experience in resume.experiences.all():

            experience_data.append({
                "id": str(experience.id),
                "company": experience.company,
                "designation": experience.designation,
                "employment_type": experience.employment_type,
                "location": experience.location,
                "start_date": experience.start_date,
                "end_date": experience.end_date,
                "currently_working": experience.currently_working,
                "description": experience.description,
            })

        # --------------------------------
        # Projects
        # --------------------------------

        project_data = []

        for project in resume.projects.all():

            project_data.append({
                "id": str(project.id),
                "title": project.title,
                "description": project.description,
                "github_url": project.github_url,
                "live_url": project.live_url,
                "technologies": project.technologies,
                "start_date": project.start_date,
                "end_date": project.end_date,
            })

        # --------------------------------
        # Skills
        # --------------------------------

        skill_data = []

        for user_skill in resume.skills.all():

            skill_data.append({
                "id": str(user_skill.id),
                "skill_id": (
                    str(user_skill.skill_id)
                    if user_skill.skill_id else None
                ),
                "name": (
                    user_skill.skill.name
                    if user_skill.skill else user_skill.other_skill
                ),
                "category": (
                    user_skill.skill.category
                    if user_skill.skill else "OTHER"
                ),
                "proficiency": user_skill.proficiency,
                "years_of_experience": float(
                    user_skill.years_of_experience
                ),
            })

        # --------------------------------
        # Certifications
        # --------------------------------

        certification_data = []

        for certification in resume.certifications.all():

            certification_data.append({
                "id": str(certification.id),
                "name": certification.name,
                "issuer": certification.issuer,
                "start_date": certification.start_date,
                "end_date": certification.end_date,
            })

        # --------------------------------
        # Languages
        # --------------------------------

        language_data = []

        for language in resume.languages.all():

            language_data.append({
                "id": str(language.id),
                "name": language.name,
                "proficiency": language.proficiency,
            })

        # --------------------------------
        # Candidate Information
        # --------------------------------

        candidate_data = {
            "id": str(user.id),
            "name": (
                user.get_full_name()
                or user.username
                or user.email
            ),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined,
            "is_active": user.is_active,
            "is_email_verified": getattr(user, "is_email_verified", None),
        }

        # --------------------------------
        # Final Response
        # --------------------------------

        data = {
            "id": str(resume.id),

            "candidate": candidate_data,

            "title": resume.title,
            "resume_file": resume_file_url,
            "file_name": (
                resume.resume_file.name.split("/")[-1]
                if resume.resume_file else None
            ),

            "upload_status": resume.upload_status,
            "ats_score": float(resume.ats_score),
            "parsed_text": resume.parsed_text,

            "created_at": resume.created_at,
            "updated_at": resume.updated_at,

            "ats_analysis": analysis_data,

            "educations": education_data,
            "experiences": experience_data,
            "projects": project_data,
            "skills": skill_data,
            "certifications": certification_data,
            "languages": language_data,
        }

        return Response({
            "success": True,
            "data": data,
        })

# ====================================
# Admin - Download Resume
# ====================================

class AdminResumeDownloadAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request, pk):

        resume = get_object_or_404(
            Resume,
            pk=pk
        )

        if not resume.resume_file:
            return Response({
                "success": False,
                "message": "Resume file not found."
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            resume.resume_file.open("rb")

            file_name = resume.resume_file.name.split("/")[-1]

            return FileResponse(
                resume.resume_file,
                as_attachment=True,
                filename=file_name
            )

        except (OSError, ValueError):
            return Response({
                "success": False,
                "message": "Unable to access resume file."
            }, status=status.HTTP_404_NOT_FOUND)


# ====================================
# Admin - Delete Resume
# ====================================

class AdminResumeDeleteAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def delete(self, request, pk):

        resume = get_object_or_404(
            Resume,
            pk=pk
        )

        file_field = resume.resume_file
        file_name = file_field.name if file_field else None
        storage = file_field.storage if file_field else None

        with transaction.atomic():
            resume.delete()

        if file_name and storage:
            try:
                storage.delete(file_name)
            except Exception:
                # Log the storage error in production
                pass

        return Response({
            "success": True,
            "message": "Resume deleted successfully."
        }, status=status.HTTP_200_OK)