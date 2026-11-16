from django.conf import settings
from django.db import models



class GeneralSettings(models.Model):
    application_name = models.CharField(
        max_length=150,
        default="InterviewIQ"
    )
    application_description = models.TextField(
        blank=True,
        default="AI Powered Smart Interview Assistant"
    )
    support_email = models.EmailField(blank=True)

    timezone = models.CharField(
        max_length=100,
        default="Asia/Kolkata"
    )
    date_format = models.CharField(
        max_length=30,
        default="DD/MM/YYYY"
    )
    time_format = models.CharField(
        max_length=20,
        default="12-hour"
    )
    default_language = models.CharField(
        max_length=20,
        default="en"
    )

    pagination_size = models.PositiveIntegerField(default=10)
    maintenance_mode = models.BooleanField(default=False)
    allow_registration = models.BooleanField(default=True)
    max_upload_size_mb = models.PositiveIntegerField(default=5)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "General Settings"
        verbose_name_plural = "General Settings"

    def __str__(self):
        return self.application_name

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
