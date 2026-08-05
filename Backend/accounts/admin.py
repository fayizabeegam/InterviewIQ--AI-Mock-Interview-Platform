from django.contrib import admin
from .models import User, OTP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_email_verified",
        "is_staff",
    )
    search_fields = ("email", "first_name", "last_name")


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "purpose",
        "otp",
        "is_verified",
        "expires_at",
        "created_at",
    )
    list_filter = (
        "purpose",
        "is_verified",
    )
    search_fields = ("user__email",)
