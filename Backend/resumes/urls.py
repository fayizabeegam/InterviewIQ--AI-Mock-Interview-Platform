from django.urls import path
from resumes.views import*


urlpatterns = [
    path("upload/",ResumeUploadView.as_view(),name="resume-upload"),
    path("",ResumeListView.as_view(),name="resume-list"),
    path("<uuid:id>/",ResumeDetailView.as_view(),name="resume-detail"),
    path("<uuid:resume_id>/parsed-data/",ResumeParsedDataView.as_view(),
         name="resume-parsed-data"),
    path("<uuid:resume_id>/ats-analysis/",ResumeATSAnalysisView.as_view(),
         name="resume-ats-analysis"),

]