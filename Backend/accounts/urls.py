from django.urls import path
from accounts.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("verify-email/",VerifyEmailView.as_view(),name="verify-email"),
    path("resend-otp/",ResendOTPView.as_view(),name="resend-otp"),

    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/",TokenRefreshView.as_view(),name="token-refresh"),

    path("forgot-password/",ForgotPasswordView.as_view(),name="forgot-password"),
    path("reset-password/",ResetPasswordView.as_view(),name="reset-password")
    ,
    path("change-password/send-otp/",ChangePasswordOTPView.as_view(),
                name="change-password-send-otp"),
    path("change-password/",ChangePasswordView.as_view(),name="change-password"),

    path("logout/",LogoutView.as_view(),name="logout"),

    path("profile/",UserProfileView.as_view(),name="profile"
),
]