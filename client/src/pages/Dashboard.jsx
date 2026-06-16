import Sidebar from "../components/Sidebar";
import wellnessTips from "../utils/wellnessTips";
import { motion } from "framer-motion";
import MusicPlayer from "../components/MusicPlayer";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";
import {
  FaPlus,
  FaSmile,
  FaBell,
  FaBookOpen,
  FaTimes,
  FaClock,
  FaExclamationCircle,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
  FaFire,
  FaAngleRight,
  FaChevronDown,
  FaBars
} from "react-icons/fa";

function Dashboard() {
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().getDate();
  const dailyTip = wellnessTips[today % wellnessTips.length];
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;
  const cardStyle = isNight ? "bg-[#ffffff14] text-white backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : "bg-white/75 text-gray-800 backdrop-blur-xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)]";
  const primaryText = isNight ? "text-white" : "text-gray-800";
  const secondaryText = isNight ? "text-purple-100" : "text-gray-500";
  const headingText = isNight ? "text-purple-200" : "text-purple-700";
  const dropdownText = isNight ? "text-purple-100" : "text-gray-800";
  const dropdownSubtext = isNight ? "text-purple-200" : "text-gray-600";
  const dropdownHover = isNight ? "hover:bg-white/10" : "hover:bg-purple-100/80";
  const [reminders, setReminders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [streak, setStreak] = useState(null);
  const [selectedMood,setSelectedMood] = useState(null);
  const [timelineMoodData, setTimelineMoodData] = useState([]);
  const [timelineFilter, setTimelineFilter] = useState("week");
  const [bellSeen, setBellSeen] = useState(false);
  const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
  const timelineDropdownRef = useRef(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodNote, setMoodNote] = useState("");
  const [moods, setMoods] = useState([]);
  const moodData = [
    {
      mood: "Happy",
      emoji: "😊",
      score: 5
    },
    {
      mood: "Calm",
      emoji: "😌",
      score: 4
    },
    {
      mood: "Neutral",
      emoji: "😐",
      score: 3
    },
    {
      mood: "Low",
      emoji: "😔",
      score: 2
    },
    {
      mood: "Sad",
      emoji: "😢",
      score: 1
    }
  ];

  const moodPoints = timelineMoodData.map((item, index) => ({
    x:
      timelineMoodData.length > 1
        ? 40 +
          (index * 920) /
            (timelineMoodData.length - 1)
        : 500,

    y: 100 - item.score * 12
  }));

  const fetchMoodTimeline = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const email = user?.email;

      const response = await API.get(
        `/moods?email=${email}`
      );

      let filteredMoods = response.data;

      const today = new Date();

      if (timelineFilter === "week") {

        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        filteredMoods = filteredMoods.filter(
          (mood) =>
            new Date(mood.date_only) >= weekAgo
        );

      }

      else if (timelineFilter === "month") {

        filteredMoods = filteredMoods.filter((mood) => {

          const moodDate = new Date(mood.date_only);

          return (
            moodDate.getMonth() === today.getMonth() &&
            moodDate.getFullYear() === today.getFullYear()
          );

        });

      }

      else if (timelineFilter === "year") {

        filteredMoods = filteredMoods.filter((mood) => {

          const moodDate = new Date(mood.date_only);

          return (
            moodDate.getFullYear() === today.getFullYear()
          );

        });

      }

      filteredMoods.sort(
        (a, b) =>
          new Date(a.date_only) -
          new Date(b.date_only)
      );

      setTimelineMoodData(filteredMoods);

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    fetchMoodTimeline();
  }, [timelineFilter]);

  useEffect(() => {

    fetchReminders();
    fetchStreak();
    fetchDashboardMood();

  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        timelineDropdownRef.current &&
        !timelineDropdownRef.current.contains(
          event.target
        )
      ) {
        setShowTimelineDropdown(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const fetchDashboardMood = async () => {
    try {
      const response = await API.get(
        `/moods?email=${user.email}`
      );

      setMoods(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchReminders = async () => {

    try {

      const response = await API.get(
        `/get-reminders/${user.email}`
      );

      setReminders(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const generateCurvePath = (points) => {

    if (!points.length) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {

      const current = points[i];
      const next = points[i + 1];

      const controlX =
        (current.x + next.x) / 2;

      path += `
        C
        ${controlX} ${current.y}
        ${controlX} ${next.y}
        ${next.x} ${next.y}
      `;
    }

    return path;
  };

  const curvePath =
    generateCurvePath(moodPoints);

  const fetchStreak = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/get-streak/${user.email}`
      );

      const data = await response.json();

      console.log(data);

      setStreak(data.streak);

    } catch (error) {

      console.log(error);

    }

  };

  const pendingReminders = reminders.filter(
    (reminder) => reminder.completed !== true
  );

 const notifications = [];

  reminders
    .filter((reminder) => !reminder.completed)
    .forEach((reminder) => {

      const reminderDateTime = new Date(
        `${reminder.date}T${reminder.time}`
      );

      const now = new Date();

      const diffInHours =
        (reminderDateTime - now) /
        (1000 * 60 * 60);

      const isOverdue =
        reminderDateTime < now;

      const dueWithinOneHour =
        diffInHours > 0 &&
        diffInHours <= 1;

      if (isOverdue) {

        notifications.push({
          id: reminder._id,
          type: "reminder",
          icon: <FaExclamationCircle />,
          title: `${reminder.title} is overdue`,
          color: "text-red-400",
          time: reminder.time,
          read: reminder.notificationRead
        });

      }

      else if (dueWithinOneHour) {

        notifications.push({
          id: reminder._id,
          type: "reminder",
          icon: <FaClock />,
          title: `${reminder.title} starts soon`,
          color: "text-orange-400",
          time: reminder.time,
          read: reminder.notificationRead
        });

      }

    });

  const hour = new Date().getHours();

  if (hour >= 20) {

    notifications.push({
      id: "mood-reminder",
      type: "system",
      icon: <FaSmile />,
      title: "Don't forget to track today's mood",
      color: "text-pink-400",
      time: "Daily Check-in",
      read: false
    });

  }

  if (hour >=21) {

    notifications.push({
      id: "journal-reminder",
      type: "system",
      icon: <FaBookOpen />,
      title: "Take a few minutes to journal",
      color: "text-indigo-400",
      time: "Daily Reflection",
      read: false
    });

  }

  if (streak === 7) {

    notifications.push({
      id: "streak-7",
      icon: <FaFire />,
      title: "Amazing! 7 day wellness streak 🔥",
      color: "text-orange-400",
      time: "Achievement",
      read: false
    });

  }

  if (streak === 30) {

    notifications.push({
      id: "streak-30",
      icon: <FaFire />,
      title: "Incredible! 30 day streak achieved 🌟",
      color: "text-yellow-400",
      time: "Achievement",
      read: false
    });

  }

  if (streak === 100) {

    notifications.push({
      id: "streak-100",
      icon: <FaFire />,
      title: "Wellness Champion! 100 day streak 👑",
      color: "text-purple-400",
      time: "Achievement",
      read: false
    });

  }

  const unreadNotifications =
    bellSeen
      ? []
      : notifications.filter(
          (item) => !item.read
        );

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };

  const markNotificationsRead = async () => {

    try {

      const unread = notifications.filter(
        (item) => !item.read
      );

      await Promise.all(

        unread
          .filter(
            item => item.type === "reminder"
          )
          .map(item =>
            axios.put(
              `http://127.0.0.1:8000/read-notification/${item.id}`
            )
          )

      );

      fetchReminders();

    } catch (error) {

      console.log(error);

    }

  };

  
  const saveMood = async () => {

  try {

    if (selectedMood === null) {

      alert("Please select a mood first");

      return;

    }

    const mood = moodData[selectedMood];

    await axios.post(
      "http://127.0.0.1:8000/save-mood",
      {
        email: user.email,
        mood: mood.mood,
        emoji: mood.emoji,
        score: mood.score,
        date: new Date().toISOString(),
        note: moodNote
      }
    );

    await fetchMoodTimeline();

    setSelectedMood(null);
    setMoodNote("");
    setShowMoodModal(false);

  } catch (error) {

    console.log(error);

    alert("Failed to save mood");

  }
};

  let greeting = "";
  let subGreeting = "";
  let moodEmoji = "";
  let backgroundStyle = "";
  let streakMessage = "";
  let streakFooter = "";
  let streakEmoji = "";


  if (currentHour >= 5 && currentHour < 12) {

    greeting = "Good Morning";
    moodEmoji = "☀️";

    subGreeting = "Start your day with a calm and positive mind.";

    backgroundStyle =
      "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100";

  } else if (currentHour >= 12 && currentHour < 18) {

    greeting = "Good Afternoon";
    moodEmoji = "🌸";

    subGreeting = "Take a mindful pause and breathe gently.";

    backgroundStyle =
      "bg-gradient-to-br from-[#f5e9ff] via-[#efe1ff] to-[#ffdff3]";

  } else {

    greeting = "Good Evening";
    moodEmoji = "🌙";

    subGreeting = "Relax, unwind, and be kind to yourself tonight.";

    backgroundStyle =
      "bg-gradient-to-br from-[#170b2c] via-[#2a1745] to-[#4d2b67]";

  }

  if (!streak || streak === 0) {
    streakMessage = "Start your wellness journey";
    streakFooter = "Track your mood to begin your streak.";
    streakEmoji = "🌱";
  }

  else if (streak < 7) {
    streakMessage = "Keep going!";
    streakFooter = "You're building a healthy habit.";
    streakEmoji = "💪";
  }

  else if (streak < 30) {
    streakMessage = "You're doing great!";
    streakFooter = "Keep showing up for yourself.";
    streakEmoji = "🌸";
  }

  else if (streak < 100) {
    streakMessage = "Amazing consistency!";
    streakFooter = "Your mental wellness is thriving.";
    streakEmoji = "🔥";
  }

  else {
    streakMessage = "Wellness Champion!";
    streakFooter = "An inspiration to others.";
    streakEmoji = "👑";
  }

  const latestMood =
            moods.length > 0
                ? [...moods].sort(
                    (a, b) =>
                        new Date(b.date_only) -
                        new Date(a.date_only)
                )[0]
                : null;

        const moodIllustrations = {
            Happy: "/happy-brain.png",
            Calm: "/calm-brain.png",
            Neutral: "/neutral-brain.png",
            Low: "/low-brain.png",
            Sad: "/sad-brain.png",
            };

        const currentIllustration =
            moodIllustrations[latestMood?.mood];

        const moodMessages = {
            Happy:
                "You've been feeling joyful and energetic lately. Keep embracing the positivity and sharing your happiness.",

            Calm:
                "You've been emotionally balanced recently. Keep nurturing your well-being and inner peace.",

            Neutral:
                "Your emotions have been steady and balanced. Take time to explore activities that bring you more joy and fulfillment.",

            Low:
                "You've had a few emotionally challenging moments recently. Remember to be gentle with yourself and take things one step at a time.",

            Sad:
                "You've been feeling down lately. Don't hesitate to reach out, journal your thoughts, or practice self-care. Better days are ahead."
            };

            const currentMoodMessage =
                latestMood
                    ? moodMessages[latestMood.mood]
                    : "";

  return (

    <div className={`min-h-screen ${backgroundStyle} flex relative`}>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {
        sidebarOpen && (
          <div
            className="
              fixed
              inset-0
              bg-black/40
              z-30
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />
        )
      }
      
      <div
        className="
          flex-1

          lg:pl-[260px]
          pl-4

          lg:pr-[40px]
          pr-4

          lg:pt-[40px]
          pt-4

          transition-all
          duration-300
        "
      >

    <div className="flex lg:hidden justify-between items-center mb-5">

      <button
        onClick={() => setSidebarOpen(true)}
        className="
          w-12
          h-12
          rounded-xl
          bg-white/80
          flex
          items-center
          justify-center
          shadow-lg
          cursor-pointer
        "
      >
        <FaBars />
      </button>

      <div className="flex items-center gap-1 sm:gap-2">

        <div
          className={`
            ${cardStyle}
            px-3
            py-2
            min-w-[120px]
            md:min-w-[150px]
            rounded-[18px]
            flex
            items-center
            gap-2
          `}
        >
          <FaCalendarAlt className="text-purple-500" />

          <div>
            <p className={`text-[11px] font-semibold ${primaryText}`}>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </p>

            <p className={`text-[10px] ${secondaryText}`}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short"
              })}
            </p>
          </div>
        </div>

        <div
              className={`
                ${cardStyle}
                w-[54px]
                h-[54px]
                rounded-full

                flex
                items-center
                justify-center
              `}
            >

              <MusicPlayer />

            </div>

            <div className="relative">

              {
              showNotifications && (

                <div
                  className={`

                   fixed

                    top-[80px]

                    max-sm:left-1/2
                    max-sm:-translate-x-1/2

                    left-1/2
                    -translate-x-1/2

                    sm:absolute
                    sm:left-auto
                    sm:translate-x-0
                    sm:right-0

                    w-[calc(100vw-24px)]
                    sm:w-[340px]

                    max-w-[340px]

                    rounded-[32px]

                    ${
                      isNight
                        ? "bg-[#1e1b2e]/95"
                        : "bg-white/95"
                    }

                    backdrop-blur-[25px]

                    border
                    border-white/20

                    shadow-[0_12px_50px_rgba(0,0,0,0.18)]

                    p-5

                    z-[9999]

                    animate-fadeIn

                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-5
                    "
                  >

                    <h2
                      className={`${dropdownText} text-xl font-bold`}
                    >
                      Notifications
                    </h2>

                    <button
                      onClick={() =>
                        setShowNotifications(false)
                      }
                      className="cursor-pointer"
                    >

                      <FaTimes className={`${dropdownSubtext}`} />

                    </button>

                  </div>

                  <div className="space-y-4">

                    {
                      notifications.length === 0 && (

                        <div
                          className={`text-center ${dropdownSubtext} py-10`}
                        >
                          No new reminder alerts!
                        </div>

                      )
                    }

                    {
                      notifications
                        .filter(item => !item.read)
                        .map((item, index) => (

                        <div
                          key={index}
                          className={`
                            flex
                            items-start
                            gap-4
                            transition-all
                            duration-300
                            p-4
                            rounded-2xl

                            ${
                              item.read
                                ? "bg-white/10 opacity-70"
                                : "bg-purple-500/15 border border-purple-400/10"
                            }

                            hover:bg-white/10
                          `}
                        >

                          <div
                            className={`
                              text-2xl
                              ${item.color}
                            `}
                          >
                            {item.icon}
                          </div>

                          <div>

                            <p
                              className={`${dropdownText} text-sm leading-relaxed`}
                            >
                              {item.title}
                            </p>

                            <p
                              className={`${dropdownSubtext} text-xs mt-1`}
                            >
                              {item.time}
                            </p>

                          </div>

                        </div>

                      ))
                    }

                  </div>

                </div>

              )
            }

              <button
                onClick={() => {

                  setShowNotifications(
                    !showNotifications
                  );

                  if (!showNotifications) {

                    setBellSeen(true);

                    markNotificationsRead();

                  }

                }}
                className={`
                  ${cardStyle}
                  w-[54px]
                  h-[54px]
                  rounded-full

                  flex
                  items-center
                  justify-center

                  relative

                  hover:scale-105
                  transition-all
                  cursor-pointer
                `}
              >

                <FaBell className="text-xl text-yellow-500" />

                {unreadNotifications.length > 0 && (

                  <div
                    className="
                      absolute
                      -top-1
                      -right-1

                      w-5
                      h-5

                      rounded-full

                      bg-red-500

                      text-white
                      text-[11px]

                      flex
                      items-center
                      justify-center
                    "
                  >
                    {unreadNotifications.length > 9
                      ? "9+"
                      : unreadNotifications.length}
                  </div>

                )}

              </button>

            </div>

            <div
              className="relative"
              ref={profileMenuRef}
            >

              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="
                  w-[54px]
                  h-[54px]

                  rounded-full

                  bg-gradient-to-r
                  from-purple-600
                  to-fuchsia-500

                  text-white
                  text-lg
                  font-bold

                  shadow-xl

                  hover:scale-105

                  transition-all
                  cursor-pointer
                "
              >
                {user?.name?.charAt(0)}
              </button>

              {profileOpen && (

              <div
                className={`

                  absolute
                  top-24
                  right-0

                  w-[90vw]
                  max-w-[300px]

                  rounded-[32px]

                  ${
                    isNight
                      ? "bg-[#1e1b2e]/95"
                      : "bg-white/95"
                  }

                  backdrop-blur-[25px]

                  border
                  border-white/20

                  shadow-[0_12px_50px_rgba(0,0,0,0.18)]

                  p-6

                  z-[9999]

                  animate-fadeIn

                `}
              >

                <div className="flex items-center gap-4 mb-6">

                  <div
                    className="
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
                      font-bold
                    "
                  >
                    {user?.name?.charAt(0)}
                  </div>

                  <div>

                    <h2 className={`text-xl font-bold ${dropdownText}`}>
                      {user?.name}
                    </h2>

                    <p className={`text-sm ${dropdownSubtext}`}>
                      {user?.email}
                    </p>

                  </div>

                </div>

                <div className="space-y-2">

                  <button
                    onClick={() => navigate("/settings")}
                    className={`

                      w-full

                      flex
                      items-center
                      gap-4

                      px-4
                      py-3.5

                      rounded-2xl

                      cursor-pointer

                      transition-all
                      duration-300

                      hover:translate-x-1

                      ${dropdownText}
                      ${dropdownHover}

                    `}
                  >
                    <FaCog />
                    Settings
                  </button>

                </div>

                <button
                  onClick={logout}
                  className="

                    mt-5

                    w-full

                    py-4

                    rounded-2xl

                    bg-gradient-to-r
                    from-red-500
                    to-pink-500

                    text-white
                    font-semibold

                    flex
                    items-center
                    justify-center
                    gap-3

                    shadow-lg

                    hover:scale-[1.03]

                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >

                  <FaSignOutAlt />

                  Logout

                </button>

              </div>

            )}

            </div>

          </div>

        </div>

        <div
          className="
            flex
            flex-col
            xl:flex-row
            justify-between
            xl:items-center
            items-start
            gap-4
            mb-8
          "
        >

          <div className="w-full">

            <h1
              className={`
                text-[30px]
                xl:text-[40px]
                font-bold
                leading-tight
                ${primaryText}
              `}
            >
              {greeting}, {user?.name?.split(" ")[0]} {moodEmoji}
            </h1>

            <p
              className={`
                mt-2
                text-base
                max-w-[600px]
                ${secondaryText}
              `}
            >
              {subGreeting}
            </p>

          </div>

          <div className="hidden lg:flex items-center gap-4 whitespace-nowrap">

            <div
              className={`
                ${cardStyle}
                px-5
                py-3
                rounded-[24px]

                min-w-[170px]

                flex
                items-center
                gap-4
              `}
            >

              <FaCalendarAlt
                className="
                  text-purple-500
                  text-xl
                "
              />

              <div>

                <p
                  className={`
                    text-sm
                    font-semibold
                    ${primaryText}
                  `}
                >
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>

                <p
                  className={`
                    text-sm
                    ${secondaryText}
                  `}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short"
                  })}
                </p>

              </div>

            </div>

            <div
              className={`
                ${cardStyle}
                w-[54px]
                h-[54px]
                rounded-full

                flex
                items-center
                justify-center
              `}
            >

              <MusicPlayer />

            </div>

            <div className="relative">

              {
              showNotifications && (

                <div
                  className={`

                    absolute
                    top-[75px]
                    right-0

                    w-[90vw]
                    max-w-[340px]

                    rounded-[32px]

                    ${
                      isNight
                        ? "bg-[#1e1b2e]/95"
                        : "bg-white/95"
                    }

                    backdrop-blur-[25px]

                    border
                    border-white/20

                    shadow-[0_12px_50px_rgba(0,0,0,0.18)]

                    p-5

                    z-[9999]

                    animate-fadeIn

                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-5
                    "
                  >

                    <h2
                      className={`${dropdownText} text-xl font-bold`}
                    >
                      Notifications
                    </h2>

                    <button
                      onClick={() =>
                        setShowNotifications(false)
                      }
                      className="cursor-pointer"
                    >

                      <FaTimes className={`${dropdownSubtext}`} />

                    </button>

                  </div>

                  <div className="space-y-4">

                    {
                      notifications.length === 0 && (

                        <div
                          className={`text-center ${dropdownSubtext} py-10`}
                        >
                          No new reminder alerts!
                        </div>

                      )
                    }

                    {
                      notifications
                        .filter(item => !item.read)
                        .map((item, index) => (

                        <div
                          key={index}
                          className={`
                            flex
                            items-start
                            gap-4
                            transition-all
                            duration-300
                            p-4
                            rounded-2xl

                            ${
                              item.read
                                ? "bg-white/10 opacity-70"
                                : "bg-purple-500/15 border border-purple-400/10"
                            }

                            hover:bg-white/10
                          `}
                        >

                          <div
                            className={`
                              text-2xl
                              ${item.color}
                            `}
                          >
                            {item.icon}
                          </div>

                          <div>

                            <p
                              className={`${dropdownText} text-sm leading-relaxed`}
                            >
                              {item.title}
                            </p>

                            <p
                              className={`${dropdownSubtext} text-xs mt-1`}
                            >
                              {item.time}
                            </p>

                          </div>

                        </div>

                      ))
                    }

                  </div>

                </div>

              )
            }

              <button
                onClick={() => {

                  setShowNotifications(
                    !showNotifications
                  );

                  if (!showNotifications) {

                    setBellSeen(true);

                    markNotificationsRead();

                  }

                }}
                className={`
                  ${cardStyle}
                  w-[54px]
                  h-[54px]
                  rounded-full

                  flex
                  items-center
                  justify-center

                  relative

                  hover:scale-105
                  transition-all
                  cursor-pointer
                `}
              >

                <FaBell className="text-xl text-yellow-500" />

                {unreadNotifications.length > 0 && (

                  <div
                    className="
                      absolute
                      -top-1
                      -right-1

                      w-5
                      h-5

                      rounded-full

                      bg-red-500

                      text-white
                      text-[11px]

                      flex
                      items-center
                      justify-center
                    "
                  >
                    {unreadNotifications.length > 9
                      ? "9+"
                      : unreadNotifications.length}
                  </div>

                )}

              </button>

            </div>

            <div
              className="relative"
              ref={profileMenuRef}
            >

              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="
                  w-[54px]
                  h-[54px]

                  rounded-full

                  bg-gradient-to-r
                  from-purple-600
                  to-fuchsia-500

                  text-white
                  text-lg
                  font-bold

                  shadow-xl

                  hover:scale-105

                  transition-all
                  cursor-pointer
                "
              >
                {user?.name?.charAt(0)}
              </button>

              {profileOpen && (

              <div
                className={`

                  absolute
                  top-24
                  right-0

                  w-[90vw]
                  max-w-[300px]

                  rounded-[32px]

                  ${
                    isNight
                      ? "bg-[#1e1b2e]/95"
                      : "bg-white/95"
                  }

                  backdrop-blur-[25px]

                  border
                  border-white/20

                  shadow-[0_12px_50px_rgba(0,0,0,0.18)]

                  p-6

                  z-[9999]

                  animate-fadeIn

                `}
              >

                <div className="flex items-center gap-4 mb-6">

                  <div
                    className="
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
                      font-bold
                    "
                  >
                    {user?.name?.charAt(0)}
                  </div>

                  <div>

                    <h2 className={`text-xl font-bold ${dropdownText}`}>
                      {user?.name}
                    </h2>

                    <p className={`text-sm ${dropdownSubtext}`}>
                      {user?.email}
                    </p>

                  </div>

                </div>

                <div className="space-y-2">

                  <button
                    onClick={() => navigate("/settings")}
                    className={`

                      w-full

                      flex
                      items-center
                      gap-4

                      px-4
                      py-3.5

                      rounded-2xl

                      cursor-pointer

                      transition-all
                      duration-300

                      hover:translate-x-1

                      ${dropdownText}
                      ${dropdownHover}

                    `}
                  >
                    <FaCog />
                    Settings
                  </button>

                </div>

                <button
                  onClick={logout}
                  className="

                    mt-5

                    w-full

                    py-4

                    rounded-2xl

                    bg-gradient-to-r
                    from-red-500
                    to-pink-500

                    text-white
                    font-semibold

                    flex
                    items-center
                    justify-center
                    gap-3

                    shadow-lg

                    hover:scale-[1.03]

                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >

                  <FaSignOutAlt />

                  Logout

                </button>

              </div>

            )}

            </div>

          </div>

        </div>

        <div className="grid xl:grid-cols-[2fr_0.9fr] grid-cols-1 gap-8 mt-10">


            <div
        className={`
        max-w-5xl
        mx-auto
        rounded-[36px]
        p-6 md:p-8
        shadow-xl
        flex
        flex-col
        lg:flex-row
        items-center
        justify-between
        gap-8
        mb-10

        ${cardStyle}
        `}
        >

        <div className="flex-1 w-full">

        <h4 className={`${primaryText} font-semibold mb-4`}>
        Emotional Wellness Journey
        </h4>

        <div className="flex items-center gap-4 mb-4">

        <span className="text-5xl">
        {latestMood?.emoji || "🌸"}
        </span>

        <h2
        className={`
        text-5xl
        font-bold
        ${isNight ? "text-purple-200" : "text-purple-800"}
        `}
        >
        {latestMood?.mood || "Welcome"}
        </h2>

        </div>

        <span
        className={`
        inline-block
        px-4
        py-2
        rounded-full
        ${isNight
          ? "bg-purple-500/20 text-purple-200"
          : "bg-purple-200 text-purple-800"
        }
        text-sm
        font-semibold
        `}
        >
        Current emotional state
        </span>

        <p
          className={`
          mt-4
          text-lg
          leading-relaxed
          max-w-lg
          ${isNight ? "text-purple-100" : "text-gray-700"}
          `}
          >
          {currentMoodMessage ||
            "Track your first mood to start your emotional wellness journey."}
          </p>

        </div>

        <div className="w-[250px] flex justify-center">

          {currentIllustration && (

            <motion.img
              src={currentIllustration}
              alt="Mood"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -12, 0]
              }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="
                w-[180px]
                sm:w-[220px]
                xl:w-[250px]
                object-contain
              "
            />

          )}

        </div>

        </div>

          <div
            className={`
              ${cardStyle}
              rounded-[36px]
              p-6
              min-h-[240px]
              w-full
            `}
          >
            <h3
              className={`font-bold text-2xl mb-8 ${primaryText}`}
            >
              Wellness Streak
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-5">

              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  bg-orange-100

                  flex
                  items-center
                  justify-center

                  text-4xl
                "
              >
                <FaFire className="text-orange-500" />
              </div>

              <div>

                <div className="flex items-center gap-3">

                  <span
                    className="
                      text-6xl
                      font-bold
                      text-purple-400
                      leading-none
                    "
                  >
                    {streak || 0}
                  </span>

                  <span
                    className={`
                      text-3xl
                      font-semibold
                      ${secondaryText}
                    `}
                  >
                    Days
                  </span>

                </div>

                <p className="text-purple-500 font-semibold">
                  {streakMessage} {streakEmoji}
                </p>

              </div>

            </div>

            <div className="flex justify-center gap-3 mt-8">

              {[...Array(7)].map((_, i) => (

                <div
                  key={i}
                  className={`
                    w-7
                    h-7

                    rounded-full

                    flex
                    items-center
                    justify-center

                    text-[10px]
                    font-bold

                    ${
                      i < Math.min(streak || 0, 8)
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-300"
                    }
                  `}
                >
                  {i < Math.min(streak || 0, 8) ? "✓" : ""}
                </div>

              ))}

            </div>

            <p className={`mt-30 text-[15px] ${secondaryText}`}>
              {streakFooter}
            </p>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">

          <div
            className={`
              ${cardStyle}

              rounded-[24px]
              p-5

              flex
              items-center
              justify-between

              cursor-pointer
            `}
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14

                  rounded-2xl

                  bg-gradient-to-r
                  from-purple-500
                  to-violet-400

                  flex
                  items-center
                  justify-center

                  shadow-lg
                "
              >
                <FaBell className="text-white text-xl" />
              </div>

              <div className="text-left">

                <h3
                  className={`
                    font-bold
                    text-lg
                    ${primaryText}
                  `}
                >
                  Add Reminder
                </h3>

                <p
                  className={`
                    text-sm
                    ${secondaryText}
                  `}
                >
                  Never miss important tasks
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/reminders")}
              className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-purple-100
              transition
              cursor-pointer
            "
            >
              <FaAngleRight className="text-gray-400 text-xl" />
            </button>

          </div>

          <div
            className={`
              ${cardStyle}

              rounded-[24px]
              p-5

              flex
              items-center
              justify-between

              cursor-pointer
            `}
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14

                  rounded-2xl

                  bg-gradient-to-r
                  from-pink-500
                  to-fuchsia-400

                  flex
                  items-center
                  justify-center

                  shadow-lg
                "
              >
                <FaSmile className="text-white text-xl" />
              </div>

              <div className="text-left">

                <h3
                  className={`
                    font-bold
                    text-lg
                    ${primaryText}
                  `}
                >
                  Track Mood
                </h3>

                <p
                  className={`
                    text-sm
                    ${secondaryText}
                  `}
                >
                  Log how you feel today
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/mood")}
              className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-purple-100
              transition
              cursor-pointer
            "
            >
              <FaAngleRight className="text-gray-400 text-xl" />
            </button>

          </div>

          <div
            className={`
              ${cardStyle}

              rounded-[24px]
              p-5

              flex
              items-center
              justify-between

              cursor-pointer
            `}
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14

                  rounded-2xl

                  bg-gradient-to-r
                  from-indigo-500
                  to-blue-400

                  flex
                  items-center
                  justify-center

                  shadow-lg
                "
              >
                <FaBookOpen className="text-white text-xl" />
              </div>

              <div className="text-left">

                <h3
                  className={`
                    font-bold
                    text-lg
                    ${primaryText}
                  `}
                >
                  Write Journal
                </h3>

                <p
                  className={`
                    text-sm
                    ${secondaryText}
                  `}
                >
                  Express your thoughts freely
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/journal")}
              className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-purple-100
              transition
              cursor-pointer
            "
            >
              <FaAngleRight className="text-gray-400 text-xl" />
            </button>

          </div>

        </div>

        <div className="flex flex-col xl:flex-row gap-6 mt-10">

          <div
            className={`
              ${cardStyle}
              rounded-[32px]
              p-5
              w-full
              relative
              overflow-hidden
            `}
          >
            <h3
              className={`
                text-xl
                font-bold
                mb-5
                ${primaryText}
              `}
            >
              Today's Tip
            </h3>

            <div
              className={`
                relative
                rounded-[24px]
                border
                ${
                  isNight
                    ? "border-white/10 bg-white/5"
                    : "border-purple-100 bg-white/60"
                }
                p-8
                min-h-[140px]
              `}
            >
              <div className="absolute left-7 top-4 text-5xl text-purple-500">
                ❝
              </div>

              <p
                className={`
                  ml-12
                  mt-5
                  text-lg
                  font-semibold
                  leading-relaxed
                  max-w-full
                  lg:max-[70%]
                  ${primaryText}
                `}
              >
                {dailyTip}
              </p>

              <div className="absolute right-7 bottom-3 text-4xl text-pink-400">
                ❞
              </div>
            </div>
          </div>

          <div
            className={`
              ${cardStyle}
              rounded-[32px]
              p-5
              w-full
            `}
          >
            <div className="flex justify-between items-center mb-5">

              <h3
                className={`
                  text-xl
                  font-bold
                  ${primaryText}
                `}
              >
                Upcoming Reminders
              </h3>

              <button
                onClick={() => navigate("/reminders")}
                className="text-purple-500 text-sm font-semibold cursor-pointer"
              >
                View all
              </button>

            </div>

            <div className="space-y-4">

              {pendingReminders.length === 0 ? (

                <div
                  className={`
                    text-center
                    py-12
                    ${secondaryText}
                  `}
                >
                  <p className="text-4xl mb-3">🔔</p>

                  <p>No upcoming reminders yet</p>

                  <p className="text-sm mt-1 opacity-70">
                    Add a reminder to see it here
                  </p>
                </div>

              ) : (

                pendingReminders.slice(0, 3).map((reminder, index) => {

                  const reminderTime = new Date(
                    `${reminder.date}T${reminder.time}`
                  );

                  const diff =
                    Math.max(
                      0,
                      reminderTime - new Date()
                    ) / (1000 * 60 * 60);

                  const badgeText =
                    diff < 1
                      ? `In ${Math.ceil(diff * 60)} mins`
                      : `In ${Math.ceil(diff)} hrs`;

                  const reminderDate = new Date(reminder.date);

                  const isToday =
                    reminderDate.toDateString() ===
                    new Date().toDateString();

                  const displayDate = isToday
                    ? "Today"
                    : reminderDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                  const displayTime = reminderTime.toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );

                  return (
                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        justify-between
                        pb-3
                        border-b
                        border-white/10
                      "
                    >
                      <div className="flex items-center gap-4">

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-purple-500/15
                            flex
                            items-center
                            justify-center
                            text-xl
                          "
                        >
                          🔔
                        </div>

                        <div>

                          <p
                            className={`
                              font-semibold
                              text-base
                              lg:text-[18px]
                              leading-tight
                              ${primaryText}
                            `}
                          >
                            {reminder.title}
                          </p>

                          <p
                            className={`
                              text-[14px]
                              mt-1
                              ${secondaryText}
                            `}
                          >
                            {displayDate}, {displayTime}
                          </p>

                        </div>

                      </div>

                      <span
                        className="
                          hidden sm:block
                          px-3
                          py-1
                          rounded-full
                          bg-purple-100
                          text-purple-600
                          text-sm
                          font-semibold
                        "
                      >
                        {badgeText}
                      </span>

                    </div>
                  );

                })

              )}

            </div>
          </div>

        </div>

        <div
          className={`
            ${cardStyle}
            rounded-[36px]
            shadow-lg
            p-8
            mt-11
            overflow-visible
            border border-white/10
            backdrop-blur-2xl
            shadow-[0_10px_50px_rgba(168,85,247,0.12)]
          `}
        >

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">

            <h2 className={`text-2xl font-bold ${primaryText}`}>
              Mood Timeline
            </h2>

            <div
              className="relative"
              ref={timelineDropdownRef}
            >

            <button
              onClick={() =>
                setShowTimelineDropdown(
                  !showTimelineDropdown
                )
              }
              className={`
                px-5
                py-2.5

                rounded-2xl

                flex
                items-center
                gap-3

                font-semibold

                transition-all
                duration-300

                ${
                  isNight
                    ? "bg-white/10 text-purple-100 border border-white/10"
                    : "bg-purple-50 text-purple-600 border border-purple-100"
                }

                hover:scale-[1.03]
                cursor-pointer
              `}
            >

              {timelineFilter === "week" && "This Week"}

              {timelineFilter === "month" && "This Month"}

              {timelineFilter === "year" && "This Year"}

              <FaChevronDown
                className={`
                  transition-transform
                  duration-300

                  ${
                    showTimelineDropdown
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>

            {showTimelineDropdown && (

              <div
                className={`
                  absolute
                  right-0
                  top-14

                  w-[140px]

                  rounded-3xl

                  overflow-hidden

                  z-50

                  ${
                    isNight
                      ? "bg-[#2b1d45]/95 border border-white/10"
                      : "bg-white border border-purple-100"
                  }

                  backdrop-blur-xl

                  shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                `}
              >

                <button
                  onClick={() => {

                    setTimelineFilter("week");

                    setShowTimelineDropdown(false);

                  }}
                  className={`
                    w-full
                    px-5
                    py-4

                    text-left

                    transition-all
                    duration-300

                    ${
                      timelineFilter === "week"
                        ? "bg-purple-500 text-white"
                        : isNight
                        ? "text-purple-100 hover:bg-white/10"
                        : "text-gray-700 hover:bg-purple-50"
                    }
                  `}
                >
                  This Week
                </button>

                <button
                  onClick={() => {

                    setTimelineFilter("month");

                    setShowTimelineDropdown(false);

                  }}
                  className={`
                    w-full
                    px-5
                    py-4

                    text-left

                    transition-all
                    duration-300

                    ${
                      timelineFilter === "month"
                        ? "bg-purple-500 text-white"
                        : isNight
                        ? "text-purple-100 hover:bg-white/10"
                        : "text-gray-700 hover:bg-purple-50"
                    }
                  `}
                >
                  This Month
                </button>

                <button
                  onClick={() => {

                    setTimelineFilter("year");

                    setShowTimelineDropdown(false);

                  }}
                  className={`
                    w-full
                    px-5
                    py-4

                    text-left

                    transition-all
                    duration-300

                    ${
                      timelineFilter === "year"
                        ? "bg-purple-500 text-white"
                        : isNight
                        ? "text-purple-100 hover:bg-white/10"
                        : "text-gray-700 hover:bg-purple-50"
                    }
                  `}
                >
                  This Year
                </button>

              </div>

            )}

          </div>

          </div>

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2

              w-[400px]
              h-[200px]

              bg-purple-500/10

              rounded-full
              blur-[100px]

              pointer-events-none
            "
          />

          {timelineMoodData.length < 3 && (
            <p className="text-center text-sm text-gray-500 mb-4">
              Track a few more moods to unlock your full journey
            </p>
          )}

          <div className="relative h-44 overflow-x-auto scrollbar-thin">

            {timelineMoodData.length < 2 ? (

              <div
                className={`
                  h-full
                  flex
                  items-center
                  justify-center
                  ${secondaryText}
                `}
              >
                Track moods for a few days to see your journey
              </div>

            ) : (

            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
            >
              <motion.path
                key={curvePath}
                d={curvePath}
                fill="none"
                stroke="#9d6bff"
                strokeWidth="4"
                strokeLinecap="round"

                initial={{
                  pathLength: 0
                }}

                animate={{
                  d: curvePath,
                  pathLength: 1
                }}

                transition={{
                  d: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  pathLength: {
                    duration: 1
                  }
                }}
              />
            </motion.svg>

            )}

            <div className="absolute top-4 left-0 right-0 flex justify-between px-4 sm:px-8">

            {timelineMoodData.map((item, index) => (

              <motion.div
                key={index}

                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.7
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}

                transition={{
                  delay: index * 0.18,
                  duration: 0.5
                }}

                className="flex flex-col items-center"
              >

                <motion.div

                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1]
                  }}

                  transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                  className="
                    w-12
                    h-12

                    rounded-full

                    bg-white/10
                    backdrop-blur-xl

                    border
                    border-white/10

                    flex
                    items-center
                    justify-center

                    text-2xl
                  "
                >

                  {item.emoji}

                </motion.div>      

              </motion.div>

            ))}

          </div>

          <div
            className={`
              absolute
              bottom-2
              left-0
              right-0

              flex
              justify-between

              px-8

              text-lg
              font-medium
              ${secondaryText}
            `}
          >
            {timelineMoodData.map((item,index)=>(
              <span key={index}>
                {new Date(item.date_only)
                  .toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                  )}
              </span>
            ))}
          </div>

          </div>

        </div>

      </div>
    
    </div>

  );
}

export default Dashboard;