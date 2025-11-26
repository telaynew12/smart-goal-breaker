"""
Test script to verify Supabase PostgreSQL connection
Run this before starting the main application to ensure database connectivity.
"""
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user") or os.getenv("DB_USER") or "postgres"
PASSWORD = os.getenv("password") or os.getenv("DB_PASSWORD")
HOST = os.getenv("host") or os.getenv("DB_HOST") or "localhost"
PORT = os.getenv("port") or os.getenv("DB_PORT") or "5432"
DBNAME = os.getenv("dbname") or os.getenv("DB_NAME") or "postgres"

# Connect to the database
try:
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    print("✅ Connection successful!")
    
    # Create a cursor to execute SQL queries
    cursor = connection.cursor()
    
    # Example query
    cursor.execute("SELECT NOW();")
    result = cursor.fetchone()
    print(f"✅ Current Time: {result[0]}")
    
    # Check if tables exist
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    
    if tables:
        print("\n📋 Existing tables:")
        for table in tables:
            print(f"   - {table[0]}")
    else:
        print("\n📋 No tables found (will be created on first app run)")
    
    # Close the cursor and connection
    cursor.close()
    connection.close()
    print("\n✅ Connection closed.")
    print("\n🎉 Database connection test passed! You can now start the backend server.")
    
except Exception as e:
    print(f"❌ Failed to connect: {e}")
    print("\n💡 Make sure:")
    print("   1. Your .env file has the correct Supabase credentials")
    print("   2. Your Supabase database is running and accessible")
    print("   3. Your IP is whitelisted in Supabase (if required)")
    exit(1)

