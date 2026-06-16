import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import API from "../services/api";
import { getThemeByTime } from "../utils/theme";
import {
  FaArrowRight,
  FaPlay,
  FaHeart,
  FaSmile,
  FaHeartbeat,
  FaBrain,
  FaBookOpen,
  FaBell,
  FaChartLine,
  FaBars,
  FaTimes,
  FaWhatsapp
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const CinematicSection = ({
  children,
  className = "",
  delay = 0,
  id,
}) => {
  return (
    <motion.section
      id={id}

      initial={{
        opacity: 0,
        y: 100,
        filter: "blur(14px)",
      }}

      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}

      viewport={{
        once: true,
        amount: 0.18,
      }}

      transition={{
        duration: 1.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}

      className={className}

      style={{
        willChange:
          "transform, opacity, filter",
      }}
    >
      {children}
    </motion.section>
  );
};

function LandingPage() {

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [showUpdates, setShowUpdates] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [websiteUnlocked, setWebsiteUnlocked] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const {
    isNight,
    backgroundStyle,
    cardStyle,
    primaryText,
    secondaryText,
    brandSubtext
  } = getThemeByTime();
  const thoughts = [
    {
      emoji: "🌸",
      text: "Small mindful steps create lasting emotional strength."
    },

    {
      emoji: "💜",
      text: "Your emotions deserve a safe space."
    },

    {
      emoji: "✨",
      text: "Healing begins with understanding yourself."
    },

    {
      emoji: "🧠",
      text: "Consistency matters more than perfection."
    },

    {
      emoji: "🌙",
      text: "Pause. Breathe. Reflect. Grow."
    }
  ]

  const contactCards = [
    {
      title: "SEND A MESSAGE",
      type: "contact",
    }
  ];

  const [currentStat, setCurrentStat] = useState(0);
  const [contactSuccess, setContactSuccess] = useState(false);

  const testimonials = [
    {
      name: "Ananya",
      role: "College Student",
      text: "I started using MannMitra during stressful exam weeks, and it genuinely helped me slow down.",
    },
    {
      name: "Rahul",
      role: "Software Engineer",
      text: "The AI reflections felt surprisingly personal and helped me process difficult days better.",
    },
    {
      name: "Meera",
      role: "UI Designer",
      text: "The soft design, reminders, and journaling flow make the app feel emotionally safe.",
    },
    {
      name: "Kabir",
      role: "Frontend Developer",
      text: "The gentle reminders helped me build healthier habits without feeling pressured or overwhelmed.",
    },
    {
      name: "Riya",
      role: "Content Creator",
      text: "It genuinely feels like a calm little escape from the constant noise of social media.",
    },
  ];

  const handleSubscribe = async () => {

    if (!email) return;

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(data.message)
        setEmail("");

      } else {

        alert(data.message);
      }

    } catch (error) {

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  const handleHeroExplore = () => {

    setHeroExpanded(true);

      setWebsiteUnlocked(true);

      setTimeout(() => {

        setShowScrollHint(true);

      }, 1600);

      setTimeout(() => {

        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

      }, 1800);

  };

  const handleContactSubmit = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/contact-message",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(contactForm),
        }
      );

      const data = await response.json();

      alert(data.message);

      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
      }, 3000);

      setContactForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % thoughts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    if (websiteUnlocked) return;

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };

  }, [websiteUnlocked]);

  useEffect(() => {

    const fetchAnnouncements = async () => {

      try {

        const response = await API.get(
          "/feature-announcements"
        );

        setAnnouncements(response.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchAnnouncements();

  }, []);

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {

      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

    };

  }, []);

  useEffect(() => {

    if (announcements.length === 0) return;

    const interval = setInterval(() => {

      setCurrentAnnouncement((prev) =>
        (prev + 1) % announcements.length
      );

    }, 4000);

    return () => clearInterval(interval);

  }, [announcements]);

  return (

    <div
      className={`
        relative
        isolate
        z-0
        w-full
        max-w-full
        overflow-x-hidden
        overflow-y-hidden

        ${
          isNight
            ? "bg-[#160828]"
            : "bg-[#f6ecff]"
        }
      `}
    >

      <div
        className="
          absolute
          top-[-200px]
          left-[-100px]
          w-[240px]
          h-[240px]

          sm:w-[350px]
          sm:h-[350px]

          lg:w-[500px]
          lg:h-[500px]
          bg-fuchsia-600/20
          rounded-full
          blur-[160px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-[30%]
          right-[-200px]
          w-[240px]
          h-[240px]

          sm:w-[350px]
          sm:h-[350px]

          lg:w-[500px]
          lg:h-[500px]
          bg-purple-600/20
          rounded-full
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        style={{ contain: "layout" }}
        className="
          absolute
          bottom-[-3px]
          left-[20%]
          w-[400px]
          h-[400px]
          bg-pink-500/10
          rounded-full
          blur-[100px]
          pointer-events-none
        "
      />

      {
        isNight && (

          <div
            className="
              fixed
              inset-0
              overflow-hidden
              pointer-events-none
              z-[1]
            "
          >

            {[...Array(window.innerWidth < 768 ? 18 : heroExpanded ? 55 : 35)].map((_, i) => (

              <motion.div
                key={i}

                initial={{
                  y: 0,
                  opacity: 0
                }}

                animate={{
                  y: -700,
                  x: [0, 30, -20, 0],
                  opacity: [0, 0.4, 0.2, 0]
                }}

                transition={{
                  duration: 28 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 15,
                  ease: "linear"
                }}

                className={`
                  particle
                  absolute
                  rounded-full
                  blur-[1px]

                  ${
                    isNight
                      ? "bg-white/30"
                      : "bg-white/40"
                  }
                `}

                style={{

                  width: `${2 + Math.random() * 5}px`,
                  height: `${2 + Math.random() * 5}px`,

                  left: `${Math.random() * 100}%`,
                  bottom: `-${Math.random() * 200}px`,

                  opacity: 0.28,

                  filter: "blur(0.5px)",
                  boxShadow: "0 0 16px rgba(216,180,254,0.35)"
                }}
              />

            ))}

          </div>

        )
      }

      <motion.nav

        initial={{
          opacity: 0,
          y: -80
        }}

        animate={{
          opacity: websiteUnlocked ? 1 : 0,
          y: websiteUnlocked ? 0 : -80
        }}

        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1]
        }}

        className={`
          fixed
          top-2
          left-1/2
          -translate-x-1/2
          w-[98%]
          z-50

          ${isNight ? "bg-white/5" : "bg-white/35"}

          backdrop-blur-2xl
          backdrop-saturate-150

          border
          ${isNight ? "border-white/10" : "border-white/30"}

          rounded-full

          shadow-[0_4px_25px_rgba(168,85,247,0.08)]

          px-3
          sm:px-5
          lg:px-10
          py-2
        `}
      >

        <div
          className="
            absolute
            inset-0
            rounded-[34px]
            bg-white/[0.02]
            pointer-events-none
          "
        />

        <div
          className="
            relative
            flex
            items-center
            justify-between
            gap-4
            items-center
            w-full
          "
        >

          <div className="flex items-center gap-2 lg:gap-4 min-w-0">

            <img
              src="/mannmitra-logo.png"
              alt="MannMitra"
              className="
                w-12
                h-12

                sm:w-14
                sm:h-14

                lg:w-16
                lg:h-16
                object-cover
                rounded-2xl
                shadow-lg
              "
            />

            <div>

              <h1
                className={`
                  text-[20px]
                  sm:text-[26px]
                  lg:text-[30px]
                  font-bold
                  leading-none
                  ${primaryText}
                `}
              >
                MannMitra
              </h1>

              <p
                className="
                  ${brandSubtext}
                  mt-1
                  text-[11px]
                  lg:text-[14px]
                "
              >
                Your Mind, Our Care
              </p>

            </div>

          </div>

          <div
            className="
              hidden
              xl:flex
              items-center
              justify-center
              gap-14
            "
          >

            <div className="flex items-center gap-9">

            {["Home", "About", "Features", "Testimonials", "Contact"].map((item) => (

              <a
                key={item}
                href={
                  websiteUnlocked
                    ? `#${item.toLowerCase()}`
                    : undefined
                }
                className={`
                  relative
                  text-[17px]
                  font-medium
                  ${isNight ? "text-purple-100" : "text-gray-700"}

                  hover:text-purple-600

                  transition-all
                  duration-300

                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:w-0
                  after:h-[2px]
                  after:bg-gradient-to-r
                  after:from-purple-600
                  after:to-pink-500
                  after:rounded-full
                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                `}
              >
                {item}
              </a>

            ))}

          </div>

            {
              announcements.length > 0 && (

                <div
                  className="
                    relative
                    min-w-[160px]
                    flex
                    justify-center
                    mr-6
                  "
                >

                  <button
                    onClick={() =>
                      setShowUpdates(!showUpdates)
                    }
                    className="
                      hidden
                      w-full
                      lg:flex
                      items-center
                      gap-3

                      px-2
                      py-3

                      rounded-full

                      bg-white/70
                      backdrop-blur-xl

                      border
                      border-white/40

                      shadow-lg

                      text-purple-700
                      font-medium

                      transition-all
                      duration-300

                      hover:scale-105
                      cursor-pointer

                      min-w-[200px]
                      justify-center
                    "
                  >

                    <div className="relative">

                      <span
                        className="
                          absolute
                          w-3
                          h-3
                          rounded-full
                          bg-pink-400
                          animate-ping
                        "
                      />

                      <span
                        className="
                          relative
                          w-3
                          h-3
                          rounded-full
                          bg-pink-500
                        "
                      />

                    </div>

                    New Features Added

                  </button>

                  {
                    showUpdates && (

                      <div
                        className="
                          absolute
                          top-16
                          right-0

                          w-[300px]

                          bg-[#2d1b4e]/95
                          backdrop-blur-xl

                          border
                          border-white/10

                          rounded-2xl

                          shadow-2xl

                          p-4

                          z-50
                        "
                      >

                        <h3
                          className="
                            text-white
                            font-semibold
                            mb-4
                          "
                        >
                          Latest Updates
                        </h3>

                        <div className="space-y-3">

                          {
                            announcements.map(
                              (item, index) => (

                                <div
                                  key={index}
                                  className="
                                    text-purple-100
                                    text-sm

                                    bg-white/5

                                    p-3
                                    rounded-xl

                                    border
                                    border-white/5
                                  "
                                >

                                   {item.title}

                                </div>

                              )
                            )
                          }

                        </div>

                      </div>

                    )
                  }

                </div>

              )
            }

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                lg:hidden

                w-12
                h-12

                rounded-2xl

                bg-white/70
                backdrop-blur-xl

                border
                border-white/40

                shadow-lg

                flex
                items-center
                justify-center

                text-gray-700
                text-lg

                cursor-pointer
              "
            >

              {mobileMenu ? <FaTimes /> : <FaBars />}

            </button>

            <button
              onClick={() => navigate("/login")}
              className="
                hidden
                lg:block

                px-6
                py-3

                rounded-2xl

                bg-white/70
                backdrop-blur-xl

                border
                border-white/40

                shadow-lg

                text-gray-800
                font-semibold
                text-[15px]

                hover:scale-105
                hover:bg-white

                transition-all
                duration-300

                cursor-pointer
              "
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="
                hidden
                lg:block

                px-7
                py-3

                rounded-2xl

                bg-gradient-to-r
                from-purple-700
                via-fuchsia-500
                to-pink-500

                text-white
                font-semibold
                text-[15px]

                shadow-[0_10px_40px_rgba(217,70,239,0.35)]

                hover:scale-105
                hover:shadow-[0_0_35px_rgba(217,70,239,0.55)]

                transition-all
                duration-300

                cursor-pointer
              "
            >
              Get Started
            </button>

          </div>

        </div>

      </motion.nav>

      {
        mobileMenu && (

          <>

            <div
              onClick={() => setMobileMenu(false)}

              className="
                fixed
                inset-0
                z-30
                bg-black/20
                backdrop-blur-sm
                lg:hidden
              "
            />

            <div
              className="
                fixed
                top-28
                left-4
                right-4
                z-40

                lg:hidden

                bg-white/80
                backdrop-blur-3xl

                rounded-3xl

                border
                border-white/40

                shadow-2xl

                p-6
              "
            >

              <div className="flex flex-col gap-5">

                {[
                  "Home",
                  "About",
                  "Features",
                  "Testimonials",
                  "Contact"
                ].map((item) => (

                  <a
                    key={item}
                    href={
                      websiteUnlocked
                        ? `#${item.toLowerCase()}`
                        : undefined
                    }

                    onClick={() => {
                      setMobileMenu(false);
                    }}

                    className="
                      text-lg
                      font-semibold
                      text-gray-700

                      hover:text-purple-600

                      transition-all
                    "
                  >
                    {item}
                  </a>

                ))}

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/login");
                  }}

                  className="
                    mt-3
                    py-3
                    rounded-2xl

                    bg-white

                    shadow-lg

                    font-semibold
                    cursor-pointer
                  "
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/register");
                  }}

                  className="
                    py-3
                    rounded-2xl

                    bg-gradient-to-r
                    from-purple-700
                    to-pink-500

                    text-white
                    font-semibold
                    cursor-pointer
                  "
                >
                  Get Started
                </button>

              </div>

            </div>
          </>
        )
      }

      <section
        id="home"

        style={{
          transform: heroExpanded
            ? "scale(1.02)"
            : "scale(1)",
          transition: "transform 2.5s ease"
        }}
        
        className="
          relative
          overflow-hidden
          min-h-screen
          flex
          items-center
          justify-center
          px-5
          sm:px-8
          lg:px-20

          pt-28
          sm:pt-24

          pb-16
        "
      >

        {
          !websiteUnlocked && (

            <motion.div

              initial={{
                opacity: 0,
                y: -20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 1.2
              }}

              className="
                absolute
                top-8
                left-1/2
                -translate-x-1/2
                z-40

                flex
                items-center
                gap-3
              "
            >

              <img
                src="/mannmitra-logo.png"
                alt="MannMitra"

                className="
                  w-12
                  h-12
                  rounded-2xl
                  shadow-xl
                "
              />

              <span
                className="
                  text-white
                  text-2xl
                  font-semibold
                  tracking-tight
                "
              >
                MannMitra
              </span>

            </motion.div>

          )
        }

        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`
            absolute
            inset-0
            w-full
            h-full
            object-cover

            transition-opacity
            duration-1000

            ${
              videoLoaded
                ? heroExpanded
                  ? "opacity-90"
                  : "opacity-95"
                : "opacity-0"
            }
          `}
        >

          <source
            src="/hero-fog.mp4"
            type="video/mp4"
          />

        </video>

        <div
          className="
            absolute
            top-[20%]
            left-1/2
            -translate-x-1/2

            w-[320px]
            h-[320px]

            sm:w-[500px]
            sm:h-[500px]

            lg:w-[700px]
            lg:h-[700px]

            bg-fuchsia-300/20

            rounded-full

            blur-[160px]

            animate-pulse

            pointer-events-none
          "
        />

        <div
          className={`
            absolute
            inset-0

            ${
              isNight
                ? "bg-[#12071f]/45"
                : "bg-[#e9dff0]/28"
            }

            backdrop-blur-[2px]

            pointer-events-none
          `}
        />

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]

            pointer-events-none
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.05]
            mix-blend-overlay
            pointer-events-none
          "
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        <div
          className="
            absolute
            top-24
            left-10

            w-[240px]
            h-[240px]

            sm:w-[350px]
            sm:h-[350px]

            lg:w-[500px]
            lg:h-[500px]

            bg-fuchsia-300/20
            animate-pulse
            rounded-full

            blur-[140px]

            pointer-events-none
          "
        />

        <div
          className="
            max-w-[1400px]
            min-h-full
            content-center
            mx-auto
            w-full
            grid
            lg:grid-cols-1
            justify-items-center
            text-center
            relative
            z-30
          "
        >

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}

            style={{
              willChange: "transform",
              transform: "translateZ(0)"
            }}
          >

            <motion.div

              animate={{
                opacity: heroExpanded ? 0 : 1,
                y: heroExpanded ? -20 : 0
              }}

              transition={{ duration: 0.8 }}

              className={`
                mb-8
                inline-flex
                items-center
                gap-3

                px-5
                py-2

                rounded-full

                backdrop-blur-2xl

                border
                border-white/20

                text-sm
                tracking-[0.2em]
                uppercase

                ${isNight ? "text-fuchsia-900" : "text-fuchsia-500"}

                shadow-lg
              `}
            >

              ✦ Emotional Wellness Reimagined

            </motion.div>

            <motion.h1

              animate={{
                opacity: 1,
                scale: heroExpanded ? 1.03 : 1
              }}

              transition={{
                duration: 1.2
              }}

              className={`
                text-[42px]
                leading-[1]

                sm:text-[56px]
                md:text-[72px]
                lg:text-[92px]
                font-semibold
                hero-font
                leading-[0.88]
                tracking-[-0.05em]
                ${isNight ? "text-[#f8f5ff]" : "text-[#020617]"}
              `}
            >

              {
                heroExpanded ? (
                  <>
                    Some emotions
                    <br />

                    <span
                      className={`
                        bg-gradient-to-r
                        hero-font
                        bg-clip-text
                        text-transparent

                        ${
                          isNight
                            ? "from-violet-200 via-fuchsia-200 to-pink-300"
                            : "from-purple-700 via-fuchsia-500 to-pink-500"
                        }
                      `}
                    >
                      need space to breathe.
                    </span>
                  </>
                ) : (
                  <>
                    Your Mind
                    <br />

                    <span
                      className={`
                        bg-gradient-to-r
                        hero-font
                        ${
                          isNight
                            ? "from-violet-200 via-fuchsia-200 to-pink-300"
                            : "from-violet-800 via-fuchsia-600 to-pink-500"
                        }
                        bg-clip-text
                        text-transparent
                        drop-shadow-[0_2px_18px_rgba(255,255,255,0.18)]
                      `}
                    >
                      Needs Softness Too
                    </span>
                  </>
                )
              }

            </motion.h1>

            <motion.p

              animate={{
                opacity: heroExpanded ? 0 : 1,
                y: heroExpanded ? 20 : 0
              }}

              transition={{ duration: 0.7 }}

              className={`
                mt-6
                text-lg
                sm:text-xl
                lg:text-2xl
                leading-[1.9]
                max-w-[760px]
                hero-font
                mx-auto
                ${secondaryText}
              `}
            >

              Reflect. Breathe. Reconnect.

            </motion.p>

            {
              !heroExpanded && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12"
                >

                  <button
                    onClick={handleHeroExplore}
                    className="
                      px-5 sm:px-8
                      py-4

                      rounded-full

                      bg-gradient-to-r
                      from-violet-700
                      to-pink-500
                      backdrop-blur-2xl

                      border
                      border-white/20

                      text-white
                      font-medium

                      shadow-[0_0_40px_rgba(217,70,239,0.35)]

                      hover:scale-105
                      hover:bg-white/15

                      transition-all
                      duration-500

                      cursor-pointer
                    "
                  >

                    Explore

                  </button>

                </motion.div>

              )
            }

            {
              heroExpanded && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 40
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  transition={{
                    delay: 0.9,
                    duration: 1
                  }}

                  className={`
                    mt-8

                    max-w-[540px]
                    mx-auto

                    rounded-[50px]

                    ${isNight ? "bg-white/10" : "bg-white/18"}
                    backdrop-blur-2xl

                    border
                    border-white/15

                    py-7
                    px-10

                    shadow-[0_10px_80px_rgba(168,85,247,0.18)]
                  `}
                >

                  <div className="space-y-4">

                    <p
                      className={`
                        text-2xl
                        hero-font
                        ${isNight ? "text-white/90" : "text-[#1a1325]"}
                        leading-relaxed
                      `}
                    >
                      Some feelings aren’t problems.
                    </p>

                    <p
                      className={`
                        text-lg
                        ${isNight ? "text-white/70" : "text-[#3a3147]"}
                        leading-relaxed
                        font-light
                      `}
                    >
                      They just need quiet,
                      space,
                      and gentleness.
                    </p>

                  </div>

                </motion.div>

              )
            }

            {
              showScrollHint && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 20
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  transition={{
                    duration: 1
                  }}

                  className={`
                    mt-8

                    ${isNight ? "text-white/70" : "text-[#2b1d3a]"}
                    text-sm
                    tracking-[0.25em]
                    uppercase

                    tracking-[0.3em]
                    opacity-70
                  `}
                >

                  ↓ Scroll to continue

                </motion.div>

              )
            }

          </motion.div>

        </div>

      </section>

      <CinematicSection
        id="about"
        className="
          pt-16
          pb-24
          px-5 sm:px-8
          relative
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_right,rgba(168,85,247,0.18),transparent_45%)]

            pointer-events-none
          "
        />

        <div className="max-w-6xl mx-auto">

          <div
            className="
              grid
              lg:grid-cols-[1.15fr_0.85fr]
              gap-10
              items-center
            "
          >

            <div>

              <div
                className="
                  w-16
                  h-1
                  rounded-full
                  bg-gradient-to-r
                  from-purple-500
                  to-pink-500
                  mb-6
                  -ml-4
                "
              />

              <div
                className="
                  absolute
                  w-[300px]
                  h-[300px]
                  bg-purple-400/20
                  blur-[120px]
                  rounded-full
                  -z-10
                  top-10
                  left-0
                "
              />

              <p className="text-purple-600 font-semibold mb-4">
                ABOUT MANNMITRA
              </p>

              <h2
                className={`
                  text-3xl
                  lg:text-[46px]
                  font-semibold
                  leading-[1.25]
                  mb-6
                  max-w-[650px]

                  ${isNight ? "text-white" : "text-gray-900"}
                `}
              >
                Wellness should feel
                calm, personal,
                and human
              </h2>

              <p
                className={`
                  text-base
                  lg:text-lg
                  leading-8

                  ${
                    isNight
                      ? "text-purple-100/80"
                      : "text-gray-500"
                  }
                `}
              >
                MannMitra helps people understand emotions,
                build mindful habits, and feel emotionally supported.

                AI-powered insights combined with a calm,
                modern wellness experience.
              </p>

              <div
                className={`
                  mt-8

                  inline-flex
                  items-center
                  gap-4

                  px-5
                  py-4

                  rounded-2xl

                  ${isNight ? "bg-white/10" : "bg-white/60"}
                  backdrop-blur-xl

                  border
                  ${isNight ? "border-white/10" : "border-white/30"}

                  shadow-lg
                `}
              >

                <motion.div
                  key={currentStat}

                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}

                  transition={{ duration: 0.5 }}

                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)"
                  }}

                  className={`
                    flex
                    items-center
                    gap-3
                    ${
                      isNight
                        ? "text-purple-100/80"
                        : "text-gray-500"
                    }
                    font-medium
                  `}
                >

                  <span className="text-2xl">
                    {thoughts[currentStat].emoji}
                  </span>

                  <p>
                    {thoughts[currentStat].text}
                  </p>

                </motion.div>

              </div>

            </div>

            <div className="relative">

              <div
                className="
                  absolute
                  top-10
                  right-10

                  w-[300px]
                  h-[300px]

                  bg-pink-400/20

                  rounded-full

                  blur-[120px]
                "
              />

              <div className="relative flex flex-col gap-7">

              <div
                className="
                  absolute
                  -top-20
                  -right-20

                  w-56
                  h-56

                  bg-purple-400/20

                  rounded-full

                  blur-3xl
                "
              />

              <motion.div
                  animate={{
                    y: [0, -18, 0],
                    rotate: [0, 1, 0]
                  }}

                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}

                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)"
                  }}

                  className={`
                    relative
                    z-10

                    ml-0

                    p-6

                    rounded-[32px]

                    ${isNight ? "bg-white/8" : "bg-white/70"}
                    backdrop-blur-2xl

                    border
                    border-white/30

                    shadow-[0_10px_40px_rgba(168,85,247,0.12)]
                  `}
                >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-14
                      h-14

                      rounded-2xl

                      bg-gradient-to-r
                      from-purple-600
                      to-pink-500

                      flex
                      items-center
                      justify-center

                      text-2xl
                    "
                  >
                    🌙
                  </div>

                  <div>

                    <h3 className={`${isNight ? "text-white" : "text-gray-900"} text-2xl font-bold mb-2`}>
                      Built For Emotional Comfort
                    </h3>

                    <p className={`${isNight ? "text-purple-100/70" : "text-gray-500"} leading-relaxed`}>
                      Designed to feel calming, peaceful,
                      and emotionally safe during overwhelming days.
                    </p>

                  </div>

                </div>

              </motion.div>

              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, -1, 0]
                }}

                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}

                style={{
                  willChange: "transform",
                  transform: "translateZ(0)"
                }}

                className={`
                  relative
                  z-10

                  ml-0 lg:ml-12

                  p-6

                  rounded-[32px]

                  ${isNight ? "bg-white/8" : "bg-white/70"}
                  backdrop-blur-2xl

                  border
                  border-white/30

                  shadow-[0_10px_40px_rgba(168,85,247,0.12)]
                `}
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-14
                      h-14

                      rounded-2xl

                      bg-gradient-to-r
                      from-pink-500
                      to-fuchsia-500

                      flex
                      items-center
                      justify-center

                      text-2xl
                    "
                  >
                    🔒
                  </div>

                  <div>

                    <h3 className={`${isNight ? "text-white" : "text-gray-900"} text-2xl font-bold mb-2`}>
                      Private & Judgment-Free
                    </h3>

                    <p className={`${isNight ? "text-purple-100/70" : "text-gray-500"} leading-relaxed`}>
                      Your emotions, reflections, and personal thoughts
                      stay secure and deeply personal.
                    </p>

                  </div>

                </div>

              </motion.div>

              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, 1.5, 0]
                }}

                transition={{
                  duration: 7,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}

                style={{
                  willChange: "transform",
                  transform: "translateZ(0)"
                }}

                className={`
                  relative
                  z-10

                  ml-0 lg:ml-4

                  p-6

                  rounded-[32px]

                  ${isNight ? "bg-white/8" : "bg-white/70"}
                  backdrop-blur-2xl

                  border
                  border-white/30

                  shadow-[0_10px_40px_rgba(168,85,247,0.12)]
                `}
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-14
                      h-14

                      rounded-2xl

                      bg-gradient-to-r
                      from-indigo-500
                      to-purple-600

                      flex
                      items-center
                      justify-center

                      text-2xl
                    "
                  >
                    ✨
                  </div>

                  <div>

                    <h3 className={`${isNight ? "text-white" : "text-gray-900"} text-2xl font-bold mb-2`}>
                      Calm-First Experience
                    </h3>

                    <p className={`${isNight ? "text-purple-100/70" : "text-gray-500"} leading-relaxed`}>
                      Minimal distractions, soft visuals,
                      and mindful interactions that reduce mental clutter.
                    </p>

                  </div>

                </div>

              </motion.div>

            </div>             

            </div>

          </div>

        </div>

      </CinematicSection>

      <div className="relative h-32 overflow-hidden">

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-transparent
            via-purple-500/10
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2

            w-[70%]
            h-px

            bg-gradient-to-r
            from-transparent
            via-fuchsia-400/40
            to-transparent
          "
        />

      </div>

      <CinematicSection
        id="features"
        className="
          relative
          overflow-hidden
          pt-20
          pb-24
          px-5 sm:px-8
        "
      >

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >

          <div className="text-center mb-16">

            <h2
              className={`
                text-5xl
                font-bold
                mb-5

                ${isNight ? "text-white" : "text-gray-900"}
              `}
            >
              Everything You Need
            </h2>

            <p
              className={`
                text-xl

                ${
                  isNight
                    ? "text-purple-100/70"
                    : "text-gray-500"
                }
              `}
            >
              Designed for your emotional wellness journey
            </p>

          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
              items-stretch
            "
          >

            {[
              {
                icon: <FaBrain />,
                title: "Mood Tracking",
                content: (
                  <>
                    <div className="flex gap-2 text-2xl mt-2">
                      <span>😊</span>
                      <span>😌</span>
                      <span>😐</span>
                      <span>😔</span>
                      <span>😢</span>
                    </div>

                    <div className="mt-4">
                      <p
                        className={`
                          text-sm
                          mb-2

                          ${isNight ? "text-purple-100/85" : "text-gray-600"}
                        `}
                      >
                        Weekly emotional trends
                      </p>

                      <div
                        className="
                          flex
                          items-end
                          gap-2
                          h-16
                        "
                      >
                        <div className="w-3 h-7 bg-pink-300 rounded-full" />
                        <div className="w-3 h-10 bg-purple-300 rounded-full" />
                        <div className="w-3 h-12 bg-fuchsia-400 rounded-full" />
                        <div className="w-3 h-16 bg-purple-600 rounded-full" />
                      </div>

                      <p className="mt-3 text-green-500 font-semibold">
                        +32% positivity this week
                      </p>
                    </div>
                  </>
                )
              },

              {
                icon: <FaBell />,
                title: "Smart Reminders",
                content: (
                  <>
                    <div className="space-y-3 mt-5">

                      <div
                        className={`
                          ${isNight ? "bg-white/15" : "bg-white/70"}
                          rounded-2xl
                          p-2.5
                          shadow-md
                          flex
                          items-center
                          justify-between
                        `}
                      >
                        <div>
                          <p className={`font-semibold ${isNight ? "text-white" : "text-gray-800"}`}>
                            Meditation
                          </p>

                          <p
                            className={`
                              text-sm
                              mb-2

                             ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            8:00 AM
                          </p>
                        </div>

                        <div
                          className="
                            w-3
                            h-3
                            rounded-full
                            bg-green-400
                            animate-pulse
                          "
                        />
                      </div>

                      <div
                        className={`
                          ${isNight ? "bg-white/15" : "bg-white/70"}
                          rounded-2xl
                          p-2.5
                          shadow-md
                          flex
                          items-center
                          justify-between
                        `}
                      >
                        <div>
                          <p className={`font-semibold ${isNight ? "text-white" : "text-gray-800"}`}>
                            Sleep Reminder
                          </p>

                          <p className="text-sm text-gray-500">
                            10:00 PM
                          </p>
                        </div>

                        <div
                          className="
                            w-3
                            h-3
                            rounded-full
                            bg-purple-400
                            animate-pulse
                          "
                        />
                      </div>

                    </div>
                  </>
                )
              },

              {
                icon: <FaBookOpen />,
                title: "Digital Journal",
                content: (
                  <>
                    <div
                      className={`
                        mt-5
                        rounded-3xl
                        ${isNight ? "bg-white/15" : "bg-white/70"}
                        p-4
                        shadow-lg
                        border
                        border-white/40
                      `}
                    >

                      <p
                        className={`
                          text-sm
                          mb-2

                          ${isNight ? "text-purple-100/85" : "text-gray-600"}
                        `}
                      >
                        Today's Reflection
                      </p>

                      <p
                        className={`
                          ${isNight ? "text-purple-50" : "text-gray-700"}
                          leading-relaxed
                          italic
                        `}
                      >
                        “Today felt calmer after mindful breaks.”
                      </p>

                      <div className="mt-4 flex gap-2">

                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-purple-100
                            text-purple-700
                            text-xs
                          "
                        >
                          Calm
                        </span>

                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-pink-100
                            text-pink-600
                            text-xs
                          "
                        >
                          Mindful
                        </span>

                      </div>

                    </div>
                  </>
                )
              },

              {
                icon: <FaChartLine />,
                title: "AI Insights",
                content: (
                  <>
                    <div className="mt-4">

                      <div
                        className="
                          flex
                          items-end
                          gap-3
                          h-16
                        "
                      >

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-8 bg-purple-300 rounded-full" />
                          <span
                            className={`
                              text-xs
                              ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            Mon
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-10 bg-purple-400 rounded-full" />
                          <span
                            className={`
                              text-xs
                              ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            Tue
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-12 bg-pink-400 rounded-full" />
                          <span
                            className={`
                              text-xs
                              ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            Wed
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-14 bg-purple-600 rounded-full" />
                          <span
                            className={`
                              text-xs
                              ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            Thurs
                          </span>
                        </div>

                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <p
                            className={`
                              text-sm
                              mb-2

                              ${isNight ? "text-purple-100/85" : "text-gray-600"}
                            `}
                          >
                            Emotional Stability
                          </p>

                          <h4 className={`text-2xl font-bold ${isNight ? "text-white" : "text-gray-800"}`}>
                            89%
                          </h4>

                        </div>

                        <div
                          className="
                            px-3
                            py-2
                            rounded-2xl
                            bg-green-100
                            text-green-600
                            text-sm
                            font-semibold
                          "
                        >
                          AI Active
                        </div>

                      </div>

                    </div>
                  </>
                )
              }
            ].map((item, index) => (

              <motion.div
                key={index}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40
                  },
                  show: {
                    opacity: 1,
                    y: 0
                  }
                }}
                whileHover={{
                  y: -14,
                  scale: 1.03
                }}
                transition={{ duration: 0.3 }}

                style={{
                  willChange: "transform",
                  transform: "translateZ(0)"
                }}
                className={`
                  relative
                  overflow-hidden

                  flex
                  flex-col
                  flex-between

                  ${isNight ? "bg-white/[0.08]" : "bg-[#f8f4ff]"}
                  backdrop-blur-2xl

                  border
                  ${isNight ? "border-white/10" : "border-purple-100"}

                  rounded-[36px]
                  before:absolute
                  before:inset-0
                  before:rounded-[36px]
                  before:border
                  before:border-purple-400/10
                  before:pointer-events-none
                  min-h-[420px]
                  h-auto
                  p-6

                  shadow-[0_10px_50px_rgba(0,0,0,0.25)]

                  hover:border-purple-400/30
                  hover:shadow-[0_20px_80px_rgba(168,85,247,0.25)]
                  ${isNight ? "shadow-purple-900/40" : ""}
                  transition-all
                  duration-500
                `}
              >

                <div
                  className="
                    absolute
                    top-[-40px]
                    right-[-40px]

                    w-40
                    h-40

                    bg-purple-500/10

                    rounded-full

                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    inset-0

                    opacity-0
                    hover:opacity-100

                    transition-all
                    duration-500

                    bg-gradient-to-r
                    from-purple-500/5
                    via-pink-500/10
                    to-fuchsia-500/5

                    pointer-events-none
                  "
                />

                <div
                  className="
                    relative
                    z-10

                    w-16
                    h-16

                    rounded-2xl

                    bg-gradient-to-r
                    from-purple-600
                    to-pink-500

                    flex
                    items-center
                    justify-center

                    text-white
                    text-2xl

                    shadow-[0_10px_35px_rgba(217,70,239,0.35)]

                    mb-6
                  "
                >
                  {item.icon}
                </div>

                <h3
                  className={`
                    text-[2rem]
                    font-extrabold
                    tracking-tight
                    mb-4
                    relative
                    z-10

                    ${isNight ? "text-white" : "text-gray-900"}
                    drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]
                  `}
                >
                  {item.title}
                </h3>

                <div className="relative z-10">

                  <div
                    className={`
                      inline-flex
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      mb-4

                      ${
                        index === 0
                          ? "bg-purple-100 text-purple-700"
                          : index === 1
                          ? "bg-pink-100 text-pink-700"
                          : index === 2
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {
                      index === 0
                        ? "Live Mood Analytics"
                        : index === 1
                        ? "Smart Scheduling"
                        : index === 2
                        ? "Private & Secure"
                        : "AI Powered"
                    }
                  </div>

                  {item.content}

                </div>

              </motion.div>

            ))}

          </motion.div>

        </motion.div>

      </CinematicSection>

      <div className="relative h-32 overflow-hidden">

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-transparent
            via-fuchsia-400/10
            to-transparent
          "
        />

      </div>

      <CinematicSection
        className={`
          relative
          overflow-hidden
          min-h-[88vh]

          flex
          items-center
          justify-center

          px-5 sm:px-8
          py-24
          style={{
            background: isNight
              ? "radial-gradient(circle at center, #2a103f 0%, #12051d 70%)"
              : undefined
          }}
        `}
      >

        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2

            w-[320px]
            h-[320px]

            sm:w-[500px]
            sm:h-[500px]

            lg:w-[700px]
            lg:h-[700px]

            bg-fuchsia-400/15

            rounded-full

            blur-[160px]

            pointer-events-none
          "
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {[...Array(25)].map((_, i) => (

            <motion.div
              key={i}

              animate={{
                y: [0, -40, 0],
                x: [0, 15, -10, 0],
                opacity: [0.15, 0.4, 0.15],
              }}

              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}

              className={`
                absolute
                rounded-full
                ${isNight ? "bg-white/25" : "bg-white/50"}
              `}

              style={{
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: "blur(1px)",
              }}
            />

          ))}

        </div>

        <div
          className="
            relative
            z-10
            max-w-5xl
            mx-auto
            text-center
          "
        >

          <motion.p

            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}

            transition={{ duration: 1 }}

            className="
              text-fuchsia-500
              uppercase
              tracking-[0.35em]
              text-sm
              font-semibold
              mb-10
            "
          >
            A softer digital space
          </motion.p>

          <motion.h2

            initial={{
              opacity: 0,
              y: 80,
              filter: "blur(10px)"
            }}

            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)"
            }}

            transition={{
              duration: 1.4
            }}

            className={`
              text-5xl
              md:text-7xl

              hero-font

              leading-[1.05]
              tracking-[-0.04em]

              ${isNight ? "text-[#f8f5ff]" : "text-[#1a1325]"}
            `}
          >

            You don’t need to be perfect
            <br />

            <span
              className={`
                bg-gradient-to-r
                bg-clip-text
                text-transparent

                ${
                  isNight
                    ? "from-violet-200 via-fuchsia-200 to-pink-300"
                    : "from-purple-700 via-fuchsia-500 to-pink-500"
                }
              `}
            >
              to deserve peace.
            </span>

          </motion.h2>

          <motion.p

            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}

            transition={{
              delay: 0.4,
              duration: 1
            }}

            className={`
              mt-10
              max-w-3xl
              mx-auto

              text-xl
              leading-[2]

              ${isNight ? "text-white/70" : "text-[#5d4d6d]"}
            `}
          >

            MannMitra creates space for reflection,
            emotional clarity,
            and gentler everyday moments.

          </motion.p>

          <motion.div

            initial={{
              opacity: 0,
              y: 60,
              scale: 0.95
            }}

            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1
            }}

            transition={{
              delay: 0.6,
              duration: 1.2
            }}

            className={`
              relative

              mt-20

              max-w-2xl
              mx-auto

              px-10
              py-10

              rounded-[40px]

              ${isNight ? "bg-white/10" : "bg-white/30"}
              backdrop-blur-2xl

              border
              ${isNight ? "border-white/10" : "border-white/30"}

              shadow-[0_10px_80px_rgba(168,85,247,0.12)]
            `}
          >

            <div
              className="
                absolute
                inset-0

                rounded-[40px]

                bg-gradient-to-r
                from-fuchsia-400/10
                via-purple-400/10
                to-pink-400/10

                pointer-events-none
              "
            />

            <p
              className={`
                relative
                z-10

                text-3xl
                hero-font

                ${isNight ? "text-white/85" : "text-[#2b1d3a]"}

                leading-relaxed
              `}
            >
              “Some days need softness,
              <br />
              not productivity.”
            </p>

          </motion.div>

          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 1,
              duration: 1
            }}

            className={`
              mt-16

              text-sm
              tracking-[0.35em]
              uppercase

              ${isNight ? "text-white/50" : "text-[#6f5d82]"}

              animate-pulse
            `}
          >

            ↓ breathe ↓

          </motion.div>

        </div>

      </CinematicSection>

      <CinematicSection
        id="testimonials"
        className="
          relative
          overflow-hidden
          pt-24
          pb-28
          px-5 sm:px-8
        "
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-8 -mt-4">

            <p className="text-purple-600 font-semibold mb-4">
              TESTIMONIALS
            </p>

            <h2
              className={`
                text-4xl
                lg:text-5xl
                font-bold
                mb-5

                ${isNight ? "text-white" : "text-gray-900"}
              `}
            >
              Loved by mindful people
            </h2>

            <p
              className={`
                text-lg

                ${
                  isNight
                    ? "text-purple-100/70"
                    : "text-gray-500"
                }
              `}
            >
              Early users are already building healthier emotional habits.
            </p>

          </div>

          <div className="relative overflow-hidden mt-4">

            <div
              className={`
                absolute
                left-0
                top-0
                h-full
                w-40
                z-10
                bg-gradient-to-r

                ${
                  isNight
                    ? "from-[#12001f]"
                    : "from-[#f6ecff]"
                }

                to-transparent
              `}
            />

            <div
              className={`
                absolute
                right-0
                top-0
                h-full
                w-40
                z-10
                bg-gradient-to-l

                ${
                  isNight
                    ? "from-[#12001f]"
                    : "from-[#f6ecff]"
                }

                to-transparent
              `}
            />

            <div
              className="flex gap-8 animate-testimonial-scroll"
              style={{ width: "max-content" }}
            >

              {[...testimonials, ...testimonials].map((item, index) => (

                <div
                  key={index}
                  className={`
                    relative
                    min-w-[85vw]
                    sm:min-w-[420px]
                    rounded-[36px]
                    border ${
                      isNight
                        ? "border-white/10"
                        : "border-purple-200"
                    }
                    ${isNight ? "bg-white/10" : "bg-white/70"}
                    backdrop-blur-xl
                    p-10
                    shadow-[0_0_40px_rgba(168,85,247,0.08)]
                    cursor-pointer
                  `}
                >

                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      bg-gradient-to-br
                      from-fuchsia-500
                      to-purple-600
                      flex
                      items-center
                      justify-center
                      text-white
                      text-2xl
                      font-bold
                      mb-8
                    "
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div className="flex gap-1 text-yellow-400 mb-6 text-xl">
                    ★★★★★
                  </div>

                  <p
                    className={`
                      ${isNight ? "text-white/80" : "text-gray-700"}
                      text-xl
                      leading-relaxed
                      mb-6
                    `}
                  >
                    "{item.text}"
                  </p>

                  <div>

                    <h4 className={`${isNight ? "text-white" : "text-gray-900"} text-2xl font-semibold`}>
                      {item.name}
                    </h4>

                    <p className={`${isNight ? "text-white/50" : "text-gray-500"} mt-1`}>
                      {item.role}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>
          
        </div>

      </CinematicSection>

      <CinematicSection
        className="
          relative
          overflow-hidden
          z-10
          pt-28
          pb-20
          px-5 sm:px-8
        "
      >

        <div
          className={`
            absolute
            inset-0
            z-0
            bg-gradient-to-b

            ${
              isNight
                ? "from-[#170028]/90 via-[#220038]/80 to-[#12001f]/90"
                : "from-[#1b0030] via-[#220038] to-[#170028]"
            }
          `}
        />

        <div
          className={`
            absolute
            z-0
            top-[-120px]
            right-[-120px]

            rounded-full
            animate-pulse

            ${
              isNight
                ? `
                  w-[240px]
                  h-[240px]

                  sm:w-[350px]
                  sm:h-[350px]

                  lg:w-[500px]
                  lg:h-[500px]
                  bg-fuchsia-600/15
                  blur-[120px]
                `
                : `
                  w-[420px]
                  h-[420px]
                  bg-fuchsia-400/10
                  blur-[120px]
                `
            }
          `}
        />

        <div
          className={`
            absolute
            z-0
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            ${
              isNight
                ? `
                  w-[650px]
                  h-[650px]
                  bg-purple-600/15
                  blur-[200px]
                `
                : `
                  w-[240px]
                  h-[240px]

                  sm:w-[350px]
                  sm:h-[350px]

                  lg:w-[500px]
                  lg:h-[500px]
                  bg-purple-400/8
                  blur-[130px]
                `
            }
          `}
        />

        <div
          className="
            relative
            z-10
            max-w-4xl
            mx-auto
            text-center
          "
        >

          <p
            className="
              text-fuchsia-400
              tracking-[0.3em]
              uppercase
              text-sm
              font-semibold
              mb-8
              animate-pulse
            "
          >
            Emotional Wellness • AI Support • Mindful Living
          </p>

          <div
            className="
              relative

              bg-white/[0.03]
              backdrop-blur-2xl

              border
              border-white/10

              rounded-[40px]

              px-10
              py-20

              shadow-[0_10px_80px_rgba(168,85,247,0.08)]
            "
          >

            <div
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[420px]
                h-[420px]
                bg-fuchsia-500/20
                blur-[140px]
                rounded-full
              "
            />

            <h2
              className="
                relative
                text-5xl
                md:text-7xl
                font-bold
                leading-tight
                text-white
              "
            >
              Feel emotionally
              <br />
              understood.
            </h2>

          </div>

          <p
            className="
              mt-10
              text-lg
              md:text-xl
              text-purple-100/85
              leading-relaxed
              max-w-2xl
              mx-auto
            "
          >
            A calm digital space for journaling,
            mindfulness, emotional tracking,
            and gentle AI support.
          </p>

          <div className="relative inline-block mt-14">

          <div
            className={`
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              ${
                isNight
                  ? `
                    w-[260px]
                    h-[90px]
                    bg-fuchsia-500/20
                    blur-[70px]
                  `
                  : `
                    w-[220px]
                    h-[70px]
                    bg-fuchsia-400/10
                    blur-[50px]
                  `
              }
            `}
          />

          <button
            onClick={() => navigate("/register")}
            className="
              relative
              z-10

              px-10
              py-5

              rounded-full

              bg-white

              text-[#12001f]
              text-lg
              font-semibold

              shadow-[0_0_40px_rgba(255,255,255,0.15)]

              hover:scale-105
              active:scale-[0.98]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            Begin Your Journey
          </button>

        </div>

        </div>

      </CinematicSection>

      <CinematicSection
        id="contact"
        className="
          relative
          z-10
          overflow-hidden
          pt-24
          pb-36
          px-5 sm:px-8
        "
      >

        <div
          className={`
            absolute
            inset-0
            z-0
            bg-gradient-to-b
            ${
              isNight
                ? "from-[#12001f]/85 via-[#0f001c]/75 to-[#0b0014]/85"
                : "from-[#f6ecff] via-[#f3e8ff] to-[#efe4ff]"
            }
          `}
        />

        <div
          className="
            absolute
            inset-0
            z-0
            backdrop-blur-[2px]
          "
        />

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-12
            lg:gap-20
            items-center
          "
        >

          <div
            className="
              hidden lg:block
              absolute
              left-1/2
              top-0
              h-full
              w-px
              bg-gradient-to-b
              from-transparent
              via-purple-300/20
              to-transparent
            "
          />

          <div>

            <div
              className="
                absolute
                z-0
                -left-32
                top-0
                w-[400px]
                h-[400px]
                bg-pink-300/20
                blur-[120px]
                rounded-full
                pointer-events-none
              "
            />

            <p
              className="
                text-fuchsia-400
                uppercase
                tracking-[0.3em]
                text-sm
                font-semibold
                mb-6
              "
            >
              CONTACT
            </p>

            <h2
              className={`
                text-4xl
                lg:text-5xl
                font-bold
                ${isNight ? "text-white" : "text-[#2a103d]"}
                leading-tight
                mb-8
              `}
            >
              Let’s stay connected.
            </h2>

            <p
              className={`
                text-lg
                ${
                  isNight
                    ? "text-purple-100/75"
                    : "text-[#5e4b73]"
                }
                leading-loose
                max-w-xl
                mb-10
              `}
            >
              Questions, feedback, collaborations,
              or simply sharing your wellness journey —
              we’d love to hear from you.
            </p>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-6
                py-4
                rounded-full
                border border-white/15
                bg-white/12
                backdrop-blur-md
                shadow-lg shadow-purple-900/20
                text-pink-400
                animate-pulse
              "
            >
              Healing begins with feeling heard.
            </div>

          </div>

          <div className="space-y-8">

            <div className="space-y-6">

            {contactCards.map((card, index) => (

              <div
                key={index}
                className={`
                  rounded-[32px]
                  border border-white/10
                  ${
                    isNight
                      ? "bg-white/[0.04]"
                      : "bg-white/55"
                  }
                  backdrop-blur-xl
                  p-8
                  shadow-[0_10px_40px_rgba(168,85,247,0.08)]
                  hover:shadow-[0_20px_60px_rgba(168,85,247,0.15)]
                  transition-all
                  duration-500
                `}
              >

                <p className="text-fuchsia-400 text-sm mb-3">
                  {card.title}
                </p>

                {card.type === "contact" && (

                  <div className="space-y-5">

                    <input
                      type="text"
                      placeholder="Your name"

                      value={contactForm.name}

                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          name: e.target.value,
                        })
                      }

                      className={`
                        w-full
                        px-6
                        py-4
                        rounded-2xl
                        ${
                          isNight
                            ? "bg-black/20"
                            : "bg-white/80"
                        }
                        border 
                        ${
                          isNight
                            ? "border-white/10"
                            : "border-purple-200"
                        }
                        ${isNight ? "text-white" : "text-gray-800"}
                        ${
                          isNight
                            ? "placeholder:text-white/30"
                            : "placeholder:text-gray-400"
                        }
                        outline-none
                        focus:border-fuchsia-500/40
                        focus:ring-4
                        focus:ring-fuchsia-200/40
                        hover:border-fuchsia-500/20
                        hover:shadow-[0_0_80px_rgba(217,70,239,0.08)]
                        transition-all
                        duration-500
                      `}
                    />

                    <input
                      type="email"
                      placeholder="Your email"

                      value={contactForm.email}

                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }

                      className={`
                        w-full
                        px-6
                        py-4
                        rounded-2xl
                        ${
                          isNight
                            ? "bg-black/20"
                            : "bg-white/80"
                        }
                        border 
                        ${
                          isNight
                            ? "border-white/10"
                            : "border-purple-200"
                        }
                        ${isNight ? "text-white" : "text-gray-800"}
                        ${
                          isNight
                            ? "placeholder:text-white/30"
                            : "placeholder:text-gray-400"
                        }
                        outline-none
                        focus:border-fuchsia-500/40
                        focus:ring-4
                        focus:ring-fuchsia-200/40
                      `}
                    />

                    <textarea
                      rows={5}
                      placeholder="Write your message..."

                      value={contactForm.message}

                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }

                      className={`
                        w-full
                        px-6
                        py-4
                        rounded-3xl
                        ${
                          isNight
                            ? "bg-black/20"
                            : "bg-white/80"
                        }
                        border 
                        ${
                          isNight
                            ? "border-white/10"
                            : "border-purple-200"
                        }
                        ${isNight ? "text-white" : "text-gray-800"}
                        ${
                          isNight
                            ? "placeholder:text-white/30"
                            : "placeholder:text-gray-400"
                        }
                        outline-none
                        resize-none
                        focus:border-fuchsia-500/40
                        focus:ring-4
                        focus:ring-fuchsia-200/40
                      `}
                    />

                    <button
                      onClick={handleContactSubmit}

                      className="
                        w-full
                        py-4
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-600
                        to-pink-500
                        text-white
                        font-semibold
                        hover:scale-[1.02]
                        active:scale-[0.98]
                        transition-all
                        duration-300
                        cursor-pointer
                      "
                    >
                      Send Message
                    </button>

                    {contactSuccess && (
                      <div
                        className="
                          mt-5
                          rounded-2xl
                          bg-green-500/10
                          border border-green-400/20
                          px-5
                          py-4
                          text-green-300
                          animate-pulse
                        "
                      >
                        Message sent successfully
                      </div>
                    )}

                  </div>
                )}

              </div>

            ))}

          </div>

          </div>

          </div>

      </CinematicSection>

      <footer
        className={`
          relative 
          z-10
          overflow-hidden
          pt-14
          pb-8
          px-5 sm:px-8

          ${
            isNight
              ? "bg-gradient-to-b from-[#14001f]/85 via-[#100018]/75 to-black/90"
              : "bg-gradient-to-b from-[#f8f1ff] via-[#f3e8ff] to-[#eddcff]"
          }

          border-t

          ${
            isNight
              ? "border-white/10"
              : "border-purple-200/60"
          }
        `}
      >

        <div
        className="
          absolute inset-0 z-0
          opacity-[0.025]
          bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)]
          [background-size:12px_12px]
          pointer-events-none
        "
      />

        <div
          className="
            absolute
            z-0
            top-[-150px]
            left-1/2
            -translate-x-1/2

            w-[240px]
            h-[240px]

            sm:w-[350px]
            sm:h-[350px]

            lg:w-[500px]
            lg:h-[500px]

            bg-fuchsia-500/10

            rounded-full

            blur-[120px]

            pointer-events-none
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]

            w-[420px]
            h-[420px]

            bg-pink-400/10

            rounded-full

            blur-[120px]

            pointer-events-none
          "
        />

        <div
          className="
            absolute
            z-0
            top-0
            left-0
            w-full
            h-px

            bg-gradient-to-r
            from-transparent
            via-fuchsia-500/20
            to-transparent
          "
        />

        <div
          className="
            relative
            z-10

            max-w-6xl
            mx-auto
          "
        >

          <div
            className={`
              grid
              grid-cols-1
              lg:grid-cols-[1.5fr_0.7fr_1fr]
              items-start
              gap-12

              px-10 py-8
              rounded-[40px]

              ${
                isNight
                  ? `
                    bg-gradient-to-br
                    from-[#2b163a]/90
                    via-[#24122f]/90
                    to-[#1b0c24]/90

                    border border-white/10

                    shadow-[0_0_60px_rgba(168,85,247,0.18)]
                  `
                  : `
                    bg-white/35
                    border border-white/40
                    shadow-[0_10px_60px_rgba(168,85,247,0.08)]
                  `
              }

              backdrop-blur-2xl
              pb-8
            `}
          >

            <div className="lg:col-span-2">

              <div className="flex items-center gap-4 mb-6">

                <img
                  src="mannmitra-logo.png"
                  alt="MannMitra"
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    object-cover
                    shadow-xl
                  "
                />

                <div>

                  <h2
                    className={`
                      text-3xl
                      font-bold

                      ${
                        isNight
                          ? "text-white"
                          : "text-[#2a103d]"
                      }
                    `}
                  >
                    MannMitra
                  </h2>

                  <p
                    className={`
                      text-sm

                      ${
                        isNight
                          ? "text-purple-100/60"
                          : "text-[#7b6b91]"
                      }
                    `}
                  >
                    Your Mind, Our Care
                  </p>

                </div>

              </div>

              <p
                className={`
                  max-w-xl
                  leading-relaxed
                  text-lg

                  ${
                    isNight
                      ? "text-purple-100/70"
                      : "text-[#6f5d82]"
                  }
                `}
              >
                Gentle support for your mind, mood, and everyday wellbeing.
              </p>

              <div
                className={`
                  inline-flex
                  items-center
                  gap-3

                  mt-8

                  px-5
                  py-3

                  rounded-full

                  ${
                    isNight
                      ? "bg-white/5 border-white/10"
                      : "bg-white/10 border-white/20"
                  }
                  backdrop-blur-xl

                  border
                  border-white/10

                  shadow-lg
                `}
              >

                <span className="text-xl">
                  🔒
                </span>

                <p
                  className={`
                    text-sm
                    font-medium

                    ${
                      isNight
                        ? "text-purple-100/70"
                        : "text-[#6f5d82]"
                    }
                  `}
                >
                  Private • Calm • Judgment-Free
                </p>

              </div>

            </div>

            <div className="lg:pl-8">

              <h3
                className={`
                  text-lg
                  font-semibold
                  mb-6

                  ${
                    isNight
                      ? "text-white"
                      : "text-[#2a103d]"
                  }
                `}
              >
                Quick Links
              </h3>

              <div className="flex flex-col gap-4">

                {[
                  "About",
                  "Features",
                  "Testimonials",
                  "Contact",
                ].map((item) => (

                  <a
                    key={item}
                    href={
                      websiteUnlocked
                        ? `#${item.toLowerCase()}`
                        : undefined
                    }

                    className={`
                      transition-all
                      duration-300

                      hover:text-pink-300
                      hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]
                      hover:translate-x-1

                      ${
                        isNight
                          ? "text-purple-100/60"
                          : "text-[#6f5d82]"
                      }
                    `}
                  >
                    {item}
                  </a>

                ))}

              </div>

            </div>

            <div className="lg:-ml-4">

              <h3
                className={`
                  text-lg
                  font-semibold
                  mb-6

                  ${
                    isNight
                      ? "text-white"
                      : "text-[#2a103d]"
                  }
                `}
              >
                Join the MannMitra Community
              </h3>

              <p
                className={`
                  text-sm
                  leading-relaxed
                  mb-5

                  ${
                    isNight
                      ? "text-purple-100/60"
                      : "text-[#6f5d82]"
                  }
                `}
              >
                Get mindful wellness tips and emotional insights
              </p>

              <div
                className={`
                  flex
                  flex-col
                  sm:flex-row

                  rounded-2xl

                  overflow-hidden

                  ${isNight ? "bg-white/10" : "bg-white/70"}
                  backdrop-blur-xl

                  border
                  border-white/10
                `}
              >

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`
                    flex-1
                    bg-transparent
                    outline-none
                    px-6
                    py-5

                    ${
                      isNight
                        ? "text-white placeholder:text-purple-200/40"
                        : "text-purple-900 placeholder:text-purple-500"
                    }
                  `}
                />

                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="
                    px-8
                    py-5
                    rounded-r-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-pink-500
                    text-white
                    font-semibold

                    hover:scale-105
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  {loading ? "Joining..." : "Join Us"}
                </button>

              </div>

              {message && (

                <p
                  className="
                    mt-4
                    text-green-400
                    text-sm
                  "
                >
                  {message}
                </p>

              )}

              <div className="flex items-center gap-4 mt-6">

                {[
                  {
                    icon: FaWhatsapp,
                    link: "https://wa.me/918109019085",
                  }

                ].map((item, index) => {

                  const Icon = item.icon;

                  return (

                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"

                      className={`
                        inline-flex
                        items-center
                        gap-3
                        px-5
                        py-3
                        rounded-2xl
                        mt-6

                        ${
                          isNight
                            ? `
                              bg-white/5
                              text-white
                              border-white/10

                              hover:bg-green-500/15
                              hover:border-green-400/30
                            `
                            : `
                              bg-white/70
                              text-purple-700
                              border-purple-200

                              hover:bg-green-50
                            `
                        }

                        hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]

                        transition-all
                        duration-300
                      `}
                    >
                      <FaWhatsapp className="text-xl" />

                      <span className="font-medium">
                        Chat on WhatsApp
                      </span>

                    </a>

                  );
                })}

              </div>

            </div>

          </div>

          <div
            className="
              pt-5
              mt-6

              border-t
              border-white/10

              flex
              flex-col
              md:flex-row
              items-center
              justify-between

              gap-4
            "
          >

            <p
              className={`
                text-sm

                ${
                  isNight
                    ? "text-purple-100/40"
                    : "text-[#7b6b91]"
                }
              `}
            >
              MannMitra © 2026 • Your Mind, Our Care
            </p>

            <p
              className={`
                text-sm

                ${
                  isNight
                    ? "text-purple-100/40"
                    : "text-[#7b6b91]"
                }
              `}
            >
              Built with care for emotional wellness
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;