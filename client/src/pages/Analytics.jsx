import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

import { FaBars, FaCog, FaSignOutAlt, FaTimes, FaDownload } from "react-icons/fa";

function Analytics() {

    const user = JSON.parse(localStorage.getItem("user"));
    
    const [sidebarOpen, setSidebarOpen] = useState(
      window.innerWidth >= 1024
    );

    const profileMenuRef = useRef(null);

    const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1280);

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const navigate = useNavigate();

    const [currentStreak, setCurrentStreak] = useState(0);

    const [mostFrequentMood, setMostFrequentMood] = useState("");

    const [bestTimeOfDay, setBestTimeOfDay] = useState("");

    const [mostProductiveDay, setMostProductiveDay] = useState("");

    const [moodDistribution, setMoodDistribution] = useState([]);

    const [period, setPeriod] = useState(30);

    const [weeklyActivity, setWeeklyActivity] = useState([]);

    const [totalEntries, setTotalEntries] = useState(0);

    const [wordsWritten, setWordsWritten] = useState(0);

    const [journalActiveDay, setJournalActiveDay] = useState("");

    const [favoriteWritingTime, setFavoriteWritingTime] = useState("");

    const [averageMoodScore, setAverageMoodScore] = useState(0);

    const [totalMoodEntries, setTotalMoodEntries] = useState(0);

    const [completedRemindersCount, setCompletedRemindersCount] = useState(0);

    const [completionRate, setCompletionRate] = useState(0);

    const [emotionDistribution, setEmotionDistribution] = useState([]);
    
    const [dominantEmotion, setDominantEmotion] = useState("");
    
    const [positiveRatio, setPositiveRatio] = useState(0);
    
    const [stressIndex, setStressIndex] = useState(0);
    
    const [emotionalStability, setEmotionalStability] = useState("");
    
    const [weeklyAISummary, setWeeklyAISummary] = useState("");
    
    const [patternDetector, setPatternDetector] = useState([]);

    const [emotionalGrowth, setEmotionalGrowth] = useState([]);

    const [growthPercentage, setGrowthPercentage] = useState(0);

    const [currentEmotionalScore, setCurrentEmotionalScore] = useState(0);

    const [growthInsight, setGrowthInsight] = useState("");

    const [burnoutScore, setBurnoutScore] = useState(0);

    const [burnoutRisk, setBurnoutRisk] = useState("");

    const [burnoutReasons, setBurnoutReasons] = useState([]);

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

      fetchAnalyticsSummary();

  }, [period]);

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

    const fetchAnalyticsSummary = async () => {

    try {

        const response = await API.get(
          `/analytics-summary/${user.email}?period=${period}`
      );

        setCurrentStreak(
        response.data.currentStreak
        );

        setMostFrequentMood(
        response.data.mostFrequentMood
        );

        setBestTimeOfDay(
        response.data.bestTimeOfDay
        );

        setMostProductiveDay(
        response.data.mostProductiveDay
        );

        setMoodDistribution(
            response.data.moodDistribution
        );

        setWeeklyActivity(
            response.data.weeklyActivity
        );

        setTotalEntries(
            response.data.totalEntries
        );

        setWordsWritten(
            response.data.wordsWritten
        );

        setJournalActiveDay(
            response.data.journalActiveDay
        );

        setFavoriteWritingTime(
            response.data.favoriteWritingTime
        );

        setAverageMoodScore(
            response.data.averageMoodScore
        );

        setTotalMoodEntries(
            response.data.totalMoodEntries
        );

        setCompletedRemindersCount(
            response.data.completedReminders
        );

        setCompletionRate(
            response.data.completionRate
        );

        setEmotionDistribution(
          response.data.emotionDistribution
        );

        setDominantEmotion(
          response.data.dominantEmotion
        );

        setPositiveRatio(
          response.data.positiveRatio
        );

        setStressIndex(
          response.data.stressIndex
        );

        setEmotionalStability(
          response.data.emotionalStability
        );

        setWeeklyAISummary(
          response.data.weeklyAISummary
        );

        setPatternDetector(
          response.data.patternDetector
        );

        setEmotionalGrowth(
          response.data.emotionalGrowth
        );

        setGrowthPercentage(
          response.data.growthPercentage
        );

        setCurrentEmotionalScore(
          response.data.currentEmotionalScore
        );

        setGrowthInsight(
          response.data.growthInsight
        );

        setBurnoutScore(
          response.data.burnoutScore
        );

        setBurnoutRisk(
          response.data.burnoutRisk
        );

        setBurnoutReasons(
          response.data.burnoutReasons
        );

    }

    catch (error) {

        console.log(error);

    }

    };

    const COLORS = [

    "#9333ea",
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#ec4899"

    ];

    const topMood = [...moodDistribution].sort(
        (a, b) => b.value - a.value
        )[0];

        const centerEmoji =
        topMood?.name.split(" ").slice(-1)[0] || "😊";

    const achievements = [

      {
        emoji: "🏆",
        title: "Consistency Champion",
        description: "Completed 80% of reminders",
        unlocked: completionRate >= 80
      },

      {
        emoji: "🔥",
        title: "Streak Master",
        description: "Maintain a 7-day streak",
        unlocked: currentStreak >= 7
      },

      {
        emoji: "✍️",
        title: "Writer Soul",
        description: "Write over 1000 words",
        unlocked: wordsWritten >= 1000
      },

      {
        emoji: "📖",
        title: "Journal Guru",
        description: "Create 10 journal entries",
        unlocked: totalEntries >= 10
      },

      {
        emoji: "😊",
        title: "Positive Spirit",
        description: "Average mood above 4",
        unlocked: averageMoodScore >= 4
      },

      {
        emoji: "🌸",
        title: "Joyful Heart",
        description: "Happy is your dominant mood",
        unlocked:
          mostFrequentMood.includes("Happy")
      },

      {
        emoji: "🌞",
        title: "Early Bird",
        description: "Morning is your favorite time",
        unlocked:
          favoriteWritingTime.includes("Morning")
      },

      {
        emoji: "🧠",
        title: "Mindfulness Master",
        description: "Maintain a 30-day streak",
        unlocked: currentStreak >= 30
      }

    ];

    const unlockedCount = achievements.filter(
      achievement => achievement.unlocked
    ).length;

    const percentage = Math.round(
      (unlockedCount / achievements.length) * 100
    );

    const wellnessScore = Math.round(

      (
        averageMoodScore * 20 +

        completionRate +

        Math.min(currentStreak * 2, 20) +

        Math.min(totalEntries * 2, 20)
      ) / 1.6

    );

    const wellnessLabel =

      wellnessScore >= 85

        ? "Excellent 🌸"

        : wellnessScore >= 70

        ? "Very Good ✨"

        : wellnessScore >= 55

        ? "Good 🌷"

        : wellnessScore >= 40

        ? "Needs Attention 🌿"

        : "Low ❤️";

    const downloadWellnessReport = async () => {

      try {

        const response = await API.get(
          `/download-wellness-report/${user.email}?period=${period}`,
          {
            responseType: "blob"
          }
        );

        const file = new Blob(
          [response.data],
          {
            type: "application/pdf"
          }
        );

        const fileURL = window.URL.createObjectURL(file);

        const link = document.createElement("a");

        link.href = fileURL;

        link.download = "Wellness_Report.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

      }

      catch (error) {

        console.log(error);

      }

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
    
    <div
    className="
    flex
    flex-col
    sm:flex-row
    sm:justify-between
    gap-4
    "
    >
    
        <div
        className="
        ml-12
        sm:ml-14
        "
        >
    
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
    
            <h1
            className="
            text-xl
            sm:text-2xl
            md:text-4xl
            font-bold
            text-gray-800
            whitespace-nowrap
            "
            >
                Analytics Dashboard
            </h1>
    
           <p
          className="
          text-xs
          sm:text-[15px]
          text-gray-500
          leading-5
          max-w-[230px]
          "
          >
                Track your progress and discover meaningful insights
            </p>
    
        </div>
    
        <div
        className="
        hidden sm:flex
        items-center
        gap-4
        ml-auto
        "
        >
    
            <div
                className="
                    hidden
                    sm:block

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
                        hidden
                        sm:flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        md:w-14
                        md:h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-500
                        text-white
                        font-bold
                        text-xl
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
              !isMobileOrTablet &&
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
className="
lg:mt-12
sm:mt-4
bg-white/50
backdrop-blur-xl
rounded-[40px]
shadow-xl
p-10
"
>

    <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800">

        Your Wellness Journey

    </h1>

    <p className="text-center text-gray-500 mt-3 text-lg">

        A snapshot of your emotional health and productivity

    </p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 items-center">

    <div>

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            snap-x
            sm:grid
            sm:grid-cols-2
            no-scrollbar
            pb-2
          "
        >
            <div
              className="
                min-w-[180px]
                snap-start
                bg-white
                rounded-3xl
                p-5
                shadow-md

                sm:min-w-0
                sm:p-6
              "
            >

                <p className="text-gray-500 mt-3">
                    Current Streak
                </p>

                <h2 className="text-2xl sm:text-4xl font-bold text-orange-500 mt-2">
                    {currentStreak}
                </h2>
            </div>


            <div
              className="
                min-w-[180px]
                snap-start
                bg-white
                rounded-3xl
                p-5
                shadow-md

                sm:min-w-0
                sm:p-6
              "
            >

                <p className="text-gray-500 mt-3">
                    Most Frequent Mood
                </p>

                <h2 className="text-3xl font-bold text-green-500 mt-2">
                    {mostFrequentMood}
                </h2>

            </div>


            <div
              className="
                min-w-[180px]
                snap-start
                bg-white
                rounded-3xl
                p-5
                shadow-md

                sm:min-w-0
                sm:p-6
              "
            >

                <p className="text-gray-500 mt-3">
                    Best Time
                </p>

                <h2 className="text-3xl font-bold text-purple-600 mt-2">
                    {bestTimeOfDay}
                </h2>

            </div>


            <div
              className="
                min-w-[180px]
                snap-start
                bg-white
                rounded-3xl
                p-5
                shadow-md

                sm:min-w-0
                sm:p-6
              "
            >

                <p className="text-gray-500 mt-3">
                    Productive Day
                </p>

                <h2 className="text-3xl font-bold text-pink-500 mt-2">
                    {mostProductiveDay}
                </h2>

            </div>

        </div>

    </div>

    <div className="flex flex-col items-center">

        <div
            className="
            w-40
            h-40
            sm:w-56
            sm:h-56
            rounded-full
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            shadow-[0_20px_80px_rgba(168,85,247,0.4)]
            flex
            flex-col
            justify-center
            items-center
            text-white
            "
        >

            <h1 className="text-5xl sm:text-7xl font-bold">
                {wellnessScore}
            </h1>

            <p className="text-xl">
                /100
            </p>

        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mt-6">
            {wellnessLabel}
        </h2>

        <p className="text-gray-500 mt-3">
            Keep showing up for yourself
        </p>

    </div>

</div>
    
</div>

<div
  className="
    flex
    flex-col
    sm:flex-row
    items-stretch
    sm:items-center
    sm:justify-between
    gap-4
    mt-10
    mb-6
  "
>

  <div className="w-full sm:w-auto">

    <h2 className="text-3xl font-bold text-gray-800">
      Analytics Overview
    </h2>

    <p className="text-gray-500 mt-1">
      Visualize your moods and activity trends
    </p>

    <button

      onClick={downloadWellnessReport}

      className="
      mt-5
      w-full
      sm:w-fit
      flex
      justify-center
      items-center
      gap-3
      px-6
      py-3
      rounded-2xl
      bg-gradient-to-r
      from-purple-600
      to-pink-500
      text-white
      font-semibold
      shadow-lg
      hover:scale-105
      transition-all
      duration-300
      cursor-pointer
      "

    >

      <FaDownload />

      Download Wellness Report

    </button>

  </div>

  <select
    value={period}
    onChange={(e) =>
      setPeriod(Number(e.target.value))
    }
    className="
      w-full
      sm:w-auto
      max-w-full
      px-5
      py-3
      rounded-2xl
      bg-white/70
      backdrop-blur-xl
      border
      border-purple-200
      shadow-md
      outline-none
      text-gray-700
      font-medium
    "
  >

    <option value={7}>
      Last 7 Days
    </option>

    <option value={30}>
      Last 30 Days
    </option>

    <option value={90}>
      Last 90 Days
    </option>

    <option value={0}>
      All Time
    </option>

  </select>

</div>

<div className="grid lg:grid-cols-2 gap-8 mt-10">

    <div
    className="
    bg-white/50
    backdrop-blur-xl
    rounded-[35px]
    shadow-xl
    p-5 sm:p-10
    "
    >

  <div className="mb-8">

    <h2 className="text-3xl font-bold text-slate-900">

      Mood Distribution

    </h2>

    <p className="text-gray-500 mt-2">

      How you felt this month

    </p>

  </div>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-8">

  <div className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] relative">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={moodDistribution}
          innerRadius={70}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >

          {
            moodDistribution.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))
          }

        </Pie>

      </PieChart>

    </ResponsiveContainer>

    <div
      className="
      absolute
      left-1/2
      top-1/2
      -translate-x-1/2
      -translate-y-1/2
      w-24
      h-24
      rounded-full
      bg-white
      shadow-lg
      flex
      items-center
      justify-center
      text-2xl sm:text-4xl
    "
    >

      {centerEmoji}

    </div>

  </div>

  <div className="space-y-4 shrink-0">

    {

      moodDistribution.map((item, index) => {

        const total = moodDistribution.reduce(
          (sum, mood) => sum + mood.value,
          0
        );

        const percentage = Math.round(
          (item.value / total) * 100
        );

        return (

          <div
            key={index}
            className="flex items-center gap-4"
          >

            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length]
              }}
            />

            <span className="text-gray-800 text-sm md:text-base w-[95px] md:w-[120px">

              {item.name}

            </span>

            <span className="font-semibold text-gray-600">

              {percentage}%

            </span>

          </div>

        );

      })

    }

  </div>

