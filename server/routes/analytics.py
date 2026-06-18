import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from fastapi import APIRouter
from database.db import db
from datetime import datetime, timedelta
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
    Flowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics import renderPDF
from reportlab.lib.utils import ImageReader
from fastapi.responses import FileResponse

router = APIRouter()

moods = db["moods"]
journals = db["journals"]
reminders = db["reminders"]
journal_sentiments = db["journal_sentiments"]

@router.get("/analytics-summary/{email}")
def analytics_summary(
    email: str,
    period: int = 30
):

    period = int(period)

    if period == 0:

        start_date = None
        week_start = None

    else:

        start_date = datetime.now() - timedelta(days=period)
        week_start = datetime.now() - timedelta(days=period)

    mood_docs = moods.find({
        "email": email
    })

    mood_count = {}

    for mood in mood_docs:

        mood_name = (
            mood["mood"]
            + " "
            + mood["emoji"]
        )

        mood_count[mood_name] = (
            mood_count.get(mood_name, 0)
            + 1
        )

    most_frequent_mood = (
        max(mood_count, key=mood_count.get)
        if mood_count
        else "No Data"
    )

    mood_distribution = []

    query = {
        "email": email
    }

    if start_date:
        query["date"] = {
            "$gte": start_date
        }

    filtered_moods = moods.find(query)

    filtered_mood_count = {}

    for mood in filtered_moods:

        mood_name = mood["mood"] + " " + mood["emoji"]

        filtered_mood_count[mood_name] = (
            filtered_mood_count.get(mood_name, 0)
            + 1
        )

    for mood_name, count in filtered_mood_count.items():

        mood_distribution.append({

            "name": mood_name,

            "value": count

        })

    time_scores = {

        "Morning": [],
        "Afternoon": [],
        "Evening": [],
        "Night": []

    }

    mood_docs = moods.find({
        "email": email
    })

    for mood in mood_docs:

        dt = mood["date"]

        hour = dt.hour

        score = mood["score"]

        if 6 <= hour < 12:

            time_scores["Morning"].append(score)

        elif 12 <= hour < 17:

            time_scores["Afternoon"].append(score)

        elif 17 <= hour < 22:

            time_scores["Evening"].append(score)

        else:

            time_scores["Night"].append(score)


    averages = {}

    for period, scores in time_scores.items():

        if scores:

            averages[period] = sum(scores) / len(scores)

    best_time_of_day = (

        max(averages, key=averages.get)

        if averages

        else "No Data"

    )

    completed = reminders.find({

        "userEmail": email,

        "completed": True

    })

    weekday_count = {}

    for reminder in completed:

        if reminder.get("completedDate"):

            dt = datetime.strptime(

                reminder["completedDate"],

                "%Y-%m-%d"

            )

            day = dt.strftime("%A")

            weekday_count[day] = (

                weekday_count.get(day, 0)

                + 1

            )

    most_productive_day = (

        max(

            weekday_count,

            key=weekday_count.get

        )

        if weekday_count

        else "No Data"

    )

    active_dates = set()

    mood_docs = moods.find({

        "email": email

    })

    for mood in mood_docs:

        active_dates.add(

            mood["date_only"]

        )

    journal_docs = journals.find({

        "userEmail": email

    })

    for journal in journal_docs:

        active_dates.add(

            journal["createdAt"]

            .strftime("%Y-%m-%d")

        )

    completed = reminders.find({

        "userEmail": email,

        "completed": True

    })

    for reminder in completed:

        if reminder.get("completedDate"):

            active_dates.add(

                reminder["completedDate"]

            )


    streak = 0

    current_day = datetime.now()

    while True:

        date_str = current_day.strftime(

            "%Y-%m-%d"

        )

        if date_str in active_dates:

            streak += 1

            current_day -= timedelta(days=1)

        else:

            break

    week_days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

    reminder_counts = {

        day:0

        for day in week_days

    }

    journal_counts = {

        day:0

        for day in week_days

    }

    mood_counts = {

        day:0

        for day in week_days

    }

    completed_reminders = reminders.find({

        "userEmail": email,

        "completed": True

    })

    for reminder in completed_reminders:

        if reminder.get("completedDate"):

            dt = datetime.strptime(

                reminder["completedDate"],

                "%Y-%m-%d"

            )

            if week_start is None or dt >= week_start:

                day = dt.strftime("%a")

                reminder_counts[day] += 1

    journal_docs = journals.find({

        "userEmail": email

    })

    for journal in journal_docs:

        created_date = journal["createdAt"]

        if week_start is None or created_date >= week_start:

            day = created_date.strftime("%a")

            journal_counts[day] += 1

    mood_docs = moods.find({

        "email": email

    })

    for mood in mood_docs:

        mood_date = mood["date"]

        if week_start is None or mood_date >= week_start:

            day = mood_date.strftime("%a")

            mood_counts[day] += 1

    weekly_activity = []

    for day in week_days:

        weekly_activity.append({

            "day": day,

            "reminders": reminder_counts[day],

            "journals": journal_counts[day],

            "moods": mood_counts[day]

        })

    journal_query = {

        "userEmail": email

    }

    if start_date:

        journal_query["createdAt"] = {

            "$gte": start_date

        }

    journal_docs = list(

        journals.find(

            journal_query

        )

    )

    total_entries = len(journal_docs)

    words_written = 0

    weekday_count = {}

    time_count = {

        "Morning": 0,

        "Afternoon": 0,

        "Evening": 0,

        "Night": 0

    }

    for journal in journal_docs:

        content = journal.get(

            "content",

            ""

        )

        words_written += len(

            content.split()

        )

        created = journal["createdAt"]

        day = created.strftime("%A")

        weekday_count[day] = (

            weekday_count.get(day, 0)

            + 1

        )

        hour = created.hour

        if 6 <= hour < 12:

            time_count["Morning"] += 1

        elif 12 <= hour < 17:

            time_count["Afternoon"] += 1

        elif 17 <= hour < 22:

            time_count["Evening"] += 1

        else:

            time_count["Night"] += 1

    journal_active_day = (

        max(

            weekday_count,

            key=weekday_count.get

        )

        if weekday_count

        else "No Data"

    )

    favorite_writing_time = (

        max(

            time_count,

            key=time_count.get

        )

        if time_count

        else "No Data"

    )

    monthly_query = {
        "email": email
    }

    if start_date:
        monthly_query["date"] = {
            "$gte": start_date
        }

    filtered_moods = list(
        moods.find(monthly_query)
    )

    total_mood_entries = len(filtered_moods)

    average_mood_score = round(

        (
            sum(
                mood.get("score", 0)
                for mood in filtered_moods
            )
            /
            total_mood_entries
        ) / 2,

        1

    ) if total_mood_entries > 0 else 0


    all_reminders = list(

        reminders.find({

            "userEmail": email

        })

    )

    if start_date:

        filtered_reminders = []

        for reminder in all_reminders:

            reminder_date = reminder.get("date")

            if reminder_date:

                reminder_date = datetime.strptime(

                    reminder_date,

                    "%Y-%m-%d"

                )

                if reminder_date >= start_date:

                    filtered_reminders.append(

                        reminder

                    )

        all_reminders = filtered_reminders

    completed_reminders = len(

        [

            reminder

            for reminder in all_reminders

            if reminder.get("completed")

        ]

    )

    completion_rate = round(

        completed_reminders
        /
        len(all_reminders)

        * 100,

        1

    ) if len(all_reminders) > 0 else 0

    emotion_docs = list(

        journal_sentiments.find(

            {

                "userEmail": email

            }

        )

    )

    emotion_count = {}

    positive_emotions = [
        "Joy",
        "Love",
        "Calm",
        "Gratitude",
        "Hope"
    ]

    negative_emotions = [
        "Stress",
        "Sadness",
        "Anger",
        "Fear",
        "Loneliness"
    ]

    positive_count = 0
    negative_count = 0

    for doc in emotion_docs:

        emotion = doc.get(
            "emotion",
            "Unknown"
        )

        emotion_count[emotion] = (
            emotion_count.get(emotion,0)+1
        )

        if doc["sentiment"] == "Positive":

            positive_count += 1

        elif doc["sentiment"] == "Negative":

            negative_count += 1


    emotion_distribution = []

    for emotion,count in emotion_count.items():

        emotion_distribution.append({

            "name": emotion,

            "value": count

        })

    dominant_emotion = (
        max(
            emotion_count,
            key=emotion_count.get
        )
        if emotion_count
        else "No Data"
    )

    total = positive_count + negative_count

    positive_ratio = round(
        positive_count/total*100,
        1
    ) if total else 0

    stress_from_mood = (
        (5 - average_mood_score)
        * 20
    )

    stress_from_reminders = (
        100 - completion_rate
    )

    journal_stress = (

        negative_count
        /
        total
        * 100

    ) if total else 50

    stress_index = round(

        (

            stress_from_mood * 0.5

            +

            stress_from_reminders * 0.3

            +

            journal_stress * 0.2

        ),

        1

    )

    if stress_index < 25:
        emotional_stability = "Very Stable"

    elif stress_index < 50:
        emotional_stability = "Stable"

    elif stress_index < 70:
        emotional_stability = "Moderate"

    else:
        emotional_stability = "Needs Support"

    weekly_ai_summary = (
        f"Your dominant emotion this period was "
        f"{dominant_emotion}. "
        f"{positive_ratio}% of your journals reflected positive emotions."
    )

    pattern_detector = []

    if positive_ratio >= 70:

        pattern_detector.append(
            "You have maintained a largely positive emotional pattern."
        )

    if stress_index >= 50:

        pattern_detector.append(
            "Stress-related emotions appeared frequently."
        )

    if dominant_emotion == "Gratitude":

        pattern_detector.append(
            "Gratitude journaling seems to improve your mood."
        )

    if dominant_emotion == "Love":

        pattern_detector.append(
            "Relationship experiences are mostly positive."
        )

    if not pattern_detector:

        pattern_detector.append(
            "Healthy habits are supporting your emotional wellbeing."
        )

    emotion_scores = []

    for doc in emotion_docs:

        score = 50

        if doc.get("sentiment") == "Positive":
            score = 85

        elif doc.get("sentiment") == "Negative":
            score = 35

        emotion_scores.append({

            "date": doc["createdAt"],

            "score": score

        })

    emotion_scores.sort(
        key=lambda x: x["date"]
    )

    monthly_growth = {}

    for item in emotion_scores:

        month = item["date"].strftime("%b")

        monthly_growth.setdefault(
            month,
            []
        ).append(
            item["score"]
        )

    emotional_growth = []

    for month, scores in monthly_growth.items():

        emotional_growth.append({

           "month": month,

           "score": round(

            sum(scores) / len(scores),

                1

            )

        })

    current_emotional_score = (

        emotional_growth[-1]["score"]

        if emotional_growth

        else 0

    )

    if len(emotional_growth) >= 2:

        growth_percentage = round(

            current_emotional_score

            -

            emotional_growth[0]["score"],

            1

        )

    else:

        growth_percentage = 0


    if growth_percentage > 15:

        growth_insight = (
           "Your emotional wellbeing is improving steadily."
        )

    elif growth_percentage > 0:

        growth_insight = (
           "You are showing positive emotional progress."
        )

    elif growth_percentage < 0:

        growth_insight = (
           "Recent emotions indicate some decline. Practice self-care."
        )

    else:

        growth_insight = (
           "Not enough emotional history yet."
        )

    burnout_score = 0

    burnout_reasons = []

    if average_mood_score < 3:

        burnout_reasons.append(
            "Recent moods have been lower than usual."
        )

    if completion_rate < 60:

        burnout_reasons.append(
            "Many reminders are being missed."
        )

    if journal_stress > 60:

        burnout_reasons.append(
            "Journal sentiment indicates emotional strain."
        )

    if stress_index >= 80:

        burnout_score += 40

        burnout_reasons.append(
            "High amount of stress-related emotions detected."
        )

    elif stress_index >= 60:

        burnout_score += 25

        burnout_reasons.append(
            "Stress emotions appeared frequently."
        )

    if positive_ratio <= 40:

        burnout_score += 25

        burnout_reasons.append(
            "Low positivity in journal entries."
        )

    if growth_percentage < 0:

        burnout_score += 20

        burnout_reasons.append(
            "Emotional growth has declined recently."
        )

    if emotional_stability == "Needs Support":

        burnout_score += 15

        burnout_reasons.append(
            "Emotional stability requires attention."
        )

    burnout_score = min(
        burnout_score,
        100
    )

    if burnout_score < 30:

        burnout_risk = "Low"

    elif burnout_score < 60:

        burnout_risk = "Moderate"

    elif burnout_score < 85:

        burnout_risk = "High"

    else:

        burnout_risk = "Burnout Risk"

    mood_component = (
        average_mood_score / 5
    ) * 100

    journal_dates = set()

    for journal in journal_docs:

        journal_dates.add(

            journal["createdAt"].strftime(
                "%Y-%m-%d"
            )

        )

    active_journal_days = len(
        journal_dates
    )

    journal_consistency = min(

        active_journal_days * 4,

        100

    )

    if streak >= 30:

        streak_score = 100

    elif streak >= 21:

        streak_score = 85

    elif streak >= 14:

        streak_score = 70

    elif streak >= 7:

        streak_score = 50

    elif streak >= 3:

        streak_score = 25

    else:

        streak_score = 10
        
    cognitive_wellness_score = round(

        (

            (100 - stress_index) * 0.25

            +

            (100 - burnout_score) * 0.20

            +

            mood_component * 0.20

            +

            completion_rate * 0.15

            +

            journal_consistency * 0.10

            +

            streak_score * 0.10

        ),

        0

    )

    if cognitive_wellness_score >= 90:

        cognitive_label = "Excellent"

    elif cognitive_wellness_score >= 75:

        cognitive_label = "Very Good"

    elif cognitive_wellness_score >= 60:

        cognitive_label = "Good"

    elif cognitive_wellness_score >= 40:

        cognitive_label = "Needs Attention"

    else:

        cognitive_label = "Low"

    return {

        "currentStreak": streak,

        "mostFrequentMood": most_frequent_mood,

        "bestTimeOfDay": best_time_of_day,

        "mostProductiveDay": most_productive_day,

        "moodDistribution": mood_distribution,

        "totalEntries": total_entries,

        "wordsWritten": words_written,

        "journalActiveDay": journal_active_day,

        "favoriteWritingTime": favorite_writing_time,

        "weeklyActivity": weekly_activity,

        "averageMoodScore": average_mood_score,

        "totalMoodEntries": total_mood_entries,

        "completedReminders": completed_reminders,

        "completionRate": completion_rate,

        "emotionDistribution": emotion_distribution,
        
        "dominantEmotion": dominant_emotion,
        
        "positiveRatio": positive_ratio,
        
        "stressIndex": stress_index,
        
        "emotionalStability": emotional_stability,
        
        "weeklyAISummary": weekly_ai_summary,
        
        "patternDetector": pattern_detector,

        "emotionalGrowth": emotional_growth,

        "growthPercentage": growth_percentage,

        "currentEmotionalScore": current_emotional_score,

        "growthInsight": growth_insight,

        "burnoutScore": burnout_score,

        "burnoutRisk": burnout_risk,

        "burnoutReasons": burnout_reasons,

        "cognitiveWellnessScore": cognitive_wellness_score,

        "cognitiveLabel": cognitive_label

    }

