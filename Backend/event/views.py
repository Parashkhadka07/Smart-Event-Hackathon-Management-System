from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Event, Team, TeamMember, ProjectSubmission, Judgement, EventRegistration, JudgeAssignment
from .serializers import (
    EventSerializer,
    TeamSerializer,
    ProjectSubmissionSerializer,
    JudgementSerializer,
    EventRegistrationSerializer,
    JudgeAssignmentSerializer,
    TeamMemberSerializer,
)


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return Event.objects.filter(organizer=self.request.user)
        if self.request.user.role == 'judge':
            return Event.objects.filter(judge_assignments__judge=self.request.user, judge_assignments__active=True).distinct()
        return Event.objects.exclude(status='draft')

    def perform_create(self, serializer):
        if self.request.user.role != 'organizer':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only organizers can create events.')
        serializer.save(organizer=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return Event.objects.filter(organizer=self.request.user)
        if self.request.user.role == 'judge':
            return Event.objects.filter(judge_assignments__judge=self.request.user, judge_assignments__active=True).distinct()
        return Event.objects.exclude(status='draft')

    def perform_update(self, serializer):
        current_status = self.get_object().status
        next_status = serializer.validated_data.get('status', current_status)
        if current_status in ('cancelled', 'completed') and next_status != current_status:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'status': 'Completed or cancelled events cannot be reopened.'})
        serializer.save()

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user.role != 'organizer' or event.organizer_id != request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the event organizer can update an event.')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user.role != 'organizer' or event.organizer_id != request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the event organizer can delete an event.')
        return super().destroy(request, *args, **kwargs)


class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'participant':
            return Team.objects.filter(members__user=self.request.user).distinct()
        if self.request.user.role == 'organizer':
            return Team.objects.filter(event__organizer=self.request.user)
        return Team.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can create teams.')
        event = serializer.validated_data['event']
        if event.status != 'open' or not EventRegistration.objects.filter(user=self.request.user, event=event).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Register for an open event before creating a team.')
        if TeamMember.objects.filter(team__event=event, user=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'event': 'You already belong to a team for this event.'})
        team = serializer.save()
        TeamMember.objects.create(team=team, user=self.request.user)


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return Team.objects.filter(event__organizer=self.request.user)
        return Team.objects.filter(members__user=self.request.user).distinct()

    def update(self, request, *args, **kwargs):
        if request.user.role != 'organizer':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only organizers can update teams from this endpoint.')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'organizer':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only organizers can delete teams from this endpoint.')
        return super().destroy(request, *args, **kwargs)


