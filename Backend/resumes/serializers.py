from rest_framework import serializers
from resumes.models import*
from rest_framework import serializers



class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = (
            "id",
            "title",
            "resume_file",
            "ats_score",
            "upload_status",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "ats_score",
            "upload_status",
            "created_at",
            "updated_at",
        )

    def validate_resume_file(self, value):

        allowed_extensions = ["pdf", "docx"]

        extension = value.name.split(".")[-1].lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF and DOCX files are allowed."
            )

        # Maximum 5 MB
        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Resume file size cannot exceed 5 MB."
            )

        return value



class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = (
            "id",
            "institution",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
        )

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = (
            "id",
            "name",
            "issuer",
            "start_date",
            "end_date",
        )


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = (
            "id",
            "name",
            "proficiency",
        )


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = (
            "id",
            "company",
            "designation",
            "employment_type",
            "location",
            "start_date",
            "end_date",
            "currently_working",
            "description",
        )


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "github_url",
            "live_url",
            "technologies",
            "start_date",
            "end_date",
        )


class UserSkillSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    category = serializers.CharField(
        source="skill.category",
        read_only=True
    )

    class Meta:
        model = UserSkill
        fields = (
            "id",
            "name",
            "category",
            "proficiency",
            "years_of_experience",
        )


class ResumeDetailSerializer(serializers.ModelSerializer):
    educations = EducationSerializer(
        many=True,
        read_only=True
    )

    experiences = ExperienceSerializer(
        many=True,
        read_only=True
    )

    projects = ProjectSerializer(
        many=True,
        read_only=True
    )

    skills = UserSkillSerializer(
        many=True,
        read_only=True
    )

    certifications = CertificationSerializer(
        many=True,
        read_only=True
    )

    languages = LanguageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Resume

        fields = (
            "id",
            "title",
            "resume_file",
            "parsed_text",
            "ats_score",
            "upload_status",
            "educations",
            "experiences",
            "projects",
            "skills",
            "certifications",
            "languages",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields

class EducationParsedSerializer(serializers.Serializer):
    institution = serializers.CharField(max_length=255)
    degree = serializers.CharField(max_length=150)

    field_of_study = serializers.CharField(
        max_length=150,
        allow_blank=True,
        required=False,
        default=""
    )

    start_date = serializers.DateField(
        allow_null=True,
        required=False
    )

    end_date = serializers.DateField(
        allow_null=True,
        required=False
    )


class ExperienceParsedSerializer(serializers.Serializer):
    company = serializers.CharField(max_length=255)
    designation = serializers.CharField(max_length=150)

    employment_type = serializers.ChoiceField(
        choices=Experience.EmploymentType
    )

    location = serializers.CharField(
        max_length=150,
        allow_blank=True,
        required=False,
        default=""
    )

    start_date = serializers.DateField(
        allow_null=True,
        required=False
    )

    end_date = serializers.DateField(
        allow_null=True,
        required=False
    )

    currently_working = serializers.BooleanField(
        required=False,
        default=False
    )

    description = serializers.CharField(
        allow_blank=True,
        required=False,
        default=""
    )


class ProjectParsedSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)

    description = serializers.CharField(
        allow_blank=True,
        required=False,
        default=""
    )

    github_url = serializers.URLField(
        allow_blank=True,
        required=False,
        default=""
    )

    live_url = serializers.URLField(
        allow_blank=True,
        required=False,
        default=""
    )

    technologies = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )

    start_date = serializers.DateField(
        allow_null=True,
        required=False
    )

    end_date = serializers.DateField(
        allow_null=True,
        required=False
    )


class SkillParsedSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

    category = serializers.ChoiceField(
        choices=Skill.SkillsCategory
    )



class CertificationParsedSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)

    issuer = serializers.CharField(
        max_length=255,
        allow_blank=True,
        required=False,
        default=""
    )

    start_date = serializers.DateField(
        allow_null=True,
        required=False
    )

    end_date = serializers.DateField(
        allow_null=True,
        required=False
    )


class LanguageParsedSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

    proficiency = serializers.CharField(
        max_length=150,
        allow_blank=True,
        required=False,
        default=""
    )

class ResumeParsedDataSerializer(serializers.Serializer):
    education = EducationParsedSerializer(
        many=True,
        required=False,
        default=list
    )

    experience = ExperienceParsedSerializer(
        many=True,
        required=False,
        default=list
    )

    projects = ProjectParsedSerializer(
        many=True,
        required=False,
        default=list
    )

    skills = SkillParsedSerializer(
        many=True,
        required=False,
        default=list
    )

    certifications = CertificationParsedSerializer(
        many=True,
        required=False,
        default=list
    )

    languages = LanguageParsedSerializer(
        many=True,
        required=False,
        default=list
    )




class ATSSectionScoresSerializer(serializers.Serializer):
    content = serializers.IntegerField(
        min_value=0,
        max_value=100
    )
    skills = serializers.IntegerField(
        min_value=0,
        max_value=100
    )
    experience = serializers.IntegerField(
        min_value=0,
        max_value=100
    )
    projects = serializers.IntegerField(
        min_value=0,
        max_value=100
    )
    education = serializers.IntegerField(
        min_value=0,
        max_value=100
    )
    readability = serializers.IntegerField(
        min_value=0,
        max_value=100
    )


class ATSAnalysisInputSerializer(serializers.Serializer):
    ats_score = serializers.DecimalField(max_digits=5,decimal_places=2,
                                         min_value=0, max_value=100)
    summary = serializers.CharField(allow_blank=True,required=False,default="")
    strengths = serializers.ListField(child=serializers.CharField(),
                                      required=False,default=list)
    weaknesses = serializers.ListField(child=serializers.CharField(),
                                       required=False,default=list)
    suggestions = serializers.ListField(child=serializers.CharField(),required=False,
                                        default=list)
    section_scores = ATSSectionScoresSerializer()


class ATSAnalysisSerializer(serializers.ModelSerializer):
    ats_score = serializers.DecimalField(source="score",max_digits=5,
                                         decimal_places=2,read_only=True)

    class Meta:
        model = ATSAnalysis

        fields = (
            "id",
            "ats_score",
            "summary",
            "strengths",
            "weaknesses",
            "suggestions",
            "section_scores",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields