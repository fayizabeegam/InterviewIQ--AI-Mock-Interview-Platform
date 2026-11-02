
# InterviewIQ AI – Smart Interview Assistant

An AI-powered career and interview preparation platform that analyzes resumes, matches candidate profiles with job descriptions, identifies skill gaps, and provides personalized improvement suggestions. It also offers AI-powered mock interviews, coding practice, and personalized learning roadmaps to help candidates strengthen their skills and prepare effectively for job opportunities.

The platform provides two separate interfaces:
- **User Panel:** Interview preparation and career development features.
- **Admin Panel:** Centralized management of users, interviews, coding questions, resumes, and platform activities.

**GitHub Repository:** [InterviewIQ AI](https://github.com/fayizabeegam/InterviewIQ--AI-Mock-Interview-Platform)

---

# 1. Features

## A. User Panel

### 1. Home
- Provides an overview of the InterviewIQ platform.
- Navigation to the main interview preparation modules.
- Access to resume analysis, job matching, interviews, coding practice, and learning roadmap.

### 2. Resume Analyzer
- Upload and manage resumes.
- Extract and process resume content.
- Analyze candidate information and skills.
- Prepare resume data for AI-powered job matching.

### 3. Job Matcher
- Compare candidate resumes with job descriptions.
- Integrate Puter AI for resume-to-job analysis.
- Generate overall job match and ATS scores.
- Identify matched and missing skills.
- Analyze strengths and weaknesses.
- Generate personalized recommendations for improving resume alignment.
- Extract required and preferred skills from job descriptions.

### 4. AI Interview
- Create and manage interview sessions.
- Support different interview types and difficulty levels.
- Manage interview questions.
- Provide voice-based interview interaction.
- Convert candidate speech into text using Faster-Whisper.
- Generate spoken interview questions using Piper TTS.
- Track interview status: Pending, In Progress, and Completed.

### 5. Coding Practice
- Browse coding questions.
- View problem statements, constraints, input/output formats, and sample cases.
- Access individual coding problem pages.
- Select programming languages.
- Write code in the coding workspace.

**Development status:** Coding question management and the candidate coding interface are implemented. Secure code execution and automated evaluation are still under development.

### 6. Learning Roadmap
- Dedicated roadmap section for interview preparation.
- Intended to support structured learning and skill development.

**Development status:** The Roadmap section is present in the application. Detailed functionality is still being developed.

---

## B. Admin Panel

The Admin Panel provides a separate interface for managing platform users and activities.

### 1. Admin Dashboard
- View platform dashboard statistics.
- Monitor platform activity.
- Access administrative modules.

### 2. User Management
- View registered users.
- Manage user accounts.
- Activate and deactivate user accounts.
- Monitor user information.

### 3. Interview Management
- View candidate interview sessions.
- Monitor total interviews.
- Track completed and in-progress interviews.
- View candidate names and email addresses.
- View interview types and difficulty levels.
- Monitor question counts and creation dates.
- Search and filter interview records.
- Refresh interview information.

### 4. Coding Test Management
- Access coding question management.
- Manage the coding question bank.
- Planned: Bulk JSON upload of coding questions and associated test cases.

### 5. Resume Management
- Access resume management features.

### 6. Reports
- Access platform reporting features.

### 7. Settings
- Access administrative platform settings.

---

# 2. Technology Stack

## Backend
- Python
- Django
- Django REST Framework (DRF)
- Django REST Framework Simple JWT
- Django ORM

## Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

## Database
- PostgreSQL
- psycopg2-binary

## AI Integration
- Puter AI – Resume and job description matching.
- @heyputer/puter.js – Frontend AI integration.

## Speech Processing
- Faster-Whisper – Speech-to-text transcription.
- Piper TTS – Text-to-speech generation.

## Background Processing
- Celery – Asynchronous task processing.
- Redis – Celery message broker and background task support.
- Django notifications – Notification management.

## Other Tools and Libraries
- Postman – API testing.
- Git and GitHub – Version control.
- pypdf – PDF processing.
- python-docx – Word document processing.

---

# 3. System Architecture

InterviewIQ follows a full-stack architecture with a React frontend and Django REST Framework backend.

```text
                    INTERVIEWIQ AI
                          |
              +-----------+-----------+
              |                       |
          USER PANEL              ADMIN PANEL
              |                       |
       +------+------+          +-----+------+
       |      |      |          |     |      |
     Resume  Job    AI       Dashboard Users Interviews
    Analyzer Matcher Interview   Coding Tests Reports
       |      |      |          |
       +------+------+----------+
              |
              v
        REACT FRONTEND
       (Vite + Tailwind CSS)
              |
              | REST API
              v
      DJANGO REST FRAMEWORK
              |
      +-------+--------+----------+
      |       |        |          |
   Accounts Resumes  Jobs     Interviews
      |       |        |          |
      +-------+--------+----------+
              |
          Coding App
              |
              v
          DATABASE
         PostgreSQL
              |
      +-------+---------+
      |         |       |
    Puter AI  Faster-  Piper
               Whisper  TTS

       Celery + Redis
              |
      Background Notifications
```

---

# 4. Installation and Setup

## Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- PostgreSQL, if using the configured PostgreSQL database
- Redis, for Celery background tasks

## Backend Setup

Open a terminal in VS Code.

```bash
cd Backend
```

### Step 1: Create a virtual environment

```bash
python -m venv venv
```

### Step 2: Activate the virtual environment

Windows:

```bash
venv\Scripts\activate
```

### Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Apply database migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Create an admin account

```bash
python manage.py createsuperuser
```

### Step 6: Start the Django server

```bash
python manage.py runserver
```

Backend server:

```text
http://127.0.0.1:8000/
```

---

## Frontend Setup

Open another terminal in VS Code.

### Step 1: Navigate to frontend

```bash
cd Frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the React development server

```bash
npm run dev
```

Frontend server:

```text
http://localhost:5173/
```

---

# 5. Celery and Redis Setup

InterviewIQ uses Celery and Redis for asynchronous notification processing.

### Step 1: Start Redis

Make sure your Redis service is running.

### Step 2: Start Celery Worker

Run the following command from the backend directory.

Replace `project_name` with your actual Django project package name.

```bash
celery -A project_name worker -l info
```

Celery processes background notification tasks through Redis.

---

# 6. API Testing

Backend REST APIs can be tested using Postman.

Testing includes:

- User registration and authentication.
- Resume management.
- Job description and skill management.
- Interview creation and management.
- Interview question management.
- Audio transcription.
- Text-to-speech generation.
- Coding question retrieval.
- Coding submissions.
- Admin management APIs.

Use the appropriate JWT access token for authenticated API requests.

---

# 7. Author

**Fayiza Beegam**

Python Backend Developer

- GitHub: https://github.com/fayizabeegam
- LinkedIn: https://www.linkedin.com/in/fayizabeegam/

---

**InterviewIQ AI – Prepare Smarter. Practise Better. Interview Confidently.**
