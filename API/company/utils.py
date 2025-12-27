from django.utils import timezone
from datetime import datetime
from .models import Mission, Company, Application, Role
from user_auth.models import MissionUser
from django.db.models.functions import TruncMonth
from django.db.models import Count
from django.db.models import Avg
from student.models import Student, SkillWrapper

def get_missions_per_month(user:MissionUser):
    current_year = timezone.now().year

    # Get missions current year per month
    data = (
        Mission.objects.filter(
            company=user.company,
            created_at__year=current_year
        ).annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total=Count('uuid'))
        .order_by('month')
    )

    # Prepare empty months dict
    stats = {i:0 for i in range(1, 13)}

    # Fill stats
    for entry in data:
        month_number = entry['month'].month
        stats[month_number] = entry['total']
    
    # Prepare and fill missions per month
    missions_per_month = [stats.get(i, 0) for i in range(1, 13)]
    return missions_per_month

def get_applications_rate(user:MissionUser):

    return {
        'pending': Application.objects.filter(mission__company=user.company, status='pending').count(),
        'confirmed': Application.objects.filter(mission__company=user.company, status='confirmed').count(),
        'declined': Application.objects.filter(mission__company=user.company, status='not-validated').count()
    }

def update_student_global_rate(student: Student):
    result = student.roles.filter(rate__gt=0).aggregate(Avg('rate'))

    new_global_rate = result['rate__avg'] or 0.0
    student.global_rate = round(new_global_rate, 2)
    student.save()

def update_skills_proficiency(role: Role):
    student = role.student
    mission = role.mission

    wrappers = SkillWrapper.objects.filter(
        student=student,
        skill__name__in=mission.skills
    )

    for wrapper in wrappers:
        if (wrapper.mission_rate == 0):
            wrapper.mission_rate = role.quality_rate
        else:
            wrapper.mission_rate = (wrapper.mission_rate * 0.7) + (role.quality_rate * 0.3)
        wrapper.save()

