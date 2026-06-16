import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import MoodChart from "../components/MoodChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

function MoodTracker() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const navigate = useNavigate();

  const chartRef = useRef(null);

  const [moods, setMoods] = useState([]);

  const [timeRange, setTimeRange] = useState("7");

  const [loading, setLoading] = useState(true);

  const [aiInsight, setAiInsight] = useState("");

  const [correlationInsight, setCorrelationInsight] = useState("");
  
  const [insightLoading, setInsightLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedMood, setSelectedMood] = useState(null);

  const [selectedMoodEntry, setSelectedMoodEntry] = useState(null);

  const [showMoodModal, setShowMoodModal] = useState(false);

  const [moodNote, setMoodNote] = useState("");

  const [journalEntries, setJournalEntries] = useState([]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const profileMenuRef = useRef(null);

  const [stats, setStats] = useState({
    average_score: 0,
    entries: 0
  });

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
      window.innerWidth < 1280
      );

  const moodDistribution = moods.reduce((acc, mood) => {

    acc[mood.mood] = (acc[mood.mood] || 0) + 1;

    return acc;

    }, {});

  useEffect(() => {

    fetchMoods();
    fetchStats();
    fetchAIInsight();
    fetchCorrelationInsight();

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

  const fetchMoods = async () => {
    try {
        setLoading(true);

        const response = await API.get(
        `/moods?email=${user.email}`
        );

        setMoods(response.data);

        fetchAIInsight();

    } catch (error) {
        console.log(error);

    } finally {
        setLoading(false);
    }
    };

  const fetchStats = async () => {

    try {

      const response = await API.get(
        `/mood-stats?email=${user.email}`
      );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchAIInsight = async () => {

    try {

        setInsightLoading(true);

        const response =
        await API.get(
            `/api/ai-insight?email=${user.email}`
        );

        console.log(response.data);

        setAiInsight(
        response.data.insight
        );

    } catch (error) {

        console.log(error);

    } finally {

        setInsightLoading(false);

    }

    };

    const fetchCorrelationInsight = async () => {

        try {

            const response =
            await API.get(
                `/api/mood-correlation?email=${user.email}`
            );

            setCorrelationInsight(
                response.data.insight
            );

        } catch (error) {

            console.log(error);
        }
    };

    const fetchJournalForMood = async (date) => {
    try {

        const response = await API.get(
        `/journal-by-date?email=${user.email}&date=${date}`
        );

        setJournalEntries(response.data);

    } catch (err) {

        console.log(err);

        setJournalEntries([]);
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
    
        await fetchMoods();
        await fetchStats();
        await fetchAIInsight();
        await fetchCorrelationInsight();
    
        setSelectedMood(null);
        setMoodNote("");
        setShowMoodModal(false);
    
      } catch (error) {
    
        console.log(error);
    
        alert("Failed to save mood");
    
      }
    };

    const recentMoods = moods.slice(-7);

    const filteredMoods = moods.filter((mood) => {

    const moodDate = new Date(mood.date);
    const today = new Date();

    if (timeRange === "7") {

        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        return moodDate >= weekAgo;

    }

    if (timeRange === "30") {

        return (
        moodDate.getMonth() === today.getMonth() &&
        moodDate.getFullYear() === today.getFullYear()
        );

    }

    if (timeRange === "365") {

        return (
        moodDate.getFullYear() === today.getFullYear()
        );

    }

    return true;
    });

    const chartData = {
        labels: filteredMoods.map(
            mood =>
            new Date(mood.date).toLocaleDateString(
                "en-IN",
                {
                day: "numeric",
                month: "short",
                }
            )
        ),

        datasets: [
            {
            label: "Mood",

            data: filteredMoods.map(
                mood => mood.score
            ),

            borderColor: "#8b5cf6",

            borderWidth: 4,

            tension: 0.45,

            fill: true,

            pointRadius: 6,

            pointHoverRadius: 10,

            pointBackgroundColor: "#8b5cf6",

            pointBorderColor: "#fff",

            pointBorderWidth: 3,

            backgroundColor: (context) => {
                const chart = context.chart;

                const { ctx, chartArea } = chart;

                if (!chartArea) return null;

                const gradient =
                ctx.createLinearGradient(
                    0,
                    chartArea.top,
                    0,
                    chartArea.bottom
                );

                gradient.addColorStop(
                0,
                "rgba(168,85,247,0.25)"
                );

                gradient.addColorStop(
                1,
                "rgba(168,85,247,0)"
                );

                return gradient;
            }
            }
        ]
        };

    const chartOptions = {
        responsive: true,

        maintainAspectRatio: false,

        animation: {
            duration: 1800,

            easing: "easeInOutQuart",
        },

        transitions: {
            active: {
            animation: {
                duration: 800,
            }
            }
        },

        interaction: {
            intersect: false,
            mode: "index",
        },

        plugins: {

            legend: {
            display: false,
            },

            tooltip: {

            backgroundColor: "#fff",

            titleColor: "#111827",

            bodyColor: "#6b7280",

            borderColor: "#8b5cf6",

            borderWidth: 1,

            padding: 14,

            cornerRadius: 12,

            displayColors: false,

            callbacks: {

                title: (items) =>
                filteredMoods[
                    items[0].dataIndex
                ]?.date_only,

                label: (context) => {

                const mood =
                    filteredMoods[
                    context.dataIndex
                    ];

                return `${mood.emoji} ${mood.mood}`;
                }
            }
            },

            datalabels: {

            align: "top",

            anchor: "end",

            offset: 10,

            formatter: (_, context) =>
                filteredMoods[
                context.dataIndex
                ]?.emoji || "",

            font: {
                size: window.innerWidth < 640 ? 14 : 22
            }
            }
        },

        scales: {

            x: {

            grid: {

                color:
                "rgba(139,92,246,0.10)",

                borderDash: [5, 5],

                drawBorder: false,

                
            },

            ticks: {
                color: "#6b7280",
                font: {
                    size: 14,
                    weight: "700"
                }
            }
            },

            y: {

            min: 1,

            max: 5,

            ticks: {

                stepSize: 1,

                font: {
                    size: window.innerWidth < 640 ? 10 : 14,
                    weight: "700"
                    },

                callback: (value) => {

                const map = {
                    5: "😊 5",
                    4: "😌 4",
                    3: "😐 3",
                    2: "😔 2",
                    1: "😢 1",
                };

                return map[value];
                }
            },

            grid: {

                color:
                "rgba(139,92,246,0.10)",

                borderDash: [5, 5],

                drawBorder: false,
            }
            }
        }
        };

    const glowPlugin = {
        id: "glowPlugin",

        beforeDatasetsDraw(chart) {

            const {
            ctx
            } = chart;

            chart.data.datasets.forEach(
            (dataset, i) => {

                const meta =
                chart.getDatasetMeta(i);

                meta.data.forEach(
                point => {

                    ctx.save();

                    ctx.shadowColor =
                    "#a855f7";

                    ctx.shadowBlur = 18;

                    ctx.shadowOffsetX = 0;

                    ctx.shadowOffsetY = 0;

                    point.draw(ctx);

                    ctx.restore();
                }
                );
            }
            );
        }
        };

    const distributionData = {

        labels: Object.keys(moodDistribution),

        datasets: [
            {
            data: Object.values(moodDistribution),

            backgroundColor: [
                "#8B5CF6",
                "#EC4899",
                "#F59E0B",
                "#10B981",
                "#EF4444"
            ],

            borderWidth: 0
            }
        ]
        };

            const moodColors = {
                Happy: "bg-green-100",
                Calm: "bg-green-100",
                Neutral: "bg-yellow-100",
                Low: "bg-orange-100",
                Sad: "bg-red-100",
                };

                const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
                ];

                const weekdays = [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
                ];

                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();

                const firstDay = new Date(
                year,
                month,
                1
                );

                const lastDay = new Date(
                year,
                month + 1,
                0
                );

                const daysInMonth =
                lastDay.getDate();

                let startingDay =
                firstDay.getDay();

                startingDay =
                startingDay === 0
                    ? 6
                    : startingDay - 1;

                const moodMap = {};

                moods.forEach((mood) => {

                const d = new Date(mood.date);

                const moodYear =
                    d.getFullYear();

                const moodMonth =
                    d.getMonth();

                const moodDay =
                    d.getDate();

                const key =
                    `${moodYear}-${moodMonth}-${moodDay}`;

                moodMap[key] = mood;
                });

                const calendarCells = [];

                for (
                let i = 0;
                i < startingDay;
                i++
                ) {
                calendarCells.push(null);
                }

                for (
                let day = 1;
                day <= daysInMonth;
                day++
                ) {

                const key =
                    `${year}-${month}-${day}`;

                calendarCells.push({
                    day,
                    mood: moodMap[key] || null,
                });
                }

                const previousMonth = () => {

                setCurrentMonth(
                    new Date(
                    year,
                    month - 1,
                    1
                    )
                );
                };

                const nextMonth = () => {

                setCurrentMonth(
                    new Date(
                    year,
                    month + 1,
                    1
                    )
                );
                };

                const moodSnapshots = {
                Happy:
                    "You were feeling joyful and optimistic today. Celebrate the positive moments and carry that energy forward.",

                Calm:
                    "You experienced emotional balance and inner peace today. A calm mind is a powerful foundation for well-being.",

                Neutral:
                    "Your emotions remained steady and balanced today. Small moments of gratitude can make an ordinary day meaningful.",

                Low:
                    "You faced some emotional challenges today, but you continued moving forward. Every step counts, even on difficult days.",

                Sad:
                    "Today may have felt emotionally heavy. Be gentle with yourself and remember that difficult feelings are temporary."
                };

                const moodCounts = moods.reduce((acc, mood) => {
                    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
                    return acc;
                    }, {});

                    const totalMoods = moods.length;

                    const moodBreakdown = [
                    {
                        mood: "Happy",
                        emoji: "😊",
                        count: moodCounts.Happy || 0,
                        color: "bg-green-500",
                    },
                    {
                        mood: "Calm",
                        emoji: "😌",
                        count: moodCounts.Calm || 0,
                        color: "bg-emerald-500",
                    },
                    {
                        mood: "Neutral",
                        emoji: "😐",
                        count: moodCounts.Neutral || 0,
                        color: "bg-yellow-500",
                    },
                    {
                        mood: "Low",
                        emoji: "😔",
                        count: moodCounts.Low || 0,
                        color: "bg-orange-500",
                    },
                    {
                        mood: "Sad",
                        emoji: "😢",
                        count: moodCounts.Sad || 0,
                        color: "bg-red-500",
                    },
                    ];

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
      
              <div className="flex-1 min-w-0 ml-12 sm:ml-14 lg:ml-0 pr-2">
      
                <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="
                                    lg:hidden
                
                                    fixed
                                    top-7
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
              Mood Tracker
            </h1>

           <p className="text-xs sm:text-[15px] text-gray-500">
              Track your emotions. Understand yourself better.
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

            <div
            id="mood-selector"
                className="
                    w-full
                    max-w-5xl

                    mx-auto

                    rounded-[24px]
                    md:rounded-[32px]

                    p-5
                    sm:p-6
                    md:p-8

                    shadow-xl

                    bg-gradient-to-r
                    from-[#f3e8ff]
                    to-[#fde7ef]

                    flex
                    flex-col
                    lg:flex-row

                    items-center
                    justify-between

                    gap-6
                    md:gap-8

                    mb-10
                    mt-8
                "
                >

                <div
                    className="
                        flex-1
                        text-center
                        lg:text-left
                    "
                    >

                <h2
                    className="
                        text-2xl
                        sm:text-3xl
                        md:text-5xl
                        font-bold
                        text-purple-800
                        leading-tight
                    "
                    >
                How are you feeling today?
                </h2>

                <p
                    className="
                        text-sm
                        sm:text-base
                        text-gray-600
                        mt-3
                    "
                    >
                Your mood matters. Track it with a tap.
                </p>

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        lg:justify-start

                        gap-3
                        sm:gap-4

                        mt-6
                        md:mt-8
                    "
                    >

                {["😊","😌","😐","😔","😢"].map((emoji,index)=>(

                <button
                  key={index}
                  onClick={() => {
                    setSelectedMood(index);
                    setShowMoodModal(true);
                  }}
                  className={`
                    w-14
                    h-14

                    sm:w-16
                    sm:h-16

                    text-2xl
                    sm:text-3xl

                    rounded-full

                    bg-white

                    flex
                    items-center
                    justify-center

                    transition-all
                    duration-300
                    cursor-pointer

                    ${
                      selectedMood === index
                        ? "scale-125"
                        : "hover:scale-110"
                    }
                  `}
                  style={{
                    boxShadow:
                      selectedMood === index
                        ? index === 0
                          ? "0 0 25px #facc15" 
                          : index === 1
                          ? "0 0 25px #4ade80" 
                          : index === 2
                          ? "0 0 25px #9ca3af" 
                          : index === 3
                          ? "0 0 25px #fb923c" 
                          : "0 0 25px #60a5fa" 
                        : "0 6px 18px rgba(0,0,0,0.08)"
                  }}
                >
                  {emoji}
                </button>

                ))}

                </div>

                </div>

                <div
                    className="
                        flex
                        justify-center
                        w-full
                        lg:w-auto
                    "
                    >

                <motion.img
                src="/Meditation.png"
                alt="meditation"
                className="
                    w-[180px]
                    sm:w-[260px]
                    md:w-[320px]
                    lg:w-[350px]

                    object-contain
                    shrink-0
                    "
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

                </div>
                </div>

        <div className="bg-white rounded-3xl p-4 md:p-8 w-full max-w-[900px] mx-auto mt-10">

            <div className="
                flex
                flex-col
                md:flex-row
                gap-5
                md:justify-between
                md:items-start
                mb-8
                ">

                <div>

                    <h2
                        className="
                        text-xl
                        font-bold
                        text-[#1f1147]
                        flex
                        items-center
                        gap-2
                        "
                        >
                        <span className="md:hidden">
                            Mood Summary
                        </span>

                        <span className="hidden md:inline">
                            Mood Journey
                        </span>
                        </h2>

                    <div
                        className="
                        hidden md:inline-flex

                        mt-3
                        items-start
                        gap-3
                        px-4
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-50
                        to-pink-50
                        border
                        border-purple-100
                        max-w-xl
                        "
                        >

                        <div>

                            <p
                                className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-purple-700
                                "
                            >
                                Pattern Detected
                            </p>

                            <p
                                className="
                                text-sm
                                text-gray-600
                                leading-relaxed
                                mt-1
                                "
                            >
                                {correlationInsight}
                            </p>

                        </div>

                    </div>

                </div>

                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="
                    hidden md:block
                    px-4
                    py-2
                    rounded-xl
                    border
                    border-purple-200
                    bg-white
                    text-sm
                    font-semibold
                    "
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Current Month</option>
                    <option value="365">Current Year</option>
                </select>

            </div>

            <div className="block md:hidden mt-6 space-y-4">

            {moodBreakdown.map((item) => {

                const percentage =
                totalMoods > 0
                    ? Math.round(
                        (item.count / totalMoods) * 100
                    )
                    : 0;

                return (

                <div key={item.mood}>

                    <div className="flex justify-between mb-2">

                    <span className="font-medium text-gray-700">
                        {item.emoji} {item.mood}
                    </span>

                    <span className="text-sm text-gray-500">
                        {percentage}%
                    </span>

                    </div>

                    <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">

                    <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{
                        width: `${percentage}%`
                        }}
                    />

                    </div>

                </div>
                );
            })}

            </div>

            <div className="hidden md:block h-[260px] lg:h-[360px]">
            <MoodChart moods={filteredMoods} />
            </div>

            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mt-10 items-start">

                <div className="lg:col-span-2 bg-white rounded-[35px] p-8 shadow-xl">

                <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-2">
                        <span className="text-lg md:text-2xl"></span>

                        <h2
                        className="
                            text-base
                            sm:text-xl
                            md:text-3xl
                            font-bold
                            text-purple-800
                            whitespace-nowrap
                        "
                        >
                        Mood Calendar
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-5">

                        <button
                        onClick={previousMonth}
                        className="text-lg md:text-xl font-bold"
                        >
                        ‹
                        </button>

                        <span
                        className="
                            text-xs
                            sm:text-sm
                            md:text-base
                            font-semibold
                            text-gray-600
                            whitespace-nowrap
                        "
                        >
                        {monthNames[month]} {year}
                        </span>

                        <button
                        onClick={nextMonth}
                        className="text-lg md:text-xl font-bold"
                        >
                        ›
                        </button>

                    </div>

                    </div>

                <div className="grid grid-cols-7 gap-1 md:gap-3 mb-4">

                    {weekdays.map((day) => (

                    <div
                        key={day}
                        className="
                        text-center
                        text-sm
                        font-bold
                        text-gray-600
                        "
                    >
                        {day}
                    </div>

                    ))}

                </div>

                <div className="grid grid-cols-7 gap-3">

                    {calendarCells.map(
                    (cell, index) => {

                        if (!cell) {

                        return (
                            <div
                            key={index}
                            className="h-12"
                            />
                        );
                        }

                        return (

                        <div
                            key={index}
                            className={`
                                h-8 md:h-11
                                rounded-xl
                                flex
                                flex-col
                                items-center
                                justify-center
                                ${
                                    cell.mood
                                        ? "cursor-pointer hover:ring-2 hover:ring-purple-300"
                                        : ""
                                }
                                ${
                                    cell.mood
                                        ? moodColors[cell.mood.mood]
                                        : "bg-gray-50"
                                }
                            `}
                        >

                            <span
                            className="
                                text-[10px]
                                text-gray-500
                            "
                            >
                            {cell.day}
                            </span>

                            <span className="text-sm md:text-xl">

                            {cell.mood?.emoji || ""}

                            </span>

                        </div>

                        );
                    }
                    )}

                </div>

                <div
                className="
                    flex
                    overflow-x-auto
                    gap-2
                    mt-6
                    pb-2
                    scrollbar-hide
                "
                >
                <div className="px-2 py-1 rounded-full bg-green-100 text-xs flex-shrink-0">
                    😊 Happy
                </div>

                <div className="px-2 py-1 rounded-full bg-green-50 text-xs flex-shrink-0">
                    😌 Calm
                </div>

                <div className="px-2 py-1 rounded-full bg-yellow-100 text-xs flex-shrink-0">
                    😐 Neutral
                </div>

                <div className="px-2 py-1 rounded-full bg-orange-100 text-xs flex-shrink-0">
                    😔 Low
                </div>

                <div className="px-2 py-1 rounded-full bg-red-100 text-xs flex-shrink-0">
                    😢 Sad
                </div>
                </div>

                </div>

                <div className="bg-white rounded-[35px] p-8 shadow-xl">

                    <h2 className="text-3xl font-bold text-[#1f1147]">
                    Today's Insight
                    </h2>

                <div
                    className="
                        bg-gradient-to-br
                        from-[#faf5ff]
                        to-[#f3e8ff]
                        rounded-[22px]

                        p-4
                        md:p-6

                        h-auto
                        md:h-[320px]

                        flex
                        flex-row


                        items-center
                        justify-center

                        gap-4
                        md:gap-6

                        mt-6
                        relative
                        overflow-hidden
                    "
                    >

                    <div
                        className="
                        relative
                        flex-shrink-0

                        w-[80px]
                        md:w-auto

                        flex
                        justify-center
                        items-center
                        "
                        >

                    <div
                        className="
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-16
                        h-16
                        md:w-28
                        md:h-28
                        bg-purple-300/30
                        blur-3xl
                        rounded-full
                        
                        "
                    />

                    <img
                        src="/insight-bulb.png"
                        alt="AI Insight"
                        className="
                            relative
                            z-10
                            w-14
                            h-14

                            md:w-32
                            md:h-32

                            object-contain
                            animate-float
                            "
                    />

                    </div>

                    <div className="z-10 w-full">

                    {insightLoading ? (

                        <div
                            className="
                            animate-pulse
                            space-y-3
                            "
                        >

                            <div className="h-4 bg-purple-100 rounded" />
                            <div className="h-4 bg-purple-100 rounded" />
                            <div className="h-4 bg-purple-100 rounded" />

                        </div>

                        ) : (

                        <p
                            className="
                                text-[#3d3570]

                                text-xs
                                md:text-sm

                                leading-5
                                md:leading-7

                                text-center

                                
                                overflow-y-auto

                                px-2
                            "
                            >
                            {aiInsight}
                            </p>

                        )}

                    </div>

                </div>

                </div>

                </div>

                <div
                    className="
                        bg-white
                        rounded-[28px]
                        px-3 md:px-6
                        py-5
                        shadow-lg
                        mt-8
                        max-w-[900px]
                        mx-auto
                    "
                    >

                    <div className="flex justify-between items-center gap-2 mb-6">

                        <h2
                            className="
                                text-base
                                md:text-xl
                                font-bold
                                text-[#1f1147]
                                flex
                                items-center
                                gap-2
                                whitespace-nowrap
                            "
                            >
                            Recent Mood Entries
                            </h2>

                        <button
                            onClick={() =>
                                navigate("/mood-history")
                            }
                            className="
                                text-purple-600
                                font-semibold
                                text-xs
                                md:text-base
                                whitespace-nowrap
                                hover:text-purple-800
                                transition
                                cursor-pointer
                            "
                            >
                            View All Entries →
                            </button>

                    </div>

                    <div className="space-y-4">

                        {moods
                        .slice()
                        .reverse()
                        .slice(0, 3)
                        .map((mood, index) => {

                            const scoreColors = {
                            5: "bg-green-100 text-green-700",
                            4: "bg-green-100 text-green-700",
                            3: "bg-yellow-100 text-yellow-700",
                            2: "bg-orange-100 text-orange-700",
                            1: "bg-red-100 text-red-700",
                            };

                            const moodBg = {
                            Happy: "bg-yellow-100",
                            Calm: "bg-green-100",
                            Neutral: "bg-yellow-50",
                            Low: "bg-orange-100",
                            Sad: "bg-red-100",
                            };

                            return (

                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedMoodEntry(mood);

                                    fetchJournalForMood(
                                        mood.date_only
                                    );
                                    }}
                                className="
                                flex
                                flex-col
                                md:flex-row
                                items-start
                                md:items-center
                                justify-between
                                gap-3
                                py-3
                                border-b
                                border-gray-100
                                last:border-b-0
                                cursor-pointer
                                hover:bg-purple-50
                                rounded-xl
                                transition
                                "
                            >

                                <div className="flex items-center gap-4 flex-1 w-full">

                                <div
                                    className={`
                                    w-12
                                    h-12
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    text-3xl
                                    flex-shrink-0
                                    ${moodBg[mood.mood]}
                                    `}
                                >
                                    {mood.emoji}
                                </div>

                                <div className="flex-1">

                                <div className="flex justify-between items-center w-full">

                                    <h3 className="font-semibold text-purple-700 text-base">
                                    {mood.mood}
                                    </h3>

                                    <div
                                    className={`
                                    px-3
                                    py-1
                                    rounded-lg
                                    text-xs
                                    font-bold
                                    ${scoreColors[mood.score]}
                                    `}
                                    >
                                    {mood.score}/5
                                    </div>

                                </div>

                                <div
                                    className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-gray-500
                                    mt-1
                                    "
                                >
                                    <span>
                                    {new Date(mood.date).toLocaleDateString()}
                                    </span>

                                    <span>•</span>

                                    <span>
                                    {new Date(mood.date).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    </span>
                                </div>

                                </div>

                                </div>

                            </div>
                            );
                        })}

      </div>
    </div>
    </div>
    </div>

    {selectedMoodEntry && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-50
    "
    >

    <div
        className="
        bg-white
        rounded-[32px]
        p-5 md:p-8
        w-[95%]
        max-w-[520px]
        max-h-[85vh]
        shadow-2xl
        relative
        overflow-hidden
        "
    >

        <button
        onClick={() =>
            setSelectedMoodEntry(null)
        }
        className="
        absolute
        top-5
        right-5
        text-xl
        text-gray-400
        hover:text-gray-700
        "
        >
        ✕
        </button>

        <div
            className="
                overflow-y-auto
                max-h-[70vh]
                pr-2
            "
        >

        <div className="text-center">

        <div className="text-5xl md:text-6xl mb-4">
            {selectedMoodEntry.emoji}
        </div>

        <h2
            className="
            text-3xl
            font-bold
            text-purple-700
            "
        >
            {selectedMoodEntry.mood}
        </h2>

        <div
            className="
            mt-3
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-purple-100
            text-purple-700
            font-semibold
            "
        >
            {selectedMoodEntry.score}/5
        </div>

        <p
            className="
            mt-4
            text-gray-500
            "
        >
            {new Date(
            selectedMoodEntry.date
            ).toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
            )}
        </p>

        </div>

        <div className="space-y-4 mt-6">

        <div
            className="
            bg-gradient-to-r
            from-purple-50
            to-pink-50
            rounded-3xl
            p-5
            "
        >
            <h4 className="font-semibold text-purple-700 mb-2">
            Emotional Snapshot
            </h4>

            <p className="text-gray-600 leading-relaxed">
            {moodSnapshots[selectedMoodEntry.mood]}
            </p>
        </div>

        <div
            className="
            bg-blue-50
            rounded-3xl
            p-5
            "
        >
            <h4 className="font-semibold text-blue-700 mb-2">
            Mood Note
            </h4>

            <p className="text-gray-600">
            {selectedMoodEntry.note?.trim()
                ? selectedMoodEntry.note
                : "No mood note added."}
            </p>
        </div>

        <div
            className="
                bg-purple-50
                rounded-3xl
                p-5
            "
        >
            <h4 className="font-semibold text-purple-700 mb-4">
                Journal Entry
            </h4>

            {journalEntries.length > 0 ? (

                <div className="space-y-5">

                {journalEntries.map((journal) => (

                    <div
                        key={journal._id}
                        className="
                            bg-white
                            rounded-2xl
                            p-4
                            border
                            border-purple-100
                        "
                    >

                        <div className="flex flex-wrap gap-3 mb-3">

                            <span
                                className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-purple-100
                                    text-purple-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                {journal.category}
                            </span>

                            <span
                                className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-indigo-100
                                    text-indigo-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                {journal.mood}
                            </span>

                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {journal.title}
                        </h3>

                        <p className="text-gray-600 whitespace-pre-wrap leading-7">
                            {journal.content}
                        </p>

                    </div>

                ))}

            </div>

            ) : (

                <p className="text-gray-500">
                    No journal entry found for this day.
                </p>

            )}

        </div>

        </div>

        </div>

    </div>

    </div>

        )}

        <button
            onClick={() => {
                document
                .querySelector("#mood-selector")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }}
            className="
                md:hidden

                fixed
                bottom-5
                right-3
                z-40

                w-14
                h-14

                rounded-full

                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500

                text-white
                text-3xl
                font-bold

                flex
                items-center
                justify-center

                shadow-2xl

                hover:scale-110
                md:hidden

                transition-all
                duration-300

                z-[999]
            "
        >
            +
        </button>

        {showMoodModal && selectedMood !== null && (

      <div
        className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
        "
      >

        <div
          className="
            bg-white
            rounded-[32px]
            p-5 md:p-8
            w-[92%]
            max-w-[500px]
            shadow-2xl
          "
        >

          <div className="text-center">

            <div className="text-6xl mb-3">
              {moodData[selectedMood].emoji}
            </div>

            <h2 className="text-3xl font-bold text-purple-700">
              {moodData[selectedMood].mood}
            </h2>

            <p className="text-gray-500 mt-2">
              What caused this mood today?
            </p>

          </div>

          <textarea
            value={moodNote}
            onChange={(e) =>
              setMoodNote(e.target.value)
            }
            maxLength={200}
            rows={5}
            placeholder="Write a short reflection..."
            className="
              w-full
              mt-6
              border
              border-purple-200
              rounded-2xl
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-purple-300
            "
          />

          <div className="text-right text-xs text-gray-400 mt-1">
            {moodNote.length}/200
          </div>

          <div className="flex gap-4 mt-6">

            <button
              onClick={() => {
                setShowMoodModal(false);
                setMoodNote("");
              }}
              className="
                flex-1
                py-3
                rounded-xl
                bg-gray-100
                cursor-pointer
              "
            >
              Skip
            </button>

            <button
              onClick={saveMood}
              className="
                flex-1
                py-3
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500
                text-white
                font-semibold
                cursor-pointer
              "
            >
              Save Mood
            </button>

          </div>

        </div>

      </div>

      )}

        </>
    );
}

export default MoodTracker;