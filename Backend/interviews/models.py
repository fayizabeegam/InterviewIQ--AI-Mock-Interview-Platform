import uuid

from django.conf import settings
from django.db import models
from resumes.models import Resume
from jobs.models import JobDescription
from resumes.models import Skill


class Interview(models.Model):

    INTERVIEW_TYPE_CHOICES = [
    ("MOCK", "Mock Interview"),
    ("TECHNICAL", "Technical Interview"),
    ("HR", "HR Interview"),
    ("JOB_SPECIFIC", "Job Specific"),
    ]

    DIFFICULTY_CHOICES = [
        ("EASY", "Easy"),
        ("MEDIUM", "Medium"),
        ("HARD", "Hard"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                         related_name="interviews")

    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,
                related_name="interviews")

    job = models.ForeignKey(JobDescription,on_delete=models.SET_NULL,null=True,
            blank=True,related_name="interviews")

    interview_type = models.CharField(max_length=20,
                choices=INTERVIEW_TYPE_CHOICES)

    difficulty = models.CharField(max_length=20,
                    choices=DIFFICULTY_CHOICES)
    
    total_questions = models.PositiveIntegerField(default=10)
    duration_minutes = models.PositiveIntegerField(default=30)
    status = models.CharField(max_length=20,
                 choices=STATUS_CHOICES,default="PENDING")
    
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.interview_type}"


class InterviewQuestion(models.Model):

    QUESTION_TYPE_CHOICES = [
    ("TECHNICAL", "Technical"),
    ("HR", "HR"),
    ("BEHAVIORAL", "Behavioral"),
    ("CODING", "Coding"),
    ]       

    DIFFICULTY_CHOICES = [
    ("EASY", "Easy"),
    ("MEDIUM", "Medium"),
    ("HARD", "Hard"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview = models.ForeignKey(Interview,on_delete=models.CASCADE,
                    related_name="questions")

    skill = models.ForeignKey(Skill,on_delete=models.SET_NULL, null=True,
            blank=True,related_name="interview_questions")

    question = models.TextField()
    question_type = models.CharField(max_length=20,choices=QUESTION_TYPE_CHOICES)
    difficulty = models.CharField(max_length=20,choices=DIFFICULTY_CHOICES)
    expected_answer = models.TextField(blank=True)
    question_order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["question_order"]

    def __str__(self):
        return f"Question {self.question_order}"



class InterviewAnswer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.OneToOneField(InterviewQuestion,on_delete=models.CASCADE,
                 related_name="answer")
    answer_text = models.TextField(blank=True)
    audio_file = models.FileField(upload_to="interview_answers/",null=True,
                            blank=True)
    answer_duration = models.PositiveIntegerField(help_text="Duration in seconds",
                        default=0)
    ai_score = models.DecimalField(max_digits=5,decimal_places=2,default=0)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    feedback = models.TextField(blank=True)
    improvement_suggestions = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer - {self.question.question_order}"


class InterviewReport(models.Model):

    RESULT_CHOICES = [
    ("PASS", "Pass"),
    ("AVERAGE", "Average"),
    ("NEEDS_IMPROVEMENT", "Needs Improvement"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview = models.OneToOneField(Interview,on_delete=models.CASCADE,
                    related_name="report")
    overall_score = models.DecimalField(max_digits=5,decimal_places=2,
                    default=0)
    technical_score = models.DecimalField(max_digits=5,decimal_places=2,
                    default=0)
    communication_score = models.DecimalField(max_digits=5,decimal_places=2,
                    default=0)
    confidence_score = models.DecimalField(max_digits=5,decimal_places=2,
                default=0)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    result = models.CharField(max_length=25,choices=RESULT_CHOICES)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report - {self.interview.id}"