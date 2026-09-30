import uuid
from django.db import models
from django.conf import settings

class Resume(models.Model):
    UploadStatus = (
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed")
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name="resumes")
    title = models.CharField(max_length=100)
    resume_file = models.FileField(upload_to="resumes/")
    parsed_text = models.TextField(blank= True)
    ats_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    upload_status = models.CharField(max_length=20, choices=UploadStatus,
                                      default= "PENDING") 
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title}"



class Education(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                               related_name="educations"
    )
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150,blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Experience(models.Model):
    EmploymentType = (
        ("FULL_TIME", "Full Time"),
        ("PART_TIME", "Part Time"),
        ("INTERN", "Intern"),
       ( "FREELANCE", "Freelance"),
       ( "CONTRACT", "Contract")
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                                   related_name="experiences"
        )
    company = models.CharField(max_length=255)
    designation = models.CharField(max_length=150)
    employment_type = models.CharField(max_length=20,choices=EmploymentType,
                                       default="FULL_TIME")
    location = models.CharField(max_length=150,blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True,blank=True)
    currently_working = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.designation} - {self.company}"

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                               related_name="projects")

    title = models.CharField(max_length=200)
    description = models.TextField()
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    technologies = models.CharField(max_length=255,
                                    help_text="Comma separated technologies")

    start_date = models.DateField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Skill(models.Model):
    SkillsCategory=(
        ("TECHNICAL", "Technical Skills"),
        ("TOOLS_TECHNOLOGIES", "Tools & Technologies"),
        ("DOMAIN_KNOWLEDGE", "Domain Knowledge"),
        ("MANAGEMENT", "Management"),
        ("COMMUNICATION", "Communication"),
        ("LEADERSHIP", "Leadership"),
        ("ANALYTICAL", "Analytical Skills"),
        ("CREATIVE", "Creative Skills"),
        ("LANGUAGE", "Languages"),
        ("SOFT_SKILL", "Soft Skills"),
        ("OTHER", "Other"),
    )
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,
                          editable=False)

    name = models.CharField(max_length=100,unique=True)
    category = models.CharField(max_length=30,
                                choices=SkillsCategory,default="OTHER")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "skills"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["category"]),
        ]

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    Proficiency=(
        ("BEGINNER", "Beginner"),
        ("INTERMEDIATE", "Intermediate"),
        ("ADVANCED", "Advanced"),
        ("EXPERT", "Expert")
    )
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                               related_name="skills")
    skill = models.ForeignKey( Skill,on_delete=models.SET_NULL,
                              null=True,blank=True,related_name="user_skills")

    other_skill = models.CharField(max_length=100,blank=True,
                        help_text="Enter skill if not available in the list."
    )

    proficiency = models.CharField(max_length=20,choices=Proficiency,
                                   default="INTERMEDIATE")

    years_of_experience = models.DecimalField(max_digits=3,
                                              decimal_places=1,default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_skills"
        ordering = ["skill__name"]
        unique_together = ("resume", "skill")

    def __str__(self):
        if self.skill:
            return self.skill.name
        return self.other_skill


class Certification(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,related_name="certifications")
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255,blank=True)
    start_date = models.DateField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Language(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,related_name="languages")
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=150,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ATSAnalysis(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.OneToOneField(Resume,on_delete=models.CASCADE,
                                  related_name="ats_analysis")
    score = models.DecimalField(max_digits=5,decimal_places=2,default=0)
    summary = models.TextField(blank=True)
    strengths = models.JSONField(default=list,blank=True)
    weaknesses = models.JSONField(default=list,blank=True)
    suggestions = models.JSONField(default=list,blank=True)
    section_scores = models.JSONField(default=dict,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ATS Analysis - {self.resume.title}"