class TeamMemberListCreateView(generics.ListCreateAPIView):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        team_id = self.request.query_params.get('team')
        queryset = TeamMember.objects.select_related('user', 'team')
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        if self.request.user.role == 'organizer':
            return queryset.filter(team__event__organizer=self.request.user)
        return queryset.filter(team__members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        if self.request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can manage team membership.')
        team = serializer.validated_data['team']
        if not team.members.filter(user=self.request.user).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only a team member can add members.')
        user = serializer.validated_data['user']
        if user.role != 'participant':
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user': 'Only participants can join teams.'})
        if TeamMember.objects.filter(team=team, user=user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user': 'This participant is already on the team.'})
        if TeamMember.objects.filter(team__event=team.event, user=user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user': 'This participant already belongs to a team for this event.'})
        if not EventRegistration.objects.filter(event=team.event, user=user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user': 'The participant must register for this event first.'})
        serializer.save()


class TeamMemberDetailView(generics.DestroyAPIView):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TeamMember.objects.all()

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return TeamMember.objects.filter(team__event__organizer=self.request.user)
        return TeamMember.objects.filter(team__members__user=self.request.user).distinct()

    def perform_destroy(self, instance):
        if self.request.user.role != 'participant' or not instance.team.members.filter(user=self.request.user).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only a team member can remove team members.')
        if instance.team.members.count() == 1:
            from rest_framework.exceptions import ValidationError
            raise ValidationError('A team must have at least one member.')
        instance.delete()


class ProjectSubmissionListCreateView(generics.ListCreateAPIView):
    queryset = ProjectSubmission.objects.all()
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'judge':
            return ProjectSubmission.objects.filter(team__event__judge_assignments__judge=self.request.user, team__event__judge_assignments__active=True).distinct()
        if self.request.user.role == 'organizer':
            return ProjectSubmission.objects.filter(team__event__organizer=self.request.user)
        return ProjectSubmission.objects.filter(team__members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        if self.request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can submit projects.')
        team = serializer.validated_data['team']
        if not team.members.filter(user=self.request.user).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only submit a project for your team.')
        if team.event.status != 'open':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Submissions are only available for open events.')
        serializer.save()


class ProjectSubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectSubmission.objects.all()
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'judge':
            return ProjectSubmission.objects.filter(team__event__judge_assignments__judge=self.request.user, team__event__judge_assignments__active=True).distinct()
        if self.request.user.role == 'organizer':
            return ProjectSubmission.objects.filter(team__event__organizer=self.request.user)
        return ProjectSubmission.objects.filter(team__members__user=self.request.user).distinct()

    def update(self, request, *args, **kwargs):
        if request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can update submissions.')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can delete submissions.')
        return super().destroy(request, *args, **kwargs)


class JudgementListCreateView(generics.ListCreateAPIView):
    queryset = Judgement.objects.all()
    serializer_class = JudgementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'judge':
            return Judgement.objects.filter(judge=self.request.user)
        if self.request.user.role == 'organizer':
            return Judgement.objects.filter(submission__team__event__organizer=self.request.user)
        return Judgement.objects.filter(submission__team__members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        if self.request.user.role != 'judge':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only judges can score submissions.')
        submission = serializer.validated_data['submission']
        if not JudgeAssignment.objects.filter(event=submission.team.event, judge=self.request.user, active=True).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not assigned to this submission\'s event.')
        serializer.save(judge=self.request.user)


class JudgementDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = JudgementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'judge':
            return Judgement.objects.filter(judge=self.request.user)
        if self.request.user.role == 'organizer':
            return Judgement.objects.filter(submission__team__event__organizer=self.request.user)
        return Judgement.objects.filter(submission__team__members__user=self.request.user).distinct()

    def update(self, request, *args, **kwargs):
        if request.user.role != 'judge':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only judges can update evaluations.')
        return super().update(request, *args, **kwargs)


class JudgeAssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = JudgeAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return JudgeAssignment.objects.filter(event__organizer=self.request.user)
        return JudgeAssignment.objects.filter(judge=self.request.user)

    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        judge = serializer.validated_data['judge']
        if self.request.user.role != 'organizer' or event.organizer_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the event organizer can assign judges.')
        if judge.role != 'judge':
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'judge': 'The selected user must have the judge role.'})
        serializer.save()


class EventRegistrationListCreateView(generics.ListCreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organizer':
            return EventRegistration.objects.filter(event__organizer=self.request.user)
        return EventRegistration.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != 'participant':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only participants can register for events.')
        event = serializer.validated_data['event']
        if event.status != 'open':
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'event': 'Registration is only available for open events.'})
        serializer.save(user=self.request.user)


class EventRegistrationDetailView(generics.DestroyAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.filter(user=self.request.user, event__status='open')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def register_for_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'detail': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role != 'participant':
        return Response({'detail': 'Only participants can register for events.'}, status=status.HTTP_403_FORBIDDEN)
    if event.status != 'open':
        return Response({'detail': 'Registration is only available for open events.'}, status=status.HTTP_400_BAD_REQUEST)

    registration, created = EventRegistration.objects.get_or_create(user=request.user, event=event)
    if not created:
        return Response({'detail': 'You are already registered for this event.'}, status=status.HTTP_200_OK)

    serializer = EventRegistrationSerializer(registration)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def event_leaderboard(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'detail': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role == 'organizer' and event.organizer_id != request.user.id:
        return Response({'detail': 'You can only view results for your events.'}, status=status.HTTP_403_FORBIDDEN)
    if request.user.role == 'judge' and not event.judge_assignments.filter(judge=request.user, active=True).exists():
        return Response({'detail': 'You are not assigned to this event.'}, status=status.HTTP_403_FORBIDDEN)
    if request.user.role == 'participant' and not event.registrations.filter(user=request.user).exists():
        return Response({'detail': 'Register for this event to view its results.'}, status=status.HTTP_403_FORBIDDEN)

    leaderboard = []
    for submission in event.get_leaderboard():
        leaderboard.append({
            'id': str(submission.id),
            'title': submission.title,
            'team': submission.team.name,
            'average_score': submission.average_score,
        })

    return Response(leaderboard, status=status.HTTP_200_OK)
