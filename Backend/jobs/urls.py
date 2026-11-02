from django.urls import path

from jobs.views import*


urlpatterns = [
    path( "",JobDescriptionListCreateView.as_view(),name="job-list-create"),
    path("<uuid:id>/",JobDescriptionDetailView.as_view(),name="job-detail"),
    path("<uuid:job_id>/skills/",JobSkillAnalysisView.as_view(),name="job-skill-analysis"),

]