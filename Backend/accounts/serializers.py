from django.contrib.auth import authenticate
from rest_framework import serializers
from accounts.models import*
import re

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
        if len(value)<8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r"[A-Z]",value):
             raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]",value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d",value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r'[!@#$%^&*()_\-+=\[\]{};:"\\|,.<>/?]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
         
        return value


    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
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
        user = authenticate(username=username,password=password)

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                "Account is disabled."
            )
        attrs["user"] = user
        return attrs


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