
from django.urls import path
from coding.views import*

urlpatterns = [
    path("questions/",CodingQuestionListAPIView.as_view(),name="coding-question-list"),
    path("questions/<uuid:pk>/",CodingQuestionDetailAPIView.as_view(),
         name="coding-question-detail"),
    path("submissions/",CodingSubmissionListCreateAPIView.as_view(),
         name="coding-submission-list-create"),
]
