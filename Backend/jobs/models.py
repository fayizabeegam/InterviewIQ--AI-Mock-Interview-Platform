import uuid
from django.db import models
from django.conf import settings
from resumes.models import Skill
from resumes.models import Resume


class JobDescription(models.Model):
    EmploymentType=( 
        ("FULL_TIME", "Full Time"),
        ("PART_TIME", "Part Time"),
        ("CONTRACT", "Contract"),
        ("INTERN", "Intern"),
        ("FREELANCE", "Freelance")
    )

    ExperienceLevel=(
        ("FRESHER", "Fresher"),
        ("JUNIOR", "Junior"),
        ("MID", "Mid Level"),
        ("SENIOR", "Senior")
    )
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                    on_delete=models.CASCADE,related_name="job_descriptions"
    )
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=150)
    employment_type = models.CharField(max_length=20,
                            choices=EmploymentType,default="FULL_TIME"
    )

    experience_level = models.CharField(max_length=20,choices=ExperienceLevel,
                     default="JUNIOR"
    )
    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    current_ctc = models.DecimalField(max_digits=10,
                        decimal_places=2,null=True,blank=True
    )
    expected_ctc = models.DecimalField(max_digits=10,
                            decimal_places=2,null=True,blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class JobSkill(models.Model):
    JobSkillPriority=(
        ("REQUIRED", "Required"),
        ("PREFERRED", "Preferred")
    )
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    job = models.ForeignKey(JobDescription,on_delete=models.CASCADE,
                            related_name="job_skills")
    skill = models.ForeignKey(Skill,on_delete=models.CASCADE,
                              related_name="job_skills")
    priority = models.CharField(max_length=20,
                                choices=JobSkillPriority,default="REQUIRED")

    class Meta:
        unique_together = ("job", "skill")

    def __str__(self):
        return f"{self.job.title} - {self.skill.name}"


class ResumeMatch(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                               related_name="resume_matches"
    )
    job = models.ForeignKey(JobDescription,on_delete=models.CASCADE,
                          related_name="resume_matches"
    )
    overall_score = models.DecimalField(max_digits=5,decimal_places=2,
                                        default=0)
    ats_score = models.DecimalField(max_digits=5,decimal_places=2,default=0)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    missing_skills = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    analyzed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("resume", "job")

    def __str__(self):
        return f"{self.resume.title} - {self.job.title}"