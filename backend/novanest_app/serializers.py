from rest_framework import serializers
from .models import User, StudentProfile, Skill, Resume, Company, JobPosting, Application, MockTest, MockTestSubmission
from .models import Question, MockInterview, InterviewQuestion


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Do not expose `role` for public registration; role is set server-side.
        fields = ('register_number', 'username', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Force role to 'student' for public registrations to prevent elevation.
        user = User(**validated_data)
        user.role = 'student'
        user.set_password(password)
        user.save()
        StudentProfile.objects.create(user=user)
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'learned_date', 'certificate', 'created_at')


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('id', 'file', 'generated', 'created_at')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'description', 'website', 'created_at')


class JobPostingSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company', write_only=True, required=False, allow_null=True)

    class Meta:
        model = JobPosting
        fields = ('id', 'company', 'company_id', 'title', 'description', 'required_skills', 'posted_at')


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('id', 'job', 'user', 'resume', 'applied_at')


class MockTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockTest
        fields = ('id', 'title', 'description', 'created_at')


class MockTestSubmissionSerializer(serializers.ModelSerializer):
    # `user` should be set by the view (read-only in serializer) so clients
    # don't need to (and shouldn't) provide it in POST payloads.
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    score = serializers.FloatField(read_only=True)

    class Meta:
        model = MockTestSubmission
        fields = ('id', 'test', 'user', 'answers', 'score', 'submitted_at')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'test', 'text', 'options', 'correct_answer', 'marks')


class QuestionPublicSerializer(serializers.ModelSerializer):
    # exclude correct_answer for public consumption
    class Meta:
        model = Question
        fields = ('id', 'test', 'text', 'options', 'marks')


class InterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestion
        fields = ('id', 'interview', 'text', 'suggested_answer')


class MockInterviewSerializer(serializers.ModelSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = MockInterview
        fields = ('id', 'title', 'description', 'created_at', 'questions')
