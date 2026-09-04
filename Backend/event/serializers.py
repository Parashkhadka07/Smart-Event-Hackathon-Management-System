from rest_framework import serializers
from .models import Event, Team, TeamMember, ProjectSubmission, Judgement, EventRegistration, JudgeAssignment


class EventSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))
        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({'end_date': 'End date must be after start date.'})
        return attrs

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'event', 'created_at']
        read_only_fields = ['id', 'created_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'user', 'username', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class ProjectSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectSubmission
        fields = '__all__'
        read_only_fields = ['id', 'submitted_at', 'status']

    def validate_team(self, value):
        if value.submissions.exists() and (not self.instance or self.instance.team_id != value.id):
            raise serializers.ValidationError('This team already has a submission.')
        return value


class JudgementSerializer(serializers.ModelSerializer):
    def validate_score(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('Score must be between 0 and 100.')
        return value

    class Meta:
        model = Judgement
        fields = '__all__'
        read_only_fields = ['judge']


class EventRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user', 'username', 'status', 'registered_at']
        read_only_fields = ['id', 'user', 'username', 'status', 'registered_at']


class JudgeAssignmentSerializer(serializers.ModelSerializer):
    judge_username = serializers.CharField(source='judge.username', read_only=True)

    class Meta:
        model = JudgeAssignment
        fields = '__all__'
        read_only_fields = ['id', 'assigned_at', 'judge_username']
