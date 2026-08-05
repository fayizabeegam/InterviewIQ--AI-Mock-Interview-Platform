from datetime import timedelta
from django.utils import timezone
from accounts.models import OTP
from django.conf import settings
from core.utils.Otp import generate_otp
from django.core.mail import EmailMultiAlternatives


def create_email_verification_otp(user):
    """
    Create a new email verification OTP for the user.
    """
    OTP.objects.filter(user=user,purpose="EMAIL_VERIFICATION",
                       is_verified=False).delete()
    otp = OTP.objects.create(user=user,otp=generate_otp(),purpose="EMAIL_VERIFICATION",
            expires_at=timezone.now() + timedelta(minutes=10))

    return otp



def send_verification_email(user):
    otp = create_email_verification_otp(user)

    subject = "Verify your InterviewIQ account"

    html_content = f"""
    <html>
        <body>
            <h2>Welcome to InterviewIQ</h2>

            <p>Hello {user.first_name},</p>

            <p>Your verification code is:</p>

            <h1>{otp.otp}</h1>

            <p>This OTP is valid for 10 minutes.</p>
        </body>
    </html>
    """

    email = EmailMultiAlternatives(
        subject=subject,
        body="Please verify your email.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)

    return otp


