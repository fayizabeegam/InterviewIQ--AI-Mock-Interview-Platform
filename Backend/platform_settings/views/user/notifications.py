from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from platform_settings.models import NotificationPreferences
from platform_settings.serializers import NotificationPreferencesSerializer


class UserNotificationPreferencesAPIView(RetrieveUpdateAPIView):
    serializer_class = NotificationPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        preferences, _ = NotificationPreferences.objects.get_or_create(
            user=self.request.user
        )
        return preferences