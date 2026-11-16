from rest_framework import serializers
from platform_settings.models import GeneralSettings


class GeneralSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = GeneralSettings
        fields = [
            "id",
            "application_name",
            "application_description",
            "support_email",
            "timezone",
            "date_format",
            "time_format",
            "default_language",
            "pagination_size",
            "maintenance_mode",
            "allow_registration",
            "max_upload_size_mb",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]