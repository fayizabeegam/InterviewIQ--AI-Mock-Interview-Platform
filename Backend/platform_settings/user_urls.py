from django.urls import path

from platform_settings.views.user.preferences import (
    UserPreferencesAPIView,
)
from platform_settings.views.user.notifications import (
    UserNotificationPreferencesAPIView,
)

urlpatterns = [
    path("settings/preferences/",UserPreferencesAPIView.as_view(),
        name="user-preferences"),
    path("settings/notifications/",UserNotificationPreferencesAPIView.as_view(),
        name="user-notification-preferences"),
]