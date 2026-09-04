from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Event, EventRegistration, Judgement, ProjectSubmission, Team, TeamMember


class HackathonFlowTests(TestCase):
    def setUp(self):
        User = get_user_model()

        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='StrongPass123',
            role='organizer',
        )
        self.participant = User.objects.create_user(
            username='participant',
            email='participant@example.com',
            password='StrongPass123',
            role='participant',
        )
        self.judge = User.objects.create_user(
            username='judge',
            email='judge@example.com',
            password='StrongPass123',
            role='judge',
        )

        self.event = Event.objects.create(
            title='AI Hackathon',
            description='Build an AI tool for local communities.',
            start_date=timezone.now(),
            end_date=timezone.now(),
            status='open',
            organizer=self.organizer,
        )

        self.team = Team.objects.create(name='Team Alpha', event=self.event)
        TeamMember.objects.create(team=self.team, user=self.participant)
        EventRegistration.objects.create(user=self.participant, event=self.event)

        self.submission = ProjectSubmission.objects.create(
            team=self.team,
            title='Smart City Assistant',
            description='A platform to help local residents manage city alerts.',
        )

        Judgement.objects.create(
            judge=self.judge,
            submission=self.submission,
            score=9.5,
            feedback='Strong concept and good execution.',
        )

    def test_submission_average_score_is_calculated(self):
        self.assertEqual(self.submission.average_score, 9.5)

    def test_event_leaderboard_orders_projects_by_average_score(self):
        second_team = Team.objects.create(name='Team Beta', event=self.event)
        second_submission = ProjectSubmission.objects.create(
            team=second_team,
            title='Community Insights Portal',
            description='A dashboard for civic data tracking.',
        )
        Judgement.objects.create(
            judge=self.judge,
            submission=second_submission,
            score=8.0,
            feedback='Great idea but needs more polish.',
        )

        leaderboard = self.event.get_leaderboard()

        self.assertEqual(leaderboard[0].id, self.submission.id)
        self.assertEqual(leaderboard[1].id, second_submission.id)

    def test_participant_can_register_for_event_via_api(self):
        second_participant = get_user_model().objects.create_user(
            username='participant2',
            email='participant2@example.com',
            password='StrongPass123',
            role='participant',
        )

        client = APIClient()
        client.force_authenticate(user=second_participant)

        response = client.post(f'/api/v1/events/{self.event.id}/register/')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(EventRegistration.objects.filter(user=second_participant, event=self.event).exists())

    def test_event_leaderboard_endpoint_returns_sorted_submissions(self):
        second_team = Team.objects.create(name='Team Beta', event=self.event)
        second_submission = ProjectSubmission.objects.create(
            team=second_team,
            title='Community Insights Portal',
            description='A dashboard for civic data tracking.',
        )
        Judgement.objects.create(
            judge=self.judge,
            submission=second_submission,
            score=8.0,
            feedback='Great idea but needs more polish.',
        )

        client = APIClient()
        client.force_authenticate(user=self.organizer)

        response = client.get(f'/api/v1/events/{self.event.id}/leaderboard/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['title'], 'Smart City Assistant')
        self.assertEqual(response.data[1]['title'], 'Community Insights Portal')

    def test_closed_event_rejects_registration(self):
        self.event.status = 'closed'
        self.event.save(update_fields=['status'])
        client = APIClient()
        client.force_authenticate(user=self.participant)

        response = client.post(f'/api/v1/events/{self.event.id}/register/')

        self.assertEqual(response.status_code, 400)

    def test_organizer_event_creation_uses_authenticated_owner(self):
        client = APIClient()
        client.force_authenticate(user=self.organizer)

        response = client.post('/api/v1/events/', {
            'title': 'New Challenge',
            'description': 'A new challenge.',
            'start_date': timezone.now().isoformat(),
            'end_date': timezone.now().isoformat(),
            'status': 'draft',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(str(response.data['organizer']), str(self.organizer.id))

    def test_judge_only_sees_submissions_for_assigned_events(self):
        other_event = Event.objects.create(
            title='Other Hackathon',
            description='Other challenge.',
            start_date=timezone.now(),
            end_date=timezone.now(),
            status='open',
            organizer=self.organizer,
        )
        other_team = Team.objects.create(name='Other Team', event=other_event)
        other_submission = ProjectSubmission.objects.create(
            team=other_team,
            title='Other Project',
            description='Not assigned.',
        )
        from .models import JudgeAssignment
        JudgeAssignment.objects.create(event=self.event, judge=self.judge)
        client = APIClient()
        client.force_authenticate(user=self.judge)

        response = client.get('/api/v1/submissions/')

        self.assertEqual(response.status_code, 200)
        self.assertIn(str(self.submission.id), [item['id'] for item in response.data])
        self.assertNotIn(str(other_submission.id), [item['id'] for item in response.data])

    def test_team_member_can_be_added_and_persists(self):
        second_participant = get_user_model().objects.create_user(
            username='participant3', email='participant3@example.com',
            password='StrongPass123', role='participant',
        )
        EventRegistration.objects.create(user=second_participant, event=self.event)
        client = APIClient()
        client.force_authenticate(user=self.participant)

        response = client.post('/api/v1/team-members/', {
            'team': str(self.team.id), 'user': str(second_participant.id),
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(TeamMember.objects.filter(team=self.team, user=second_participant).exists())

    def test_assigned_judge_can_update_existing_evaluation(self):
        from .models import JudgeAssignment
        JudgeAssignment.objects.create(event=self.event, judge=self.judge)
        client = APIClient()
        client.force_authenticate(user=self.judge)

        response = client.patch(
            f'/api/v1/judgements/{self.submission.judgements.get().id}/',
            {'score': 95, 'feedback': 'Updated feedback.'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.submission.judgements.get().refresh_from_db()
        self.assertEqual(self.submission.judgements.get().score, 95)

    def test_unassigned_judge_cannot_view_leaderboard(self):
        client = APIClient()
        client.force_authenticate(user=self.judge)

        response = client.get(f'/api/v1/events/{self.event.id}/leaderboard/')

        self.assertEqual(response.status_code, 403)

    def test_team_cannot_submit_twice(self):
        client = APIClient()
        client.force_authenticate(user=self.participant)

        response = client.post('/api/v1/submissions/', {
            'team': str(self.team.id),
            'title': 'Duplicate Project',
            'description': 'Duplicate submission.',
        }, format='json')

        self.assertEqual(response.status_code, 400)

    def test_non_participant_cannot_register(self):
        client = APIClient()
        client.force_authenticate(user=self.judge)

        response = client.post(f'/api/v1/events/{self.event.id}/register/')

        self.assertEqual(response.status_code, 403)
