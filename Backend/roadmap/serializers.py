
from rest_framework import serializers
from roadmap.models import*


class RoadmapTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapTask
        fields = [
            "id",
            "roadmap",
            "title",
            "description",
            "priority",
            "status",
            "estimated_hours",
            "due_date",
            "completed_at",
            "week_number",
            "day_number",
            "resource_name",
            "resource_url",
            "created_at",
        ]
        read_only_fields = ["id", "completed_at", "created_at"]


class LearningRoadmapSerializer(serializers.ModelSerializer):
    tasks = RoadmapTaskSerializer(many=True, read_only=True)

    class Meta:
        model = LearningRoadmap
        fields = [
            "id",
            "interview",
            "job",
            "title",
            "description",
            "estimated_duration",
            "status",
            "target_role",
            "focus_areas",
            "tasks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
