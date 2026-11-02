
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from interviews.models import Interview
from roadmap.models import*
from roadmap.serializers import*


def get_user_interviews(user):
    """
    Adjust the ownership field to match your Interview model.
    """
    field_names = {
        field.name for field in Interview._meta.get_fields()
    }

    if "user" in field_names:
        return Interview.objects.filter(user=user)

    if "candidate" in field_names:
        return Interview.objects.filter(candidate=user)

    if "created_by" in field_names:
        return Interview.objects.filter(created_by=user)

    raise ValueError(
        "Configure the Interview ownership field in get_user_interviews()."
    )


class RoadmapListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roadmaps = (
            LearningRoadmap.objects
            .filter(interview__in=get_user_interviews(request.user))
            .prefetch_related("tasks")
            .order_by("-created_at")
        )

        serializer = LearningRoadmapSerializer(
            roadmaps, many=True
        )
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        tasks = data.get("tasks", [])

        if not isinstance(tasks, list) or len(tasks) != 30:
            return Response(
                {"error": "A roadmap must contain exactly 30 daily tasks."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview_id = data.get("interview")
        if not interview_id:
            return Response(
                {"error": "An interview ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            interview = get_user_interviews(request.user).get(
                pk=interview_id
            )
        except Interview.DoesNotExist:
            return Response(
                {"error": "Interview not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        with transaction.atomic():
            roadmap = LearningRoadmap.objects.create(
                interview=interview,
                job_id=data.get("job"),
                title=data.get(
                    "title", "Personalized Learning Roadmap"
                ),
                description=data.get("description", ""),
                estimated_duration=data.get(
                    "estimated_duration", "30 days"
                ),
                status="NOT_STARTED",
                target_role=data.get(
                    "target_role", "Python Developer"
                ),
                focus_areas=data.get("focus_areas", []),
            )

            task_objects = []

            for index, task in enumerate(tasks, start=1):
                task_objects.append(
                    RoadmapTask(
                        roadmap=roadmap,
                        title=task.get("title", f"Day {index}"),
                        description=task.get("description", ""),
                        priority=task.get("priority", "MEDIUM"),
                        status="PENDING",
                        estimated_hours=task.get(
                            "estimated_hours", 1
                        ),
                        week_number=task.get(
                            "week_number", ((index - 1) // 7) + 1
                        ),
                        day_number=task.get("day_number", index),
                        resource_name=task.get("resource_name", ""),
                        resource_url=task.get("resource_url", ""),
                    )
                )

            RoadmapTask.objects.bulk_create(task_objects)

        return Response(
            LearningRoadmapSerializer(roadmap).data,
            status=status.HTTP_201_CREATED,
        )


class RoadmapTaskUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        task = get_object_or_404(
            RoadmapTask.objects.filter(
                roadmap__interview__in=get_user_interviews(
                    request.user
                )
            ),
            pk=task_id,
        )

        new_status = request.data.get("status")
        allowed_statuses = {
            "PENDING", "IN_PROGRESS", "COMPLETED"
        }

        if new_status not in allowed_statuses:
            return Response(
                {"error": "Invalid task status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task.status = new_status
        task.completed_at = (
            timezone.now()
            if new_status == "COMPLETED"
            else None
        )

        task.save(update_fields=["status", "completed_at"])

        return Response({
            "id": str(task.id),
            "status": task.status,
            "completed_at": task.completed_at,
        })
