from django.urls import path
from platform_settings.views.admin.general_settings import (
    AdminGeneralSettingsAPIView,
)

urlpatterns = [
    path("settings/general/",AdminGeneralSettingsAPIView.as_view(),
         name="admin-general-settings"),
]