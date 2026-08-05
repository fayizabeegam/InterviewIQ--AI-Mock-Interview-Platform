import uuid
from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(upload_to="profile_images/",
                                      blank=True,null=True)
    bio = models.TextField(blank=True)
    experience_years = models.DecimalField(max_digits=4,decimal_places=1,
                                           default=0)
    current_role = models.CharField(max_length=100, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class OTP(models.Model):

    PURPOSE_CHOICES = [
        ("EMAIL_VERIFICATION", "Email Verification"),
        ("PASSWORD_RESET", "Password Reset"),
    ]

    id = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,
                             related_name="otps")
    otp = models.CharField(max_length=6)
    purpose = models.CharField(max_length=30,choices=PURPOSE_CHOICES)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.purpose}"
