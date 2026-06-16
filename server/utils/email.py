from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig
)
from datetime import datetime
from dotenv import load_dotenv

import os

load_dotenv()

conf = ConnectionConfig(

    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),

    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),

    MAIL_FROM=os.getenv("MAIL_FROM"),

    MAIL_PORT=587,

    MAIL_SERVER="smtp.gmail.com",

    MAIL_STARTTLS=True,

    MAIL_SSL_TLS=False,

    USE_CREDENTIALS=True
)

async def send_otp_email(
    email: str,
    otp: str
):

    message = MessageSchema(

        subject="MannMitra Email Verification",

        recipients=[email],

        body=f"""

        <h2>Your Verification OTP</h2>

        <h1>{otp}</h1>

        <p>This OTP expires in 5 minutes.</p>

        """,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_reset_email(
    email: str,
    reset_link: str
):

    message = MessageSchema(

        subject="Reset Your MannMitra Password",

        recipients=[email],

        body=f"""

        <div
            style="
                font-family: Arial;
                padding: 30px;
            "
        >

            <h2
                style="
                    color: #7e22ce;
                "
            >
                Reset Your Password 🔐
            </h2>

            <p>
                We received a request to reset your
                MannMitra password.
            </p>

            <a
                href="{reset_link}"

                style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 14px 28px;
                    background: linear-gradient(
                        to right,
                        #9333ea,
                        #ec4899
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: bold;
                "
            >
                Reset Password
            </a>

            <p
                style="
                    margin-top: 25px;
                    color: gray;
                "
            >
                This link expires in 15 minutes.
            </p>

        </div>

        """,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_welcome_email(email: str):

    message = MessageSchema(

        subject="Welcome to MannMitra 💜",

        recipients=[email],

        body="""

        <div
            style="
                font-family: Arial;
                padding: 30px;
                background: #faf5ff;
                border-radius: 20px;
            "
        >

            <h1
                style="
                    color: #7e22ce;
                    margin-bottom: 10px;
                "
            >
                Welcome to MannMitra 💜
            </h1>

            <p
                style="
                    font-size: 16px;
                    color: #4b5563;
                    line-height: 1.8;
                "
            >
                Thank you for joining the MannMitra community.
            </p>

            <p
                style="
                    font-size: 16px;
                    color: #4b5563;
                    line-height: 1.8;
                "
            >
                We're building a calm digital space focused on:
            </p>

            <ul
                style="
                    color: #6b21a8;
                    line-height: 2;
                "
            >
                <li>✨ Emotional wellness</li>
                <li>✨ Mindful journaling</li>
                <li>✨ Gentle AI support</li>
                <li>✨ Healthier daily habits</li>
            </ul>

            <div
                style="
                    margin-top: 30px;
                    padding: 18px;
                    background: white;
                    border-radius: 14px;
                    border: 1px solid #e9d5ff;
                "
            >

                <p
                    style="
                        margin: 0;
                        color: #7e22ce;
                        font-weight: bold;
                    "
                >
                    🌸 Small mindful steps create lasting emotional strength.
                </p>

            </div>

            <p
                style="
                    margin-top: 30px;
                    color: #6b7280;
                "
            >
                We're happy to have you here ✨
            </p>

            <p
                style="
                    color: #6b7280;
                    margin-top: 20px;
                "
            >
                — Team MannMitra
            </p>

        </div>

        """,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_contact_notification(
    name: str,
    email: str,
    message_text: str
):

    message = MessageSchema(

        subject=f"📩 {name} sent a new message",

        recipients=["mannmitra.support@gmail.com"],

        reply_to=[email],

        body=f"""

        <div
            style="
                font-family: Arial, sans-serif;
                padding: 30px;
                background: #faf5ff;
                border-radius: 18px;
                color: #2e1065;
            "
        >

            <h2
                style="
                    color: #7e22ce;
                    margin-bottom: 25px;
                "
            >
                New Contact Form Submission 💌
            </h2>

            <p
                style="
                    margin-bottom: 10px;
                "
            >
                <strong>Name:</strong> {name}
            </p>

            <p
                style="
                    margin-bottom: 10px;
                "
            >
                <strong>Email:</strong>

                <a
                    href="mailto:{email}"
                    style="
                        color: #7e22ce;
                        text-decoration: none;
                    "
                >
                    {email}
                </a>
            </p>

            <p
                style="
                    margin-bottom: 20px;
                "
            >
                <strong>Received:</strong>
                {datetime.now().strftime("%d %b %Y, %I:%M %p")}
            </p>

            <a
                href="mailto:{email}"

                style="
                    display: inline-block;
                    margin-bottom: 25px;
                    padding: 12px 22px;
                    background: linear-gradient(
                        to right,
                        #9333ea,
                        #ec4899
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: bold;
                "
            >
                Reply to User
            </a>

            <hr
                style="
                    border: none;
                    border-top: 1px solid #e9d5ff;
                    margin: 25px 0;
                "
            />

            <p
                style="
                    margin-bottom: 12px;
                    font-weight: bold;
                "
            >
                Message:
            </p>

            <div
                style="
                    background: white;
                    padding: 20px;
                    border-radius: 14px;
                    border: 1px solid #e9d5ff;
                    box-shadow: 0 4px 18px rgba(
                        139,
                        92,
                        246,
                        0.08
                    );
                    line-height: 1.7;
                    color: #374151;
                "
            >
                {message_text}
            </div>

        </div>

        """,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_contact_thankyou_email(
    email: str,
    name: str
):

    message = MessageSchema(

        subject="💜 We Received Your Message - MannMitra",

        recipients=[email],

        body=f"""

        <div
            style="
                font-family: Arial, sans-serif;
                padding: 35px;
                background: linear-gradient(
                    135deg,
                    #faf5ff,
                    #fdf4ff
                );
                border-radius: 20px;
                color: #374151;
                line-height: 1.8;
                max-width: 650px;
                margin: auto;
                box-shadow: 0 10px 40px rgba(147, 51, 234, 0.08);
            "
        >

            <div
            style="
                display: flex;
                align-items: center;
                gap: 14px;
                margin-bottom: 28px;
            "
        >

            <img
                src="https://i.ibb.co/zTk5ZMG1/mannmitra-logo.png"
                alt="MannMitra Logo"
                width="55"
                style="
                    border-radius: 14px;
                    object-fit: cover;
                    display: block;
                "
            />

            <h1
                style="
                    color: #7e22ce;
                    margin: 0;
                    font-size: 34px;
                    font-weight: bold;
                "
            >
                MannMitra
            </h1>

        </div>

            <h2
                style="
                    color: #7e22ce;
                    font-size: 28px;
                    margin-bottom: 18px;
                    font-weight: bold;
                "
            >
                Hi {name} 👋
            </h2>

            <p
                style="
                    font-size: 16px;
                "
            >
                Thank you for reaching out to MannMitra.
            </p>

            <p
                style="
                    font-size: 16px;
                    line-height: 1.9;
                    color: #4b5563;
                "
            >
                Your message has been safely received 💌
                <br/><br/>
                We truly appreciate you reaching out to MannMitra.
                Our team will carefully review your message and connect with you soon.
            </p>

            <div
                style="
                    margin-top: 28px;
                    background: white;
                    padding: 18px;
                    border-radius: 14px;
                    border: 1px solid #e9d5ff;
                "
            >

                <p
                    style="
                        margin: 0;
                        color: #7e22ce;
                        font-weight: bold;
                    "
                >
                    🌸 Your mental wellness matters.
                </p>

            </div>

            <p
                style="
                    margin-top: 28px;
                    color: #7e22ce;
                    font-style: italic;
                    line-height: 1.8;
                    text-align: center;
                "
            >
                “Every conversation begins with care.”
            </p>

            <p
                style="
                    margin-top: 35px;
                    color: #6b7280;
                "
            >
                Warm regards,
                <br/>
                Team MannMitra 💜
            </p>

            <hr
                style="
                    margin-top: 35px;
                    border: none;
                    border-top: 1px solid #e9d5ff;
                "
            />

            <p
                style="
                    margin-top: 18px;
                    font-size: 13px;
                    color: #9ca3af;
                    text-align: center;
                "
            >
                MannMitra • Your Mind, Our Care 💜
            </p>

        </div>

        """,

        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_intruder_alert_email(
    email: str,
    device: str,
    browser: str,
    os: str,
    image: str,
    ip_address: str,
    location: str,
    timestamp:str
):

    message = MessageSchema(

        subject="⚠️ MannMitra Security Alert",

        recipients=[email],

        body=f"""

        <div
        style="
        font-family:Arial;
        padding:30px;
        background:#faf5ff;
        border-radius:20px;
        "
        >

        <h2 style="color:#dc2626;">
        ⚠️ Suspicious Activity Detected
        </h2>

        <p>
        Someone entered an incorrect Master PIN multiple times.
        </p>

        <hr>

        <h3>📍 Intruder Information</h3>

        <table
        style="
        border-collapse:collapse;
        width:100%;
        "
        >

        <tr>
        <td><b>🕒 Time</b></td>
        <td>{timestamp}</td>
        </tr>

        <tr>
        <td><b>🌍 Location</b></td>
        <td>{location}</td>
        </tr>

        <tr>
        <td><b>🌐 IP Address</b></td>
        <td>{ip_address}</td>
        </tr>

        <tr>
        <td><b>💻 Device</b></td>
        <td>{device}</td>
        </tr>

        <tr>
        <td><b>🌐 Browser</b></td>
        <td>{browser}</td>
        </tr>

        <tr>
        <td><b>⚙ Operating System</b></td>
        <td>{os}</td>
        </tr>

        </table>

        <br>

        <img
        src="{image}"
        width="250"
        style="
        border-radius:15px;
        border:3px solid red;
        "
        />

        <br><br>

        <p>
        If this wasn't you, please change your Master PIN immediately.
        </p>

        <p>
        Stay safe 💜<br>
        Team MannMitra
        </p>

        </div>

        """,

        subtype="html"

    )

    fm = FastMail(conf)

    await fm.send_message(message)

async def send_master_pin_reset_email(
    email: str,
    reset_link: str
):

    message = MessageSchema(

        subject="Reset Your MannMitra Master PIN 🔐",

        recipients=[email],

        body=f"""

        <div
            style="
                font-family: Arial;
                padding:30px;
            "
        >

            <h2 style="color:#7e22ce;">
                Reset Master PIN 🔒
            </h2>

            <p>
                We received a request to reset your
                MannMitra Master PIN.
            </p>

            <br>

            <a
                href="{reset_link}"

                style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 14px 28px;
                    background: linear-gradient(
                        to right,
                        #9333ea,
                        #ec4899
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: bold;
                "
            >
                Reset Master PIN
            </a>

            <br><br>

            <p style="color:gray;">
                This link expires in 15 minutes.
            </p>

            <p>
                Team MannMitra 💜
            </p>

        </div>

        """,

        subtype="html"

    )

    fm = FastMail(conf)

    await fm.send_message(message)