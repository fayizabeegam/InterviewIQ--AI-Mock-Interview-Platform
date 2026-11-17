from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from resumes.models import*
from jobs.models import*
from interviews.models import*
from coding.models import*
from roadmap.models import*

from admin_panel.permissions import IsSuperUser


User = get_user_model()


# ====================================
# Admin - Users
# ====================================

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



class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request, pk):
        user = get_object_or_404(
            User.objects.filter(is_superuser=False),
            pk=pk,
        )

        # ==========================================
        # 1. USER ACCOUNT INFORMATION
        # ==========================================

        user_data = {
            "id": str(user.id),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": user.get_full_name() or user.username,
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined,
            "last_login": user.last_login,
            "is_active": user.is_active,
            "is_email_verified": user.is_email_verified,
        }

        # ==========================================
        # 2. RESUME ANALYZER ACTIVITY
        # ==========================================

        resumes = (
            Resume.objects
            .filter(user=user)
            .order_by("-created_at")
        )

        resume_data = []

        for resume in resumes:
            analysis = getattr(resume, "ats_analysis", None)

            resume_data.append({
                "id": str(resume.id),
                "title": resume.title,
                "upload_status": resume.upload_status,
                "ats_score": float(resume.ats_score),
                "created_at": resume.created_at,
                "updated_at": resume.updated_at,
                "analysis": {
                    "score": float(analysis.score),
                    "summary": analysis.summary,
                    "strengths": analysis.strengths,
                    "weaknesses": analysis.weaknesses,
                    "suggestions": analysis.suggestions,
                    "section_scores": analysis.section_scores,
                    "created_at": analysis.created_at,
                } if analysis else None,
            })

        resume_summary = {
            "total_resumes": resumes.count(),
            "completed": resumes.filter(upload_status="COMPLETED").count(),
            "processing": resumes.filter(upload_status="PROCESSING").count(),
            "pending": resumes.filter(upload_status="PENDING").count(),
            "failed": resumes.filter(upload_status="FAILED").count(),
        }

        # ==========================================
        # 3. JOB MATCHER ACTIVITY
        # ==========================================

        job_matches = (
            ResumeMatch.objects
            .filter(resume__user=user)
            .select_related("resume", "job")
            .order_by("-analyzed_at")
        )

        job_match_data = []

        for match in job_matches:
            job_match_data.append({
                "id": str(match.id),
                "resume_id": str(match.resume_id),
                "resume_title": match.resume.title,
                "job_id": str(match.job_id),
                "job_title": match.job.title,
                "company_name": match.job.company_name,
                "overall_score": float(match.overall_score),
                "ats_score": float(match.ats_score),
                "strengths": match.strengths,
                "weaknesses": match.weaknesses,
                "missing_skills": match.missing_skills,
                "recommendations": match.recommendations,
                "analyzed_at": match.analyzed_at,
            })

        job_match_summary = {
            "total_matches": job_matches.count(),
            "average_match_score": (
                round(
                    sum(float(item.overall_score) for item in job_matches)
                    / job_matches.count(),
                    2,
                )
                if job_matches.exists()
                else 0
            ),
        }

        # ==========================================
        # 4. AI INTERVIEW ACTIVITY
        # ==========================================

        interviews = (
            Interview.objects
            .filter(user=user)
            .select_related("report", "resume", "job")
            .order_by("-created_at")
        )

        interview_summary = {
            "total": interviews.count(),
            "completed": interviews.filter(status="COMPLETED").count(),
            "pending": interviews.filter(status="PENDING").count(),
            "in_progress": interviews.filter(status="IN_PROGRESS").count(),
            "cancelled": interviews.filter(status="CANCELLED").count(),
        }

        interview_data = []

        for interview in interviews:
            report = getattr(interview, "report", None)

            interview_data.append({
                "id": str(interview.id),
                "interview_type": interview.get_interview_type_display(),
                "difficulty": interview.get_difficulty_display(),
                "status": interview.status,
                "resume_title": interview.resume.title,
                "job_title": interview.job.title if interview.job else None,
                "total_questions": interview.total_questions,
                "duration_minutes": interview.duration_minutes,
                "started_at": interview.started_at,
                "completed_at": interview.completed_at,
                "created_at": interview.created_at,
                "report": {
                    "overall_score": float(report.overall_score),
                    "technical_score": float(report.technical_score),
                    "communication_score": float(report.communication_score),
                    "confidence_score": float(report.confidence_score),
                    "result": report.result,
                    "generated_at": report.generated_at,
                } if report else None,
            })

        # ==========================================
        # 5. CODING PRACTICE ACTIVITY
        # ==========================================

        submissions = (
            CodingSubmission.objects
            .filter(user=user)
            .order_by("-submitted_at")
        )

        coding_summary = {
            "total_submissions": submissions.count(),
            "questions_attempted": submissions.values(
                "question_id"
            ).distinct().count(),
            "passed": submissions.filter(status="PASSED").count(),
            "failed": submissions.filter(status="FAILED").count(),
            "pending": submissions.filter(status="PENDING").count(),
            "running": submissions.filter(status="RUNNING").count(),
        }

        coding_data = []

        for submission in submissions[:50]:
            coding_data.append({
                "id": str(submission.id),
                "question_id": str(submission.question_id),
                "question_title": submission.question.title,
                "difficulty": submission.question.get_difficulty_display(),
                "programming_language": submission.get_programming_language_display(),
                "status": submission.status,
                "score": float(submission.score),
                "test_cases_passed": submission.test_cases_passed,
                "total_test_cases": submission.total_test_cases,
                "execution_time": (
                    float(submission.execution_time)
                    if submission.execution_time is not None
                    else None
                ),
                "memory_used": (
                    float(submission.memory_used)
                    if submission.memory_used is not None
                    else None
                ),
                "submitted_at": submission.submitted_at,
            })

        # ==========================================
        # 6. LEARNING ROADMAP ACTIVITY
        # ==========================================

        roadmaps = (
            LearningRoadmap.objects
            .filter(interview__user=user)
            .select_related("interview", "job")
            .prefetch_related("tasks")
            .order_by("-created_at")
        )

        roadmap_data = []

        for roadmap in roadmaps:
            tasks = roadmap.tasks.all()

            roadmap_data.append({
                "id": str(roadmap.id),
                "title": roadmap.title,
                "description": roadmap.description,
                "target_role": roadmap.target_role,
                "estimated_duration": roadmap.estimated_duration,
                "status": roadmap.status,
                "focus_areas": roadmap.focus_areas,
                "job_title": roadmap.job.title if roadmap.job else None,
                "interview_id": str(roadmap.interview_id),
                "total_tasks": tasks.count(),
                "completed_tasks": tasks.filter(status="COMPLETED").count(),
                "pending_tasks": tasks.filter(status="PENDING").count(),
                "in_progress_tasks": tasks.filter(status="IN_PROGRESS").count(),
                "created_at": roadmap.created_at,
                "updated_at": roadmap.updated_at,
            })

        roadmap_summary = {
            "total": roadmaps.count(),
            "completed": roadmaps.filter(status="COMPLETED").count(),
            "in_progress": roadmaps.filter(status="IN_PROGRESS").count(),
            "not_started": roadmaps.filter(status="NOT_STARTED").count(),
        }

        # ==========================================
        # 7. COMPLETE ACTIVITY TIMELINE
        # ==========================================

        activity_timeline = []

        for resume in resume_data:
            activity_timeline.append({
                "type": "RESUME",
                "title": "Resume uploaded",
                "description": resume["title"],
                "status": resume["upload_status"],
                "date": resume["created_at"],
                "id": resume["id"],
            })

            if resume["analysis"]:
                activity_timeline.append({
                    "type": "RESUME_ANALYSIS",
                    "title": "Resume analyzed",
                    "description": resume["title"],
                    "status": "COMPLETED",
                    "date": resume["analysis"]["created_at"],
                    "id": resume["id"],
                })

        for match in job_match_data:
            activity_timeline.append({
                "type": "JOB_MATCH",
                "title": "Job match completed",
                "description": (
                    f'{match["job_title"]} - {match["company_name"]}'
                ),
                "status": "COMPLETED",
                "date": match["analyzed_at"],
                "id": match["id"],
            })

        for interview in interview_data:
            activity_timeline.append({
                "type": "INTERVIEW",
                "title": interview["interview_type"],
                "description": interview["difficulty"],
                "status": interview["status"],
                "date": interview["created_at"],
                "id": interview["id"],
            })

        for submission in coding_data:
            activity_timeline.append({
                "type": "CODING",
                "title": submission["question_title"],
                "description": submission["programming_language"],
                "status": submission["status"],
                "date": submission["submitted_at"],
                "id": submission["id"],
            })

        for roadmap in roadmap_data:
            activity_timeline.append({
                "type": "ROADMAP",
                "title": roadmap["title"],
                "description": roadmap["target_role"],
                "status": roadmap["status"],
                "date": roadmap["created_at"],
                "id": roadmap["id"],
            })

        activity_timeline.sort(
            key=lambda item: item["date"],
            reverse=True,
        )

        # ==========================================
        # FINAL RESPONSE
        # ==========================================

        return Response({
            "success": True,
            "data": {
                "user": user_data,

                "resume_summary": resume_summary,
                "resumes": resume_data,

                "job_match_summary": job_match_summary,
                "job_matches": job_match_data,

                "interview_summary": interview_summary,
                "interviews": interview_data,

                "coding_summary": coding_summary,
                "coding_submissions": coding_data,

                "roadmap_summary": roadmap_summary,
                "roadmaps": roadmap_data,

                "activity_timeline": activity_timeline,
            },
        })