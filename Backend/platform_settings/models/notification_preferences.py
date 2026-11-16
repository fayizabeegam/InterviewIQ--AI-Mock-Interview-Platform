
from django.conf import settings
from django.db import models


class NotificationPreferences(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences"
    )

    email_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)

    interview_reminders = models.BooleanField(default=True)
    interview_completion = models.BooleanField(default=True)

    coding_submission_updates = models.BooleanField(default=True)
    resume_analysis_updates = models.BooleanField(default=True)

    learning_reminders = models.BooleanField(default=True)
    platform_announcements = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} Notification Preferences"
