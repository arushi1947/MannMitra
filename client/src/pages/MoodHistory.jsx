import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import MoodChart from "../components/MoodChart";
import ReactMarkdown from "react-markdown";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import coverTemplate from "../assets/cover-template.png";
import snapshotTemplate from "../assets/second-page-template.png";
import timelineTemplate from "../assets/third-page-template.png";
import fourthPageTemplate from "../assets/fourth-page-template.png";
import fifthPageTemplate from "../assets/fifth-page-template.png";
import sixthPageTemplate from "../assets/sixth-page-template.png";
import { useNavigate } from "react-router-dom";

function MoodHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [moods, setMoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlySummary, setMonthlySummary] = useState("");
  const [editingMood, setEditingMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
      window.innerWidth < 1280
      );
  
  const navigate = useNavigate();
  
  const [editForm, setEditForm] = useState({
    mood: "",
    emoji: "",
    score: 0,
    note: ""
    });

  const reportRef = useRef();
  const chartRef = useRef(null);

  useEffect(() => {
    fetchMoods();
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

  useEffect(() => {

    fetchSummary();

    }, [selectedMonth]);

  const fetchMoods = async () => {
    try {
      const res = await API.get(
        `/moods?email=${user.email}`
      );

      setMoods(res.data.reverse());

      console.log(res.data);

      if (res.data.length > 0) {
        const latestMonth =
            res.data[0].date_only.slice(0, 7);

        setSelectedMonth(latestMonth);
        }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMood = async (id) => {
    try {
        await API.delete(`/moods/${id}`);

        fetchMoods();
    } catch (err) {
        console.log(err);
    }
    };

    const openEditModal = (mood) => {
        setEditingMood(mood);

        setEditForm({
            mood: mood.mood,
            emoji: mood.emoji,
            score: mood.score,
            note: mood.note || ""
            });
        };

       const saveMoodEdit = async () => {

    if (!editingMood?._id) {

        console.error(
        "Missing mood id"
        );

        return;
    }

    try {

        await API.put(

        `/moods/${editingMood._id}`,

        editForm

        );

        setEditingMood(null);

        fetchMoods();

    } catch (err) {

        console.log(err);

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

  const filtered = moods.filter((mood) => {

    const moodMatch =
        filterMood === "All" ||
        mood.mood === filterMood;

    const searchMatch =
        mood.mood
        .toLowerCase()
        .includes(search.toLowerCase());

    const moodDate =
        new Date(mood.date_only);

    const afterStart =
        !startDate ||
        moodDate >= new Date(startDate);

    const beforeEnd =
        !endDate ||
        moodDate <= new Date(endDate);

    return (
        moodMatch &&
        searchMatch &&
        afterStart &&
        beforeEnd
    );
    });

  const totalEntries = moods.length;

    const averageMood =
    moods.length > 0
        ? (
            moods.reduce(
            (sum, mood) => sum + mood.score,
            0
            ) / moods.length
        ).toFixed(1)
        : 0;

    const happyDays = moods.filter(
    (mood) => mood.score >= 4
    ).length;

    const lowDays = moods.filter(
    (mood) => mood.score <= 2
    ).length;

    const currentStreak = (() => {
    if (moods.length === 0) return 0;

    const sorted = [...moods].sort(
        (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    let streak = 1;

    for (
        let i = 1;
        i < sorted.length;
        i++
    ) {
        const prev = new Date(
        sorted[i - 1].date_only
        );

        const curr = new Date(
        sorted[i].date_only
        );

        const diff =
        (prev - curr) /
        (1000 * 60 * 60 * 24);

        if (diff === 1) {
        streak++;
        } else {
        break;
        }
    }

    return streak;
    })();

    const generateSummary = async () => {

    try {

        const res = await API.post(
            `/generate-monthly-summary?email=${user.email}&month=${selectedMonth}`
            );

        setMonthlySummary(
        res.data.summary
        );

    } catch (err) {

        console.log(err);
    }
    };

    const fetchSummary = async () => {

    try {

        const res = await API.get(
            `/monthly-summary?email=${user.email}&month=${selectedMonth}`
            );

        setMonthlySummary(
        res.data.summary
        );

    } catch (err) {

        console.log(err);
    }
    };

    const availableMonths = [
    ...new Set(
        moods.map((mood) =>
        mood.date_only.slice(0, 7)
        )
    )
    ].sort().reverse();

    const mostFrequentMood = (() => {
        if (!moods.length) return "N/A";

        const counts = {};

        moods.forEach((m) => {
            counts[m.mood] = (counts[m.mood] || 0) + 1;
        });

        return Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        );
        })();

        const bestDay =
        moods.length > 0
            ? moods.reduce((a, b) =>
                a.score > b.score ? a : b
            )
            : null;

        const lowestDay =
        moods.length > 0
            ? moods.reduce((a, b) =>
                a.score < b.score ? a : b
            )
            : null;

        const positivityRate =
        totalEntries > 0
            ? Math.round((happyDays / totalEntries) * 100)
            : 0;

        const streakScore =
        Math.min(currentStreak * 10, 100);

        const moodScore =
        Math.round((averageMood / 5) * 100);

        const wellnessScore =
        Math.round(
            moodScore * 0.5 +
            positivityRate * 0.3 +
            streakScore * 0.2
        );

        const wellnessLabel =
        wellnessScore >= 80
            ? "Excellent 💚"
            : wellnessScore >= 60
            ? "Good 🌸"
            : wellnessScore >= 40
            ? "Moderate 🌿"
            : "Needs Attention 💜"; 

    const downloadReport = async () => {

        const pdf = new jsPDF(
            "p",
            "mm",
            "a4"
        );

        const userName = user?.name || "User";

        const reportMonthLabel = selectedMonth
        ? new Date(selectedMonth + "-01").toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric",
            }
            )
        : "Monthly Report";

        pdf.addImage(
            coverTemplate,
            "PNG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
            );

        pdf.setFont("times", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(124, 58, 237);

        pdf.text(
        userName,
        105,
        156,
        { align: "center" }
        );

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        pdf.addPage();

        pdf.addImage(
        snapshotTemplate,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
        );

        pdf.setTextColor(124, 58, 237);
        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(22);

        pdf.text(String(totalEntries), 75, 96, { align: "center" });

        pdf.text(`${averageMood}/5`, 158, 96, { align: "center" });

        pdf.text(String(happyDays), 75, 134, { align: "center" });

        pdf.text(`${currentStreak}`, 156, 134, { align: "center" });

        const centerX = 55;
        const centerY = 184;
        const radius = 13;

        pdf.setDrawColor(235, 225, 255);
        pdf.setLineWidth(4);
        pdf.circle(centerX, centerY, radius);

        pdf.setDrawColor(124, 58, 237);
        pdf.setLineWidth(4);

        const angle = (wellnessScore / 100) * 360;

        for (let i = 0; i < angle; i += 3) {
        const start = (i - 90) * Math.PI / 180;
        const end = (i + 3 - 90) * Math.PI / 180;

        pdf.line(
            centerX + radius * Math.cos(start),
            centerY + radius * Math.sin(start),
            centerX + radius * Math.cos(end),
            centerY + radius * Math.sin(end)
        );
        }

        pdf.setFillColor(255, 255, 255);
        pdf.circle(centerX, centerY, radius - 5, "F");

        pdf.setTextColor(124, 58, 237);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);

        pdf.text(
        String(wellnessScore),
        centerX,
        centerY,
        { align: "center" }
        );

        pdf.setFontSize(5);

        pdf.text(
        "/100",
        centerX,
        centerY + 5,
        { align: "center" }
        );

        pdf.setFontSize(9);

        pdf.text(
        `${moodScore}%`,
        176,
        165
        );

        pdf.text(
        `${positivityRate}%`,
        176,
        185
        );

        pdf.text(
        `${streakScore}%`,
        176,
        205
        );

        pdf.setFillColor(124,58,237);

        pdf.roundedRect(
        118,
        163,
        moodScore * 0.55,
        3,
        2,
        2,
        "F"
        );

        pdf.roundedRect(
        118,
        183,
        positivityRate * 0.55,
        3,
        2,
        2,
        "F"
        );

        pdf.roundedRect(
        118,
        203,
        streakScore * 0.55,
        3,
        2,
        2,
        "F"
        );

        pdf.setFontSize(10);

        pdf.text(
        mostFrequentMood,
        53,
        266,
        { align: "center" }
        );

        pdf.text(
        bestDay?.date_only || "N/A",
        105,
        266,
        { align: "center" }
        );

        pdf.text(
        lowestDay?.date_only || "N/A",
        155,
        266,
        { align: "center" }
        );
        
        pdf.addPage();

        pdf.addImage(
        timelineTemplate,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
        );

        if (chartRef.current) {

        const chartImage =
            chartRef.current.toBase64Image();

        pdf.addImage(
            chartImage,
            "PNG",
            16,
            68,
            175,
            95
        );
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(70, 70, 70);

        pdf.text(
        reportMonthLabel,
        43,
        211
        );

        pdf.text(
        `${totalEntries} Mood Check-ins`,
        43,
        234
        );

        pdf.addPage();

        pdf.addImage(
            fourthPageTemplate,
            "PNG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(124, 58, 237);

        pdf.text(
            reportMonthLabel,
            16,
            60
        );

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(55,55,55);
        pdf.setFontSize(10);

        const cleanSummary = (monthlySummary || "No AI summary generated.")
            .replace(/\*\*/g, "")
            .replace(/#/g, "")
            .replace(/•/g, "• ")
            .trim();

        const summaryLines = pdf.splitTextToSize(
            cleanSummary,
            145
        );

        let summaryY = 85;

        summaryLines.forEach((line) => {

            const headingMatch = line.match(
                /^(\d+\.\s.*?:)\s(.*)$/
            );

            if (headingMatch) {

                const heading = headingMatch[1];
                const content = headingMatch[2];

                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(124,58,237);

                pdf.text(
                    heading,
                    30,
                    summaryY
                );

                const headingWidth =
                    pdf.getTextWidth(heading);

                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(55,55,55);

                pdf.text(
                    content,
                    32 + headingWidth,
                    summaryY
                );

            } else {

                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(55,55,55);

                pdf.text(
                    line,
                    30,
                    summaryY
                );
            }

            summaryY += 6;
        });

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(124,58,237);

        pdf.setFontSize(15);

        pdf.text(
            `${wellnessScore}/100`,
            84,
            240,
            { align: "center" }
        );

        pdf.setFontSize(16);

        pdf.text(
            wellnessLabel.replace(
                /💚|🌸|🌿|💜/g,
                ""
            ),
            145,
            241,
            { align: "center" }
        );

        pdf.addPage();

        pdf.addImage(
            fifthPageTemplate,
            "PNG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
        );

        const moodCounts = {};

        moods.forEach((mood) => {
            moodCounts[mood.mood] =
                (moodCounts[mood.mood] || 0) + 1;
        });

        const totalMoodEntries =
            Object.values(moodCounts).reduce(
                (a, b) => a + b,
                0
            );

        const happyCount =
            moodCounts["Happy"] || 0;

        const calmCount =
            moodCounts["Calm"] || 0;

        const neutralCount =
            moodCounts["Neutral"] || 0;

        const sadCount =
            moodCounts["Sad"] || 0;

        const happyPercent =
            totalMoodEntries
                ? ((happyCount / totalMoodEntries) * 100).toFixed(1)
                : "0";

        const calmPercent =
            totalMoodEntries
                ? ((calmCount / totalMoodEntries) * 100).toFixed(1)
                : "0";

        const neutralPercent =
            totalMoodEntries
                ? ((neutralCount / totalMoodEntries) * 100).toFixed(1)
                : "0";

        const sadPercent =
            totalMoodEntries
                ? ((sadCount / totalMoodEntries) * 100).toFixed(1)
                : "0";

        const chartCanvas = document.createElement("canvas");

        chartCanvas.width = 500;
        chartCanvas.height = 500;

        const ctx = chartCanvas.getContext("2d");

        const colors = [
            "#8B5CF6",
            "#A855F7",
            "#D8B4FE",
            "#5B21B6"
        ];

        const values = [
            happyCount,
            calmCount,
            neutralCount,
            sadCount
        ];

        const total =
            values.reduce((a,b)=>a+b,0);

        let startAngle = -Math.PI/2;

        values.forEach((value,index)=>{

            const sliceAngle =
                (value/total) *
                Math.PI * 2;

            ctx.beginPath();

            ctx.moveTo(250,250);

            ctx.arc(
                250,
                250,
                170,
                startAngle,
                startAngle + sliceAngle
            );

            ctx.fillStyle = colors[index];
            ctx.fill();

            startAngle += sliceAngle;
        });

        ctx.beginPath();

        ctx.arc(
            250,
            250,
            90,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#FFFFFF";

        ctx.fill();

        const donutImage =
            chartCanvas.toDataURL("image/png");

        pdf.addImage(
            donutImage,
            "PNG",
            0,
            75,
            110,
            110
        );

        pdf.setFont("helvetica","bold");

        pdf.setTextColor(124,58,237);

        pdf.setFontSize(24);

        pdf.text(
            String(totalMoodEntries),
            56,
            128,
            {align:"center"}
        );

        pdf.setFontSize(10);

        pdf.text(
            "Entries",
            57,
            133,
            {align:"center"}
        );

        pdf.setFontSize(10);

        pdf.text(
            `${happyCount} Entry`,
            135,
            100
        );

        pdf.text(
            `${happyPercent}%`,
            180,
            104
        );

        pdf.text(
            `${calmCount} Entries`,
            135,
            129
        );

        pdf.text(
            `${calmPercent}%`,
            180,
            133
        );

        pdf.text(
            `${neutralCount} Entry`,
            135,
            158
        );

        pdf.text(
            `${neutralPercent}%`,
            180,
            162
        );

        pdf.text(
            `${sadCount} Entries`,
            135,
            187
        );

        pdf.text(
            `${sadPercent}%`,
            180,
            190
        );

        const drawMoodBar = (
            y,
            percentage,
            color
        ) => {

            pdf.setFillColor(
                243,
                237,
                248
            );

            pdf.roundedRect(
                136,
                y,
                42,
                3.5,
                2,
                2,
                "F"
            );

            pdf.setFillColor(
                color[0],
                color[1],
                color[2]
            );

            pdf.roundedRect(
                136,
                y,
                (42 * percentage) / 100,
                3.5,
                2,
                2,
                "F"
            );
        };

        drawMoodBar(
            101,
            Number(happyPercent),
            [139,95,246]
        );

        drawMoodBar(
            131,
            Number(calmPercent),
            [168,120,247]
        );

        drawMoodBar(
            160,
            Number(neutralPercent),
            [216,190,254]
        );

        drawMoodBar(
            189,
            Number(sadPercent),
            [91,50,182]
        );

        const mostFrequent =
            Object.keys(moodCounts).length
                ? Object.keys(moodCounts).reduce(
                    (a,b)=>
                    moodCounts[a] >
                    moodCounts[b]
                    ? a
                    : b
                )
                : "N/A";

        pdf.setFontSize(14);

        pdf.text(
            String(totalMoodEntries),
            68,
            255,
            {align:"center"}
        );

        pdf.text(
            reportMonthLabel,
            105,
            254,
            {align:"center"}
        );

        pdf.text(
            mostFrequent,
            143,
            254,
            {align:"center"}
        );

        pdf.text(
            `${Object.keys(moodCounts).length}`,
            181,
            254,
            {align:"center"}
        );

        const recommendations = [];

        if (currentStreak < 7) {

        recommendations.push({
            title: "Daily Mood Tracking",
            text: "Try checking in at the same time each day to build a consistent emotional awareness habit."
        });

        } else {

        recommendations.push({
            title: "Daily Mood Tracking",
            text: "Excellent consistency. Continue your daily mood tracking habit to maintain self-awareness."
        });

        }

        if (wellnessScore < 60) {

        recommendations.push({
            title: "Mindfulness Practice",
            text: "Spend 10 minutes daily on breathing exercises or meditation to reduce emotional stress."
        });

        } else {

        recommendations.push({
            title: "Mindfulness Practice",
            text: "Keep practicing mindfulness regularly to strengthen emotional balance."
        });

        }

        if (sadPercent > 25) {

        recommendations.push({
            title: "Healthy Sleep Routine",
            text: "Prioritize 7–8 hours of sleep. Better sleep often improves mood stability and emotional resilience."
        });

        } else {

        recommendations.push({
            title: "Healthy Sleep Routine",
            text: "Maintain your healthy sleeping schedule to support long-term emotional wellness."
        });

        }

        if (happyPercent < 40) {

        recommendations.push({
            title: "Joy & Self-Care Activities",
            text: "Schedule at least one enjoyable activity every week that helps you relax and recharge."
        });

        } else {

        recommendations.push({
            title: "Joy & Self-Care Activities",
            text: "Continue engaging in activities that bring happiness and strengthen positive emotions."
        });

        }

        pdf.addPage();

        pdf.addImage(
        sixthPageTemplate,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(70,70,70);

        let lines = pdf.splitTextToSize(
        recommendations[0].text,
        70
        );

        pdf.text(lines, 24, 95);

        lines = pdf.splitTextToSize(
        recommendations[1].text,
        70
        );

        pdf.text(lines, 118, 95);

        lines = pdf.splitTextToSize(
        recommendations[2].text,
        70
        );

        pdf.text(lines, 24, 160);

        lines = pdf.splitTextToSize(
        recommendations[3].text,
        70
        );

        pdf.text(lines, 118, 160);

        let motivationalQuote = "";

        if (wellnessScore >= 80) {

        motivationalQuote =
            "You have built strong emotional awareness this month. Keep nurturing the habits that support your well-being.";

        }
        else if (wellnessScore >= 60) {

        motivationalQuote =
            "Progress comes from consistency, not perfection. Every reflection helps you understand yourself better.";

        }
        else {

        motivationalQuote =
            "Difficult days do not define your journey. Small steps forward are still meaningful progress.";

        }

        pdf.setFont(
        "times",
        "italic"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
        90,
        90,
        90
        );

        const quoteLines =
        pdf.splitTextToSize(
            motivationalQuote,
            125
        );

        pdf.text(
        quoteLines,
        55,
        270
        );

        pdf.save(
            `MannMitra_Report_${selectedMonth}.pdf`
        );
        };

        const moodOptions = {
            Happy: {
                emoji: "😊",
                score: 5,
            },

            Calm: {
                emoji: "😌",
                score: 4,
            },

            Neutral: {
                emoji: "😐",
                score: 3,
            },

            Low: {
                emoji: "😔",
                score: 2,
            },

            Sad: {
                emoji: "😢",
                score: 1,
            },
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
                              top-8
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
          Mood History
        </h1>

        <p className="text-xs sm:text-[15px] text-gray-500">
            Track your emotional journey
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 mt-5">

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                Total Entries
                </p>

                <h2 className="text-3xl font-bold text-purple-700 mt-2">
                {totalEntries}
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                Average Mood
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                {averageMood}/5
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                Positive Days
                </p>

                <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                {happyDays}
                </h2>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                Tracking Streak
                </p>

                <h2 className="text-3xl font-bold text-orange-500 mt-2">
                🔥 {currentStreak}
                </h2>
            </div>

            </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            <div
            className="
                col-span-1 lg:col-span-2
                bg-white
                rounded-[32px]
                p-6
                shadow-xl
                h-[550px]
                md:max-w-[500px]
                md:mx-auto
                lg:max-w-none
            "
            >
            <h2 className="text-3xl font-bold text-purple-800 mb-8">
                Wellness Score
            </h2>

            <div className="flex flex-col items-center">

                <div
                className="
                    w-32
                    h-32
                    rounded-full
                    bg-gradient-to-r
                    from-purple-500
                    to-fuchsia-500
                    flex
                    items-center
                    justify-center
                    shadow-xl
                    mb-6
                "
                >
                <div
                    className="
                    w-24
                    h-24
                    rounded-full
                    bg-white
                    flex
                    flex-col
                    items-center
                    justify-center
                    "
                >
                    <span className="text-4xl font-bold text-purple-700">
                    {wellnessScore}
                    </span>

                    <span className="text-gray-500 text-sm">
                    /100
                    </span>
                </div>
                </div>

                <h3 className="text-2xl font-bold text-purple-700">
                {wellnessLabel}
                </h3>

                <p className="text-gray-500 mt-2 text-center">
                Based on your mood patterns,
                positivity rate, and tracking consistency.
                </p>
            </div>

            <div className="mt-8 space-y-4">

                <div>
                <div className="flex justify-between mb-1">
                    <span>Mood Health</span>
                    <span>{moodScore}%</span>
                </div>

                <div className="h-3 bg-purple-100 rounded-full">
                    <div
                    className="h-3 bg-purple-600 rounded-full"
                    style={{ width: `${moodScore}%` }}
                    />
                </div>
                </div>

                <div>
                <div className="flex justify-between mb-1">
                    <span>Positive Days</span>
                    <span>{positivityRate}%</span>
                </div>

                <div className="h-3 bg-green-100 rounded-full">
                    <div
                    className="h-3 bg-green-500 rounded-full"
                    style={{ width: `${positivityRate}%` }}
                    />
                </div>
                </div>

                <div>
                <div className="flex justify-between mb-1">
                    <span>Tracking Habit</span>
                    <span>{streakScore}%</span>
                </div>

                <div className="h-3 bg-orange-100 rounded-full">
                    <div
                    className="h-3 bg-orange-500 rounded-full"
                    style={{ width: `${streakScore}%` }}
                    />
                </div>
                </div>

            </div>
            </div>

            <div
                className="
                    col-span-1 lg:col-span-3
                    bg-white
                    rounded-[32px]
                    p-8
                    shadow-lg
                    h-[550px]
                    flex
                    flex-col
                "
                >
                <h2 className="text-3xl font-bold text-purple-800 mb-6">
                    Monthly AI Summary
                </h2>

                <div
                    className="
                        bg-gradient-to-r
                        from-[#f7f1ff]
                        to-[#fff4fb]
                        rounded-[24px]
                        p-6
                        flex-1
                        overflow-y-auto
                        custom-scroll
                    "
                    >
                    <ReactMarkdown
                        components={{
                            h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-purple-800 mt-4 mb-3">
                                {children}
                            </h2>
                            ),

                            li: ({ children }) => (
                            <li className="ml-5 mb-2 text-gray-700">
                                {children}
                            </li>
                            ),

                            p: ({ children }) => (
                            <p className="mb-3 text-gray-700 leading-8">
                                {children}
                            </p>
                            )
                        }}
                        >
                        {monthlySummary}
                        </ReactMarkdown>
                </div>
                </div>

        </div>

        <div className="flex flex-wrap gap-4 mb-8 mt-8">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-purple-800">
                    Mood Analysis Tools
                </h2>

                <p className="text-gray-500 mt-1">
                    Filter entries, generate AI insights, and download your wellness report.
                </p>
                </div>

            <div
                className="
                    bg-white
                    rounded-3xl
                    p-8
                    shadow-lg
                    max-w-6xl
                    mx-auto
                    space-y-8
                "
                >

                <div>

                    <h3 className="
                    text-xl
                    font-bold
                    text-purple-800
                    mb-1
                    ">
                    Report & Insights
                    </h3>

                    <p className="text-gray-500 text-sm mb-6">
                    Generate summaries and export your emotional wellness report.
                    </p>

                    <div className="
                    flex
                    flex-wrap
                    items-end
                    gap-4
                    ">

                    <div>
                        <label className="
                        text-sm
                        text-gray-500
                        block
                        mb-2
                        ">
                        Report Month
                        </label>

                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                            setSelectedMonth(e.target.value)
                            }
                            className="
                            px-4 py-3
                            rounded-xl
                            border
                            border-purple-200
                            bg-white
                            cursor-pointer
                            "
                        >
                            {availableMonths.map((month) => (
                            <option
                                key={month}
                                value={month}
                            >
                                {new Date(month + "-01")
                                .toLocaleString(
                                    "default",
                                    {
                                    month: "long",
                                    year: "numeric"
                                    }
                                )}
                            </option>
                            ))}
                        </select>
                        </div>

                        <button
                        onClick={generateSummary}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-purple-600
                            to-fuchsia-500
                            text-white
                            font-semibold
                            shadow-md
                            hover:scale-105
                            transition
                            cursor-pointer
                        "
                        >
                        Generate AI Summary
                        </button>

                        <button
                        onClick={downloadReport}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-emerald-600
                            to-green-500
                            text-white
                            font-semibold
                            shadow-md
                            hover:bg-emerald-700
                            hover:scale-105
                            transition
                            cursor-pointer
                        "
                        >
                        Download Report
                        </button>

                    </div>
                    </div>

                    <div className="border-t border-purple-100"></div>

                    <div>

                        <h3 className="
                        text-xl
                        font-bold
                        text-purple-800
                        mb-1
                        ">
                        Filter Mood Entries
                        </h3>

                        <p className="text-gray-500 text-sm mb-6">
                        Find entries by mood, keyword, or date range.
                        </p>

                        <div className="
                        grid
                        grid-cols-2
                        lg:grid-cols-4
                        gap-4
                        ">

                    <input
                        type="text"
                        placeholder="Search mood..."
                        value={search}
                        onChange={(e) =>
                        setSearch(e.target.value)
                        }
                        className="
                        col-span-2
                        lg:col-span-1
                        px-4 py-3
                        rounded-xl
                        border
                        border-purple-200
                        "
                    />

                    <div>
                    <label className="block text-sm text-gray-500 mb-2">
                        Mood
                    </label>

                    <select
                        value={filterMood}
                        onChange={(e) =>
                        setFilterMood(e.target.value)
                        }
                        className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border
                        border-purple-200
                        cursor-pointer
                        "
                    >
                        <option>All</option>
                        <option>Happy</option>
                        <option>Calm</option>
                        <option>Neutral</option>
                        <option>Low</option>
                        <option>Sad</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm text-gray-500 mb-2">
                        From
                    </label>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                        setStartDate(e.target.value)
                        }
                        className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border
                        border-purple-200
                        "
                    />
                    </div>

                    <div>
                    <label className="block text-sm text-gray-500 mb-2">
                        To
                    </label>

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                        setEndDate(e.target.value)
                        }
                        className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border
                        border-purple-200
                        "
                    />
                    </div>

                    <div className="col-span-2 lg:col-span-1 mt-5">

                    <button
                    onClick={() => {
                        setSearch("");
                        setFilterMood("All");
                        setStartDate("");
                        setEndDate("");
                    }}
                    className="
                        px-5 py-3
                        rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-fuchsia-500
                        text-white
                        font-semibold
                        cursor-pointer
                    "
                    >
                    Clear
                    </button>

                    </div>

                    </div>

                </div>
                </div>

        </div>      

        <div
            className="
                bg-white
                rounded-[32px]
                shadow-xl
                p-8
                h-[500px]
                flex
                flex-col
                max-w-[900px]
                mx-auto
            "
            >

                <div className="mb-9">

                    <h2
                        className="
                            text-xl
                            sm:text-2xl
                            md:text-3xl
                            lg:text-4xl
                            font-bold
                            text-purple-700
                            whitespace-nowrap
                        "
                        >
                        Recent Mood Entries
                        </h2>

                    <p className="text-gray-500 mt-2">
                        View and manage your emotional journey
                    </p>

                    </div>

                    <div
                        className="
                            max-h-[360px]
                            overflow-y-auto
                            pr-2
                            space-y-4
                            custom-scroll
                        "
                        >

          {filtered.map((mood) => (

            <div
                key={mood._id}
                onClick={() => {
                    setSelectedMood(mood);

                    fetchJournalForMood(
                        mood.date_only
                    );
                    }}
                className="
                    bg-[#faf8ff]
                    rounded-[24px]
                    px-4
                    md:px-6
                    py-4
                    shadow-md
                    hover:shadow-lg
                    hover:bg-purple-50
                    transition-all

                    flex
                    flex-col
                    md:flex-row

                    justify-between
                    md:items-center

                    gap-4

                    mb-3
                    max-w-[1000px]
                    mx-auto
                    cursor-pointer
                "
                >

              <div className="flex items-center gap-5">

                <div
                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-purple-100
                        flex
                        items-center
                        justify-center
                        text-3xl
                    "
                >
                  {mood.emoji}
                </div>

                <div>

                  <h3 className="font-bold text-lg text-purple-700">
                    {mood.mood}
                </h3>

                <p className="text-gray-500 text-sm">
                    {mood.date_only}
                    </p>

                </div>

              </div>

              <div className="flex flex-wrap items-center gap-3">

                <div
                    className="
                    bg-purple-100
                    text-purple-700
                    px-4
                    py-2
                    rounded-full
                    font-bold
                    "
                >
                    {mood.score}/5
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(mood);
                    }}
                    className="
                        text-blue-600
                        font-semibold
                        hover:text-blue-800
                        cursor-pointer
                    "
                    >
                    Edit
                    </button>

                <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteMood(mood._id);
                }}
                className="
                    text-red-500
                    hover:text-red-700
                    font-semibold
                    cursor-pointer
                "
                >
                Delete
                </button>

                </div>

            </div>

          ))}

          </div>

        </div>

        <div
            ref={reportRef}
            className="
                fixed
                left-[-9999px]
                top-0
                w-[900px]
                bg-white
                p-10
            "
            >

            <h1
                className="
                text-4xl
                font-bold
                text-purple-700
                mb-8
                "
            >
                MannMitra Emotional Wellness Report
            </h1>

            <p className="mb-4">
                Month: {selectedMonth}
            </p>

            

            <hr className="mb-6" />

            <h2 className="text-2xl font-bold mb-3">
                Monthly AI Summary
            </h2>

            <p className="mb-8">
                {monthlySummary}
            </p>

            <h2 className="text-2xl font-bold mb-4">
                Mood Trend Analysis
            </h2>

            <MoodChart
                moods={filtered}
                chartRef={chartRef}
            />

            <h2 className="text-2xl font-bold mb-3">
                Emotional Statistics
            </h2>

            <ul className="mb-8">

                <li>
                Total Entries:
                {totalEntries}
                </li>

                <li>
                Average Mood:
                {averageMood}/5
                </li>

                <li>
                Most Frequent Mood:
                {mostFrequentMood}
                </li>

                <li>
                Positive Days:
                {happyDays}
                </li>

                <li>
                Tracking Streak:
                {currentStreak}
                </li>

            </ul>

            <h2 className="text-2xl font-bold mb-3">
                Best Emotional Day
            </h2>

            <p className="mb-6">

                {bestDay?.emoji}
                {" "}
                {bestDay?.mood}
                {" "}
                ({bestDay?.date_only})

            </p>

            <h2 className="text-2xl font-bold mb-3">
                Lowest Emotional Day
            </h2>

            <p className="mb-8">

                {lowestDay?.emoji}
                {" "}
                {lowestDay?.mood}
                {" "}
                ({lowestDay?.date_only})

            </p>

            <h2 className="text-2xl font-bold mb-3">
                AI Recommendations
            </h2>

            <p>

                Continue mood tracking daily,
                practice mindfulness,
                maintain healthy routines,
                and review emotional patterns
                regularly.

            </p>

            </div>

      </div>

    </div>

    {editingMood && (

    <div
        className="
        fixed inset-0
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
            rounded-3xl
            p-8
            w-[95%] md:w-[500px]
        "
        >

        <h2 className="text-2xl font-bold text-purple-800 mb-6">
            Edit Mood Entry
        </h2>

        <div className="space-y-5">

            <div>

                <label className="block text-sm text-gray-500 mb-2">
                Mood
                </label>

                <select
                value={editForm.mood}
                onChange={(e) => {

                    const selected =
                    e.target.value;

                    setEditForm({

                    mood: selected,

                    emoji:
                        moodOptions[selected]
                        .emoji,

                    score:
                        moodOptions[selected]
                        .score,

                    });

                }}
                className="
                    w-full
                    border
                    border-purple-200
                    rounded-xl
                    px-4
                    py-3
                    cursor-pointer
                "
                >

                <option value="Happy">
                    😊 Happy
                </option>

                <option value="Calm">
                    😌 Calm
                </option>

                <option value="Neutral">
                    😐 Neutral
                </option>

                <option value="Low">
                    😔 Low
                </option>

                <option value="Sad">
                    😢 Sad
                </option>

                </select>

            </div>

            <div
                className="
                bg-purple-50
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
                "
            >

                <div className="flex items-center gap-4">

                <span className="text-4xl">
                    {editForm.emoji}
                </span>

                <span className="font-semibold text-purple-700">
                    {editForm.mood}
                </span>

                </div>

                <div
                className="
                    px-4
                    py-2
                    rounded-full
                    bg-purple-100
                    text-purple-700
                    font-bold
                "
                >
                {editForm.score}/5
                </div>

            </div>

            </div>

        <div className="flex gap-4 mt-8">

            <button
            onClick={saveMoodEdit}
            className="
                flex-1
                bg-purple-600
                text-white
                py-3
                rounded-xl
                font-semibold
                cursor-pointer
            "
            >
            Save Changes
            </button>

            <button
            onClick={() =>
                setEditingMood(null)
            }
            className="
                flex-1
                bg-gray-100
                py-3
                rounded-xl
                cursor-pointer
            "
            >
            Cancel
            </button>

        </div>

        </div>

    </div>

    )}

    {selectedMood && (

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
            setSelectedMood(null)
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

        <div className="text-6xl mb-4">
            {selectedMood.emoji}
        </div>

        <h2
            className="
            text-3xl
            font-bold
            text-purple-700
            "
        >
            {selectedMood.mood}
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
            {selectedMood.score}/5
        </div>

        <p
            className="
            mt-4
            text-gray-500
            "
        >
            {new Date(
            selectedMood.date
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
                {moodSnapshots[selectedMood.mood]}
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
                {selectedMood.note?.trim()
                    ? selectedMood.note
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
    </>
  );
}

export default MoodHistory;