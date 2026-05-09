# Gym Management System

APEX is a role-based gym management platform with separate experiences for trainees, coaches, and admins. It includes authentication, dashboard routing, workout and diet tracking, admin operations, and an AI coach assistant for trainees.

## Features

- Role-based authentication for trainee, coach, and admin users
- OTP-based registration and verification flow
- Trainee dashboard with workout, schedule, diet, settings, and AI coach screens
- Coach dashboard with assigned trainees, workout assignment, and account settings
- Admin dashboard for user management, coach-trainee assignment, and payment oversight
- MongoDB seed script that clears existing data and loads a complete linked demo dataset
- AI nutrition and coaching assistant backed by Groq

## Tech Stack

- Frontend: Next.js 16, React 19, Chakra UI, Redux Toolkit, Axios
- Backend: Express, MongoDB, Mongoose, JWT, cookie-based auth
- AI: Groq chat completions API

## Project Structure

```text
backend/
	controllers/
	middlewares/
	models/
	routes/
	services/
	scripts/
frontend/
	src/app/
		adminDashboard/
		coachDashboard/
		traineeDashboard/
		login/
		register/
		verify-otp/
		account-type/
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a `backend/.env` file with values similar to these:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gym-management
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
TEST_OTP=123456
EMAIL_DELIVERY_DISABLED=true
```

If you use a different frontend port or production URL, update `FRONTEND_URL` accordingly.

The frontend uses the API base URL from `NEXT_PUBLIC_API_URL`. If that variable is not set, it falls back to `http://localhost:5000/api`.

## Installation

Install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the App

Start the backend:

```bash
cd backend
npm start
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The app will typically be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Seed Data

Load the demo dataset with linked users, subscriptions, workouts, diets, sessions, and coach assignments:

```bash
cd backend
npm run seed
```

The seed script resets the collections it manages before inserting fresh demo data.

## Default Demo Accounts

Use these accounts after seeding the database:

- Admin: `admin@apex.local`
- Coaches: `coach.mason@apex.local`, `coach.lina@apex.local`, `coach.omar@apex.local`
- Trainees: `ava@apex.local`, `noah@apex.local`, `mia@apex.local`, `leo@apex.local`, `emma@apex.local`, `kai@apex.local`
- Password for all accounts: `Password123!`
- Test OTP: `123456`

## Key API Areas

- `/api/auth` for OTP request and verification
- `/api/users` for login, logout, password changes, and trainee chat
- `/api/trainee` for trainee profile, workout, and settings data
- `/api/coach` for coach trainee and workout management
- `/api/admin` for admin dashboard and account management
- `/api/diet` for diet summaries and AI meal logging
- `/api/sessions` for session booking and management

## AI Coach

The trainee AI coach screen is available in the trainee dashboard. It uses the backend chat endpoint and requires `GROQ_API_KEY` in `backend/.env` to generate live responses. If the key is missing, the server returns a safe fallback message instead of failing.

## Troubleshooting

- If login or dashboard redirects seem stale, restart both dev servers and clear the browser session.
- If the AI coach says it is unavailable, verify `GROQ_API_KEY` is set in `backend/.env`.
- If you see a MongoDB connection issue, confirm the database URI and that MongoDB is running.
- If the frontend opens on a different port, check the terminal output and update `FRONTEND_URL` if needed.

## License

No license has been specified for this project.
