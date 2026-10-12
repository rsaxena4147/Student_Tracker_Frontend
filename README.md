# Student_Tracker_Frontend

## API configuration

The frontend reads its API base URL from `VITE_API_URL`.

- Local development: copy `.env.example` to `.env`. The default `/api` uses the
  Vite proxy to reach the backend at `http://localhost:5000`.
- Render: set `VITE_API_URL` in the Static Site's environment variables to the
  backend URL ending in `/api`, such as `https://your-backend.onrender.com/api`.
  Vite embeds this value during the build, so redeploy the frontend after
  changing it.