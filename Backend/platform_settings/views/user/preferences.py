from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from platform_settings.models import UserPreferences
from platform_settings.serializers import UserPreferencesSerializer


class UserPreferencesAPIView(RetrieveUpdateAPIView):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        preferences, _ = UserPreferences.objects.get_or_create(
            user=self.request.user
        )
        return preferences