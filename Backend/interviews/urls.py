from django.urls import path
from interviews.views import*



urlpatterns = [
     path("",InterviewListCreateView.as_view(),name="interview-list-create"),
     path("tts/", PiperTextToSpeechView.as_view(), name="interview-tts"),

     path("<uuid:id>/start/",StartInterviewView.as_view(),name="interview-start"),
     path("<uuid:id>/complete/",CompleteInterviewView.as_view(),name="interview-complete"),
     path("<uuid:pk>/",InterviewDetailView.as_view(),name="interview-detail"),
     path("<uuid:id>/questions/",SaveInterviewQuestionsView.as_view(),
          name="save-interview-questions"),
     path("<uuid:id>/transcribe/",TranscribeInterviewAudioView.as_view(),
         name="interview-transcribe"),
]