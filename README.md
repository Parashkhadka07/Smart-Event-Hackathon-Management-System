# Smart-Event-Hackathon-Management-System

🚀 Smart Event Hackathon Management System

Smart Event Hackathon Management System is a full-stack web application for managing the complete workflow of a hackathon through a single platform.

The system is built around three roles:

👨‍💻 Participant — discovers hackathons, registers, creates/manages a team, submits a project, and views results.

⚖️ Judge — accesses assigned hackathons, reviews submitted projects, gives scores, and provides feedback.

🏢 Organizer — creates and manages hackathons, assigns judges, monitors participants/teams/submissions, and manages the event workspace.

The project is split into a React/Vite frontend and a Django REST Framework backend. The backend currently uses Oracle Database in its Django settings.

📖 Table of Contents

Project Overview

Features

User Roles

Application Flow

Frontend Pages and Routes

Backend Architecture

Database Models

API Endpoints

Authentication

Authorization Rules

Technology Stack

Project Structure

Getting Started

Backend Setup

Frontend Setup

Environment and Configuration

How the Main Workflows Work

Leaderboard

Current Implementation Notes

Security Notes

Development Commands

Future Improvements

Contributing

License

📌 Project Overview

Running a hackathon involves several connected processes:

Hackathon
│
├── Participant Registration
│
├── Team Formation
│
├── Project Submission
│
├── Judge Assignment
│
├── Project Evaluation
│
└── Leaderboard

This application connects those processes through REST APIs.

The frontend provides role-specific pages and navigation, while the Django backend is responsible for:

User accounts

Authentication

Hackathon/event management

Event registration

Team management

Team membership

Project submissions

Judge assignments

Project evaluations

Leaderboard generation

✨ Features

👨‍💻 Participant

A participant can:

Register an account

Select the participant role during registration

Log in

Discover available hackathons

Search hackathons by title

View hackathon details

Register for an open hackathon

View registered hackathons

Cancel an open-event registration

Create a team after registering for an event

Add other registered participants to the team

Remove team members

Submit one project for a team

Provide a project description

Provide a GitHub repository link

Provide a demo link

View the leaderboard for accessible events

Manage their account profile

Participant navigation

Dashboard
Discover Events
My Hackathons
My Team
Submit Project
Leaderboard
Notifications
My Profile

⚖️ Judge

A judge can:

Register/login using the judge role

See hackathons assigned to them

Access assigned project submissions

View project descriptions

Open GitHub repositories

Open project demo links

Give a score from 0 to 100

Provide feedback

Update an existing evaluation

View leaderboard data for assigned events

Judge navigation

Dashboard
Discover Events
Review Projects
Leaderboard
Notifications
My Profile

🏢 Organizer

An organizer can:

Register/login using the organizer role

Create hackathons

Set event name and description

Set start and end date/time

Set a prize pool

Publish an event

Close registration

Cancel an event

Delete an event

View their own hackathons

Assign judges

View registered participants

View teams

View team members

View project submissions

Access a dedicated event management workspace

Organizer navigation

Dashboard
Create Event
My Hackathons
Discover Events
Leaderboard
Notifications
My Profile

👥 User Roles

The backend defines exactly three application roles:

Role

Description

participant

Joins hackathons, forms teams, and submits projects

judge

Reviews and scores projects

organizer

Creates and manages hackathons

The custom Django user model stores the role as a field with these choices.

🔄 Application Flow

Complete Hackathon Lifecycle

                    ┌───────────────┐
                    │   Organizer   │
                    └───────┬───────┘
                            │
                            ▼
                    Create Hackathon
                            │
                            ▼
                    Publish / Open
                            │
                            ▼
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        Participants                    Judges
              │                           │
              ▼                           ▼
       Register Event              Assigned Event
              │                           │
              ▼                           │
         Create Team                     │
              │                           │
              ▼                           │
       Add Team Members                  │
              │                           │
              ▼                           │
       Submit Project                    │
              │                           │
              └─────────────┬─────────────┘
                            ▼
                     Review Project
                            │
                            ▼
                    Score + Feedback
                            │
                            ▼
                       Average Score
                            │
                            ▼
                       Leaderboard

🧭 Frontend Pages and Routes

The React application defines the following routes.

Route

Page

Access

/

Landing/Home

Public

/login

Login

Public

/register

Registration

Public

/dashboard

Dashboard

All authenticated roles

/profile

Profile & Settings

All authenticated roles

