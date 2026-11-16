from rest_framework import serializers
from platform_settings.models import (
    UserPreferences,
    NotificationPreferences,
)


class UserPreferencesSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserPreferences
        fields = [
            "id",
            "theme",
            "language",
            "timezone",
            "date_format",
            "default_interview_difficulty",
            "preferred_programming_language",
            "editor_theme",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]


class NotificationPreferencesSerializer(serializers.ModelSerializer):

    class Meta:
        model = NotificationPreferences
        fields = [
            "id",
            "email_notifications",
            "in_app_notifications",
            "interview_reminders",
            "interview_completion",
            "coding_submission_updates",
            "resume_analysis_updates",
            "learning_reminders",
            "platform_announcements",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]