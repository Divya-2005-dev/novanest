from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    register_number = models.CharField(max_length=64, unique=True)
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'register_number'
    REQUIRED_FIELDS = ['username', 'email']

    def __str__(self):
        return f"{self.register_number} ({self.role})"


class StudentProfile(models.Model):
    user = models.OneToOneField('novanest_app.User', on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=200, blank=True)
    dob = models.DateField(null=True, blank=True)
    tenth_school = models.CharField(max_length=200, blank=True)
    twelfth_school = models.CharField(max_length=200, blank=True)
    tenth_marks = models.CharField(max_length=50, blank=True)
    twelfth_marks = models.CharField(max_length=50, blank=True)
    current_cgpa = models.CharField(max_length=10, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    semester = models.IntegerField(null=True, blank=True)
    department = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Profile: {self.user.register_number}"


class Skill(models.Model):
    user = models.ForeignKey('novanest_app.User', on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=200)
    learned_date = models.DateField(null=True, blank=True)
    certificate = models.FileField(upload_to='certificates/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.register_number}"


class Resume(models.Model):
    user = models.ForeignKey('novanest_app.User', on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume: {self.user.register_number} ({self.created_at:%Y-%m-%d})"


class Company(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class JobPosting(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    required_skills = models.TextField(blank=True, help_text='Comma-separated skill names')
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}" + (f" @ {self.company.name}" if self.company else "")


class Application(models.Model):
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey('novanest_app.User', on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application: {self.user.register_number} -> {self.job.title}"


class MockTest(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MockTestSubmission(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey('novanest_app.User', on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)
    score = models.FloatField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission: {self.user.register_number} -> {self.test.title}"


class Question(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    # options stored as list of strings: ["A", "B", "C", "D"]
    options = models.JSONField(default=list)
    # correct_answer is the index (0-based) into the options list
    correct_answer = models.IntegerField(null=True, blank=True)
    marks = models.FloatField(default=1.0)

    def __str__(self):
        return f"Q{self.id}: {self.text[:40]}"


class MockInterview(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class InterviewQuestion(models.Model):
    interview = models.ForeignKey(MockInterview, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    suggested_answer = models.TextField(blank=True)

    def __str__(self):
        return f"InterviewQ{self.id}: {self.text[:40]}"
