from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.EventListCreateView.as_view(), name='event-list-create'),
    path('events/<uuid:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('events/<uuid:event_id>/register/', views.register_for_event, name='register-for-event'),
    path('events/<uuid:event_id>/leaderboard/', views.event_leaderboard, name='event-leaderboard'),
    path('teams/', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<uuid:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('team-members/', views.TeamMemberListCreateView.as_view(), name='team-member-list-create'),
    path('team-members/<uuid:pk>/', views.TeamMemberDetailView.as_view(), name='team-member-detail'),
    path('submissions/', views.ProjectSubmissionListCreateView.as_view(), name='submission-list-create'),
    path('submissions/<uuid:pk>/', views.ProjectSubmissionDetailView.as_view(), name='submission-detail'),
    path('judgements/', views.JudgementListCreateView.as_view(), name='judgement-list-create'),
    path('judgements/<uuid:pk>/', views.JudgementDetailView.as_view(), name='judgement-detail'),
    path('registrations/', views.EventRegistrationListCreateView.as_view(), name='registration-list-create'),
    path('registrations/<uuid:pk>/', views.EventRegistrationDetailView.as_view(), name='registration-detail'),
    path('judge-assignments/', views.JudgeAssignmentListCreateView.as_view(), name='judge-assignment-list-create'),
]
