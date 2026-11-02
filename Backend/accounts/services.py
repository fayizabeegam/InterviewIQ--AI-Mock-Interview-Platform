from datetime import timedelta
from django.utils import timezone
from accounts.models import OTP
from pathlib import Path
from django.conf import settings
from core.utils.Otp import generate_otp
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def create_otp(user,purpose):
    """
    Create a new email verification OTP for the user.
    """
    OTP.objects.filter(user=user,purpose=purpose,
                       is_verified=False).delete()
    otp = OTP.objects.create(user=user,otp=generate_otp(),purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10))

    return otp



def send_verification_email(user):

    # 1. Create OTP
    otp = create_otp(
        user,
        "EMAIL_VERIFICATION"
    )

    # 2. Locate React Email HTML
    template_path = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "templates"
        / "emails"
        / "verification_email.html"
    )

    # 3. Read generated HTML
    html_content = template_path.read_text(
        encoding="utf-8"
    )

    # 4. Replace React Email placeholders
    html_content = html_content.replace(
        "{{NAME}}",
        user.first_name or "User"
    )

    html_content = html_content.replace(
        "{{OTP}}",
        otp.otp
    )

    # 5. Create email
    email = EmailMultiAlternatives(
        subject="Verify your InterviewIQ account",
        body="Please verify your email address.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    # 6. Attach React Email HTML
    email.attach_alternative(
        html_content,
        "text/html"
    )

    # 7. Send
    email.send(
        fail_silently=False
    )

    return otp

def send_password_reset_email(user):
    token = PasswordResetTokenGenerator().make_token(user)

    uid = urlsafe_base64_encode(force_bytes(user.pk))

    reset_link = (
        f"http://localhost:5173/reset-password/{uid}/{token}"
    )

    # Locate React Email HTML
    template_path = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "templates"
        / "emails"
        / "password_reset_email.html"
    )

    # Read generated HTML
    html_content = template_path.read_text(
        encoding="utf-8"
    )

    # Replace React Email placeholders
    html_content = html_content.replace(
        "{{NAME}}",
        user.first_name or "User"
    )

    html_content = html_content.replace(
        "{{RESET_LINK}}",
        reset_link
    )

    # Create email
    email = EmailMultiAlternatives(
        subject="Reset your InterviewIQ password",
        body="Please reset your InterviewIQ password.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    # Attach React Email HTML
    email.attach_alternative(
        html_content,
        "text/html"
    )

    # Send email
    email.send(
        fail_silently=False
    )



def send_change_password_otp(user):
    otp = create_otp(user, "PASSWORD_RESET")

    # Locate React Email HTML template
    template_path = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "templates"
        / "emails"
        / "change_password_otp_email.html"
    )

    # Read generated HTML
    html_content = template_path.read_text(encoding="utf-8")

    # Replace React Email placeholders
    html_content = html_content.replace(
        "{{NAME}}",
        user.first_name or "User"
    )

    html_content = html_content.replace(
        "{{OTP}}",
        str(otp.otp)
    )

    # Create email
    email = EmailMultiAlternatives(
        subject="InterviewIQ Password Change OTP",
        body="Your password change OTP is valid for 10 minutes.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    # Attach React Email HTML
    email.attach_alternative(html_content, "text/html")

    # Send email
    email.send(fail_silently=False)

    return otp
