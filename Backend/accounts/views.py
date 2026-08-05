from rest_framework import status
from rest_framework.generics import CreateAPIView,GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.serializers import*
from core.responses import success_response
from accounts.models import User, OTP
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.services import send_verification_email


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)

        user = serializer.save()

        send_verification_email(user)

        return success_response(
             message="User registered successfully.",
            data={
                "id": str(user.id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_email_verified": user.is_email_verified,
            },
            status_code=status.HTTP_201_CREATED,
        )



class VerifyEmailView(GenericAPIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        entered_otp = serializer.validated_data["otp"]

        user = User.objects.filter(email=email).first()

        if not user:
            raise ValueError("User not found.")

        otp = OTP.objects.filter(
            user=user,
            purpose="EMAIL_VERIFICATION",
            is_verified=False,
        ).order_by("-created_at").first()

        if not otp:
            raise ValueError("No verification OTP found.")

        if otp.is_expired():
            raise ValueError("OTP has expired.")

        if otp.otp != entered_otp:
            raise ValueError("Invalid OTP.")

        otp.is_verified = True
        otp.save(update_fields=["is_verified"])

        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        return success_response(
            message="Email verified successfully.",
            data={
                "email": user.email,
                "is_email_verified": user.is_email_verified,
            },
        )

class ResendOTPView(GenericAPIView):
    serializer_class = ResendOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        user = User.objects.filter(email=email).first()

        if user.is_email_verified:
            raise ValidationError(
                "Email is already verified."
            )

        send_verification_email(user)

        return success_response(
            message="Verification OTP sent successfully."
        )



class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self,request):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return success_response(
            message="Login successful.",
            data={
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": str(user.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "is_email_verified": user.is_email_verified,
                }
            }

        )