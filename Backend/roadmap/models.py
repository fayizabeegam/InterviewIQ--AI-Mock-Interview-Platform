import uuid

from django.db import models
from interviews.models import Interview
from jobs.models import JobDescription


class LearningRoadmap(models.Model):

    STATUS_CHOICES = [
        ("NOT_STARTED", "Not Started"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    ]

    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    interview = models.ForeignKey(Interview,on_delete=models.CASCADE,
                related_name="learning_roadmaps")
    job = models.ForeignKey(JobDescription,on_delete=models.SET_NULL,null=True,
                    blank=True,related_name="learning_roadmaps")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    estimated_duration = models.CharField(max_length=100)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class RoadmapTask(models.Model):
    
    TASK_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    ]

    PRIORITY_CHOICES = [
        ("HIGH", "High"),
        ("MEDIUM", "Medium"),
        ("LOW", "Low"),
    ]

    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    roadmap = models.ForeignKey(LearningRoadmap,on_delete=models.CASCADE,
                    related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=20,choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20,choices=TASK_STATUS_CHOICES)
    estimated_hours = models.PositiveIntegerField()
    due_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title