/events

Discover Hackathons

All authenticated roles

/events/:eventId

Hackathon Details

All authenticated roles

/team

Team Management

Participant

/my-hackathons

My Hackathons

Participant

/submit

Project Submission

Participant

/leaderboard

Leaderboard

All authenticated roles

/notifications

Notification Center

All authenticated roles

/create-event

Create Event

Organizer

/review

Review Projects

Judge

/organizer/hackathons

Organizer Hackathons

Organizer

/organizer/hackathons/:eventId/manage

Organizer Workspace

Organizer

The application uses a ProtectedRoute component to check authentication and role before rendering protected pages.

🏗️ Frontend Architecture

The frontend is a React application using React Router for navigation.

Frontend
│
├── App.jsx
│ └── Application routes
│
├── main.jsx
│ └── BrowserRouter + authentication interceptor
│
├── components/
│ ├── html/
│ │ ├── Button.jsx
│ │ ├── Logo.jsx
│ │ ├── Sidebar.jsx
│ │ ├── footer.jsx
│ │ └── navbar.jsx
│ │
│ └── css/
│ ├── button.css
│ ├── footer.css
│ ├── logo.css
│ ├── navbar.css
│ └── sidebar.css
│
├── pages/
│ ├── html/
│ │ ├── home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Discover.jsx
│ │ ├── HackathonDetails.jsx
│ │ ├── MyHackathons.jsx
│ │ ├── Team.jsx
│ │ ├── SubmitProject.jsx
│ │ ├── LeaderBoard.jsx
│ │ ├── Notifications.jsx
│ │ ├── Profile.jsx
│ │ ├── CreateEvent.jsx
│ │ ├── ReviewProjects.jsx
│ │ ├── OrganizerHackathons.jsx
│ │ └── OrganizerWorkspace.jsx
│ │
│ └── css/
│ ├── Dashboard.css
│ ├── discover.css
│ ├── home.css
│ ├── leaderboard.css
│ ├── notifications.css
│ ├── profile.css
│ ├── register.css
│ ├── submit.css
│ └── team.css
│
└── utils/
└── auth.js

🧱 Backend Architecture

The Django backend is organized into two main applications:

Backend/
│
├── EventForge/
│ ├── settings.py
│ ├── urls.py
│ ├── asgi.py
│ └── wsgi.py
│
├── user/
│ ├── models.py
│ ├── serializers.py
│ ├── views.py
│ ├── urls.py
│ └── migrations/
│
└── event/
├── models.py
├── serializers.py
├── views.py
├── urls.py
└── migrations/

user application

Responsible for:

Custom user model

User registration

Current-user profile

Participant list

Judge list

Login

JWT refresh

OTP/token model endpoints

event application

Responsible for:

Events

Teams

Team members

Registrations

Judge assignments

Project submissions

Judgements

Leaderboard

🗃️ Database Models

The project currently defines the following main models.

User

The project extends Django's AbstractUser.

Fields include:

id
username
email
password
role

The id is a UUID and the email is unique.

Roles:

participant
judge
organizer

Token

The token model stores:

user
OTP
created_at

It is implemented as a one-to-one relationship with a user.

Event

An Event represents a hackathon.

Fields:

id
title
description
start_date
end_date
prize_pool
status
organizer
created_at

Available statuses:

draft
open
closed
completed
cancelled

Each event belongs to an organizer.

The event model also provides a get_leaderboard() method that collects project submissions belonging to its teams and sorts them by average score.

Team

Fields:

id
name
event
created_at

A team belongs to a specific event.

TeamMember

Fields:

id
team
user
joined_at

The model prevents the same user from being added twice to the same team using:

unique_together = ('team', 'user')

EventRegistration

Fields:

id
user
event
status
registered_at

A participant can only have one registration for a particular event.

JudgeAssignment

Fields:

event
judge
assigned_at
active

The same judge cannot be assigned to the same event more than once.

ProjectSubmission

Fields:

id
team
title
description
github_link
demo_link
submitted_at
status

A team is restricted to one project submission.

The model calculates:

average_score

using all judgements associated with the submission.

If a project has no scores, its average score is:

0

Judgement

Fields:

id
judge
submission
score
feedback
created_at

Each judge can evaluate a particular submission only once.

The backend validates scores between:

0 - 100

🔗 Database Relationship

