from django.contrib.auth import authenticate
from rest_framework import serializers
from accounts.models import*
import re
from core.utils.password_validator import*

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,min_length=8,
                                     style={"input_type": "password"})

    confirm_password = serializers.CharField(write_only=True,
                                             style={"input_type": "password"})

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
        )

    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email already exist"
            )
        return value

    def validate_password(self, value):
        return validate_password_strength(value)

    def validate(self, attrs):
        validate_password_match(
            attrs["password"],
            attrs["confirm_password"],
        )
        return attrs


    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_active=True,
            is_email_verified=False,

        )
        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "OTP must contain only numbers."
            )
        return value


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "User with this email does not exist."
            )
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        # Find user by username OR email
        user = User.objects.filter(username=username).first()

        if not user:
            user = User.objects.filter(email=username).first()

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

         # Check password
        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid username/email or password."
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                "Account is disabled."
            )

        if not user.is_email_verified and not user.is_superuser:
            raise serializers.ValidationError(
                "Please verify your email before logging in."
            )
        
        attrs["user"] = user
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "No account found with this email."
            )
        return value


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        return validate_password_strength(value)

    def validate(self, attrs):
        validate_password_match(
            attrs["password"],
            attrs["confirm_password"],
        )
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)

    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    confirm_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    def validate_password(self, value):
        return validate_password_strength(value)

    def validate(self, attrs):
        validate_password_match(
            attrs["password"],
            attrs["confirm_password"],
        )
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()





class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "mobile",
            "profile_image",
            "bio",
            "experience_years",
            "current_role",
            "linkedin_url",
            "github_url",
            "is_email_verified",
            "created_at",

        )
        read_only_fields = (
            "id",
            "email",
            "is_email_verified",
            "created_at",
        )