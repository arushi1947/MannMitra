from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.reminder import router as reminder_router
from routes.settings import router as settings_router
from routes.dashboard import router as dashboard_router
from routes.contact_routes import router as contact_router
from routes.newsletter import router as newsletter_router
from routes.feature_announcements import router as feature_router
from routes.moods import router as mood_router
from routes.ai_insight import router as ai_router
from routes.monthly_summary import router as monthly_router
from routes.journal import router as journal_router
from routes.upload import router as upload_router
from routes.analytics import router as analytics_router
from routes.chat import router as chat_router
from routes.daily_summary import router as daily_summary_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(reminder_router)
app.include_router(settings_router)
app.include_router(dashboard_router)
app.include_router(contact_router, prefix="/api")
app.include_router(newsletter_router, prefix="/api")
app.include_router(feature_router)
app.include_router(mood_router)
app.include_router(ai_router, prefix="/api")
app.include_router(monthly_router)
app.include_router(journal_router)
app.include_router(upload_router)
app.include_router(analytics_router)
app.include_router(chat_router, prefix="/api")
app.include_router(daily_summary_router)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "MannMitra Backend Running"}