User
│
├───────────────┐
│ │
│ ├── JudgeAssignment ── Event
│ │
│ ├── Judgement ── ProjectSubmission
│ │
│ └── EventRegistration ── Event
│
└── TeamMember ── Team ── Event
│
└── ProjectSubmission
│
└── Judgement

🔌 API Endpoints

The main API base used by the frontend is:

http://localhost:8000/api/v1

Authentication

POST /api/v1/login/
POST /api/v1/token/refresh/

Users

POST /api/v1/users/
GET /api/v1/me/
PUT /api/v1/me/

GET /api/v1/users/<uuid:id>

GET /api/v1/participants/
GET /api/v1/judges/

Events

GET /api/v1/events/
POST /api/v1/events/

GET /api/v1/events/<uuid:pk>/
PATCH /api/v1/events/<uuid:pk>/
PUT /api/v1/events/<uuid:pk>/
DELETE /api/v1/events/<uuid:pk>

POST /api/v1/events/<uuid:event_id>/register/
GET /api/v1/events/<uuid:event_id>/leaderboard/

Teams

GET /api/v1/teams/
POST /api/v1/teams/

GET /api/v1/teams/<uuid:pk>/
PUT /api/v1/teams/<uuid:pk>/
DELETE /api/v1/teams/<uuid:pk>

Team Members

GET /api/v1/team-members/
POST /api/v1/team-members/

DELETE /api/v1/team-members/<uuid:pk>/

Team members can also be filtered using:

/team-members/?team=<team_uuid>

Event Registrations

GET /api/v1/registrations/
POST /api/v1/registrations/

DELETE /api/v1/registrations/<uuid:pk>/

There is also a dedicated event registration endpoint:

POST /api/v1/events/<event_uuid>/register/

Project Submissions

GET /api/v1/submissions/
POST /api/v1/submissions/

GET /api/v1/submissions/<uuid:pk>/
PUT /api/v1/submissions/<uuid:pk>/
PATCH /api/v1/submissions/<uuid:pk>/
DELETE /api/v1/submissions/<uuid:pk>/

Judgements

GET /api/v1/judgements/
POST /api/v1/judgements/

GET /api/v1/judgements/<uuid:pk>/
PATCH /api/v1/judgements/<uuid:pk>/
PUT /api/v1/judgements/<uuid:pk>/

Judge Assignments

GET /api/v1/judge-assignments/
POST /api/v1/judge-assignments/

🔐 Authentication

Authentication is implemented using Django REST Framework Simple JWT.

After login, the frontend receives:

access token
refresh token

The tokens are stored in browser localStorage.

Stored values include:

accessToken
refreshToken
username
userRole

Authenticated requests send:

Authorization: Bearer <access_token>

♻️ Automatic Token Refresh

The frontend contains an Axios response interceptor.

When an API request returns:

401 Unauthorized

the interceptor attempts to use the refresh token to obtain a new access token.

API Request
│
▼
401 Unauthorized
│
▼
Refresh Token
│
├── Success ──► Save new Access Token
│ │
│ ▼
│ Retry Request
│
└── Failure ──► Clear Auth Data
│
▼
/login

This logic is implemented in:

Frontend/src/utils/auth.js

🛡️ Authorization Rules

The backend does not rely only on the frontend to restrict users. Important operations are checked in the Django views.

Participant

A participant:

Can register for an open event

Must be registered before creating a team

Cannot belong to multiple teams in the same event

Can create teams

Can add participants to their team

Can only add users who are participants

Can only add users who registered for the event

Can remove team members

Cannot remove the last member of a team

Can submit projects only for their own team

Can submit only while the event is open

Can update/delete their submissions

Can view results only after registering for the event

Judge

A judge:

Can see events assigned to them

Can see submissions belonging to assigned events

Can create judgements only for assigned events

Can score from 0 to 100

Can update their own evaluations

Cannot evaluate events to which they are not assigned

Organizer

An organizer:

Can create events

Automatically becomes the event organizer when creating one

Can only see their own events through organizer event views

Can update their own events

Can delete their own events

Can assign judges to their own events

Can only assign users whose role is judge

Can view registrations for their events

Can view teams belonging to their events

Can view submissions for their events

Can view results for their own events

🧮 Validation Rules

The backend contains several important validation rules.

Event dates

The end date must be later than the start date.

end_date > start_date

Project submission

A team can only have one submission.

One Team → One Project Submission

Judgement score

Scores must be:

0 ≤ score ≤ 100

Event registration

Registration is available only when:

event.status == "open"

Team creation

A participant must:

