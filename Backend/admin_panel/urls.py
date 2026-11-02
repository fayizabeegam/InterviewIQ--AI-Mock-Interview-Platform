
from django.urls import path

from admin_panel.views import*

urlpatterns = [
    path("dashboard/stats/",AdminDashboardStatsView.as_view(),name="admin-dashboard-stats"),
    path("users/",AdminUsersListView.as_view(),name="admin-users-list"),
    path("users/<str:pk>/status/",AdminUserStatusUpdateView.as_view(),
         name="admin-user-status-update"),
    path("interviews/",AdminInterviewsListView.as_view(),name="admin-interviews-list"),
]
