# 🤖 SEGULA SupportAI — Full Stack Setup Guide

## Tech Stack
| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React + Tailwind CSS + Recharts |
| Backend    | Flask + SQLAlchemy + JWT       |
| ML         | scikit-learn (TF-IDF + RandomForest) |
| Database   | PostgreSQL (Supabase free)     |
| Deploy FE  | Vercel                         |
| Deploy BE  | Render                         |

---

## 📁 Project Structure
```
supportai-project/
├── frontend/          ← React app
│   ├── src/
│   │   ├── pages/     ← Home, RaiseTicket, Chatbot, MyTickets, AdminDashboard
│   │   ├── components/← Navbar, Footer
│   │   ├── services/  ← api.js (all Axios calls)
│   │   ├── App.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
└── backend/           ← Flask API
    ├── app.py
    ├── config/config.py
    ├── models/
    │   ├── db.py
    │   └── models.py
    ├── routes/
    │   ├── auth.py
    │   ├── tickets.py
    │   ├── chatbot.py
    │   ├── admin.py
    │   └── ml.py
    ├── ml_model/
    │   └── classifier.py
    └── requirements.txt
```

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1 — Prerequisites
Install these first:
- Node.js (v18+): https://nodejs.org
- Python 3.11: https://python.org
- PostgreSQL: https://postgresql.org (or use Supabase free)
- Git: https://git.scm.com

---

### STEP 2 — Frontend Setup (React)

```bash
cd frontend
npm install
```

Create `.env` file in frontend/:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm start
```
✅ Opens at http://localhost:3000

---

### STEP 3 — Backend Setup (Flask)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `.env` from example:
```bash
cp .env.example .env
# Edit .env with your database URL
```

---

### STEP 4 — Database Setup

#### Option A: Local PostgreSQL
```sql
-- In psql or pgAdmin:
CREATE DATABASE supportai_db;
```
Set DATABASE_URL in .env:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost/supportai_db
```

#### Option B: Supabase (Free Cloud DB) ⭐ Recommended
1. Go to https://supabase.com → New Project
2. Settings → Database → Connection String → URI
3. Copy the URI and paste into .env as DATABASE_URL

---

### STEP 5 — Run the Backend

```bash
cd backend
python app.py
```
✅ Backend runs at http://localhost:5000
✅ Test: http://localhost:5000/api/health

---

### STEP 6 — Test Both Together

1. Open http://localhost:3000 (React)
2. Navigate to Raise Ticket → click "Auto-Classify with AI"
3. It calls Flask → ML model → returns category + priority
4. Open Chatbot → type "WiFi not working"
5. It calls Flask chatbot route → returns step-by-step fix

---

## 🌐 DEPLOYMENT (Free)

### Deploy Frontend → Vercel
```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Follow prompts → it deploys automatically
```
After deploy, add environment variable in Vercel dashboard:
```
REACT_APP_API_URL = https://your-backend.onrender.com/api
```

### Deploy Backend → Render
1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo → select /backend folder
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn "app:create_app()"`
6. Add environment variables (DATABASE_URL, JWT_SECRET_KEY)
7. Deploy!

### Database → Supabase (Already setup above)

---

## 🔑 API Endpoints Reference

| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /api/auth/register      | Register user         |
| POST   | /api/auth/login         | Login, get JWT token  |
| GET    | /api/tickets/           | Get all tickets       |
| POST   | /api/tickets/           | Create new ticket     |
| PUT    | /api/tickets/:id        | Update ticket         |
| DELETE | /api/tickets/:id        | Delete ticket         |
| POST   | /api/ml/classify        | AI classify ticket    |
| POST   | /api/chatbot/message    | Chat with AI bot      |
| GET    | /api/admin/stats        | Dashboard stats       |
| GET    | /api/admin/agents       | Agent performance     |
| GET    | /api/admin/activity     | Recent activity       |
| GET    | /api/health             | Health check          |

---

## ⚠️ Important Notes

1. **Never commit `.env`** — add it to `.gitignore`
2. **Change JWT_SECRET_KEY** before production
3. The ML model auto-trains on first run → saves `classifier.pkl`
4. Add `classifier.pkl` to `.gitignore`
5. Frontend falls back to mock data if backend is offline

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| `CORS error` | Check allowed origins in app.py CORS config |
| `Cannot connect to DB` | Check DATABASE_URL in .env |
| `Module not found` | Run `pip install -r requirements.txt` again |
| `Port 3000 in use` | `npx kill-port 3000` |
| `Port 5000 in use` | `npx kill-port 5000` |
