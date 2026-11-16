from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from admin_panel.permissions import IsSuperUser
from platform_settings.models import GeneralSettings
from platform_settings.serializers import GeneralSettingsSerializer


class AdminGeneralSettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = GeneralSettingsSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get_object(self):
        return GeneralSettings.get_settings()