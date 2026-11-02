from rest_framework import serializers
from interviews.models import*


class InterviewQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewQuestion
        fields = (
            "id",
            "skill",
            "question",
            "question_type",
            "difficulty",
            "expected_answer",
            "question_order",
            "created_at",
        )

        read_only_fields = (
            "id",
            "created_at",
        )


class InterviewAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewAnswer
        fields = (
            "id",
            "question",
            "answer_text",
            "audio_file",
            "answer_duration",
            "ai_score",
            "strengths",
            "weaknesses",
            "feedback",
            "improvement_suggestions",
            "submitted_at",
        )

        read_only_fields = (
            "id",
            "ai_score",
            "strengths",
            "weaknesses",
            "feedback",
            "improvement_suggestions",
            "submitted_at",
        )


class InterviewReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewReport
        fields = (
            "id",
            "interview",
            "overall_score",
            "technical_score",
            "communication_score",
            "confidence_score",
            "strengths",
            "weaknesses",
            "recommendations",
            "result",
            "generated_at",
        )

        read_only_fields = (
            "id",
            "interview",
            "overall_score",
            "technical_score",
            "communication_score",
            "confidence_score",
            "strengths",
            "weaknesses",
            "recommendations",
            "result",
            "generated_at",
        )


class InterviewSerializer(serializers.ModelSerializer):

    questions = InterviewQuestionSerializer(
        many=True,
        read_only=True,
    )

    report = InterviewReportSerializer(
        read_only=True,
    )

    class Meta:
        model = Interview

        fields = (
            "id",
            "resume",
            "job",
            "interview_type",
            "difficulty",
            "total_questions",
            "duration_minutes",
            "status",
            "started_at",
            "completed_at",
            "created_at",
            "questions",
            "report",
        )

        read_only_fields = (
            "id",
            "status",
            "started_at",
            "completed_at",
            "created_at",
            "questions",
            "report",
        )


class InterviewQuestionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewQuestion
        fields = (
            "question",
            "question_type",
            "difficulty",
            "expected_answer",
            "question_order",
        )