from rest_framework import status
from rest_framework.generics import CreateAPIView,GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from accounts.serializers import*
from core.responses import success_response
from accounts.models import User, OTP
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.services import*
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from core.utils.email import send_email
from core.utils.Otp import*


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

        # print("EMAIL:", email)
        # print("ENTERED OTP:", entered_otp)

        user = User.objects.filter(email=email).first()

        # print("USER:", user)

        if not user:
            raise ValueError("User not found.")

        

        otp_obj = OTP.objects.filter(
            user=user,
            purpose="EMAIL_VERIFICATION",
            is_verified=False,
        ).order_by("-created_at").first()

        # print("OTP OBJECT:", otp_obj)
        # print("ENTERED OTP:", entered_otp)
        # print("STORED OTP:", otp_obj.otp)
        # print("EXPIRED:", otp_obj.is_expired())

        validate_otp(otp_obj, entered_otp)

        otp_obj.is_verified = True
        otp_obj.save(update_fields=["is_verified"])

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
                    "is_superuser": user.is_superuser,
                    "is_staff": user.is_staff,
                }
            }

        )


class ForgotPasswordView(GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        user = User.objects.get(email=email)

        send_password_reset_email(user)

        return success_response(
            message="Password reset link has been sent to your email."
        )


class ResetPasswordView(GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        password = serializer.validated_data["password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError("Invalid reset link.")

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise ValidationError("Reset link is invalid or has expired.")

        user.set_password(password)
        user.save(update_fields=["password"])

        return success_response(
            message="Password reset successfully."
        )


class ChangePasswordOTPView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        send_change_password_otp(request.user)

        return success_response(
            message="OTP sent successfully."
        )


class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        otp = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]

        otp_obj = OTP.objects.filter(
            user=user,
            purpose="PASSWORD_RESET",
            is_verified=False,
        ).order_by("-created_at").first()

        validate_otp(otp_obj, otp)

        user.set_password(password)
        user.save()

        otp_obj.is_verified = True
        otp_obj.save(update_fields=["is_verified"])

        return success_response(
            message="Password changed successfully."
        )



class LogoutView(GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception:
            raise ValidationError({
                "refresh": "Invalid refresh token."
            })

        return success_response(
            message="Logout successful."
        )



class UserProfileView(GenericAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = self.get_serializer(
            request.user,
            context={"request": request}
        )

        return success_response(
            message="Profile fetched successfully.",
            data=serializer.data
        )

    def patch(self, request):
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return success_response(
            message="Profile updated successfully.",
            data=serializer.data
        )