
from django.urls import path
from roadmap.views import *

urlpatterns = [
    path("",RoadmapListCreateAPIView.as_view(),name="roadmap-list-create"),
    path("tasks/<uuid:task_id>/",RoadmapTaskUpdateAPIView.as_view(),
         name="roadmap-task-update"),
]