class RoundedCard(Flowable):

    def __init__(
        self,
        title,
        body,
        bg_color="#F8F5FF",
        text_color="#374151",
        width=500,
        height=70
    ):

        Flowable.__init__(self)

        self.title = title
        self.body = body
        self.bg_color = bg_color
        self.text_color = text_color
        self.width = width
        self.height = height

    def draw(self):

        self.canv.setFillColor(
            colors.HexColor(self.bg_color)
        )

        self.canv.setStrokeColor(
            colors.HexColor("#E9D5FF")
        )

        self.canv.roundRect(

            0,
            0,
            self.width,
            self.height,

            radius=15,

            fill=1

        )

        self.canv.setFillColor(
            colors.HexColor("#6D28D9")
        )

        self.canv.setFont(
            "Helvetica-Bold",
            13
        )

        self.canv.drawString(
            20,
            45,
            self.title
        )

        self.canv.setFillColor(
            colors.HexColor(self.text_color)
        )

        self.canv.setFont(
            "Helvetica",
            11
        )

        self.canv.drawString(
            20,
            22,
            self.body
        )

@router.get("/download-wellness-report/{email}")
def download_wellness_report(
    email: str,
    period: int = 30
):

    summary = analytics_summary(
        email=email,
        period=period
    )

    wellness_score = round(

        (

            summary["averageMoodScore"] * 20

            +

            summary["completionRate"]

            +

            min(

                summary["currentStreak"] * 2,

                20

            )

            +

            min(

                summary["totalEntries"] * 2,

                20

            )

        ) / 1.6

    )

    if wellness_score >= 85:

        label = "Excellent"

    elif wellness_score >= 70:

        label = "Very Good"

    elif wellness_score >= 55:

        label = "Good"

    elif wellness_score >= 40:

        label = "Needs Attention"

    else:

        label = "Low"

    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    heading_style = ParagraphStyle(

        "Heading",

        parent=styles["Heading2"],

        textColor=colors.HexColor("#9333EA"),

        fontSize=18,

        spaceAfter=15

    )
    body_style = styles["BodyText"]

    story = []

    story.append(
        Spacer(
            1,
            1.7 * inch
        )
    )

    story.append(

        Paragraph(

            "<font color='#9333EA'><b>MannMitra</b></font>",

            ParagraphStyle(

                "logo",

                parent=styles["Title"],

                fontSize=32,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.3 * inch
        )
    )

    story.append(

        Paragraph(

            "<font color='#4B5563'>Wellness Report</font>",

            ParagraphStyle(

                "subtitle",

                parent=styles["Title"],

                fontSize=24,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.8 * inch
        )
    )

    story.append(

        Paragraph(

            f"<font size='15'><b>Prepared For</b></font>",

            ParagraphStyle(

                "prepared",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.1 * inch
        )
    )

    story.append(

        Paragraph(

            f"<font color='#9333EA' size='22'><b>{email}</b></font>",

            ParagraphStyle(

                "user",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            1 * inch
        )
    )

    story.append(

        Paragraph(

            f"Generated on {datetime.now().strftime('%d %B %Y')}",

            ParagraphStyle(

                "date",

                parent=body_style,

                alignment=1,

                textColor=colors.grey

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.15 * inch
        )
    )

    story.append(

        Paragraph(

            f"Analysis Period : Last {period} Days",

            ParagraphStyle(

                "period",

                parent=body_style,

                alignment=1,

                textColor=colors.grey

            )

        )

    )

    story.append(
        Spacer(
            1,
            2 * inch
        )
    )

    story.append(

        Paragraph(

            "<font color='#9333EA'>Your Mental Wellness Companion</font>",

            ParagraphStyle(

                "footer",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(
        PageBreak()
    )

    story.append(

        Paragraph(

            "Overall Wellness Score",

            ParagraphStyle(

                "heading",

                parent=styles["Heading1"],

                textColor=colors.HexColor("#9333EA"),

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.4*inch
        )
    )

    story.append(

        Paragraph(

            f"<font size='42'><b>{wellness_score}</b></font>",

            ParagraphStyle(

                "score",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(

        Paragraph(

            "<font color='#6B7280'>/100</font>",

            ParagraphStyle(

                "outof",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.15*inch
        )
    )

    story.append(

        Paragraph(

            f"<font color='#9333EA' size='22'><b>{label}</b></font>",

            ParagraphStyle(

                "label",

                parent=body_style,

                alignment=1

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.15 * inch
        )
    )

    story.append(

        Paragraph(

            "Keep showing up for yourself.",

            ParagraphStyle(

                "motivation",

                parent=body_style,

                alignment=1,

                textColor=colors.grey

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.6 * inch
        )
    )

    story.append(
        Spacer(
            1,
            0.7*inch
        )
    )

    card_data = [

    ["Current Streak",
    f"{summary['currentStreak']} Days"],

    ["Average Mood",
    f"{summary['averageMoodScore']}/5"],

    ["Journal Entries",
    summary["totalEntries"]],

    ["Completion Rate",
    f"{summary['completionRate']}%"]

    ]

    cards = Table(
        card_data,
        colWidths=[2.5*inch,2*inch]
    )

    cards.setStyle(

    TableStyle([

    ("BACKGROUND",(0,0),(-1,-1),
    colors.HexColor("#F8F5FF")),

    ("BOX",(0,0),(-1,-1),1,
    colors.HexColor("#E9D5FF")),

    ("GRID",(0,0),(-1,-1),0.5,
    colors.HexColor("#E9D5FF")),

    ("FONTNAME",(0,0),(-1,-1),
    "Helvetica-Bold"),

    ("TEXTCOLOR",(0,0),(-1,-1),
    colors.HexColor("#374151")),

    ("PADDING",(0,0),(-1,-1),14)

    ])

    )

    story.append(cards)

    story.append(
        Spacer(
            1,
            0.8*inch
        )
    )

    story.append(

        Paragraph(

            "Quick Insights",

            ParagraphStyle(

                "quick",

                parent=styles["Heading2"],

                textColor=colors.HexColor("#9333EA")

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.2*inch
        )
    )

    insights = [

    f"• Most frequent mood: {summary['mostFrequentMood']}",

    f"• Best time of day: {summary['bestTimeOfDay']}",

    f"• Most productive day: {summary['mostProductiveDay']}",

    f"• Favorite writing time: {summary['favoriteWritingTime']}"

    ]

    for item in insights:

        story.append(
            Paragraph(
                item,
                body_style
            )
        )

        story.append(
            Spacer(
                1,
                0.1 * inch
            )
        )

    story.append(PageBreak())

    story.append(

        Paragraph(

            "Mood Distribution",

            heading_style

        )

    )

    labels = []

    sizes = []

    for mood in summary["moodDistribution"]:

        labels.append(

            mood["name"]

        )

        sizes.append(

            mood["value"]

        )

    plt.figure(
        figsize=(5,5)
    )

    plt.pie(

        sizes,

        labels=labels,

        autopct="%1.1f%%"

    )

    plt.tight_layout()

    plt.savefig(
        "mood_distribution.png"
    )

    plt.close()

    story.append(

        Image(

            "mood_distribution.png",

            width=4*inch,

            height=4*inch

        )

    )

    story.append(
        Spacer(
            1,
            0.5*inch
        )
    )

    story.append(

        Paragraph(

            "Weekly Activity",

            heading_style

        )

    )

    days = []

    reminder_data = []

    journal_data = []

    mood_data = []

    for item in summary["weeklyActivity"]:

        days.append(
            item["day"]
        )

        reminder_data.append(
            item["reminders"]
        )

        journal_data.append(
            item["journals"]
        )

        mood_data.append(
            item["moods"]
        )

    x = range(
        len(days)
    )

    plt.figure(
        figsize=(8,4)
    )

    plt.bar(

        x,

        reminder_data,

        label="Reminders"

    )

    plt.bar(

        x,

        journal_data,

        bottom=reminder_data,

        label="Journals"

    )

    bottom2 = [

        reminder_data[i]
        +
        journal_data[i]

        for i in range(

            len(days)

        )

    ]

    plt.bar(

        x,

        mood_data,

        bottom=bottom2,

        label="Moods"

    )

    plt.xticks(
        x,
        days
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        "weekly_activity.png"
    )

    plt.close()

    story.append(

        Image(

            "weekly_activity.png",

            width=6*inch,

            height=3*inch

        )

    )

    story.append(
        PageBreak()
    )

    story.append(

        Paragraph(

            "Achievements",

            heading_style

        )

    )

    story.append(
        Spacer(
            1,
            0.15*inch
        )
    )

    achievements = []

    if summary["completionRate"] >= 80:

        achievements.append(
            "Consistency Champion"
        )

    if summary["currentStreak"] >= 7:

        achievements.append(
            "Streak Master"
        )

    if summary["totalEntries"] >= 10:

        achievements.append(
            "Journal Guru"
        )

    if summary["wordsWritten"] >= 1000:

        achievements.append(
            "Writer Soul"
        )

    if summary["averageMoodScore"] >= 4:

        achievements.append(
            "Positive Spirit"
        )

    if not achievements:

        achievements.append(
            "No achievements unlocked yet"
        )

    for badge in achievements:

        story.append(

            RoundedCard(

                "Unlocked Badge",

                badge,

                "#F3E8FF"

            )

        )

        story.append(
            Spacer(
                1,
                0.12*inch
            )
        )

        story.append(
        Spacer(
            1,
            0.3*inch
        )
    )

    story.append(

        Paragraph(

            "Recommendations",

            heading_style

        )

    )

    recommendations = []

    if summary["completionRate"] < 70:

        recommendations.append(
            "Complete reminders more consistently."
        )

    if summary["currentStreak"] < 7:

        recommendations.append(
            "Build a stronger daily habit."
        )

    if summary["averageMoodScore"] < 3:

        recommendations.append(
            "Practice mindfulness and self-care."
        )

    if summary["wordsWritten"] < 500:

        recommendations.append(
            "Write more journal entries."
        )

    if not recommendations:

        recommendations.append(

            "Excellent work! Keep maintaining your healthy habits."

        )

    for rec in recommendations:

        story.append(

            RoundedCard(

                "Recommendation",

                rec,

                "#FFF7ED",

                "#9A3412"

            )

        )

        story.append(
            Spacer(
                1,
                0.12*inch
            )
        )

    story.append(
        PageBreak()
    )

    story.append(
        Spacer(
            1,
            1.5*inch
        )
    )

    story.append(

        Paragraph(

            "<font color='white'><b>Thank You!</b></font>",

            ParagraphStyle(

                "thanks",

                parent=styles["Title"],

                alignment=1,

                fontSize=28

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.5*inch
        )
    )

    story.append(

        Paragraph(

            "Your journey toward better mental wellness is made up of small steps taken consistently.",

            ParagraphStyle(

                "message",

                parent=body_style,

                alignment=1,

                leading=24,

                textColor=colors.white

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.4*inch
        )
    )

    story.append(

        Paragraph(

            "Celebrate every mood logged, every journal entry written, and every reminder completed.",

            ParagraphStyle(

                "message2",

                parent=body_style,

                alignment=1,

                leading=24,

                textColor=colors.white

            )

        )

    )

    story.append(
        Spacer(
            1,
            1*inch
        )
    )

    story.append(

        Paragraph(

            f"<font color='#9333EA' size='22'><b>{label}</b></font>",

            ParagraphStyle(

                "status",

                parent=body_style,

                alignment=1,

                textColor=colors.white

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.3*inch
        )
    )

    story.append(

        Paragraph(

            f"Overall Wellness Score : {wellness_score}/100",

            ParagraphStyle(

                "score_final",

                parent=body_style,

                alignment=1,

                textColor=colors.white

            )

        )

    )

    story.append(
        Spacer(
            1,
            1.5*inch
        )
    )

    story.append(

        Paragraph(

            "<font color='white'><b>MannMitra</b></font>",

            ParagraphStyle(

                "brand",

                parent=styles["Title"],

                alignment=1,

                fontSize=24

            )

        )

    )

    story.append(
        Spacer(
            1,
            0.15*inch
        )
    )

    story.append(

        Paragraph(

            "Your Mental Wellness Companion",

            ParagraphStyle(

                "tagline",

                parent=body_style,

                alignment=1,

                textColor=colors.grey

            )

        )

    )

    file_name = "wellness_report.pdf"

    doc = SimpleDocTemplate(
        file_name
    )

    logo_path = "images/mannmitra-logo.png"

    def page_background(canvas, doc):

        canvas.saveState()

        page = doc.page

        width, height = doc.pagesize

        logo = ImageReader(logo_path)

        if page == 1:

            canvas.setFillColor(
                colors.HexColor("#F8F5FF")
            )

            canvas.rect(
                -5,
                -5,
                width + 10,
                height + 10,
                fill=1,
                stroke=0
            )

            canvas.drawImage(

                logo,

                width/2 - 50,

                height - 150,

                width=100,

                height=100,

                preserveAspectRatio=True,

                mask='auto'

            )

        elif page == 2:

            canvas.setFillColor(
                colors.HexColor("#FAF5FF")
            )

            canvas.rect(
                -5,
                -5,
                width + 10,
                height + 10,
                fill=1,
                stroke=0
            )

            canvas.drawImage(

                logo,

                40,

                height - 65,

                width=35,

                height=35,

                preserveAspectRatio=True,

                mask='auto'

            )

        elif page == 3:

            canvas.setFillColor(
                colors.HexColor("#FCFAFF")
            )

            canvas.rect(
                -5,
                -5,
                width + 10,
                height + 10,
                fill=1,
                stroke=0
            )

            canvas.drawImage(

                logo,

                40,

                height - 65,

                width=35,

                height=35,

                preserveAspectRatio=True,

                mask='auto'

            )

        elif page == 4:

            canvas.setFillColor(
                colors.HexColor("#F5F3FF")
            )

            canvas.rect(
                -5,
                -5,
                width + 10,
                height + 10,
                fill=1,
                stroke=0
            )

            canvas.drawImage(

                logo,

                40,

                height - 65,

                width=35,

                height=35,

                preserveAspectRatio=True,

                mask='auto'

            )

        else:

            canvas.setFillColor(
                colors.HexColor("#581C87")
            )

            canvas.rect(
                -5,
                -5,
                width + 10,
                height + 10,
                fill=1,
                stroke=0
            )

            canvas.setFillColor(
                colors.HexColor("#7E22CE")
            )

            canvas.circle(
                width + 50,
                height + 50,
                150,
                fill=1,
                stroke=0
            )

            canvas.circle(
                -50,
                -50,
                120,
                fill=1,
                stroke=0
            )

            canvas.drawImage(

                logo,

                width/2 - 55,

                height - 160,

                width=110,

                height=110,

                preserveAspectRatio=True,

                mask='auto'

            )

        canvas.setStrokeColor(
            colors.HexColor("#E9D5FF")
        )

        canvas.line(
            40,
            35,
            555,
            35
        )

        canvas.setFont(
            "Helvetica",
            9
        )

        if page == 5:

            canvas.setFillColor(
                colors.white
            )

        else:

            canvas.setFillColor(
                colors.grey
            )

        canvas.drawString(
            40,
            20,
            "Generated by MannMitra • Your Mental Wellness Companion"
        )

        canvas.drawRightString(
            550,
            20,
            f"Page {page}"
        )

        canvas.restoreState()

    doc.build(
        story,
        onFirstPage=lambda canvas, doc: (
            page_background(canvas, doc)
        ),
        onLaterPages=lambda canvas, doc: (
            page_background(canvas, doc)
        )
    )

    return FileResponse(
        file_name,
        media_type="application/pdf",
        filename="Wellness_Report.pdf"
    )