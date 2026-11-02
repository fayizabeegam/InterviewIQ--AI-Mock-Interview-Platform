
from rest_framework import serializers
from coding.models import*


class CodingQuestionSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True,
        default=None,
    )

    class Meta:
        model = CodingQuestion
        fields = [
            "id",
            "title",
            "skill",
            "skill_name",
            "difficulty",
            "programming_language",
            "problem_statement",
            "input_format",
            "output_format",
            "constraints",
            "sample_input",
            "sample_output",
            "explanation",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CodingSubmissionSerializer(serializers.ModelSerializer):
    question_title = serializers.CharField(
        source="question.title",
        read_only=True,
    )

    class Meta:
        model = CodingSubmission
        fields = [
            "id",
            "interview",
            "question",
            "question_title",
            "user",
            "programming_language",
            "source_code",
            "execution_output",
            "execution_time",
            "memory_used",
            "test_cases_passed",
            "total_test_cases",
            "score",
            "ai_feedback",
            "status",
            "submitted_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "execution_output",
            "execution_time",
            "memory_used",
            "test_cases_passed",
            "total_test_cases",
            "score",
            "ai_feedback",
            "status",
            "submitted_at",
        ]

    def validate_source_code(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Source code cannot be empty."
            )
        return value
