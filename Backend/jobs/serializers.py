from rest_framework import serializers
from jobs.models import*



class JobSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    class Meta:
        model = JobSkill
        fields = [
            "id",
            "skill",
            "skill_name",
            "priority",
        ]


class JobDescriptionSerializer(serializers.ModelSerializer):
    job_skills = JobSkillSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = JobDescription
        fields = [
            "id",
            "title",
            "company_name",
            "location",
            "employment_type",
            "experience_level",
            "description",
            "responsibilities",
            "qualifications",
            "current_ctc",
            "expected_ctc",
            "is_active",
            "job_skills",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class ResumeMatchSerializer(serializers.ModelSerializer):
    resume_title = serializers.CharField(
        source="resume.title",
        read_only=True
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.company_name",
        read_only=True
    )

    class Meta:
        model = ResumeMatch
        fields = [
            "id",
            "resume",
            "resume_title",
            "job",
            "job_title",
            "company_name",
            "overall_score",
            "ats_score",
            "strengths",
            "weaknesses",
            "missing_skills",
            "recommendations",
            "analyzed_at",
        ]

        read_only_fields = [
            "id",
            "analyzed_at",
        ]


class ParsedJobSkillSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)

    priority = serializers.ChoiceField(
        choices=[
            "REQUIRED",
            "PREFERRED",
        ]
    )


class JobSkillAnalysisSerializer(serializers.Serializer):
    skills = ParsedJobSkillSerializer(
        many=True
    )