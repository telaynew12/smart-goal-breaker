import google.generativeai as genai
import json
import os
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def break_down_goal(goal: str) -> Dict:
    """
    Use Gemini AI to break down a vague goal into 5 actionable steps
    Returns a dict with tasks (list of 5 strings) and complexity_score (1-10)
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in environment variables")
    
    # Use gemini-2.0-flash for fast, free tier responses
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""Break down the following goal into exactly 5 actionable, specific steps. 
Also provide a complexity score from 1-10 where 1 is very simple and 10 is extremely complex.

Goal: "{goal}"

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{{
    "tasks": [
        "Step 1 description here",
        "Step 2 description here",
        "Step 3 description here",
        "Step 4 description here",
        "Step 5 description here"
    ],
    "complexity_score": 7.5
}}

Make sure each task is:
- Actionable (start with a verb)
- Specific and clear
- Realistic and achievable
- Sequential (each builds on the previous)

The complexity score should reflect the overall difficulty and scope of achieving this goal."""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        result = json.loads(response_text)
        
        # Validate structure
        if "tasks" not in result or "complexity_score" not in result:
            raise ValueError("Invalid response format from AI")
        
        tasks = result["tasks"]
        if not isinstance(tasks, list) or len(tasks) != 5:
            raise ValueError(f"Expected exactly 5 tasks, got {len(tasks)}")
        
        complexity = float(result["complexity_score"])
        if complexity < 1 or complexity > 10:
            complexity = max(1, min(10, complexity))  # Clamp to 1-10
        
        return {
            "tasks": tasks,
            "complexity_score": complexity
        }
    
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}")
    except Exception as e:
        raise ValueError(f"Error calling Gemini API: {str(e)}")

