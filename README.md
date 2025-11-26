# Smart Goal Breaker 🎯

A full-stack application that uses AI to break down vague goals into 5 actionable steps with complexity scoring.

## 🚀 Features

- **AI-Powered Goal Breakdown**: Uses Google Gemini AI to analyze goals and generate 5 specific, actionable steps
- **Complexity Scoring**: Each goal receives a complexity score from 1-10
- **PostgreSQL Database**: Stores goals and tasks for future reference
- **Modern UI**: Built with Next.js and shadcn/ui components
- **Fast API**: Backend built with FastAPI for high performance

## 📋 Tech Stack

### Backend
- **Python 3.12+**
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Database (via Supabase)
- **Google Gemini AI** - Goal breakdown AI
- **psycopg2** - PostgreSQL adapter

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Icon library

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL database (Supabase or local)
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file in the backend directory:**
   ```env
   # Supabase PostgreSQL Configuration
   user=postgres
   password=your_supabase_password
   host=db.irtdcagbjhuqicfdjvfb.supabase.co
   port=5432
   dbname=postgres

   # Alternative: Use DATABASE_URL instead
   # DATABASE_URL=postgresql://postgres:your_password@db.irtdcagbjhuqicfdjvfb.supabase.co:5432/postgres

   # Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # CORS Origins (comma-separated)
   CORS_ORIGINS=http://localhost:3000
   ```

5. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file in the frontend directory:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📝 API Endpoints

### `POST /goals`
Create a new goal and break it down into tasks.

**Request:**
```json
{
  "title": "Launch a startup"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Launch a startup",
  "complexity_score": 8.5,
  "created_at": "2024-01-01T12:00:00",
  "tasks": [
    {
      "id": 1,
      "title": "Research and validate your business idea",
      "order": 1,
      "created_at": "2024-01-01T12:00:00"
    },
    ...
  ]
}
```

### `GET /goals`
Get all goals with their tasks.

### `GET /goals/{goal_id}`
Get a specific goal by ID.

## 🗄️ Database Schema

### Goals Table
- `id` (Integer, Primary Key)
- `title` (String)
- `complexity_score` (Float, 1-10)
- `created_at` (DateTime)

### Tasks Table
- `id` (Integer, Primary Key)
- `goal_id` (Integer, Foreign Key)
- `title` (Text)
- `order` (Integer, 1-5)
- `created_at` (DateTime)

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Ensure PostgreSQL database is configured
3. Deploy the backend service

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

## 📄 License

MIT License

## 👨‍💻 Author

Built for the Smart Goal Breaker challenge.


