from django.urls import path
from accounts.views import *

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/",VerifyEmailView.as_view(),name="verify-email"),
    path("resend-otp/",ResendOTPView.as_view(),name="resend-otp"),
    path("login/", LoginView.as_view(), name="login"),
]