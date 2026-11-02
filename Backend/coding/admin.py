from django.contrib import admin
from .models import CodingQuestion, CodingSubmission


@admin.register(CodingQuestion)
class CodingQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "difficulty",
        "programming_language",
        "skill",
    )
    list_filter = ("difficulty", "programming_language")
    search_fields = ("title", "problem_statement")


@admin.register(CodingSubmission)
class CodingSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "question",
        "user",
        "status",
        "score",
        "submitted_at",
    )
    list_filter = ("status", "programming_language")
    search_fields = ("question__title", "user__email")