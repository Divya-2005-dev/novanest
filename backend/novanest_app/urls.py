from django.urls import path
from .views import (
    RegisterView, MyTokenObtainPairView, StudentProfileView, SkillListCreateView, SkillDetailView,
    ResumeUploadView, CompanyListCreateView, JobListCreateView, JobDetailView, JobMatchView,
    ApplicationCreateView, MockTestListCreateView, MockTestSubmitView, GenerateResumeView
)
from .views import (
    QuestionListCreateView, QuestionDetailView, MockTestQuestionsView,
    MockInterviewListCreateView, MockInterviewQuestionsView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('student/profile/', StudentProfileView.as_view(), name='student_profile'),
    path('student/skills/', SkillListCreateView.as_view(), name='student_skills'),
    path('student/skills/<int:pk>/', SkillDetailView.as_view(), name='student_skill_detail'),
    path('student/resumes/', ResumeUploadView.as_view(), name='student_resumes'),
    path('student/generate_resume/', GenerateResumeView.as_view(), name='generate_resume'),
    path('companies/', CompanyListCreateView.as_view(), name='companies'),
    path('jobs/', JobListCreateView.as_view(), name='jobs'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('jobs/<int:pk>/match/', JobMatchView.as_view(), name='job_match'),
    path('apply/', ApplicationCreateView.as_view(), name='apply_job'),
    path('mocktests/', MockTestListCreateView.as_view(), name='mocktests'),
    path('mocktests/submit/', MockTestSubmitView.as_view(), name='mocktest_submit'),
    path('mocktests/<int:pk>/questions/', MockTestQuestionsView.as_view(), name='mocktest_questions'),
    path('questions/', QuestionListCreateView.as_view(), name='questions'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question_detail'),
    path('mockinterviews/', MockInterviewListCreateView.as_view(), name='mockinterviews'),
    path('mockinterviews/<int:pk>/questions/', MockInterviewQuestionsView.as_view(), name='mockinterview_questions'),
]
