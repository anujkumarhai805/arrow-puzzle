# Arrow Puzzle - Netlify + Node/Express + Supabase

## Structure
- frontend/index.html: current game
- backend/: Express API
- supabase/schema.sql: profiles table

## Supabase
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy Project URL and the server-side Secret key.

## Backend locally
cd backend
npm install
copy `.env.example` to `.env` and fill values.
npm start

Health check: http://localhost:3000/api/health

## Deployment
Deploy the `backend` folder to a Node.js host (Render/Railway/etc.). Set the same environment variables there. Set FRONTEND_ORIGIN to your Netlify URL.

Deploy `frontend/index.html` to Netlify as the static site.

## API
POST /api/auth/signup {name,mobile,email,password}
POST /api/auth/login {email,password}
GET /api/users/me (Bearer token)
PUT /api/users/me (Bearer token)
GET /api/admin/users (admin Bearer token)
GET /api/admin/stats (admin Bearer token)

Never commit `.env` or the Supabase secret key.


## Frontend account UI

The frontend now includes Login and Sign Up screens and calls:
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

Before deployment, set the backend URL in `frontend/index.html` by changing:

`const API_BASE = window.ARROWS_API_BASE || "http://localhost:3000";`

to your deployed backend URL, for example:

`const API_BASE = "https://YOUR-BACKEND.onrender.com";`

Do not put Supabase secret keys in the frontend.
