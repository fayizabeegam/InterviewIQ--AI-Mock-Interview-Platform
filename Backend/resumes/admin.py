from django.contrib import admin
from .models import (
    Resume,
    Education,
    Experience,
    Project,
    Skill,
    UserSkill,
)

admin.site.register(Resume)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(UserSkill)