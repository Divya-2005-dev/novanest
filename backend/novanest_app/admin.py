from django.contrib import admin
from .models import User, StudentProfile, Skill, Resume, Company, JobPosting, Application, MockTest, MockTestSubmission


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('register_number', 'username', 'role', 'is_active')


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'department', 'semester')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'learned_date', 'created_at')


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'file', 'generated', 'created_at')


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'created_at')


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'posted_at')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'applied_at')


@admin.register(MockTest)
class MockTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')


@admin.register(MockTestSubmission)
class MockTestSubmissionAdmin(admin.ModelAdmin):
    list_display = ('test', 'user', 'score', 'submitted_at')