Be authenticated

Be registered for the event

Choose an open event

Not already belong to a team in that event

🏆 Leaderboard

The leaderboard is generated by the backend.

For every project submission, the system collects all judge scores:

scores = [judge1_score, judge2_score, judge3_score, ...]

Then calculates:

average_score = sum(scores) / number_of_scores

Projects are sorted in descending order:

Highest Average Score
↓
↓
↓
Lowest Average Score

The leaderboard response contains:

{
"id": "submission-uuid",
"title": "Project Name",
"team": "Team Name",
"average_score": 92.5
}

The frontend displays:

🥇 Champion

🥈 2nd Place

🥉 3rd Place

Complete ranking table

🖥️ Frontend User Experience

Landing Page

The landing page provides:

NerdHub branding

Hackathon navigation

Sign in / registration actions

Workspace access for logged-in users

Featured open events

Event dates

Event status

"How it works" explanation

Separate participant/organizer/judge perspectives

Login

The login page provides:

Username input

Password input

Password visibility toggle

Backend error messages

Loading state

Navigation to registration

After successful authentication:

Login
↓
Fetch Current User
↓
Determine Role
↓
Store JWT + User Data
↓
Dashboard

Registration

The registration page provides:

Email

Username

Password

Confirm password

Role selection

Password visibility toggles

Client-side password confirmation

Backend validation error display

Available roles:

participant
judge
organizer

Dashboard

The dashboard loads backend data for:

Events
Registrations
Teams
Submissions
Judgements

It then provides role-aware dashboard information and actions.

Discover Hackathons

The Discover page:

Loads events from the backend

Displays event status

Displays dates

Displays prize pool

Displays event description

Provides title-based search

Links to detailed hackathon pages

Hackathon Details

The details page displays:

Event title

Description

Status

Start date

End date

Organizer

Online location indicator

Prize pool

Participants can register directly when registration is open.

After registration, the interface changes to show:

✓ Registered

and tells the participant to create or join a team.

My Hackathons

Participants can see events for which they have registered.

The page provides:

Registration status

Event dates

Event description

Open hackathon button

Registration cancellation for open events

Team Management

The Team page supports:

Create Team
↓
Automatically add creator as member
↓
Select registered participant
↓
Add member
↓
View members
↓
Remove member

The backend ensures that a participant cannot join multiple teams within the same event.

Project Submission

Participants select one of their teams and submit:

Team
Project Name
Project Description
GitHub Link
Demo Link

The backend prevents a team from submitting more than one project.

Judge Review

Judges see projects they are authorized to evaluate.

For each submission they can:

Read Project
↓
Open Repository
↓
Open Demo
↓
Enter Score (0-100)
↓
Write Feedback
↓
Submit Evaluation

If an evaluation already exists, the button becomes:

Update Evaluation

Organizer Workspace

The organizer workspace is centered around a specific hackathon.

It contains tabs for:

Overview
Participants
Teams
Judges
Submissions

The workspace loads:

Event information

Event registrations

Teams

Team members

Project submissions

Judge assignments

Available judges

Organizers can also assign a judge directly from the workspace.

🗂️ Detailed Project Structure

Smart-Event-Hackathon-Management-System/
│
├── Backend/
│ │
│ ├── EventForge/
│ │ ├── **init**.py
│ │ ├── asgi.py
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── wsgi.py
│ │
│ ├── event/
│ │ ├── migrations/
│ │ ├── **init**.py
│ │ ├── admin.py
│ │ ├── apps.py
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── tests.py
│ │ ├── urls.py
│ │ └── views.py
│ │
│ ├── user/
│ │ ├── migrations/
│ │ ├── **init**.py
│ │ ├── admin.py
│ │ ├── apps.py
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── tests.py
│ │ ├── urls.py
│ │ └── views.py
│ │
│ ├── db.sqlite3
│ ├── manage.py
│ └── requirements.txt
│
├── Frontend/
│ │
│ ├── src/
│ │ ├── assets/
│ │ │ └── images/
│ │ │
│ │ ├── components/
│ │ │ ├── css/
│ │ │ └── html/
│ │ │
│ │ ├── pages/
│ │ │ ├── css/
│ │ │ └── html/
│ │ │
│ │ ├── utils/
│ │ │ └── auth.js
│ │ │
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── index.css
│ │ ├── main.jsx
│ │ └── product.css
│ │
│ ├── public/
│ ├── .gitignore
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── README.md
│ └── vite.config.js
│
└── README.md