</div>

</div>

<div
  className="
  bg-white/50
  backdrop-blur-xl
  rounded-[35px]
  shadow-xl
  p-10
  "
>

  <div className="mb-8">

    <h2 className="text-3xl font-bold text-slate-900">

      Weekly Activity

    </h2>

    <div
    className="
    flex
    justify-center
    gap-3
    overflow-x-auto
    whitespace-nowrap
    mt-6
    pb-2

    sm:overflow-visible
    sm:gap-10
    "
    >

      <div className="flex items-center gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-purple-500"></div>
        <span className="text-[11px] sm:text-base text-gray-700">
          Reminders Completed
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-pink-500"></div>
        <span className="text-[11px] sm:text-base text-gray-700">
          Journal Entries
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500"></div>
        <span className="text-[11px] sm:text-base text-gray-700">
          Mood Entries
        </span>
      </div>

    </div>

    </div>

  <ResponsiveContainer
    width="100%"
    height={window.innerWidth < 640 ? 250 : 350}
  >

    <BarChart
      data={weeklyActivity}
    >

      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
      />

      <XAxis
        dataKey="day"
      />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="reminders"
        radius={[8,8,0,0]}
        fill="#9333ea"
        name="Completed Reminders"
      />

      <Bar
        dataKey="journals"
        radius={[8,8,0,0]}
        fill="#ec4899"
        name="Journal Entries"
      />

      <Bar
        dataKey="moods"
        radius={[8,8,0,0]}
        fill="#3b82f6"
        name="Mood Entries"
      />

    </BarChart>

  </ResponsiveContainer>

