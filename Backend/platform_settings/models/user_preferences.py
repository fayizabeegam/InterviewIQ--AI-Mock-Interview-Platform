
from django.conf import settings
from django.db import models


class UserPreferences(models.Model):

    THEME_CHOICES = [
        ("LIGHT", "Light"),
        ("DARK", "Dark"),
        ("SYSTEM", "System"),
    ]

    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("ml", "Malayalam"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="preferences"
    )

    theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default="SYSTEM"
    )

    language = models.CharField(
        max_length=10,
        choices=LANGUAGE_CHOICES,
        default="en"
    )

    timezone = models.CharField(
        max_length=100,
        default="Asia/Kolkata"
    )

    date_format = models.CharField(
        max_length=30,
        default="DD/MM/YYYY"
    )

    default_interview_difficulty = models.CharField(
        max_length=20,
        default="MEDIUM"
    )

    preferred_programming_language = models.CharField(
        max_length=30,
        default="python"
    )

    editor_theme = models.CharField(
        max_length=30,
        default="vs-dark"
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} Preferences"
