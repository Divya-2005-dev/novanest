# NovaNest - Student Placement Portal

A comprehensive full-stack web application for managing student placements, skills, resumes, and job matching at educational institutions.

## Features

- **User Authentication**: Student and Admin roles with JWT-based login
- **Student Portal**:
  - Complete profile management (personal, educational, technical details)
  - Skills tracking with certificate upload
  - Resume generation (automatic PDF creation from profile)
  - Resume upload capability
  - Mock tests and interviews
  - Job applications with matching suggestions
  
- **Admin Portal**:
  - Company management
  - Job posting and listing
  - Intelligent candidate matching (based on required skills)
  - Student management
  - Analytics and reporting

- **Job Matching Algorithm**: Scores candidates based on skill overlap with job requirements

## Tech Stack

- **Backend**: Django 4.2+ with Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production)
- **Frontend**: React 18.2
- **Authentication**: djangorestframework-simplejwt (JWT)
- **PDF Generation**: xhtml2pdf
- **File Uploads**: Local filesystem (development), S3 ready (production)

## Project Structure

```
novanest/
├── backend/
│   ├── novanest_backend/       # Django project config
│   │   ├── settings.py         # Settings (SQLite dev, PostgreSQL prod)
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── novanest_app/           # Django app with models & APIs
│   │   ├── models.py           # User, StudentProfile, Skill, Resume, Company, etc.
│   │   ├── views.py            # API endpoints
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # React page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Admin.js
│   │   │   └── ResumeBuilder.js
│   │   ├── App.js              # Main app router
│   │   ├── api.js              # Auth API helpers
│   │   ├── api_profile.js      # Student API helpers
│   │   ├── api_admin.js        # Admin API helpers
│   │   ├── api_resume.js       # Resume API helpers
│   │   ├── index.js
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn
- (Optional) PostgreSQL for production

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Create a virtual environment:
```powershell
python -m venv .venv
```

3. Activate the virtual environment (Windows):
```powershell
.\.venv\Scripts\Activate.ps1
```

Or on macOS/Linux:
```bash
source .venv/bin/activate
```

4. Install dependencies:
```powershell
pip install -r requirements.txt
```

5. Run database migrations:
```powershell
python manage.py migrate
```

6. Create a superuser (admin account):
```powershell
python manage.py createsuperuser
```
Follow the prompts to enter:
- Register Number (e.g., `ADMIN001`)
- Username
- Email
- Password (twice)
- Role: Choose 'admin'

7. Start the development server:
```powershell
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api`
Admin panel: `http://localhost:8000/admin`

### Frontend Setup

In a new terminal/PowerShell window:

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm start
```

The frontend will open at `http://localhost:3000`

## Usage

### Student User Flow

1. **Register**: Sign up with a unique register number and password (role: Student)
2. **Login**: Use credentials to access the portal
3. **Profile**: Fill in personal, educational, and technical details
4. **Skills**: Add skills with dates and optional certificates
5. **Resume Builder**: Generate a PDF resume automatically or upload your own
6. **Jobs**: View available job postings and apply
7. **Mock Tests**: Take available mock tests

### Admin User Flow

1. **Register**: Sign up with role: Admin
2. **Login**: Access the admin dashboard
3. **Companies**: Add company details coming for campus recruitment
4. **Jobs**: Post job openings with required skills
5. **Matching**: Run the matching algorithm to find suitable candidates
6. **Analytics**: View student skills, resumes, and applications

## API Endpoints

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/token/` - Login and get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Student Profile
- `GET/PUT /api/student/profile/` - Get/Update student profile
- `GET/POST /api/student/skills/` - List/Add skills
- `DELETE /api/student/skills/<id>/` - Delete a skill
- `GET/POST /api/student/resumes/` - List/Upload resumes
- `POST /api/student/generate_resume/` - Auto-generate PDF resume

### Companies & Jobs
- `GET/POST /api/companies/` - List/Add companies (admin only)
- `GET/POST /api/jobs/` - List/Post jobs (admin only)
- `GET /api/jobs/<id>/match/` - Get matched candidates (admin only)

### Applications & Tests
- `POST /api/apply/` - Apply for a job
- `GET/POST /api/mocktests/` - List/Add mock tests
- `POST /api/mocktests/submit/` - Submit mock test answers

## Database Models

- **User**: Custom user model with register_number and role (student/admin)
- **StudentProfile**: Extended profile with educational and technical details
- **Skill**: Student skills with certificate upload
- **Resume**: Uploaded or auto-generated resumes
- **Company**: Company details for recruitment
- **JobPosting**: Job openings with required skills
- **Application**: Student job applications
- **MockTest**: Mock tests for interview preparation
- **MockTestSubmission**: Test submissions with scores

## Development

### Using SQLite (default)
Backend is configured to use SQLite for local development. No additional setup needed.

### Switching to PostgreSQL
Edit `backend/novanest_backend/settings.py` and uncomment the PostgreSQL configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'novanest_db'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}
```

Set environment variables (in PowerShell):
```powershell
$env:POSTGRES_DB='novanest_db'
$env:POSTGRES_USER='postgres'
$env:POSTGRES_PASSWORD='yourpassword'
$env:POSTGRES_HOST='localhost'
$env:POSTGRES_PORT='5432'
```

### CORS Configuration
For development, CORS is enabled for all origins. In production, edit `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

## Deployment

### Backend (Heroku/Render)
1. Create a `Procfile`:
```
web: gunicorn novanest_backend.wsgi
```

2. Update `requirements.txt` with production packages:
```
gunicorn>=21.0
whitenoise>=6.0
```

3. Set environment variables on deployment platform:
   - `DJANGO_SECRET_KEY`
   - `DEBUG=False`
   - PostgreSQL connection details

### Frontend (Vercel)
1. Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

2. Deploy:
```powershell
npm install -g vercel
vercel
```

## Testing

Run backend tests:
```powershell
python manage.py test
```

Run frontend tests:
```powershell
npm test
```

## Troubleshooting

### Port Already in Use
- Django: Change port with `python manage.py runserver 8001`
- React: Change port with `PORT=3001 npm start`

### CORS Errors
Ensure both services are running and `CORS_ALLOW_ALL_ORIGINS = True` in development.

### Database Errors
Clear database and start fresh:
```powershell
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions, please open an issue in the repository.

---

**NovaNest** - Bridging students and opportunities 🎓