</div>

</div>

<div
className="
mt-12

flex
overflow-x-auto
gap-6
pb-4

lg:grid
lg:grid-cols-2

max-w-[1050px]
mx-auto
lg:pl-16

snap-x
no-scrollbar
"
>

  <div
  className="
  min-w-[90%]
  snap-start

  bg-white/50
  backdrop-blur-xl
  rounded-[35px]
  shadow-xl
  p-6

  lg:bg-transparent
  lg:shadow-none
  lg:p-0
  lg:min-w-0
  "
  >

    <h2 className="text-3xl text-center font-bold text-gray-800 mb-8">
      Journal Insights 
    </h2>

    <div className="space-y-5">

      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Total Entries
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mt-3">
          {totalEntries}
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Words Written
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mt-3">
          {wordsWritten}
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Most Active Day
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mt-3">
          {journalActiveDay}
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Favorite Writing Time
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 mt-3">
          {favoriteWritingTime}
        </h2>
      </div>

    </div>

  </div>

  <div
  className="
  min-w-[90%]
  snap-start

  bg-white/50
  backdrop-blur-xl
  rounded-[35px]
  shadow-xl
  p-6

  lg:bg-transparent
  lg:shadow-none
  lg:p-0
  lg:min-w-0
  "
  >

    <h2 className="text-3xl text-center font-bold text-gray-800 mb-8">
      Monthly Summary 
    </h2>

    <div className="space-y-5">

      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      min-w-[240px]
      flex-shrink-0

      lg:min-w-0
      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Average Mood
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mt-3">
          {averageMoodScore}/5 
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Mood Entries
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 mt-3">
          {totalMoodEntries}
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Completed Tasks
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mt-3">
          {completedRemindersCount}
        </h2>
      </div>


      <div
      className="
      bg-white/50
      backdrop-blur-xl
      rounded-3xl
      px-8
      py-6
      shadow-lg

      w-full

      lg:max-w-[500px]
      "
      >
        <p className="text-gray-500">
          Completion Rate
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mt-3">
          {completionRate}%
        </h2>
      </div>

    </div>

  </div>