🛠️ Technology Stack

Frontend

React 18

Vite 6

React Router DOM 7

Axios

Tailwind CSS 4

Bootstrap 5

React Bootstrap

Lucide React

React Icons

Backend

Python

Django 6.0.7

Django REST Framework 3.17.1

Django REST Framework Simple JWT 5.5.1

django-cors-headers 4.9.0

Oracle Database

oracledb 4.0.2

The exact backend dependency versions are maintained in:

Backend/requirements.txt

The frontend versions are maintained in:

Frontend/package.json

📋 Prerequisites

Before running the project, install:

Git

Python 3.x

Node.js

npm

Oracle Database / Oracle XE

An Oracle database user with access to the configured schema

📥 Getting Started

Clone the repository:

git clone https://github.com/Parashkhadka07/Smart-Event-Hackathon-Management-System.git

Enter the project:

cd Smart-Event-Hackathon-Management-System

The project has two separate applications:

Backend/
Frontend/

Both need to be configured and started.

⚙️ Backend Setup

Move into the backend:

cd Backend

1. Create a virtual environment

Windows

python -m venv venv

Activate:

venv\Scripts\activate

Linux/macOS

python3 -m venv venv

Activate:

source venv/bin/activate

2. Install Python dependencies

pip install -r requirements.txt

3. Configure Oracle

The current Django configuration expects:

localhost:1521/XEPDB1

The database configuration is located in:

Backend/EventForge/settings.py

You should configure your own:

Database name/service
Username
Password
Host
Port

Do not use production credentials directly inside settings.py.

4. Run migrations

python manage.py makemigrations

python manage.py migrate

5. Create a Django superuser

Optional:

python manage.py createsuperuser

6. Start Django

python manage.py runserver

The backend will normally be available at:

http://127.0.0.1:8000

The API used by the frontend is:

http://localhost:8000/api/v1

🎨 Frontend Setup

Open a second terminal.

From the project root:

cd Frontend

Install dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

🔗 Frontend ↔ Backend Configuration

The current frontend code uses the backend URL:

http://localhost:8000/api/v1

Several frontend pages currently define/use this URL directly.

For example:

Frontend/src/utils/auth.js
Frontend/src/pages/html/Login.jsx
Frontend/src/pages/html/Register.jsx
Frontend/src/pages/html/Dashboard.jsx
Frontend/src/pages/html/Discover.jsx
...

For deployment, it is recommended to replace hardcoded API URLs with a Vite environment variable such as:

VITE_API_URL=http://localhost:8000/api/v1

and use:

const API = import.meta.env.VITE_API_URL;

🌍 CORS

The backend currently allows the local Vite frontend origin:

http://localhost:5173

This is configured in:

Backend/EventForge/settings.py

For production, update CORS configuration to the actual deployed frontend domain.

🔒 Environment and Configuration

The current repository contains development configuration directly in Django settings, including:

DEBUG = True

A Django secret key

Oracle connection information

Local CORS configuration

For a production deployment, these values should be moved to environment variables.

Example:

DEBUG=False
SECRET_KEY=your-secret-key

ORACLE_NAME=your-oracle-service
ORACLE_USER=your-user
ORACLE_PASSWORD=your-password

FRONTEND_URL=https://your-frontend-domain.com

⚠️ Current Implementation Notes

This README describes the repository as it is currently implemented, rather than claiming features that are not present.

Notifications

The /notifications page currently displays a notification center UI, but the page itself does not currently retrieve notification data from the backend.

Profile

The profile page loads the current user and statistics from the backend.

The backend currently persists username/email changes through /me/. Some UI profile fields such as bio, GitHub, LinkedIn, and website are present in the frontend form but are not fields in the current Django User model.

Event location

The current frontend displays hackathons as Online. There is no event location field in the current Event model.

Event completion

The backend supports a completed status, but the current organizer interface primarily exposes publishing, closing registration, cancelling, and deleting actions.

Database file

A db.sqlite3 file is present in the backend repository, while the current Django settings.py configures Oracle as the active database engine. The configured database is therefore determined by the current settings rather than simply by the presence of the SQLite file.

🔐 Security Notes

The project already includes several useful security mechanisms:

Django password hashing

JWT authentication

Authenticated API endpoints

Role-based authorization

Event ownership checks

Judge assignment checks

Team membership checks

Registration checks

Submission ownership checks

Score validation

Unique database relationships

