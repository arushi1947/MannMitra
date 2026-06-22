import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import toast from "react-hot-toast";
import { isSoundEnabled } from "../utils/soundSettings";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMicrophone
} from "react-icons/fa";

function Reminders() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024
  );

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [repeat, setRepeat] = useState("none");

  const [category, setCategory] = useState("Work");

  const [priority, setPriority] = useState("Medium");

  const [reminders, setReminders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState("all");

  const [editId, setEditId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedDay, setSelectedDay] = useState("all");

  const [notifiedIds, setNotifiedIds] = useState([]);

  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);

  const notifiedRef = useRef(new Set());

  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [aiInsights, setAiInsights] = useState([]);

  const [recommendationData, setRecommendationData] = useState(null);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1280);

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

  useEffect(() => {

    fetchReminders();

    fetchMoodSuggestions();

    fetchReminderInsights();

  }, []);

  useEffect(() => {

    if (Notification.permission !== "granted") {

      Notification.requestPermission();

    }

  }, []);

  useEffect(() => {

    const notified = new Set();

    const interval = setInterval(() => {

      const now = new Date();

      reminders.forEach((reminder) => {

        if (reminder.completed) return;

        const [year, month, day] =
          reminder.date.split("-");

        const [hours, minutes] =
          reminder.time.split(":");

        const reminderDateTime = new Date(

          Number(year),

          Number(month) - 1,

          Number(day),

          Number(hours),

          Number(minutes),

          0

        );

        const diff =
          reminderDateTime - now;

        console.log(
          reminder.title,
          diff
        );

        if (
          diff <= 60000 &&
          diff > 0 &&
          !notifiedRef.current.has(reminder._id)
        ) {

          console.log(
            "Triggering notification"
          );

          showNotification(
            `${reminder.title}`,
            reminder.description
          );

          notifiedRef.current.add(reminder._id);

        }

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [reminders]);

  useEffect(() => {

    const handleClickOutside = (event) => {

        if (

            profileMenuRef.current &&

            !profileMenuRef.current.contains(event.target)

        ) {

            setShowProfileMenu(false);

        }

    };

    document.addEventListener(
        "mousedown",
        handleClickOutside
    );

    return () => {

        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );

    };

}, []);

useEffect(() => {

  const handleResize = () => {

    const mobile = window.innerWidth < 1024;

    setIsMobileOrTablet(mobile);

    if (!mobile) {
      setSidebarOpen(true);
    }

  };

  window.addEventListener("resize", handleResize);

  handleResize();

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );

}, []);

const fetchMoodSuggestions = async () => {

  try {

    const response = await API.get(
      `/api/mood-recommendations?email=${user.email}`
    );

    setRecommendationData(
      response.data
    );

    setAiSuggestions(
      response.data.recommendations || []
    );

  } catch (error) {

    console.log(error);

  }

};

const fetchReminderInsights = async () => {

  try {

    const response = await API.get(
      `/api/reminder-insights?email=${user.email}`
    );

    setAiInsights(
      response.data.insights || []
    );

  } catch (error) {

    console.log(error);

  }

};

  const addReminder = async (e) => {

    e.preventDefault();

    try {

      if (isEditing) {

        await API.put(`/update-reminder/${editId}`, {

          title,
          description,
          date,
          time,
          priority

        });

      } else {

        await API.post("/add-reminder", {

          title,
          description,
          date,
          time,
          priority,
          repeat,
          completed: false,

          userEmail: user.email

        });

      }

      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setPriority("Medium");
      setEditId(null);
      setIsEditing(false);

      fetchReminders();

      toast.success("Reminder Added Successfully");

    } catch (error) {

      toast.error("Something went wrong");
      console.log(error);

    }
  };

  const deleteReminder = async (id) => {

    try {

      await API.delete(
        `/delete-reminder/${id}`
      );

      fetchReminders();

      toast.success("Reminder Deleted 🗑");

    } catch (error) {

      toast.error("Something went wrong");
      console.log(error);

    }
  };

  const completeReminder = async (id) => {

    try {

      await API.put(
        `/complete-reminder/${id}`
      );

      fetchReminders();

      toast.success("Reminder Completed 🎉");

    } catch (error) {

      toast.error("Something went wrong");
      console.log(error);

    }
  };

  const showNotification = (title, body) => {

    const savedSettings = JSON.parse(
      localStorage.getItem("settings")
    );

    console.log(
      "CURRENT SETTINGS:",
      savedSettings
    );

    if (
      !savedSettings?.reminderNotifications
    ) {

      console.log(
        "Reminder notifications are OFF"
      );

      return;

    }

    if (Notification.permission === "granted") {

      const notification = new Notification(title, {
        body,
        icon: "/logo.png"
      });

      console.log("Notification object:", notification);

      if (isSoundEnabled()) {

        const audio = new Audio("/reminder.mp3");

        audio.play();

      }

      console.log(
        "Notification sent successfully"
      );

    } else {

      console.log(
        "Notification permission not granted"
      );

    }

  };

  const editReminder = (reminder) => {

    setTitle(reminder.title);

    setDescription(reminder.description);

    setDate(reminder.date);

    setTime(reminder.time);

    setPriority(reminder.priority);

    setEditId(reminder._id);

    setIsEditing(true);
  };

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      toast.error(
        "Speech recognition not supported"
      );

      return;

    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.interimResults = false;

    setIsListening(true);

    recognition.start();

    recognition.onresult = async (event) => {

      const transcript = event.results[0][0].transcript;

      console.log("Voice:", transcript);

      try {

        const response = await API.post(
          "/api/parse-voice",
          {
            text: transcript
          }
        );

        const data = response.data;

        setTitle(data.title);

        setDate(data.date);

        setTime(data.time);

        setRepeat(data.repeat);

        toast.success(
          "Voice reminder created 🎤"
        );

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Couldn't understand command"
        );

      }

      setIsListening(false);

    };

    recognition.onerror = () => {

      setIsListening(false);

      toast.error(
        "Could not recognize voice"
      );

    };

    recognition.onend = () => {

      setIsListening(false);

    };

  };

  const filteredReminders = reminders.filter((reminder) => {

    if (filter === "completed") {
      return reminder.completed;
    }

    if (filter === "pending") {
      return !reminder.completed;
    }

    return true;
  });

  const totalReminders = reminders.length;

  const completedReminders = reminders.filter(
    reminder => reminder.completed
  ).length;

  const productivity =
    totalReminders === 0
      ? 0
      : Math.round(
          (completedReminders / totalReminders) * 100
        );

  const getCountdown = (date, time) => {

    const now = new Date();

    const reminderDate = new Date(`${date}T${time}`);

    const diff = reminderDate - now;

    if (diff <= 0) {

      return "Expired";

    }

    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (diff / (1000 * 60)) % 60
    );

    if (days > 0) {

      return `⏳ ${days}d ${hours}h left`;

    }

    if (hours > 0) {

      return `⏳ ${hours}h ${minutes}m left`;

    }

    return `⏳ ${minutes}m left`;
  };

  const getReminderStatus = (date, time) => {

    const now = new Date();

    const reminderDate = new Date(`${date}T${time}`);

    const diff = reminderDate - now;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const reminderDay = new Date(reminderDate);

    reminderDay.setHours(0, 0, 0, 0);

    if (diff <= 0) {

      return {
        label: "Overdue",
        color: "bg-gray-200 text-gray-600"
      };
    }

    if (diff <= 1000 * 60 * 60) {

      return {
        label: "Due Soon",
        color: "bg-red-100 text-red-500"
      };
    }

    if (reminderDay.getTime() === today.getTime()) {

      return {
        label: "Due Today",
        color: "bg-orange-100 text-orange-500"
      };
    }

    if (reminderDay.getTime() === tomorrow.getTime()) {

      return {
        label: "Due Tomorrow",
        color: "bg-purple-100 text-purple-700"
      };
    }

    return {
      label: "Upcoming",
      color: "bg-indigo-100 text-indigo-600"
    };
  };

  return (
    <>
    <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
    />

    <div className="min-h-screen bg-[#f6f3ff] flex overflow-x-hidden">

      <div
        className={`
            relative
            w-full
            overflow-x-hidden
            p-4 md:p-6 lg:p-10
            pt-6 md:pt-8
            transition-all
            duration-300

            ${
              !isMobileOrTablet
                ? "ml-[260px]"
                : "ml-0"
            }
        `}
      >

        <div
          className="
            absolute
            top-0
            left-0
            w-full
            h-[300px]
            bg-gradient-to-r
            from-purple-100
            via-pink-50
            to-indigo-100
            opacity-50
            blur-3xl
            -z-10
            pointer-events-none
          "
        />

        <div className="flex justify-between items-start gap-3">

        <div className="flex-1 min-w-0 ml-12 sm:ml-14 pr-2">

          <button
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                          className="
                              lg:hidden
          
                              fixed
                              top-5
                              left-3
          
                              z-[60]
          
                              w-11
                              h-11
                              flex
                              items-center
                              justify-center
          
                              rounded-xl
          
                              bg-white
                              text-purple-700
          
                              shadow-lg
                          "
                          >
                              {sidebarOpen ? <FaTimes /> : <FaBars />}
                          </button>

            <h1 className="text-base sm:text-2xl md:text-4xl font-bold text-gray-800 whitespace-nowrap">
              Reminder Manager
            </h1>

           <p className="text-xs sm:text-[15px] text-gray-500">
              Organize your important tasks
            </p>

        </div>

        <div className="flex items-center gap-3">

            <div
            className="
                bg-white/70
                backdrop-blur-xl
                rounded-2xl
                px-5
                py-3
                shadow-lg
            "
          >

            <p className="font-semibold text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                })}
            </p>

            <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                })}
            </p>

            </div>

            <div
              className="relative"
              ref={profileMenuRef}
          >

              <button

                  onClick={() =>
                      setShowProfileMenu(!showProfileMenu)
                  }

                  className="
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    md:w-16
                    md:h-16
                    rounded-2xl
                    bg-gradient-to-r
                    from-purple-600
                    to-fuchsia-500
                    text-white
                    text-lg
                    sm:text-xl
                    md:text-2xl
                    font-bold
                    shadow-xl
                    hover:scale-105
                    transition-all
                    duration-300
                    cursor-pointer
                  "
              >

                  {user?.name?.charAt(0)}

              </button>

              {
                  showProfileMenu && (

                      <div
                          className={`

                            absolute
                            top-24
                            right-0

                            w-[280px] sm:w-[300px]

                            rounded-[32px]

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

                                  <h2 className="text-2xl font-bold">
                                      {user?.name}
                                  </h2>

                                  <p className="text-gray-500">
                                      {user?.email}
                                  </p>

                              </div>

                          </div>

                          <div className="space-y-3">

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

                                  `}
                                >
                                  <FaCog />
                                  Settings
                              </button>

                              <button

                                  onClick={() => {

                                      localStorage.clear();

                                      navigate("/");

                                  }}

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

                      </div>

                  )
              }

          </div>

        </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500">
                Total
                </p>

                <h2 className="text-4xl font-bold text-purple-700 mt-2">
                {reminders.length}
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500">
                Completed
                </p>

                <h2 className="text-4xl font-bold text-green-500 mt-2">
                {
                    reminders.filter(r => r.completed).length
                }
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500">
                Pending
                </p>

                <h2 className="text-4xl font-bold text-orange-400 mt-2">
                {
                    reminders.filter(r => !r.completed).length
                }
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
  
            <p className="text-gray-500">Productivity</p>

            <h2 className="text-3xl sm:text-4xl font-bold text-pink-500 mt-2">
              {productivity}%
            </h2>

            <div className="mt-4">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-700"
                  style={{ width: `${productivity}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {completedReminders} of {totalReminders} completed
              </p>
            </div>

          </div>

          </div>

          <div className="max-w-[1050px] mx-auto mt-10">

            <div
              className="
                bg-white/50
                backdrop-blur-xl
                rounded-3xl
                px-6
                py-3 sm:py-4
                shadow-lg
                border
                border-white/20
                flex
                items-center
                gap-4
              "
            >

              <span className="text-2xl">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="
                  bg-transparent
                  outline-none
                  w-full
                  text-lg
                  text-gray-700
                  placeholder:text-gray-400
                "
              />

            </div>

          </div>

          <div className="flex flex-wrap gap-4 mt-10 mb-2 max-w-[1050px] mx-auto justify-center">

            <button
              onClick={() => setFilter("all")}
              className={`
                px-6
                py-3
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                cursor-pointer
                ${
                  filter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-700"
                }
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`
                px-6
                py-3
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                cursor-pointer
                ${
                  filter === "pending"
                    ? "bg-orange-400 text-white shadow-lg"
                    : "bg-white/50 text-gray-700"
                }
              `}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("completed")}
              className={`
                px-6
                py-3
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                cursor-pointer
                ${
                  filter === "completed"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-700"
                }
              `}
            >
              Completed
            </button>

          </div>

          <div className="mt-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

              <div>

                <h2 className="text-3xl font-bold text-gray-800">
                  Upcoming Reminders
                </h2>

                <p className="text-gray-500 mt-1">
                  Filter and manage your schedule
                </p>

              </div>

              <div className="flex gap-3">

                {[
                  "today",
                  "tomorrow",
                  "all"
                ].map((day) => (

                  <button
                    key={day}
                    onClick={() =>
                      setSelectedDay(day)
                    }
                    className={`
                      px-5
                      py-2
                      rounded-2xl
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      cursor-pointer

                      ${
                        selectedDay === day
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                          : "bg-white/60 text-gray-600 hover:bg-white"
                      }
                    `}
                  >

                    {
                      day === "today"
                        ? "Today"

                      : day === "tomorrow"
                        ? "Tomorrow"

                      : "All"
                    }

                  </button>

                ))}

              </div>

            </div>

            <div className="flex gap-6 overflow-x-auto pb-2">

              {[...reminders]

                .filter((r) => {

                  if (r.completed) return false;

                  const today = new Date();

                  const tomorrow = new Date();

                  tomorrow.setDate(today.getDate() + 1);

                  const reminderDate =
                    new Date(r.date).toDateString();

                  if (selectedDay === "today") {

                    return (
                      reminderDate ===
                      today.toDateString()
                    );
                  }

                  if (selectedDay === "tomorrow") {

                    return (
                      reminderDate ===
                      tomorrow.toDateString()
                    );
                  }

                  return true;

                })

                .sort((a, b) => {

                  const dateA =
                    new Date(`${a.date}T${a.time}`);

                  const dateB =
                    new Date(`${b.date}T${b.time}`);

                  return dateA - dateB;

                })

                .map((reminder) => (

                  <div
                    key={reminder._id}
                    className="
                      min-w-[260px] sm:min-w-[320px]
                      bg-white/50
                      backdrop-blur-xl
                      border
                      border-white/20
                      rounded-3xl
                      p-6
                      shadow-lg
                    "
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-xl font-bold text-purple-700">
                          <div className="mt-3">

                            <span
                              className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold

                                ${
                                  !reminder.priority || reminder.priority === "Medium"
                                    ? "bg-orange-100 text-orange-500"

                                    : reminder.priority === "High"
                                    ? "bg-red-100 text-red-500"

                                    : "bg-green-100 text-green-600"
                                }
                              `}
                            >

                              {
                                !reminder.priority || reminder.priority === "Medium"
                                  ? "Medium"

                                  : reminder.priority === "High"
                                  ? "High"

                                  : "Low"
                              }

                            </span>

                          </div>
                          {reminder.title}
                        </h3>

                        <p className="text-gray-500 mt-2 line-clamp-2">
                          {reminder.description}
                        </p>

                      </div>

                      <div className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-500
                        flex
                        items-center
                        justify-center
                        text-white
                        text-xl
                        shadow-lg
                      ">
                        ⏰
                      </div>

                    </div>

                    <div className="mt-5 space-y-2">

                      <p
                        className={`
                          ${
                            new Date(`${reminder.date}T${reminder.time}`) < new Date()
                            && !reminder.completed

                              ? "text-red-500 font-semibold"

                              : "text-gray-700"
                          }
                        `}
                      >
                        {reminder.date}
                      </p>

                      <p className="text-gray-700 font-medium">
                        {reminder.time}
                      </p>

                    </div>

                  </div>

              ))}

            </div>

          </div>

          <div className="max-w-[1050px] mx-auto mt-10">

            <div className="mb-6">

              <h2 className="text-3xl font-bold text-purple-700">
                AI Wellness Suggestions
              </h2>

              {
                recommendationData?.mood && (

                  <p className="text-gray-500 mt-2">

                    Generated for your mood:

                    <span className="font-semibold text-purple-700">

                      {" "}
                      {recommendationData.mood}

                    </span>

                  </p>

                )
              }

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {aiSuggestions.map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-white/50
                    backdrop-blur-xl
                    rounded-3xl
                    p-6
                    shadow-lg
                  "
                >

                  <h3 className="text-xl font-bold text-purple-700">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-3">
                    {item.description}
                  </p>

                </div>

              ))}

            </div>

          </div>

          <div className="max-w-[1050px] mx-auto mt-10">

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-purple-700">
              AI Productivity Insights
            </h2>

            <p className="text-gray-500 mt-2">
              Personalized analysis of your reminder habits
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {aiInsights.map((item, index) => (

              <div
                key={index}
                className="
                  bg-white/50
                  backdrop-blur-xl
                  rounded-3xl
                  p-6
                  shadow-lg
                "
              >

                <h3 className="text-xl font-bold text-purple-700">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-3">
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </div>

        <div
          id="add-reminder-section"
          className="
            max-w-[1050px]
            mx-auto
            bg-white/40
            backdrop-blur-2xl
            border
            border-white/20
            shadow-[0_10px_40px_rgba(0,0,0,0.10)]
            rounded-[32px]
            p-8
            mt-10
          "
        >

          <div className="flex items-center justify-between gap-2 mb-8">

            <div>

              <h2 className="text-lg sm:text-2xl md:text-4xl font-bold text-purple-700 whitespace-nowrap">
                Add New Reminder
              </h2>

              <p className="text-gray-500 mt-1">
                Schedule your important tasks beautifully
              </p>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-fuchsia-500
              flex
              items-center
              justify-center
              text-2xl
              shadow-lg
            ">
              ⏰
            </div>

          </div>

          <form
            onSubmit={addReminder}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Reminder Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                p-4
                w-full
                rounded-2xl
                bg-white/70
                border
                border-white/20
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
              "
              
            />

              <button
                type="button"
                onClick={startVoiceInput}
                className={`
                  absolute
                  right-6
                  top-1/2
                  -translate-y-1/2
                  flex
                  items-center
                  justify-center
                  text-2xl
                  transition-all
                  duration-300
                  cursor-pointer

                  ${
                    isListening
                      ? "bg-red-500 animate-pulse scale-110"
                      : "text-purple-600 hover:text-fuschia-500 hover:scale-110"
                  }
                `}
              >
                <FaMicrophone />
              </button>

            </div>

            <input
              type="text"
              placeholder="Description"
              className="
                p-4
                rounded-2xl
                bg-white/70
                border
                border-white/20
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
              "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="
                p-4
                rounded-2xl
                bg-white/70
                border
                border-white/20
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
              "
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              className="
                p-4
                rounded-2xl
                bg-white/70
                border
                border-white/20
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
              "
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <select
              className="
                p-4
                rounded-2xl
                bg-white/70
                border
                border-white/20
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
              "
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >

              <option value="High">
                High Priority
              </option>

              <option value="Medium">
                Medium Priority
              </option>

              <option value="Low">
                Low Priority
              </option>

            </select>

            <button
              className="
                md:col-span-2
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500
                text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                cursor-pointer
              "
            >
              {isEditing ? "Update Reminder" : "Add Reminder"}
            </button>

          </form>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {
            [...filteredReminders]

              .filter((reminder) =>

                reminder.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())

                ||

                reminder.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )

              .sort((a, b) => {

                if (a.completed !== b.completed) {
                  return a.completed - b.completed;
                }

                const dateA = new Date(`${a.date}T${a.time}`);

                const dateB = new Date(`${b.date}T${b.time}`);

                return dateA - dateB;

              })

              .map((reminder) => (

            <div
              key={reminder._id}
              className={`p-6 rounded-3xl shadow-lg 
              ${
                reminder.completed
                  ? "bg-green-100"
                  : "bg-white/50 backdrop-blur-xl border border-white/20"
              }`}
            >

              <h2 className="text-2xl font-bold text-purple-700">
                {reminder.title}
              </h2>

              <p className="text-gray-500 mt-3">
                {reminder.description}
              </p>

              <div className="mt-4">

                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold

                    ${
                     !reminder.priority || reminder.priority === "Medium"
                      ? "bg-orange-100 text-orange-500"

                      : reminder.priority === "High"
                      ? "bg-red-100 text-red-500"

                      : "bg-green-100 text-green-600"
                    }
                  `}
                >

                  {
                    !reminder.priority || reminder.priority === "Medium"
                      ? "Medium"

                      : reminder.priority === "High"
                      ? "High"

                      : "Low"
                  }

                </span>

              </div>

              <div className="mt-5">

                <p className="text-gray-700">
                  {reminder.date}
                </p>

                <p className="text-gray-700 mt-1">
                  {reminder.time}
                </p>

                <div className="flex items-center gap-3 mt-4 flex-wrap">

                  <div
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold
                      animate-pulse

                      ${
                        getReminderStatus(
                          reminder.date,
                          reminder.time
                         ).color
                        }
                      `}
                      >
                        {
                          getReminderStatus(
                            reminder.date,
                            reminder.time
                          ).label
                        }
                      </div>

                      <div
                        className="
                          px-4
                          py-2
                          rounded-full
                          bg-purple-100
                          text-purple-700
                          text-sm
                          font-semibold
                        "
                      >
                        {
                          getCountdown(
                            reminder.date,
                            reminder.time
                          )
                        }
                      </div>

                    </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                {!reminder.completed && (

                  <button
                    onClick={() =>
                      completeReminder(reminder._id)
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
                  >
                    Complete
                  </button>

                )}

                <button
                  onClick={() => editReminder(reminder)}
                  className="
                    bg-blue-500
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    transition-all
                    hover:scale-105
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteReminder(reminder._id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

        {filteredReminders.length === 0 && (

            <div
              className="
                mt-10
                max-w-[1050px]
                mx-auto
                bg-white/40
                backdrop-blur-2xl
                border
                border-white/20
                rounded-[32px]
                p-8 md:p-16
                text-center
                shadow-[0_10px_40px_rgba(0,0,0,0.10)]
              "
            >

                <p className="text-6xl">
                ⏰
                </p>

                <h2 className="text-3xl font-bold text-gray-700 mt-4">
                No reminders yet
                </h2>

                <p className="text-gray-500 mt-3">
                Add your first reminder to stay organized
                </p>

            </div>

            )}

      </div>

      <button
        onClick={() => {
          document
            .getElementById("add-reminder-section")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }}
        className="
          fixed
          bottom-6
          right-6
          z-40

          w-14
          h-14

          flex
          items-center
          justify-center

          rounded-full

          bg-gradient-to-r
          from-purple-600
          to-fuchsia-500

          text-white
          text-3xl
          font-bold

          shadow-xl

          md:hidden

          hover:scale-110
          transition-all
          duration-300
        "
      >
        +
      </button>

    </div>

  </>
  );
}

export default Reminders;