from fastapi import APIRouter
import google.generativeai as genai
from datetime import datetime, timedelta
import os
import json

router = APIRouter()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

@router.post("/parse-voice")
async def parse_voice(data: dict):

    transcript = data["text"]

    today = datetime.now().strftime("%Y-%m-%d")
    tomorrow = (
        datetime.now() + timedelta(days=1)
    ).strftime("%Y-%m-%d")

    prompt = f"""
You are an intelligent multilingual reminder parser.

Today's date is:

{today}

Tomorrow's date is:

{tomorrow}

The user may speak in:

- English
- Hindi
- Hinglish (Hindi written in English)
- Mixed language

Examples:

"Take medicine at 8 pm"

"Tomorrow call mom"

"दवाई रात 8 बजे याद दिलाना"

"कल मम्मी को फोन करना"

"पानी पीना याद दिलाना"

"Roz subah 7 baje exercise"

"हर दिन रात 9 बजे दवाई"

"Take insulin after dinner"

Understand the meaning and convert the sentence into JSON.

Rules:

1. Return ONLY JSON.
2. Do not use markdown.
3. title should contain only the task.
4. Convert all times into 24-hour HH:MM format.
5. If user says tomorrow or कल, use:

date = "{tomorrow}"

otherwise use:

date = "{today}"

6. If user says:

every day
daily
हर दिन
रोज
roz

then:

repeat = "daily"

otherwise:

repeat = "none"

7. Understand natural language times:

after breakfast → 08:00
after lunch → 13:00
after dinner → 20:00
before bed → 22:00
morning → 08:00
afternoon → 14:00
evening → 18:00
night → 21:00

सुबह → 08:00
दोपहर → 13:00
शाम → 18:00
रात → 21:00

8. Description should be empty.

Return exactly:

{{
"title":"",
"description":"",
"date":"",
"time":"",
"repeat":""
}}
"""

    try:

        response = model.generate_content(prompt)

        text = response.text.strip()

        text = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(text)

        return parsed

    except Exception as e:

        print("Voice Parser Error:", e)

        return {
            "title": "",
            "description": "",
            "date": today,
            "time": "",
            "repeat": "none"
        }