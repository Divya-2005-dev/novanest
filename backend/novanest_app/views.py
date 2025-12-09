from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
    RegisterSerializer, StudentProfileSerializer, SkillSerializer, ResumeSerializer,
    CompanySerializer, JobPostingSerializer, ApplicationSerializer, MockTestSerializer, MockTestSubmissionSerializer
)
from .models import (
    User, StudentProfile, Skill, Resume, Company, JobPosting, Application,
    MockTest, MockTestSubmission, Question, MockInterview, InterviewQuestion
)
from .serializers import QuestionSerializer, QuestionPublicSerializer, MockInterviewSerializer, InterviewQuestionSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.http import FileResponse
from xhtml2pdf import pisa
from django.template import Context, Template
from io import BytesIO
from django.core.files.base import ContentFile


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['register_number'] = user.register_number
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['register_number'] = self.user.register_number
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except StudentProfile.DoesNotExist:
            return StudentProfile.objects.create(user=self.request.user)


class SkillListCreateView(generics.ListCreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SkillDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)


class ResumeUploadView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def admin_required(fn):
    def wrapper(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'detail': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return fn(self, request, *args, **kwargs)
    return wrapper


class CompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Company.objects.all().order_by('-created_at')

    @admin_required
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobPosting.objects.select_related('company').order_by('-posted_at')

    @admin_required
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return JobPosting.objects.select_related('company')

    @admin_required
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @admin_required
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class JobMatchView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'detail': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        try:
            job = JobPosting.objects.get(pk=pk)
        except JobPosting.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        req_skills = {s.strip().lower() for s in job.required_skills.split(',') if s.strip()}
        students = User.objects.filter(role='student').prefetch_related('skills')
        results = []
        for student in students:
            student_skills = {s.name.strip().lower() for s in student.skills.all()}
            if not req_skills:
                score = 0
            else:
                intersect = student_skills & req_skills
                score = round(len(intersect) / len(req_skills) * 100, 2)
            if score > 0:
                results.append({'register_number': student.register_number, 'score': score})

        results.sort(key=lambda x: x['score'], reverse=True)
        return Response({'job': job.title, 'matches': results})


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MockTestListCreateView(generics.ListCreateAPIView):
    serializer_class = MockTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MockTest.objects.all().order_by('-created_at')

    @admin_required
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class MockTestSubmitView(generics.CreateAPIView):
    serializer_class = MockTestSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        submission = serializer.save(user=self.request.user)
        # attempt to auto-score if possible
        try:
            test = submission.test
            total_marks = 0.0
            obtained = 0.0
            questions = {q.id: q for q in test.questions.all()}
            for qid_str, ans in (submission.answers or {}).items():
                # answers may come as strings; try int conversion
                try:
                    qid = int(qid_str)
                except Exception:
                    continue
                q = questions.get(qid)
                if not q:
                    continue
                total_marks += float(q.marks or 1.0)
                # ans may be index or option text; prefer index
                correct_idx = q.correct_answer
                try:
                    ans_idx = int(ans)
                except Exception:
                    # try to compare by text
                    ans_idx = None
                if ans_idx is not None and correct_idx is not None:
                    if ans_idx == correct_idx:
                        obtained += float(q.marks or 1.0)
                else:
                    # fallback: compare option text
                    if isinstance(ans, str) and isinstance(q.options, (list, tuple)):
                        try:
                            if q.options[correct_idx].strip().lower() == ans.strip().lower():
                                obtained += float(q.marks or 1.0)
                        except Exception:
                            pass

            if total_marks > 0:
                submission.score = round((obtained / total_marks) * 100, 2)
            else:
                submission.score = None
            submission.save()
        except Exception:
            # do not fail submission on scoring errors
            pass


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Question.objects.all()

    @admin_required
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Question.objects.all()

    @admin_required
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @admin_required
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MockTestQuestionsView(generics.ListAPIView):
    """Return public questions for a given mock test (without correct answers)."""
    serializer_class = QuestionPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            test = MockTest.objects.get(pk=pk)
        except MockTest.DoesNotExist:
            return Response({'detail': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)
        qs = test.questions.all()
        serializer = self.get_serializer(qs, many=True)
        return Response({'test': MockTestSerializer(test).data, 'questions': serializer.data})


class MockInterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = MockInterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MockInterview.objects.all().order_by('-created_at')

    @admin_required
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class MockInterviewQuestionsView(generics.ListAPIView):
    serializer_class = InterviewQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            interview = MockInterview.objects.get(pk=pk)
        except MockInterview.DoesNotExist:
            return Response({'detail': 'Interview not found'}, status=status.HTTP_404_NOT_FOUND)
        qs = interview.questions.all()
        serializer = self.get_serializer(qs, many=True)
        return Response({'interview': MockInterviewSerializer(interview).data, 'questions': serializer.data})


class GenerateResumeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            profile = request.user.profile
        except StudentProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        skills = request.user.skills.all()
        html_template = '''
        <html><head><meta charset="utf-8"><style>body{font-family: Arial;}</style></head>
        <body>
        <h1>{{ full_name }}</h1>
        <p><strong>Register:</strong> {{ register }}</p>
        <p><strong>Department:</strong> {{ department }} | <strong>Semester:</strong> {{ semester }}</p>
        <h2>Education</h2>
        <p>10th: {{ tenth_school }} - {{ tenth_marks }}</p>
        <p>12th: {{ twelfth_school }} - {{ twelfth_marks }}</p>
        <h2>Skills</h2>
        <ul>{% for s in skills %}<li>{{ s.name }}</li>{% endfor %}</ul>
        </body></html>
        '''
        tpl = Template(html_template)
        ctx = Context({
            'full_name': profile.full_name or '',
            'register': request.user.register_number,
            'department': profile.department or '',
            'semester': profile.semester or '',
            'tenth_school': profile.tenth_school or '',
            'tenth_marks': profile.tenth_marks or '',
            'twelfth_school': profile.twelfth_school or '',
            'twelfth_marks': profile.twelfth_marks or '',
            'skills': skills,
        })
        html = tpl.render(ctx)

        result = BytesIO()
        pisa_status = pisa.CreatePDF(src=html, dest=result)
        if pisa_status.err:
            return Response({'detail': 'Error generating PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        result.seek(0)
        fname = f"resume_{request.user.register_number}.pdf"
        content = ContentFile(result.read(), name=fname)
        resume = Resume.objects.create(user=request.user, file=content, generated=True)

        return Response({'resume_id': resume.id, 'file': resume.file.url})
