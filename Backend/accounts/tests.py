
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.utils import timezone
from accounts.models import*
from unittest.mock import patch
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


User = get_user_model()


class LoginAPITests(APITestCase):

    def setUp(self):
        self.login_url = reverse("login")

        self.user = User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="TestPass123!",
            first_name="Test",
            last_name="User",
            is_active=True,
            is_email_verified=True,
        )

    def test_login_with_valid_credentials(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "test@example.com",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_login_with_invalid_password(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "test@example.com",
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_unverified_user_cannot_login(self):
        self.user.is_email_verified = False
        self.user.save(update_fields=["is_email_verified"])

        response = self.client.post(
            self.login_url,
            {
                "username": "test@example.com",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_disabled_user_cannot_login(self):
        self.user.is_active = False
        self.user.save(update_fields=["is_active"])

        response = self.client.post(
            self.login_url,
            {
                "username": "test@example.com",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


class ProfileAPITests(APITestCase):

    def test_profile_requires_authentication(self):
        response = self.client.get(
            reverse("profile")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


class RegistrationAPITests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")

        self.valid_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "newuser@example.com",
            "mobile": "9876543210",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }

    @patch("accounts.views.send_verification_email")
    def test_register_with_valid_data(self, mock_send_email):
        response = self.client.post(
            self.register_url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            User.objects.filter(
                email="newuser@example.com"
            ).exists()
        )

        user = User.objects.get(email="newuser@example.com")

        self.assertFalse(user.is_email_verified)
        self.assertTrue(user.check_password("StrongPass123!"))
        mock_send_email.assert_called_once_with(user)

    def test_register_with_duplicate_email(self):
        User.objects.create_user(
            username="newuser@example.com",
            email="newuser@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            self.register_url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_register_with_password_mismatch(self):
        data = self.valid_data.copy()
        data["confirm_password"] = "DifferentPass123!"

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_register_with_weak_password(self):
        data = self.valid_data.copy()
        data["password"] = "weakpassword"
        data["confirm_password"] = "weakpassword"

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )



class EmailVerificationAPITests(APITestCase):

    def setUp(self):
        self.verify_url = reverse("verify-email")

        self.user = User.objects.create_user(
            username="verify@example.com",
            email="verify@example.com",
            password="TestPass123!",
            is_email_verified=False,
        )

        self.otp = OTP.objects.create(
            user=self.user,
            otp="123456",
            purpose="EMAIL_VERIFICATION",
            expires_at=timezone.now() + timedelta(minutes=10),
        )

    def test_verify_email_with_valid_otp(self):
        response = self.client.post(
            self.verify_url,
            {
                "email": self.user.email,
                "otp": "123456",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.otp.refresh_from_db()

        self.assertTrue(self.user.is_email_verified)
        self.assertTrue(self.otp.is_verified)

    def test_verify_email_with_invalid_otp(self):
        response = self.client.post(
            self.verify_url,
            {
                "email": self.user.email,
                "otp": "999999",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_email_verified)

    def test_verify_email_with_expired_otp(self):
        self.otp.expires_at = timezone.now() - timedelta(minutes=1)
        self.otp.save(update_fields=["expires_at"])

        response = self.client.post(
            self.verify_url,
            {
                "email": self.user.email,
                "otp": "123456",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_email_when_otp_does_not_exist(self):
        self.otp.delete()

        response = self.client.post(
            self.verify_url,
            {
                "email": self.user.email,
                "otp": "123456",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_email_for_unknown_user(self):
        response = self.client.post(
            self.verify_url,
            {
                "email": "unknown@example.com",
                "otp": "123456",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ResendOTPAPITests(APITestCase):

    def setUp(self):
        self.resend_url = reverse("resend-otp")

        self.user = User.objects.create_user(
            username="resend@example.com",
            email="resend@example.com",
            password="TestPass123!",
            is_email_verified=False,
        )

    @patch("accounts.views.send_verification_email")
    def test_resend_otp_successfully(self, mock_send_email):
        response = self.client.post(
            self.resend_url,
            {"email": self.user.email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send_email.assert_called_once_with(self.user)

    def test_resend_otp_for_verified_email(self):
        self.user.is_email_verified = True
        self.user.save(update_fields=["is_email_verified"])

        response = self.client.post(
            self.resend_url,
            {"email": self.user.email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resend_otp_for_unknown_user(self):
        response = self.client.post(
            self.resend_url,
            {"email": "unknown@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ForgotPasswordAPITests(APITestCase):

    def setUp(self):
        self.url = reverse("forgot-password")

        self.user = User.objects.create_user(
            username="forgot@example.com",
            email="forgot@example.com",
            password="TestPass123!",
            is_email_verified=True,
        )

    @patch("accounts.views.send_password_reset_email")
    def test_forgot_password_with_valid_email(self, mock_send_email):
        response = self.client.post(
            self.url,
            {"email": self.user.email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(response.data["success"])

        mock_send_email.assert_called_once_with(self.user)

    @patch("accounts.views.send_password_reset_email")
    def test_forgot_password_with_unknown_email(self, mock_send_email):
        response = self.client.post(
            self.url,
            {"email": "unknown@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        mock_send_email.assert_not_called()

    def test_forgot_password_with_invalid_email_format(self):
        response = self.client.post(
            self.url,
            {"email": "invalid-email"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class ResetPasswordAPITests(APITestCase):

    def setUp(self):
        self.url = reverse("reset-password")

        self.user = User.objects.create_user(
            username="reset@example.com",
            email="reset@example.com",
            password="OldPass123!",
            is_email_verified=True,
        )

        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token_generator = PasswordResetTokenGenerator()
        self.token = self.token_generator.make_token(self.user)

        self.valid_data = {
            "uid": self.uid,
            "token": self.token,
            "password": "NewPass123!",
            "confirm_password": "NewPass123!",
        }

    def test_reset_password_with_valid_token(self):
        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPass123!"))
        self.assertFalse(self.user.check_password("OldPass123!"))

    def test_reset_password_with_invalid_token(self):
        data = self.valid_data.copy()
        data["token"] = "invalid-token"

        response = self.client.post(
            self.url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))

    def test_reset_password_with_invalid_uid(self):
        data = self.valid_data.copy()
        data["uid"] = "invalid-uid"

        response = self.client.post(
            self.url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))

    def test_reset_password_with_password_mismatch(self):
        data = self.valid_data.copy()
        data["confirm_password"] = "DifferentPass123!"

        response = self.client.post(
            self.url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))



class ChangePasswordOTPAPITests(APITestCase):

    def setUp(self):
        self.url = reverse("change-password-send-otp")

        self.user = User.objects.create_user(
            username="change@example.com",
            email="change@example.com",
            password="OldPass123!",
            is_email_verified=True,
        )

    @patch("accounts.views.send_change_password_otp")
    def test_send_change_password_otp(self, mock_send_otp):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send_otp.assert_called_once_with(self.user)

    def test_send_change_password_otp_requires_authentication(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ChangePasswordAPITests(APITestCase):

    def setUp(self):
        self.url = reverse("change-password")

        self.user = User.objects.create_user(
            username="change2@example.com",
            email="change2@example.com",
            password="OldPass123!",
            is_email_verified=True,
        )

        self.client.force_authenticate(user=self.user)

        self.otp = OTP.objects.create(
            user=self.user,
            otp="123456",
            purpose="PASSWORD_RESET",
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        self.valid_data = {
            "otp": "123456",
            "password": "NewPass123!",
            "confirm_password": "NewPass123!",
        }

    def test_change_password_with_valid_otp(self):
        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.otp.refresh_from_db()

        self.assertTrue(self.user.check_password("NewPass123!"))
        self.assertFalse(self.user.check_password("OldPass123!"))
        self.assertTrue(self.otp.is_verified)

    def test_change_password_with_invalid_otp(self):
        data = self.valid_data.copy()
        data["otp"] = "999999"

        response = self.client.post(
            self.url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))

    def test_change_password_with_expired_otp(self):
        self.otp.expires_at = timezone.now() - timedelta(minutes=1)
        self.otp.save(update_fields=["expires_at"])

        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))

    def test_change_password_when_otp_does_not_exist(self):
        self.otp.delete()

        response = self.client.post(
            self.url,
            self.valid_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))

    def test_change_password_with_password_mismatch(self):
        data = self.valid_data.copy()
        data["confirm_password"] = "DifferentPass123!"

        response = self.client.post(
            self.url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("OldPass123!"))


class LogoutAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="logoutuser",
            email="logout@example.com",
            password="OldPassword@123"
        )
        self.url = reverse("logout")

    def get_refresh_token(self):
        return str(RefreshToken.for_user(self.user))

    def authenticate_user(self):
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

    def test_logout_with_valid_refresh_token(self):
        refresh = self.get_refresh_token()
        self.authenticate_user()

        response = self.client.post(
            self.url,
            {"refresh": refresh},
            format="json"
        )

        self.assertEqual(response.status_code, 200)

    def test_logout_without_authentication(self):
        refresh = self.get_refresh_token()

        response = self.client.post(
            self.url,
            {"refresh": refresh},
            format="json"
        )

        self.assertEqual(response.status_code, 401)

    def test_logout_without_refresh_token(self):
        self.authenticate_user()

        response = self.client.post(
            self.url,
            {},
            format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_logout_with_invalid_refresh_token(self):
        self.authenticate_user()

        response = self.client.post(
            self.url,
            {"refresh": "invalid-token"},
            format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_logout_with_blacklisted_refresh_token(self):
        refresh = self.get_refresh_token()
        self.authenticate_user()

        first_response = self.client.post(
            self.url,
            {"refresh": refresh},
            format="json"
        )

        self.assertEqual(first_response.status_code, 200)

        second_response = self.client.post(
            self.url,
            {"refresh": refresh},
            format="json"
        )

        self.assertEqual(second_response.status_code, 400)