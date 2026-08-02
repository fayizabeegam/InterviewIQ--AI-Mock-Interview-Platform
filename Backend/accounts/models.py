import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
    )
    bio = models.TextField(blank=True)

    experience_years = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=0,
    )
    current_role = models.CharField(max_length=100, blank=True)

    linkedin_url = models.URLField(blank=True)

    github_url = models.URLField(blank=True)

    is_email_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


