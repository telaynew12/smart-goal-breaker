# Quick Setup Guide 🚀

Follow these steps to get the Smart Goal Breaker app running locally.

## Step 1: Get Your API Keys

### 1.1 Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need this for the backend)

### 1.2 Supabase Database Credentials
You should already have:
- Host: `db.irtdcagbjhuqicfdjvfb.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: (your Supabase password)

## Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy the example below)
nano .env  # or use your preferred editor
```

**Backend `.env` file:**
```env
user=postgres
password=YOUR_SUPABASE_PASSWORD
host=db.irtdcagbjhuqicfdjvfb.supabase.co
port=5432
dbname=postgres

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
CORS_ORIGINS=http://localhost:3000
```

**Test database connection:**
```bash
python test_db_connection.py
```

**Start backend server:**
```bash
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

## Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 4: Test the Application

1. Open `http://localhost:3000` in your browser
2. Enter a goal like "Launch a startup"
3. Click "Break Down"
4. Wait for AI to process and see the 5 actionable steps!

## Troubleshooting

### Database Connection Issues
- Verify your Supabase credentials are correct
- Check if your IP needs to be whitelisted in Supabase
- Run `python test_db_connection.py` to diagnose

### AI API Issues
- Verify your Gemini API key is valid
- Check if you have API quota remaining
- Review backend logs for error messages

### Frontend Not Connecting to Backend
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend allow `http://localhost:3000`

## Next Steps

Once everything works locally, you can deploy:
- **Backend**: Deploy to Render, Railway, or Heroku
- **Frontend**: Deploy to Vercel (recommended for Next.js)

See the main README.md for deployment instructions.


