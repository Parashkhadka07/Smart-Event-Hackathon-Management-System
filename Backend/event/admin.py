from django.contrib import admin
from .models import (
	Event,
	Team,
	TeamMember,
	EventRegistration,
	JudgeAssignment,
	ProjectSubmission,
	Judgement,
)

admin.site.register([
	Event,
	Team,
	TeamMember,
	EventRegistration,
	JudgeAssignment,
	ProjectSubmission,
	Judgement,
])