However, before production deployment:

Move SECRET_KEY to an environment variable

Remove database credentials from source code

Set DEBUG=False

Configure ALLOWED_HOSTS

Configure production CORS

Use HTTPS

Review JWT storage strategy

Review API rate limiting

Review permission boundaries

Remove development-only credentials

Do not commit .env files containing secrets

🧪 Testing

The Django apps contain test files:

Backend/event/tests.py
Backend/user/tests.py

Django tests can be run using:

python manage.py test

Frontend linting is available through:

npm run lint

🧰 Development Commands

Backend

Start server

python manage.py runserver

Create migrations

python manage.py makemigrations

Apply migrations

python manage.py migrate

Create superuser

python manage.py createsuperuser

Run tests

python manage.py test

Frontend

Install dependencies

npm install

Development server

npm run dev

Production build

npm run build

Preview production build

npm run preview

Lint

npm run lint

📊 Example System Interaction

Participant

Register
↓
Login
↓
Discover Hackathons
↓
Open Hackathon
↓
Register
↓
My Hackathons
↓
Create Team
↓
Add Members
↓
Submit Project
↓
Wait for Evaluation
↓
View Leaderboard

Judge

Register
↓
Login
↓
Assigned Hackathons
↓
Review Projects
↓
Open Repository / Demo
↓
Score 0-100
↓
Add Feedback
↓
Submit / Update Evaluation

Organizer

Register
↓
Login
↓
Create Event
↓
Assign Judges
↓
Publish Event
↓
Monitor Participants
↓
Monitor Teams
↓
Monitor Submissions
↓
View Evaluations
↓
View Leaderboard

🚀 Future Improvements

The current architecture provides a foundation for several additional features.

🔔 Real Notification System

Replace the current static notification page with:

Event notifications

Judge assignment notifications

Registration confirmations

Submission notifications

Evaluation notifications

Result announcements

👤 Extended User Profiles

Add backend fields for:

bio
profile_image
github
linkedin
website

so the profile information currently represented by the frontend can be persisted.

📁 Project File Uploads

Allow teams to upload:

Project presentations

Screenshots

Documentation

Demo videos

Source archives

🏅 Certificates

Generate certificates for:

Participants

Winners

Judges

Organizers

📊 Organizer Analytics

Add statistics such as:

Total Registrations
Total Teams
Total Submissions
Number of Judges
Evaluated Projects
Average Scores
Event Progress

🔎 Advanced Search

Add filtering by:

Event status

Date

Prize pool

Technology/category

Registration availability

📚 API Documentation

Add an interactive API documentation system such as:

Swagger / OpenAPI

🧪 Automated Testing

Expand testing with:

API integration tests

Authentication tests

Permission tests

Model tests

Serializer tests

Frontend component tests

End-to-end workflow tests

☁️ Production Deployment

A future production deployment should separate:

Frontend
│
▼
Production API
│
▼
Production Oracle Database

and use environment-specific configuration rather than hardcoded localhost addresses.

🤝 Contributing

Contributions are welcome.

1. Fork the repository

Create your own fork on GitHub.

2. Clone your fork

git clone YOUR_FORK_URL

3. Create a feature branch

git checkout -b feature/your-feature

4. Make your changes

Implement and test your changes.

5. Commit

git add .
git commit -m "Add your feature"

6. Push

git push origin feature/your-feature

7. Open a Pull Request

Describe:

What changed

Why it was changed

How it was tested

🐛 Reporting Issues

If you find a bug, open a GitHub issue and include:

Description of the problem

Steps to reproduce

Expected result

Actual result

Error message

Browser/OS information

Screenshots when useful

📜 License

No dedicated license file is currently present in the repository.

If this project is intended to be distributed as open source, add an appropriate license such as the MIT License.

👨‍💻 Project

Smart Event Hackathon Management System

A full-stack hackathon management platform built to connect:

Participants
│
▼
Hackathons
│
▼
Teams
│
▼
Projects
│
▼
Judges
│
▼
Evaluations
│
▼
Leaderboard

⭐ Repository

GitHub repository:

https://github.com/Parashkhadka07/Smart-Event-Hackathon-Management-System

📌 Project Status

🚧 Active Development

The application is functional across the main participant, judge, and organizer workflows, while some areas such as notifications, extended profiles, production configuration, testing coverage, and deployment are still suitable for further development.

<p align="center">
  Built with React, Django REST Framework, JWT, and Oracle Database.
</p>
