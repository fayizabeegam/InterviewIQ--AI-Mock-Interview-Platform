
from django.urls import path
from admin_panel.views.dashboard.dashboard import*
from admin_panel.views.user.users import*
from admin_panel.views.interviews.interviews import*
from admin_panel.views.coding.bulk_upload import*
from admin_panel.views.coding.all_questions import*
from admin_panel.views.coding.add_questions import*
from admin_panel.views.resumes.resumes import*

urlpatterns = [
     # dashboard
     path("dashboard/stats/",AdminDashboardStatsView.as_view(),name="admin-dashboard-stats"),


     # users
     path("users/",AdminUsersListView.as_view(),name="admin-users-list"),
     path("users/<str:pk>/status/",AdminUserStatusUpdateView.as_view(),
          name="admin-user-status-update"),
     path("users/<uuid:pk>/",AdminUserDetailView.as_view(),name="admin-user-detail"),
     

     # interviews
     path("interviews/",AdminInterviewsListView.as_view(),name="admin-interviews-list"),
     path("interviews/<uuid:pk>/",AdminInterviewDetailView.as_view(),
          name="admin-interview-detail"),


     # Bulk upload
     path("coding/<str:difficulty>/bulk-upload/",AdminBulkUploadAPIView.as_view(),
          name="admin-coding-bulk-upload"),
     path("coding/stats/",AdminCodingQuestionStatsAPIView.as_view(),
          name="admin-coding-stats"),

     # Coding Questions
     path("coding/questions/",AdminQuestionsListAPIView.as_view(),
          name="admin-coding-questions-list"),

     path("coding/questions/<uuid:pk>/",AdminQuestionDetailAPIView.as_view(),
          name="admin-coding-question-detail"),

     # Create Coding Question
     path("coding/questions/create/",AdminQuestionCreateAPIView.as_view(),
          name="admin-coding-question-create"),

     # Update Coding Question
     path("coding/questions/<uuid:pk>/update/",AdminQuestionUpdateAPIView.as_view(),
          name="admin-coding-question-update"),

     # resumes
     path("resumes/stats/",AdminResumeOverviewAPIView.as_view(),
          name="admin-resume-stats"),
     path("resumes/",AdminResumesListAPIView.as_view(),name="admin-resumes-list"),
     path("resumes/<uuid:pk>/",AdminResumeDetailAPIView.as_view(),name="admin-resume-detail"),
     path("resumes/<uuid:pk>/download/",AdminResumeDownloadAPIView.as_view(),
          name="admin-resume-download"),
     path("resumes/<uuid:pk>/delete/",AdminResumeDeleteAPIView.as_view(),
          name="admin-resume-delete"),
]
         