</div>

<div className="mt-20">

  <h2 className="text-4xl font-bold text-center text-gray-800">
    Journal Sentiment Insights
  </h2>

  <p className="text-center text-gray-500 mt-3">
    Understand your emotional patterns through your journal entries
  </p>

  <div
    className="
    flex
    gap-5
    overflow-x-auto
    no-scrollbar
    mt-10

    lg:grid
    lg:grid-cols-4
    "
  >

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">Dominant Emotion</p>
      <h2 className="text-3xl font-bold text-pink-500 mt-4">
        {dominantEmotion}
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">Positive Ratio</p>
      <h2 className="text-3xl font-bold text-green-500 mt-4">
        {positiveRatio}%
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">Stress Index</p>
      <h2 className="text-3xl font-bold text-red-500 mt-4">
        {stressIndex}%
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">Emotional Stability</p>
      <h2 className="text-2xl font-bold text-purple-600 mt-4">
        {emotionalStability}
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">
        Emotional Growth
      </p>

      <h2 className="text-3xl font-bold text-green-500 mt-4">
        +{growthPercentage}%
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">
      <p className="text-gray-500">
        Emotional Score
      </p>

      <h2 className="text-3xl font-bold text-purple-700 mt-4">
        {currentEmotionalScore}
      </h2>
    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">

      <p className="text-gray-500">

        Burnout Risk

      </p>

      <h2
        className={`
          text-3xl
          font-bold
          mt-4

          ${
            burnoutRisk === "Low"
              ? "text-green-500"
              : burnoutRisk === "Moderate"
              ? "text-orange-500"
              : "text-red-500"
          }
        `}
      >

        {burnoutRisk}

      </h2>

    </div>

    <div className="min-w-[220px] bg-white/50 backdrop-blur-xl rounded-[35px] p-8">

      <p className="text-gray-500">

        Burnout Score

      </p>

      <h2 className="text-3xl font-bold text-purple-700 mt-4">

        {burnoutScore}/100

      </h2>

    </div>

  </div>

  <div
    className="
    grid
    lg:grid-cols-2
    gap-8
    mt-12
    items-stretch
    "
  >

    <div
      className="
      bg-gradient-to-r
      from-purple-50
      to-pink-50
      rounded-[40px]
      p-10
      shadow-xl
      border
      border-purple-100
      "
    >

      <h2 className="text-4xl font-bold text-purple-700">
        Weekly AI Insight
      </h2>

      <p className="text-gray-700 text-lg leading-9 mt-8">
        {weeklyAISummary}
      </p>

      <div
      className="
      mt-8
      bg-white/80
      rounded-3xl
      p-6
      shadow-md
      "
      >
        <h3 className="text-2xl font-bold text-green-600">
          Growth Insight
        </h3>

        <p className="text-gray-700 mt-4 leading-8">
          {growthInsight}
        </p>
      </div>

      <div className="mt-12">

        <h3 className="text-2xl font-bold text-red-500 mb-6">

          Burnout Indicators

        </h3>

        <div className="space-y-4 mb-10">

          {

            burnoutReasons.map((reason,index)=>(

              <div
                key={index}
                className="
                bg-red-50
                rounded-3xl
                px-6
                py-5
                border
                border-red-100
                "
              >

                <p className="text-gray-700">

                  ⚠️ {reason}

                </p>

              </div>

            ))

          }

        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Pattern Highlights
        </h3>

        <div className="space-y-4">

          {
            patternDetector.map((pattern, index) => (

              <div
                key={index}
                className="
                bg-white/80
                rounded-3xl
                px-6
                py-5
                shadow-md
                "
              >
                <p className="text-gray-700 text-lg">
                  ✓ {pattern}
                </p>
              </div>

            ))
          }

        </div>

      </div>

    </div>

    <div
      className="
      bg-white/70
      backdrop-blur-xl
      rounded-[40px]
      shadow-xl
      border
      border-purple-100
      p-10
      h-full
      "
      >

      <h3 className="text-2xl font-bold text-gray-800 mb-8">
        Emotional Growth Trend
      </h3>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={emotionalGrowth}
            margin={{
              top: 20,
              right: 20,
              left: -20,
              bottom: 5
            }}
          >

            <defs>

              <linearGradient
                id="growthGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#9333ea"
                  stopOpacity={0.45}
                />

                <stop
                  offset="100%"
                  stopColor="#9333ea"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e9d5ff"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#6b7280",
                fontSize: 13
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{
                fill: "#6b7280",
                fontSize: 13
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                stroke: "#9333ea",
                strokeWidth: 1
              }}
              contentStyle={{
                borderRadius: "20px",
                border: "none",
                background: "#ffffff",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)"
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#9333ea"
              strokeWidth={4}
              fill="url(#growthGradient)"
              dot={{
                r: 7,
                strokeWidth: 3,
                stroke: "#ffffff",
                fill: "#9333ea"
              }}
              activeDot={{
                r: 10,
                strokeWidth: 4,
                stroke: "#ffffff",
                fill: "#9333ea"
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>

<div className="mt-20">

  <h2 className="text-4xl font-bold text-center text-gray-800">

    Achievements 

  </h2>

  <p className="text-center text-gray-500 mt-3">

    {unlockedCount} / 8 badges unlocked

  </p>

  <div className="max-w-xl mx-auto mt-5">

    <div className="h-4 rounded-full bg-gray-200 overflow-hidden">

      <div
        className="
          h-full
          bg-gradient-to-r
          from-purple-600
          to-pink-500
          rounded-full
          transition-all
          duration-700
        "
        style={{
          width: `${percentage}%`
        }}
      />

    </div>

    <p className="text-center mt-3 text-gray-500">

      {percentage}% completed

    </p>

  </div>

  <div
  className="
  mt-8

  flex
  overflow-x-auto
  gap-5
  pb-3

  sm:grid
  sm:grid-cols-2

  lg:grid-cols-3
  xl:grid-cols-4

  no-scrollbar
  "
  >

    {

      achievements.map((achievement, index) => (

        <div

          key={index}

          className={`
            min-w-[270px]
            flex-shrink-0

            sm:min-w-0

            rounded-[35px]
            p-8
            shadow-xl

            ${
              achievement.unlocked
                ? `
                  bg-white/50
                  backdrop-blur-xl
                  `
                : `
                  bg-gray-100/60
                  opacity-60
                  `
            }
        `}
        >

          <div

            className={`

              w-16
              h-16
              sm:w-20
              sm:h-20
              rounded-full
              flex
              items-center
              justify-center
              text-3xl sm:text-4xl
              shadow-lg

              ${
                achievement.unlocked

                  ?

                  `
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  `

                  :

                  `
                  bg-gray-300
                  `
              }

            `}
          >

            {

              achievement.unlocked

                ?

                achievement.emoji

                :

                "🔒"

            }

          </div>


          <h2 className="text-xl sm:text-2xl font-bold mt-6 text-gray-800">

            {achievement.title}

          </h2>

          <p className="text-gray-500 mt-3">

            {achievement.description}

          </p>


          <div className="mt-5">

            {

              achievement.unlocked

                ?

                <div className="
                absolute
                top-5
                right-5
                bg-green-100
                text-green-600
                px-3 py-1
                rounded-full
                text-sm
                font-semibold
                ">
                Unlocked
                </div>

                :

                <span className="text-gray-400 font-semibold">
                  Locked
                </span>

            }

          </div>

        </div>

      ))

    }

  </div>

</div>

  </div>

</div>

</>

);

}

export default Analytics;