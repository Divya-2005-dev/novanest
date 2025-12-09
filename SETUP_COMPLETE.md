# NovaNest Setup Complete ✓

Both the backend and frontend servers are **running and ready to use**!

## Quick Start Guide

### Accessing the Application

1. **Frontend (React)**: Open your browser and go to:
   ```
   http://localhost:3000
   ```

2. **Backend Admin Panel**: 
   ```
   http://localhost:8000/admin
   ```

3. **API Endpoints**: 
   ```
   http://localhost:8000/api
   ```

### Test Credentials

**Admin Account:**
- Register Number: `admin001`
- Password: `Admin@123`
- Role: Admin

### Server Information

- **Backend Server**: Running on `http://localhost:8000`
  - Django REST API
  - SQLite Database (auto-created)
  - CORS enabled for development
  - Media files served from `./media` folder

- **Frontend Server**: Running on `http://localhost:3000`
  - React development server
  - Hot reload enabled
  - Auto-opens in browser

## Getting Started with NovaNest

### 1. Register a Student Account
1. Go to http://localhost:3000
2. Click **Register**
3. Fill in details:
   - Role: `Student`
   - Register Number: e.g., `STU001`
   - Username: Choose a username
   - Email: Your email
   - Password: Your password
4. Click **Register**

### 2. Login
1. Use the register number and password to login
2. You'll be directed to the **Profile** page

### 3. Fill Student Profile
1. Enter your details:
   - Full Name
   - Date of Birth
   - 10th and 12th school information
   - GPA and marks
   - Department and semester
   - Blood group

### 4. Add Skills
1. In the "Skills" section, enter:
   - Skill name (e.g., "Python", "React")
   - Learned date
   - Optional: Certificate file (PDF/Image)
2. Add multiple skills

### 5. Generate Resume
1. Click **Resume Builder** button in top nav
2. Click **Generate Resume PDF**
3. Your resume will be auto-generated from your profile and skills
4. The PDF will open in a new tab

### 6. Upload Custom Resume
1. In **Profile** page, scroll to "Upload Resume" section
2. Select a PDF file and upload

### 7. Access as Admin
1. Register a new account with Role: `Admin` (e.g., `ADMIN002`)
2. Login with admin credentials
3. Click **Admin** in top navigation
4. You can now:
   - Add companies coming for recruitment
   - Post job openings with required skills
   - Click "Match Candidates" to see which students have matching skills
   - View student details and resumes

## Project Structure Summary

```
novanest/
├── backend/                 # Django backend
│   ├── novanest_backend/    # Project settings
│   ├── novanest_app/        # Main app with models, APIs
│   ├── db.sqlite3           # Database (auto-created)
│   ├── media/               # Uploaded files
│   ├── .venv/               # Virtual environment
│   └── manage.py
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/           # Login, Register, Profile, Admin, ResumeBuilder
│   │   ├── api*.js          # API helper functions
│   │   └── App.js           # Main component
│   ├── node_modules/        # Dependencies
│   └── package.json
│
└── README.md                # Full documentation
```

## Available Features

✅ **Student Features:**
- Register and login
- Complete profile management
- Skills tracking with certificates
- Resume upload
- Auto-generate PDF resume from profile
- Apply for jobs
- View job postings
- Mock tests

✅ **Admin Features:**
- Manage companies
- Post job openings
- Smart candidate matching (based on skills)
- View student profiles
- Track applications

✅ **Backend:**
- JWT authentication
- RESTful APIs
- SQLite database
- CORS enabled
- File uploads (local storage)
- PDF generation
- Role-based access control

## Environment Files

All configuration is in `backend/novanest_backend/settings.py`:

- **Database**: SQLite (dev) or PostgreSQL (production)
- **Debug**: Enabled for development
- **CORS**: All origins allowed (development only)
- **Media uploads**: Stored in `./media` folder
- **JWT Expiry**: Standard Django simple JWT defaults

## Troubleshooting

### Port Already in Use
If port 8000 or 3000 is already in use:

**Backend (Django):**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver 8001
```

Then in frontend, update API URL in `src/api.js` files to use `8001`.

**Frontend (React):**
```powershell
cd frontend
PORT=3001 npm start
```

### Refresh Token Issues
Clear localStorage and login again:
```javascript
localStorage.clear()
```

### Database Issues
Reset database:
```powershell
cd backend
Remove-Item db.sqlite3
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py createsuperuser  # Create new admin
```

## Next Steps

1. **Test the application**: Register as student and admin
2. **Explore admin features**: Post jobs and match students
3. **Production deployment**: See README.md for deployment guide
4. **Customize styling**: Modify `frontend/src/index.css`
5. **Add more features**: Extend models in `backend/novanest_app/models.py`

## API Documentation

For complete API documentation, see the main `README.md` file with all endpoint details.

---

**NovaNest** is now ready for use! 🎓

Connect and manage your campus placements efficiently.
