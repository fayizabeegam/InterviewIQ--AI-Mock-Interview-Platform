import uuid

from django.db import models
from resumes.models import Skill
from django.conf import settings
from interviews.models import Interview



LANGUAGE_CHOICES = [
    ("PYTHON", "Python"),
    ("JAVA", "Java"),
    ("JAVASCRIPT", "JavaScript"),
    ("CPP", "C++"),
    ("C", "C"),
    ("CSHARP", "C#"),
]


class CodingQuestion(models.Model):

    DIFFICULTY_CHOICES = [
        ("EASY", "Easy"),
        ("MEDIUM", "Medium"),
        ("HARD", "Hard"),
    ]
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title = models.CharField(max_length=255)
    skill = models.ForeignKey(Skill,on_delete=models.SET_NULL,null=True,
            blank=True,related_name="coding_questions")
    difficulty = models.CharField(max_length=20,choices=DIFFICULTY_CHOICES)
    programming_language = models.CharField(max_length=20,choices=LANGUAGE_CHOICES)
    problem_statement = models.TextField()
    input_format = models.TextField(blank=True)
    output_format = models.TextField(blank=True)
    constraints = models.TextField(blank=True)
    sample_input = models.TextField(blank=True)
    sample_output = models.TextField(blank=True)
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class CodingSubmission(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("RUNNING", "Running"),
        ("PASSED", "Passed"),
        ("FAILED", "Failed"),
    ]

    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    interview = models.ForeignKey(Interview,on_delete=models.CASCADE,
                    related_name="coding_submissions")
    question = models.ForeignKey(CodingQuestion,on_delete=models.CASCADE,
                    related_name="submissions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="coding_submissions"
    )
    programming_language = models.CharField(max_length=20,
                    choices=LANGUAGE_CHOICES )
    source_code = models.TextField()
    execution_output = models.TextField(blank=True)
    execution_time = models.DecimalField(max_digits=5,decimal_places=2,
                    null=True,blank=True)
    memory_used = models.DecimalField(max_digits=8,decimal_places=2,
            null=True,blank=True)
    test_cases_passed = models.PositiveIntegerField(default=0)
    total_test_cases = models.PositiveIntegerField(default=0)
    score = models.DecimalField(max_digits=5,decimal_places=2,default=0)
    ai_feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.question.title}"