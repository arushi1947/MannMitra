import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaBars, FaTimes, FaCog, FaSignOutAlt, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Journal() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [gratitude1, setGratitude1] = useState("");
    const [gratitude2, setGratitude2] = useState("");
    const [gratitude3, setGratitude3] = useState("");
    const [highlight, setHighlight] = useState("");
    const [category, setCategory] = useState("Personal");
    const [mood, setMood] = useState("😊 Happy");
    const [isListening, setIsListening] = useState(false);
    const [transcriptText, setTranscriptText] = useState("");
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const recognitionRef = useRef(null);
    const [assistantMessage, setAssistantMessage] = useState("Tap the microphone to begin.");
    const [volume, setVolume] = useState(1);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const journalFormRef = useRef(null);
    const textareaRef = useRef(null);
    const [audioURL, setAudioURL] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const user = JSON.parse(localStorage.getItem("user"));
    const [journals, setJournals] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [selectedDateJournal, setSelectedDateJournal] = useState(null);
    const [showDateEntriesModal, setShowDateEntriesModal] = useState(false);
    const [showJournalCalendar, setShowJournalCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedReflection, setSelectedReflection] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [enteredPin, setEnteredPin] = useState("");
    const [showExitDecoyModal, setShowExitDecoyModal] = useState(false);
    const [exitPin, setExitPin] = useState("");
    const videoRef = useRef(null);
    const [decoyMode, setDecoyMode] = useState(false);
    const [pendingJournal, setPendingJournal] = useState(null);
    const [ipAddress, setIpAddress] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [onThisDayMemories, setOnThisDayMemories] = useState([]);
    const [futureLetter, setFutureLetter] = useState("");
    const [enableFutureLetter, setEnableFutureLetter] = useState(false);
    const [futureDate, setFutureDate] = useState("");
    const [futureLettersReady, setFutureLettersReady] = useState([]);
    const [futureLettersLocked, setFutureLettersLocked] = useState([]);
    const [showMailboxModal, setShowMailboxModal] = useState(false);
    const [showMailNotification, setShowMailNotification] = useState(() => {

        const seenCount = Number(localStorage.getItem("seenLettersCount") || 0);

        return futureLettersReady.length > seenCount;

    });
    const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 1024
    );

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const inactivityTimerRef = useRef(null);

    const profileMenuRef = useRef(null);

    const navigate = useNavigate();

    const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    window.innerWidth < 1280
    );

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
        window.removeEventListener("resize", handleResize);

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

        fetchJournals();

    }, []);

    useEffect(() => {

        const seenCount = Number(
            localStorage.getItem("seenLettersCount") || 0
        );

        setShowMailNotification(
            futureLettersReady.length > seenCount
        );

    }, [futureLettersReady]);

    useEffect(() => {

        const today = new Date();

        const ready = journals.filter(

            (journal) =>

                journal.futureLetter &&

                journal.futureDate &&

                new Date(journal.futureDate) <= today

        );

        const locked = journals.filter(

            (journal) =>

                journal.futureLetter &&

                journal.futureDate &&

                new Date(journal.futureDate) > today

        );

        setFutureLettersReady(ready);

        setFutureLettersLocked(locked);

    }, [journals]);

    useEffect(() => {

        if (journals.length === 0) return;

        const today = new Date();

        const currentMonth = today.getMonth();
        const currentDay = today.getDate();
        const currentYear = today.getFullYear();

        const memories = journals.filter((journal) => {

            const journalDate = new Date(journal.createdAt);

            return (
                journalDate.getMonth() === currentMonth &&
                journalDate.getDate() === currentDay &&
                journalDate.getFullYear() !== currentYear
            );

        });

        setOnThisDayMemories(memories);

    }, [journals]);

    useEffect(() => {

        const fetchLocation = async () => {

            try {

                const response = await fetch(
                    "https://ipapi.co/json/"
                );

                const data = await response.json();

                setIpAddress(
                    data.ip
                );

                setUserLocation(
                    `${data.city}, ${data.region}, ${data.country_name}`
                );

            }

            catch (error) {

                console.log(
                    "Unable to fetch location"
                );

            }

        };

        fetchLocation();

    }, []);

    useEffect(() => {

        const mode =
            localStorage.getItem(
                "decoyMode"
            );

        if (mode === "true") {

            setDecoyMode(true);

        }

    }, []);

    useEffect(() => {

        const resetInactivityTimer = () => {

            clearTimeout(inactivityTimerRef.current);

            inactivityTimerRef.current = setTimeout(() => {

                sessionStorage.removeItem(
                    "journalUnlockExpiry"
                );

            }, 10 * 60 * 1000);

        };

        resetInactivityTimer();

        window.addEventListener(
            "mousemove",
            resetInactivityTimer
        );

        window.addEventListener(
            "keypress",
            resetInactivityTimer
        );

        window.addEventListener(
            "click",
            resetInactivityTimer
        );

        window.addEventListener(
            "scroll",
            resetInactivityTimer
        );

        return () => {

            clearTimeout(
                inactivityTimerRef.current
            );

            window.removeEventListener(
                "mousemove",
                resetInactivityTimer
            );

            window.removeEventListener(
                "keypress",
                resetInactivityTimer
            );

            window.removeEventListener(
                "click",
                resetInactivityTimer
            );

            window.removeEventListener(
                "scroll",
                resetInactivityTimer
            );

        };

    }, []);

    const fetchJournals = async () => {

        try {

            const response =
                await API.get(
                    `/get-journals/${user.email}`
                );

            setJournals(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const totalJournals = journals.length;

    const thisMonthJournals = journals.filter((journal) => {
    const journalDate = new Date(journal.createdAt);
    const today = new Date();

    return (
        journalDate.getMonth() === today.getMonth() &&
        journalDate.getFullYear() === today.getFullYear()
    );
    }).length;

    const moodCounts = {};

    journals.forEach((journal) => {

        if (journal.mood) {

            moodCounts[journal.mood] =
                (moodCounts[journal.mood] || 0) + 1;

        }

    });

    const dominantMood =
        Object.keys(moodCounts).length > 0
            ? Object.keys(moodCounts).reduce(
                (a, b) =>
                    moodCounts[a] > moodCounts[b]
                        ? a
                        : b
            )
            : "None";

    const dominantMoodDisplay =
        dominantMood === "None"
            ? "No Data"
            : dominantMood;

    const writingStreak = (() => {

        if (journals.length === 0) return 0;

        const uniqueDates = [
            ...new Set(
                journals.map((journal) =>
                    new Date(journal.createdAt)
                        .toISOString()
                        .split("T")[0]
                )
            )
        ];

        uniqueDates.sort(
            (a, b) => new Date(b) - new Date(a)
        );

        let streak = 0;

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        const todayString =
            currentDate.toISOString().split("T")[0];

        if (!uniqueDates.includes(todayString)) {

            currentDate.setDate(
                currentDate.getDate() - 1
            );

        }

        while (true) {

            const dateString =
                currentDate.toISOString().split("T")[0];

            if (uniqueDates.includes(dateString)) {

                streak++;

                currentDate.setDate(
                    currentDate.getDate() - 1
                );

            } else {

                break;

            }
        }

        return streak;

    })();

    const monthNames = [
    "January","February","March","April",
    "May","June","July","August",
    "September","October","November","December"
    ];

    const weekdays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
    ];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();

    let startingDay = firstDay.getDay();

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;

    const journalMap = {};

    journals.forEach((journal) => {

        const d = new Date(journal.createdAt);

        const key =
            `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

        if (!journalMap[key]) {

            journalMap[key] = [];

        }

        journalMap[key].push(journal);

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

            journals:
                journalMap[key] || []

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

    const filteredJournals = journals.filter((journal) => {

        const matchesSearch =
            journal.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())

            ||

            journal.content
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All"

            ||

            journal.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const recentJournals = filteredJournals.slice(0, 5);

    const decoyJournals = [
        {
            _id: "1",
            title: "🛒 Grocery List",
            content: "Milk\nBread\nVegetables",
            category: "Personal",
            mood: "😊 Happy",
            createdAt: new Date()
        },
        {
            _id: "2",
            title: "📚 Study Notes",
            content: "Revise React Hooks",
            category: "Personal",
            mood: "😌 Calm",
            createdAt: new Date()
        },
        {
            _id: "3",
            title: "💼 Meeting Tasks",
            content: "Prepare presentation",
            category: "Personal",
            mood: "😐 Neutral",
            createdAt: new Date()
        }
    ];

    const handleSaveJournal = async () => {

        if (!title.trim() || !content.trim()) {
            return;
        }

        try {

            if (editingId) {

                const aiResponse = await API.post(
                    "/api/journal-reflection",
                    {
                        title,
                        content,
                        category,
                        mood
                    }
                );

                const aiReflection = aiResponse.data;

                await API.put(
                    `/update-journal/${editingId}`,
                    {

                        title,

                        content,

                        attachments,

                        category,

                        mood,

                        isPrivate,

                        gratitude: [
                            gratitude1,
                            gratitude2,
                            gratitude3
                        ],

                        highlight,

                        futureLetter: enableFutureLetter
                            ? futureLetter
                            : "",

                        futureDate: enableFutureLetter
                            ? futureDate
                            : "",

                        aiReflection

                    }
                );

                setEditingId(null);

            } else {

                const aiResponse = await API.post(
                    "/api/journal-reflection",
                    {
                        title,
                        content,
                        category,
                        mood
                    }
                );

                const aiReflection = aiResponse.data;

                await API.post("/add-journal", {

                    title,

                    content,

                    attachments,

                    category,

                    mood,

                    isPrivate,

                    gratitude: [
                        gratitude1,
                        gratitude2,
                        gratitude3
                    ],

                    highlight,

                    futureLetter,

                    futureDate,

                    aiReflection,

                    userEmail: user.email,

                    favorite: false,

                    createdAt: new Date().toISOString(),

                    date_only: new Date()
                        .toISOString()
                        .split("T")[0]

                });

            }

            setTitle("");
            setContent("");
            setCategory("Personal");
            setAttachments([]);
            setMood("😊 Happy");
            setGratitude1("");
            setGratitude2("");
            setGratitude3("");
            setHighlight("");
            setEnableFutureLetter(false);
            setFutureLetter("");
            setFutureDate("");
            setIsPrivate(false);

            fetchJournals();

        } catch (error) {

            console.log(error);

        }

    };

    const handleDeleteJournal = async (id) => {

        try {

            await API.delete(
                `/delete-journal/${id}`
            );

            fetchJournals();

        } catch (error) {

            console.log(error);

        }

    };

    const handleEditJournal = (journal) => {

        setTitle(journal.title);
        setContent(journal.content);
        setAttachments(journal.attachments || []);
        setCategory(journal.category || "Personal");
        setEditingId(journal._id);
        setMood(journal.mood || "😊 Happy");
        setGratitude1(
            journal.gratitude?.[0] || ""
        );

        setGratitude2(
            journal.gratitude?.[1] || ""
        );

        setGratitude3(
            journal.gratitude?.[2] || ""
        );

        setHighlight(
            journal.highlight || ""
        );

        setFutureLetter(
            journal.futureLetter || ""
        );

        setFutureDate(
            journal.futureDate || ""
        );

        setTimeout(() => {
            journalFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100);
    };

    const handleToggleFavorite = async (id) => {

        try {

            await API.put(
                `/toggle-favorite/${id}`
            );

            fetchJournals();

        } catch (error) {

            console.log(error);

        }

    };

    const handleOpenJournal = (journal) => {

        setSelectedJournal(journal);

        setShowJournalModal(true);

    };

    const handleViewReflection = (journal) => {

        setSelectedReflection(
            journal.aiReflection
        );

        setShowReflectionModal(true);

    };

    const handleContentChange = (e) => {

        setContent(e.target.value);

        e.target.style.height = "auto";

        e.target.style.height = `${e.target.scrollHeight}px`;

    };

    const uploadAudioToCloudinary = async (blob) => {

        const formData = new FormData();

        formData.append(
            "file",
            new File(
                [blob],
                "voice-note.webm",
                {
                    type: "audio/webm"
                }
            )
        );

        const response = await API.post(
            "/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;
    };

    const handleVoiceInput = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert("Voice recognition not supported");

            return;
        }

        const recognition = new SpeechRecognition();

        recognitionRef.current = recognition;

        recognition.lang = "en-IN";

        recognition.continuous = true;

        recognition.interimResults = true;

        recognitionRef.current = recognition;

        setIsListening(true);

        setAssistantMessage(
            "I'm listening..."
        );

        navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {

            const audioContext =
                new AudioContext();

            const analyser =
                audioContext.createAnalyser();

            const microphone =
                audioContext.createMediaStreamSource(
                    stream
                );

            microphone.connect(analyser);

            analyser.fftSize = 256;

            const dataArray =
                new Uint8Array(
                    analyser.frequencyBinCount
                );

            const updateVolume = () => {

                analyser.getByteFrequencyData(
                    dataArray
                );

                const average =
                    dataArray.reduce(
                        (a, b) => a + b,
                        0
                    ) / dataArray.length;

                setVolume(
                    Math.max(
                        1,
                        average / 25
                    )
                );

                if (isListening)
                    requestAnimationFrame(
                        updateVolume
                    );
            };

            updateVolume();

        });

        navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {

            const recorder =
                new MediaRecorder(stream);

            mediaRecorderRef.current =
                recorder;

            recorder.start();

            recorder.ondataavailable =
            (e) => {

                chunksRef.current.push(
                    e.data
                );

            };

            recorder.onstop = () => {

                const blob = new Blob(
                    chunksRef.current,
                    {
                        type: "audio/webm"
                    }
                );

                const localUrl = URL.createObjectURL(blob);

                setAudioURL(localUrl);

                uploadAudioToCloudinary(blob)
                .then((audio) => {

                    setAttachments(prev => [

                        ...prev,

                        {
                            name: audio.name,
                            type: audio.type,
                            url: audio.url
                        }

                    ]);

                });

                chunksRef.current = [];

            };
                
        });

        recognition.start();

        recognition.onresult = (event) => {

            let transcript = "";

            for (
                let i = 0;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;

            }

            setTranscriptText(transcript);

            setAssistantMessage(
                "Capturing your thoughts..."
            );

        };

        recognition.onerror = () => {

            setIsListening(false);

        };

        recognition.onend = () => {

            setIsListening(false);

            setAssistantMessage(
                "Voice captured successfully"
            );

        };

    };

    const handleAddVoiceToJournal = () => {

        const updatedContent =
            content
                ? content + "\n\n" + transcriptText
                : transcriptText;

        setContent(updatedContent);

        setTimeout(() => {

            if (textareaRef.current) {

                textareaRef.current.style.height = "auto";

                textareaRef.current.style.height =
                    `${textareaRef.current.scrollHeight}px`;

            }

        }, 0);

        setTranscriptText("");

        setShowVoiceModal(false);

    };


    const handleClearVoice = () => {

        setTranscriptText("");

    };

    const handleAttachmentUpload = async (e) => {

        const files = Array.from(e.target.files);

        for (const file of files) {

            try {

                const formData = new FormData();

                formData.append("file", file);

                const response = await API.post(
                    "/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                setAttachments(prev => [

                    ...prev,

                    {
                        name: response.data.name,
                        type: response.data.type,
                        url: response.data.url
                    }

                ]);

            }

            catch (error) {

                console.log(error);

            }
        }
    };

    const stopListening = () => {

        recognitionRef.current?.stop();

        mediaRecorderRef.current?.stop();

        chunksRef.current = [];

        setIsListening(false);

    };

    const handleRemoveAttachment = (indexToRemove) => {

        setAttachments(

            attachments.filter(
                (_, index) => index !== indexToRemove
            )

        );

    };

    const captureIntruderPhoto = async () => {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });

            const video = document.createElement("video");

            video.srcObject = stream;

            await video.play();

            const canvas = document.createElement("canvas");

            canvas.width = video.videoWidth;

            canvas.height = video.videoHeight;

            canvas
                .getContext("2d")
                .drawImage(
                    video,
                    0,
                    0
                );

            stream
                .getTracks()
                .forEach(track => track.stop());

            return new Promise(resolve => {

                canvas.toBlob(

                    async blob => {

                        const formData = new FormData();

                        formData.append(
                            "file",
                            blob,
                            "intruder.jpg"
                        );

                        const upload =
                            await API.post(
                                "/upload",
                                formData,
                                {
                                    headers: {
                                        "Content-Type":
                                            "multipart/form-data"
                                    }
                                }
                            );

                        resolve(upload.data.url);

                    },

                    "image/jpeg"

                );

            });

        }

        catch {

            return "";
        }

    };

    const verifyPin = async () => {

        try {

            let imageURL = "";

            if (enteredPin.length > 0) {

                imageURL = await captureIntruderPhoto();

            }

            const response = await API.post(
                "/verify-master-pin",
                {

                    email: user.email,

                    pin: enteredPin,

                    device: navigator.platform,

                    browser: navigator.userAgent,

                    os: navigator.platform,

                    image: imageURL,

                    ip: ipAddress,

                    location: userLocation

                }
            );

            if (response.data.success) {

            setDecoyMode(response.data.decoy);

            localStorage.setItem(
                "decoyMode",
                response.data.decoy
            );

            sessionStorage.setItem(
                "journalUnlockExpiry",
                Date.now() + 10 * 60 * 1000
            );

            setShowPinModal(false);

            setEnteredPin("");

            if (!response.data.decoy) {

                handleOpenJournal(
                    pendingJournal
                );

            }

        }

            else if (response.data.locked) {

                alert(
                    "Emergency Lock Mode Activated.\n\nUse Face ID or Recovery Code to unlock."
                );

            }

            else {

                alert("Incorrect PIN");

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    const unlockWithBiometrics = async () => {

    try{

    const response =
    await API.post(
    "/generate-auth-options",
    {
    email:user.email
    }
    );

    let options = response.data;

    console.log(options);

    options.challenge = Uint8Array.from(

        atob(
            options.challenge
                .replace(/-/g, "+")
                .replace(/_/g, "/")
        ),

        c => c.charCodeAt(0)

    );

    if (options.allowCredentials) {

        options.allowCredentials =
            options.allowCredentials.map(cred => ({

                ...cred,

                id: Uint8Array.from(
                    cred.id
                )

            }));

    }

    const assertion =
    await navigator.credentials.get({

        publicKey: options

    });

    const verifyResponse = await API.post(
        "/verify-auth",
        {
            email: user.email,
            credential: assertion
        }
    );

    if (verifyResponse.data.success) {

        sessionStorage.setItem(
            "journalUnlockExpiry",
            Date.now() + 10 * 60 * 1000
        );

        setShowPinModal(false);

        setEnteredPin("");

        setTimeout(() => {

            handleOpenJournal(
                pendingJournal
            );

            setPendingJournal(null);

        }, 150);

        setPendingJournal(null);

    }
    }
    catch (error) {

        console.log(error);

        alert(
            error.message
        );

    }

    };

    const exitDecoyMode = async () => {

        try {

            const response = await API.post(
                "/verify-master-pin",
                {

                    email: user.email,

                    pin: exitPin

                }
            );

            if (
                response.data.success &&
                !response.data.decoy
            ) {

                setDecoyMode(false);

                localStorage.removeItem(
                    "decoyMode"
                );

                setShowExitDecoyModal(false);

                setExitPin("");

            }

            else {

                alert(
                    "Enter your REAL Master PIN"
                );

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    const isFutureLetterUnlocked = () => {

        if (!selectedJournal?.futureDate)
            return true;

        return (
            new Date() >=
            new Date(selectedJournal.futureDate)
        );

    };

    const getDaysLeft = (date) => {

        const today = new Date();

        const future = new Date(date);

        const diff =
            future - today;

        return Math.ceil(
            diff / (1000 * 60 * 60 * 24)
        );

    };

    const categories = [
    {
        icon: "👤",
        value: "Personal"
    },
    {
        icon: "💼",
        value: "Work"
    },
    {
        icon: "📚",
        value: "Study"
    },
    {
        icon: "🏃",
        value: "Health"
    },
    {
        icon: "❤️",
        value: "Relationships"
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

            <h1 className="text-base sm:text-2xl md:text-4xl font-bold leading-tight text-gray-800">
            Journal Workspace
            </h1>

           <p className="text-xs sm:text-sm leading-5 max-w-[120px] sm:max-w-none text-gray-500">
            Capture your thoughts and memories
            </p>

        </div>

        <div className="flex items-center gap-3">

            <button
            onClick={() => setShowJournalCalendar(true)}
            className="
            relative
            w-11 h-11
            sm:w-14 sm:h-14
            md:w-16 md:h-16
            rounded-2xl
            bg-white
            shadow-lg
            flex
            items-center
            justify-center
            hover:scale-105
            transition-all
            cursor-pointer
            "
            >
                <span className="text-xl sm:text-2xl md:text-3xl">
                    📅
                </span>
            </button>

            <button
            onClick={() => {

                setShowMailboxModal(true);

                setShowMailNotification(false);

                localStorage.setItem(
                    "seenLettersCount",
                    futureLettersReady.length
                );

            }}
            className="
            relative
            w-11 h-11
            sm:w-14 sm:h-14
            md:w-16 md:h-16
            rounded-2xl
            bg-white
            shadow-lg
            flex
            items-center
            justify-center
            hover:scale-105
            transition-all
            cursor-pointer
            "
            >

            <span className="text-3xl">
            💌
            </span>

            {
            futureLettersReady.length > 0 &&
            showMailNotification && (

            <div
            className="
            absolute
            -top-2
            -right-2
            w-7
            h-7
            rounded-full
            bg-red-500
            text-white
            text-sm
            font-bold
            flex
            items-center
            justify-center
            "
            >
            {futureLettersReady.length}
            </div>

            )
            }

            </button>

            <div
            className="
                hidden md:block
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
                w-11
                h-11
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

                              {
                            decoyMode && (

                            <button

                            onClick={() => {

                                setShowProfileMenu(false);

                                setShowExitDecoyModal(true);

                            }}

                            className="
                            w-full
                            mt-3
                            py-3
                            rounded-2xl
                            bg-red-500
                            text-white
                            font-semibold
                            cursor-pointer
                            "

                            >

                            Exit Decoy Mode

                            </button>

                            )
                            }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 mb-10">

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
            <p className="text-gray-500 text-sm">
            Total Journals
            </p>

            <h2 className="text-3xl font-bold text-purple-700 mt-2">
            {totalJournals}
            </h2>
        </div>

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                This Month
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                {thisMonthJournals}
                </h2>
            </div>

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                    Dominant Mood
                </p>

                <h2
                    className="
                        mt-2
                        text-3xl
                        font-bold
                        text-yellow-500
                    "
                >
                    {dominantMoodDisplay}
                </h2>
            </div>

        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg">
                <p className="text-gray-500 text-sm">
                Writing Streak
                </p>

                <h2 className="text-3xl font-bold text-orange-500 mt-2">
                🔥 {writingStreak}
                </h2>
            </div>

        </div>

        {
        onThisDayMemories.length > 0 ? (

        <div
        className="
        bg-white
        rounded-[35px]
        p-5 sm:p-8
        shadow-xl
        max-w-[1050px]
        mx-auto
        mb-10
        "
        >

        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">

        On This Day

        </h2>

        <p className="text-gray-500 mb-8">

        Memories from previous years

        </p>

        <div className="space-y-6">

        {
        onThisDayMemories.map((memory) => (

        <div
        key={memory._id}
        className="
        bg-purple-50
        border
        border-purple-100
        rounded-[28px]
        p-6
        "
        >

        <div className="flex justify-between items-center mb-4">

        <h3 className="text-2xl font-bold text-purple-700">

        {memory.title}

        </h3>

        <span
        className="
        px-4
        py-2
        rounded-full
        bg-indigo-100
        text-indigo-700
        font-semibold
        "
        >

        {
        new Date(memory.createdAt).getFullYear()
        }

        </span>

        </div>

        <div className="flex gap-3 mb-4">

        <span
        className="
        px-3
        py-1
        rounded-full
        bg-purple-100
        text-purple-700
        "
        >
        {memory.category}
        </span>

        <span
        className="
        px-3
        py-1
        rounded-full
        bg-green-100
        text-green-700
        "
        >
        {memory.mood}
        </span>

        </div>

        <p className="text-gray-600 line-clamp-4">

        {memory.content}

        </p>

        <button
        onClick={() => handleOpenJournal(memory)}
        className="
        mt-5
        px-5
        py-3
        rounded-2xl
        bg-purple-600
        text-white
        font-semibold
        hover:bg-purple-700
        transition-all
        cursor-pointer
        "
        >

        Read Memory

        </button>

        </div>

        ))
        }

        </div>

        </div>

        ) : (

        <div
        className="
        bg-gradient-to-r
        from-pink-50
        to-purple-50
        rounded-[35px]
        p-8
        shadow-xl
        max-w-[1050px]
        mx-auto
        mb-10
        text-center
        border
        border-purple-100
        "
        >

        <h2 className="text-3xl font-bold text-purple-700">
        Creating Future Memories
        </h2>

        <p className="text-gray-500 mt-4 text-lg">
        No memories from this date yet.
        <br />
        Keep writing, and one day you'll come back here and relive today's moments
        </p>

        <p className="text-purple-500 mt-5 font-medium">
            {totalJournals} memories created so far
            </p>

        </div>

        )
        }

      <div className="max-w-[1050px] mx-auto">

      <div className="mt-10 mb-8">

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
            placeholder="Search journals..."
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
    <p className="text-gray-500 mt-3 text-sm">
        {filteredJournals.length} journal(s) found
    </p>

    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar sm:flex-wrap mt-6">

        <button
            onClick={() => setSelectedCategory("All")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "All"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            🌈 All
        </button>

        <button
            onClick={() => setSelectedCategory("Personal")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "Personal"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            👤 Personal
        </button>

        <button
            onClick={() => setSelectedCategory("Work")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "Work"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            💼 Work
        </button>

        <button
            onClick={() => setSelectedCategory("Study")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "Study"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            📚 Study
        </button>

        <button
            onClick={() => setSelectedCategory("Health")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "Health"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            🏃 Health
        </button>

        <button
            onClick={() => setSelectedCategory("Relationships")}
            className={`
                px-5 py-2 rounded-full font-medium
                transition-all
                ${
                    selectedCategory === "Relationships"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-600"
                }
            `}
        >
            ❤️ Relationships
        </button>

    </div>
    </div>

      <div
        ref={journalFormRef}
        className="
            bg-white/60
            backdrop-blur-xl
            rounded-[35px]
            p-5 sm:p-8
            shadow-lg
            border
            border-white/30
            mb-12
            max-w-[1050px]
            mx-auto
        "
        >

        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-purple-700 whitespace-nowrap">
          Write New Journal
        </h2>

        <p className="text-gray-500 mb-8">
          Express yourself freely
        </p>

        {editingId && (

            <div
                className="
                    mb-5
                    p-4
                    rounded-2xl
                    bg-yellow-100
                    border
                    border-yellow-300
                    text-yellow-800
                    font-medium
                "
            >
                Editing existing journal...
            </div>

        )}

        <input
            type="text"
            placeholder="Journal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
                w-full
                p-4
                rounded-2xl
                bg-white
                border
                border-gray-300
                outline-none
                focus:ring-4
                focus:ring-purple-300
                transition-all
                mb-5
            "
            />

            <div className="mb-5">

            <label className="block text-gray-600 mb-2 font-medium">
                Category
            </label>

            <div
                className="
                flex
                gap-3
                overflow-x-auto
                pb-2
                hide-scrollbar
                "
                >

                {categories.map((item) => (

                    <button
                    key={item.value}
                    type="button"

                    onClick={() =>
                        setCategory(item.value)
                    }

                    className={`
                        flex
                        items-center
                        gap-2

                        px-4
                        py-3

                        rounded-2xl

                        whitespace-nowrap

                        transition-all
                        duration-300
                        cursor-pointer

                        ${
                        category === item.value
                            ? `
                            bg-purple-600
                            text-white
                            shadow-lg
                            `
                            : `
                            bg-white
                            text-gray-700
                            border border-purple-100
                            hover:bg-purple-50
                            `
                        }
                    `}
                    >

                    <span>
                        {item.icon}
                    </span>

                    <span className="font-medium">
                        {item.value}
                    </span>

                    </button>

                ))}

                </div>

                </div>

            <div className="mb-5">

            <label className="block text-gray-600 mb-2 font-medium">
                Mood
            </label>

            <div className="flex sm:flex-wrap gap-3 overflow-x-auto pb-2 hide-scrollbar">

                <button
                    type="button"
                    onClick={() => setMood("😊 Happy")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-2xl whitespace-nowrap flex-shrink-0 ${
                        mood === "😊 Happy"
                            ? "bg-pink-500 text-white"
                            : "bg-white"
                    }`}
                >
                    😊 Happy
                </button>

                <button
                    type="button"
                    onClick={() => setMood("😌 Calm")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-2xl whitespace-nowrap flex-shrink-0 ${
                        mood === "😌 Calm"
                            ? "bg-green-500 text-white"
                            : "bg-white"
                    }`}
                >
                    😌 Calm
                </button>

                <button
                    type="button"
                    onClick={() => setMood("😐 Neutral")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-2xl whitespace-nowrap flex-shrink-0 ${
                        mood === "😐 Neutral"
                            ? "bg-yellow-500 text-white"
                            : "bg-white"
                    }`}
                >
                    😐 Neutral
                </button>

                <button
                    type="button"
                    onClick={() => setMood("😔 Low")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-2xl whitespace-nowrap flex-shrink-0 ${
                        mood === "😔 Low"
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                    }`}
                >
                    😔 Low
                </button>

                <button
                    type="button"
                    onClick={() => setMood("😢 Sad")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-2xl whitespace-nowrap flex-shrink-0 ${
                        mood === "😢 Sad"
                            ? "bg-red-500 text-white"
                            : "bg-white"
                    }`}
                >
                    😢 Sad
                </button>

            </div>

        </div>

        <div className="relative">

            <textarea
                ref={textareaRef}
                placeholder="What's on your mind today?"
                value={content}
                onChange={handleContentChange}
                className="
                    w-full
                    min-h-[190px]
                    p-5
                    pr-20
                    rounded-3xl
                    bg-white
                    border
                    border-gray-300
                    outline-none
                    focus:ring-4
                    focus:ring-purple-300
                    resize-none
                    overflow-hidden
                    transition-all
                    duration-200
                "
            />

            <button
                type="button"
                onClick={() => setShowVoiceModal(true)}
                className={`
                    absolute
                    right-3
                    bottom-1
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

        <div
            className="
                mt-8
                bg-gradient-to-r
                from-yellow-50
                to-orange-50
                rounded-[30px]
                p-6
                border
                border-yellow-200
            "
        >

            <h3 className="text-xl sm:text-2xl font-bold text-yellow-700 mb-2">
                Gratitude Corner
            </h3>

            <p className="text-gray-500 mb-5">
                What are three things you're grateful for today?
            </p>

            <div className="space-y-4">

                <input
                    type="text"
                    value={gratitude1}
                    onChange={(e) =>
                        setGratitude1(e.target.value)
                    }
                    placeholder="I am grateful for..."
                    className="
                        w-full
                        p-4
                        rounded-2xl
                        bg-white
                        border
                        border-yellow-200
                        outline-none
                    "
                />

                <input
                    type="text"
                    value={gratitude2}
                    onChange={(e) =>
                        setGratitude2(e.target.value)
                    }
                    placeholder="Something that made me smile..."
                    className="
                        w-full
                        p-4
                        rounded-2xl
                        bg-white
                        border
                        border-yellow-200
                        outline-none
                    "
                />

                <input
                    type="text"
                    value={gratitude3}
                    onChange={(e) =>
                        setGratitude3(e.target.value)
                    }
                    placeholder="Another blessing today..."
                    className="
                        w-full
                        p-4
                        rounded-2xl
                        bg-white
                        border
                        border-yellow-200
                        outline-none
                    "
                />

            </div>

        </div>

        <div
            className="
                mt-8
                bg-gradient-to-r
                from-purple-50
                to-pink-50
                rounded-[30px]
                p-6
                border
                border-purple-200
            "
        >

            <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-2">
                Highlight Of The Day
            </h3>

            <p className="text-gray-500 mb-5">
                Capture your favorite moment or quote from today.
            </p>

            <textarea
                rows="3"
                value={highlight}
                onChange={(e) =>
                    setHighlight(e.target.value)
                }
                placeholder='"Today I completed the MannMitra Journal page!"'
                className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white
                    border
                    border-purple-200
                    outline-none
                    resize-none
                    focus:ring-4
                    focus:ring-purple-300
                "
            />

        </div>

        <div
        className="
        mt-8
        bg-gradient-to-r
        from-indigo-50
        to-purple-50
        rounded-[30px]
        p-6
        border
        border-indigo-200
        "
        >

        <div className="flex items-center justify-between">

        <div>

        <h3 className="text-xl sm:text-2xl font-bold text-indigo-700">
        Letter To Future Self
        </h3>

        <p className="text-gray-500 mt-2">
        Send a message to your future self
        </p>

        </div>

        <div
        onClick={() =>
            setEnableFutureLetter(!enableFutureLetter)
        }
        className={`
        w-14
        h-8
        rounded-full
        cursor-pointer
        transition-all
        relative

        ${
        enableFutureLetter
        ? "bg-indigo-500"
        : "bg-gray-300"
        }
        `}
        >

        <div
        className={`
        absolute
        top-1
        w-6
        h-6
        bg-white
        rounded-full
        transition-all

        ${
        enableFutureLetter
        ? "left-7"
        : "left-1"
        }
        `}
        />

        </div>

        </div>

        {
        enableFutureLetter && (

        <>

        <textarea
        rows="5"
        value={futureLetter}
        onChange={(e) =>
            setFutureLetter(e.target.value)
        }
        placeholder="Dear future me..."
        className="
        w-full
        mt-6
        p-4
        rounded-2xl
        bg-white
        border
        border-indigo-200
        outline-none
        resize-none
        focus:ring-4
        focus:ring-indigo-300
        "
        />

        <div className="mt-5">

        <label className="block text-gray-600 mb-2">
        Open on
        </label>

        <input
        type="date"
        value={futureDate}
        onChange={(e) =>
            setFutureDate(e.target.value)
        }
        className="
        w-full
        p-4
        rounded-2xl
        border
        border-indigo-200
        outline-none
        focus:ring-4
        focus:ring-indigo-300
        "
        />

        </div>

        </>

        )

        }

        </div>

        <label
            htmlFor="memory-upload"
            className="
                mt-5
                border-2
                border-dashed
                border-pink-300
                rounded-[25px]
                h-[150px] sm:h-[180px]
                flex
                flex-col
                items-center
                justify-center
                text-pink-600
                cursor-pointer
                hover:bg-pink-50
                transition-all
            "
        >
            <div className="text-4xl sm:text-5xl mb-3">
                📸
            </div>

            <p className="font-semibold text-base sm:text-lg">
                Attach Memories
            </p>

            <p className="text-sm text-gray-500 mt-2">
                Images, PDF documents, Voice notes
            </p>
        </label>

        <input
            type="file"
            id="memory-upload"
            accept="image/*,.pdf,audio/*"
            multiple
            onChange={handleAttachmentUpload}
            className="hidden"
        />

            {attachments.length > 0 && (

            <div className="mt-10">

                <div className="flex items-center justify-between mb-5">

                    <h3 className="text-2xl font-bold text-purple-700">
                        Attached Memories
                    </h3>

                    <button
                        onClick={() => setAttachments([])}
                        className="
                        px-4 py-2
                        rounded-xl
                        bg-red-100
                        text-red-600
                        font-medium
                        hover:bg-red-200
                        transition-all
                        cursor-pointer
                        "
                    >
                        Clear All
                    </button>

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    {attachments
                        .filter(file => file.type.startsWith("image/"))
                        .map((file,index)=>(

                        <div
                            key={index}
                            className="
                            relative
                            bg-white
                            rounded-[25px]
                            overflow-hidden
                            shadow-xl
                            "
                        >

                            <button
                                onClick={() => handleRemoveAttachment(index)}
                                className="
                                absolute
                                top-3
                                right-3
                                w-8
                                h-8
                                rounded-full
                                bg-red-500
                                text-white
                                z-20
                                cursor-pointer
                                "
                            >
                                ×
                            </button>

                            <img
                                src={file.url}
                                className="
                                w-full
                                h-[220px]
                                object-cover
                                "
                            />

                        </div>

                    ))}

                </div>

                <div className="space-y-4 mt-6">

                    {attachments.map((file,index)=>(

                    !file.type.startsWith("image/") && (

                    <div
                        key={index}
                        className="
                        bg-white
                        rounded-3xl
                        p-5
                        shadow-lg
                        flex
                        items-center
                        justify-between
                        gap-5
                        "
                    >

                        <div className="flex items-center gap-4 flex-1">

                            {

                            file.type==="application/pdf"

                            ?

                            <>

                                <div className="text-4xl">
                                    📄
                                </div>

                                <div>

                                    <p className="font-semibold text-red-500">
                                        {file.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        PDF Document
                                    </p>

                                </div>

                            </>

                            :

                            <>

                                <div className="text-4xl">
                                    🎙
                                </div>

                                <audio controls className="flex-1">

                                    <source src={file.url} />

                                </audio>

                            </>

                            }

                        </div>


                        <button
                            onClick={() => handleRemoveAttachment(index)}
                            className="
                            w-10
                            h-10
                            rounded-full
                            bg-red-500
                            text-white
                            cursor-pointer
                            "
                        >
                            ×
                        </button>

                    </div>

                    )

                    ))}

                </div>

            </div>

            )}

            <div
            className="
            mt-8
            bg-red-50
            border
            border-red-200
            rounded-[30px]
            p-6
            "
            >

            <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
            Private Journal
            </h3>

            <div className="flex items-center gap-3 mb-5">

            <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            className="w-5 h-5"
            />

            <p className="text-gray-700">
            Protect this journal with a PIN
            </p>

            </div>

            {
            isPrivate && (

            <p className="text-red-500">
            Protected by your Master PIN
            </p>

            )
            }

            </div>

        <button
          onClick={handleSaveJournal}
          className="
            mt-6
            w-full
            py-4
            rounded-2xl
            text-white
            font-semibold
            bg-gradient-to-r
            from-purple-600
            to-fuchsia-500
            text-lg
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-2xl
            cursor-pointer
          "
        >
          {editingId ? "Update Journal" : "Save Journal"}
        </button>

        {editingId && (

            <button
                onClick={() => {

                    setEditingId(null);
                    setTitle("");
                    setContent("");
                    setCategory("Personal");
                    setMood("😊 Happy");

                    setGratitude1("");
                    setGratitude2("");
                    setGratitude3("");
                    setHighlight("");
                    setIsPrivate(false);

                }}
                className="
                    mt-4
                    w-full
                    py-3
                    rounded-2xl
                    bg-gray-200
                    text-gray-700
                    font-semibold
                    hover:bg-gray-300
                    transition-all
                    cursor-pointer
                "
            >
                Cancel Editing
            </button>

        )}

      </div>

      <div className="max-w-[1050px] mx-auto">

        <h2
            className="
            text-2xl sm:text-3xl md:text-4xl
            font-bold
            text-slate-800
            mb-8
            "
        >
            My Journal Entries
        </h2>

        <div className="hidden sm:block">

        {/* Recent Journals */}

        <h3 className="text-xl font-bold text-purple-700 mb-5">
            Recent Journals
        </h3>

        <div
        className="
        flex
        gap-5
        overflow-x-auto
        snap-x
        snap-mandatory
        no-scrollbar
        pb-4
        "
        >

        {
        (
            decoyMode
                ? decoyJournals.slice(0,5)
                : recentJournals
        ).map((journal) => (

            <div
                key={journal._id}
                className={`
                w-[85vw]
                min-w-[85vw]

                sm:w-[320px]
                sm:min-w-[320px]

                md:w-[350px]
                md:min-w-[350px]

                snap-center

                h-auto
                min-h-[370px]
                sm:min-h-[470px]
                flex
                flex-col
                backdrop-blur-xl
                rounded-3xl
                p-6
                shadow-lg
                border

                ${
                journal.favorite
                ? "bg-yellow-50 border-yellow-300"
                : "bg-white/60 border-white/30"
                }
                `}
            >

               <div className="flex justify-between items-start mb-2">

                    <h3 className="text-2xl font-bold text-purple-700">

                    {
                    journal.isPrivate
                    ? "🔒 "
                    : ""
                    }

                    {journal.title}

                    </h3>

                    <div className="mt-2 mb-3">

                        <span
                            className="
                                px-3
                                py-1
                                rounded-full
                                bg-purple-100
                                text-purple-700
                                text-xs
                                font-semibold
                            "
                        >
                            {journal.category || "Personal"}
                        </span>

                    </div>

                    <button
                        onClick={() =>
                            handleToggleFavorite(journal._id)
                        }
                        className="
                            text-2xl
                            hover:scale-125
                            transition-all
                            cursor-pointer
                        "
                    >
                        {journal.favorite ? "⭐" : "☆"}
                    </button>

                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">

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

                    {
                    journal.sentiment && (

                    <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-pink-100
                    text-pink-700
                    text-sm
                    font-semibold
                    "
                    >

                    {journal.sentiment.emotion}

                    </span>

                    )
                    }

                    {
                    journal.futureLetter && (

                    <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    whitespace-nowrap

                    ${
                    new Date() >= new Date(journal.futureDate)
                    ? "bg-green-100 text-green-700"
                    : "bg-indigo-100 text-indigo-700"
                    }
                    `}
                    >

                    {
                    new Date() >= new Date(journal.futureDate)
                    ? "Ready"
                    : "Letter"
                    }

                    </span>

                    )
                    }

                    <p className="text-sm text-gray-500">

                        {new Date(journal.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}

                    </p>

                </div>

                <p className="text-gray-600 line-clamp-3 sm:line-clamp-4">
                {journal.content}
                </p>

                {
                journal.highlight && (

                <div
                className="
                mt-5
                rounded-2xl
                bg-purple-50
                p-4
                border
                border-purple-100
                "
                >

                <p className="text-xs text-purple-500 mb-2">
                Highlight
                </p>

                <p className="italic text-gray-700 line-clamp-1 sm:line-clamp-2">
                "{journal.highlight}"
                </p>

                </div>

                )
                }

                <div className="flex-grow sm:flex-grow"></div>

                <button
                    onClick={() => {

                        if (decoyMode) {

                            setSelectedJournal(journal);

                            setShowJournalModal(true);

                            return;
                        }

                        if (journal.isPrivate) {

                            const expiry = sessionStorage.getItem(
                                "journalUnlockExpiry"
                            );

                            if (
                                expiry &&
                                Date.now() < Number(expiry)
                            ) {

                                handleOpenJournal(journal);

                            }

                            else {

                                setPendingJournal(journal);

                                setShowPinModal(true);

                            }

                        }

                        else {

                            handleOpenJournal(journal);

                        }

                    }}
                    className="
                        mt-5
                        mb-4
                        w-full
                        py-3
                        rounded-2xl
                        bg-purple-100
                        text-purple-700
                        font-semibold
                        hover:bg-purple-200
                        transition-all
                        cursor-pointer
                    "
                >
                    View Details
                </button>

                <div className="flex flex-col sm:flex-row gap-3">

                    <button
                        onClick={() => {

                            if (decoyMode) return;
                        
                            handleToggleFavorite(journal._id)
                        }}
                        className="
                            px-4
                            py-2
                            bg-yellow-500
                            text-white
                            rounded-xl
                            hover:scale-105
                            transition-all
                            cursor-pointer
                        "
                    >
                        {journal.favorite
                            ? "Unfavorite"
                            : "Favorite"}
                    </button>


                    <button
                        onClick={() => {
                            if (decoyMode) return;
                            
                            handleEditJournal(journal);
                        }}
                        className="
                            px-4
                            py-2
                            bg-green-500
                            text-white
                            rounded-xl
                            hover:scale-105
                            transition-all
                            cursor-pointer
                        "
                    >
                        Edit
                    </button>


                    <button
                        onClick={() => {

                            if (decoyMode) return;

                            handleDeleteJournal(journal._id)
                        }}
                        className="
                            px-4
                            py-2
                            bg-red-500
                            text-white
                            rounded-xl
                            hover:scale-105
                            transition-all
                            cursor-pointer
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        ))

    }

    </div>
    </div>

    <div className="sm:hidden space-y-4">

        {
        (decoyMode ? decoyJournals : filteredJournals).map((journal) => (

        <div
            key={journal._id}
            className="
            bg-white
            rounded-3xl
            shadow-lg
            p-5
            "
        >

            <h3 className="font-bold text-lg text-purple-700 line-clamp-1">
                {journal.title}
            </h3>

            <div className="flex gap-2 mt-3">

                <span
                className="
                px-3
                py-1
                rounded-full
                bg-indigo-100
                text-indigo-700
                text-xs
                "
                >
                    {journal.mood}
                </span>

                {
                journal.sentiment && (

                <span
                className="
                px-3
                py-1
                rounded-full
                bg-pink-100
                text-pink-700
                text-xs
                "
                >

                {journal.sentiment.emotion}

                </span>

                )
                }

                <p className="text-sm text-gray-500">

                        {new Date(journal.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}

                    </p>

            </div>

            <p className="text-gray-500 mt-4 line-clamp-2">
                {journal.content}
            </p>

            <button
                onClick={() => handleOpenJournal(journal)}
                className="
                mt-4
                w-full
                py-3
                rounded-2xl
                bg-purple-100
                text-purple-700
                font-semibold
                "
            >
                View Details
            </button>

        </div>

        ))
        }
            {filteredJournals.length === 0 && (

                <div
                    className="
                    col-span-full
                    bg-white/40
                    backdrop-blur-2xl
                    border
                    border-white/20
                    rounded-[32px]
                    p-10 md:p-16
                    text-center
                    shadow-[0_10px_40px_rgba(0,0,0,0.10)]
                "
                >
                    {searchTerm
                        ? `No journals found for "${searchTerm}"`
                        : "No journal entries yet"}
                </div>

                )}
        

        </div>
        </div>
        </div>

    {
    showDateEntriesModal && selectedDateJournal?.length > 0 && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-[10001]
    px-5
    "
    >

    <div
    className="
    bg-white
    rounded-[35px]
    max-w-[700px]
    w-full
    h-[85vh]
    overflow-hidden
    flex
    flex-col
    p-5 sm:p-8
    shadow-2xl
    relative
    "
    >

    <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
            Journal Entry
        </h2>

        <button
            onClick={() => setShowDateEntriesModal(false)}
            className="
            text-3xl
            text-gray-400
            hover:text-red-500
            cursor-pointer
            "
        >
            ×
        </button>

    </div>

    <div
    className="
    flex-1
    overflow-y-auto
    pr-2
    space-y-6
    "
    >

        {selectedDateJournal.map((journal) => (

            <div
                key={journal._id}
                className="
                p-6
                rounded-[28px]
                bg-purple-50
                border
                border-purple-100
                "
            >

                <h3 className="text-lg sm:text-2xl font-bold">
                    {journal.title}
                </h3>

                <div className="flex gap-3 mt-3 mb-4">

                    <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-purple-100
                    text-purple-700
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
                    "
                    >
                        {journal.mood}
                    </span>

                </div>

                <p className="text-gray-600 leading-8">
                    {journal.content}
                </p>

            </div>

        ))}

    </div>

    </div>

    </div>

    )
    }

    {
    showJournalModal && selectedJournal && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-[9999]
    px-5
    "
    >

    <div
    className="
    bg-white
    rounded-[35px]
    max-w-[700px]
    w-full
    h-[90vh]
    sm:h-[85vh]
    overflow-hidden
    shadow-2xl
    relative
    flex
    flex-col
    "
    >

    <div
    className="
    flex
    justify-between
    items-start
    p-5 sm:p-8
    pb-4
    border-b
    border-gray-100
    flex-shrink-0
    "
    >

        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">
            {selectedJournal.title}
        </h2>

        <button
            onClick={() => setShowJournalModal(false)}
            className="
                text-2xl sm:text-3xl
                text-gray-400
                hover:text-red-500
                cursor-pointer
            "
        >
            ×
        </button>

    </div>

    <div
    className="
    flex-1
    overflow-y-auto
    px-5 sm:px-8
    pb-5 sm:pb-8
    space-y-8
    custom-scroll
    "
    >

    <div className="flex gap-3 flex-wrap">

        <span className="
        px-4 py-2 rounded-full
        bg-purple-100 text-purple-700
        ">
            {selectedJournal.category}
        </span>

        <span className="
        px-4 py-2 rounded-full
        bg-indigo-100 text-indigo-700
        ">
            {selectedJournal.mood}
        </span>

    </div>

    <div>

        <h3 className="text-xl font-bold mb-4">
            Journal Entry
        </h3>

        <p className="text-gray-600 leading-8">
            {selectedJournal.content}
        </p>

        {
            selectedJournal.attachments?.map((file,index)=>(

            <div
            key={index}
            className="mt-6"
            >

            {
            file.type.startsWith("image/") && (

            <img
            src={file.url}
            className="
            w-full
            max-w-[250px]
            h-auto
            rounded-[20px]
            object-cover
            rounded-[20px]
            "
            />

            )
            }

            {
            file.type === "application/pdf" && (

            <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    px-4
                    py-3
                    rounded-2xl
                    bg-red-50
                    text-red-600
                    font-semibold
                    inline-block
                "
            >
                Open {file.name}
            </a>

            )
            }

            {
            file.type.startsWith("audio/") && (

            <audio controls className="w-full">

            <source src={file.url}/>

            </audio>

            )
            }

            </div>

            ))
            }

    </div>

    {
    selectedJournal.gratitude?.length > 0 && (

    <div
    className="
    bg-yellow-50
    rounded-[28px]
    border
    border-yellow-200
    p-6
    "
    >

    <h3 className="text-xl font-bold text-yellow-700 mb-4">
        Gratitude Corner
    </h3>

    <div className="space-y-3 text-gray-700">

        {
            selectedJournal.gratitude[0] &&
            <p>{selectedJournal.gratitude[0]}</p>
        }

        {
            selectedJournal.gratitude[1] &&
            <p>{selectedJournal.gratitude[1]}</p>
        }

        {
            selectedJournal.gratitude[2] &&
            <p>{selectedJournal.gratitude[2]}</p>
        }

    </div>

    </div>

    )
    }

    {
    selectedJournal.highlight && (

    <div
    className="
    bg-gradient-to-r
    from-purple-50
    to-pink-50
    rounded-[28px]
    p-6
    border
    border-purple-200
    "
    >

    <h3 className="text-xl font-bold text-purple-700 mb-4">
    Highlight Of The Day
    </h3>

    <p
    className="
    text-gray-700
    leading-8
    italic
    text-lg
    "
    >
    "{selectedJournal.highlight}"
    </p>

    </div>

    )
    }

    {
    selectedJournal.futureLetter && (

    <div
    className="
    bg-indigo-50
    rounded-[28px]
    p-6
    border
    border-indigo-200
    "
    >

    <h3 className="text-xl font-bold text-indigo-700 mb-5">
    Letter To Future Self
    </h3>

    {
    isFutureLetterUnlocked()

    ?

    (

    <>

    <p
    className="
    text-gray-700
    leading-8
    italic
    whitespace-pre-wrap
    "
    >
    {selectedJournal.futureLetter}
    </p>

    <p className="mt-5 text-sm text-indigo-500">

    Opened on:

    {
    new Date(
    selectedJournal.futureDate
    ).toLocaleDateString()
    }

    </p>

    </>

    )

    :

    (

    <div className="text-center py-6">

    <div className="text-6xl mb-5">
    🔒
    </div>

    <h4 className="text-2xl font-bold text-indigo-700">
    This message is waiting for future you
    </h4>

    <p className="text-gray-500 mt-4">

    <p className="mt-4 text-purple-600 font-semibold">

    ⏳

    {getDaysLeft(
    selectedJournal.futureDate
    )}

    day remaining

    </p>

    <br />

    <strong>

    {
    new Date(
    selectedJournal.futureDate
    ).toLocaleDateString(
    "en-US",
    {
    month:"long",
    day:"numeric",
    year:"numeric"
    }
    )
    }

    </strong>

    ❤️

    </p>

    </div>

    )

    }

    </div>

    )
    } 

    {
    selectedJournal.aiReflection && (

    <div
    className="
    bg-purple-50
    rounded-[28px]
    p-6
    space-y-6
    "
    >

    <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
        AI Reflection
    </h3>

    <div>

    <p className="text-gray-500">
    Main Theme
    </p>

    <p className="font-bold">
    {selectedJournal.aiReflection.theme}
    </p>

    </div>

    <div>

    <p className="text-gray-500">
    Highlight Of The Day
    </p>

    <p>
    "{selectedJournal.aiReflection.highlight}"
    </p>

    </div>

    <div>

    <p className="text-gray-500">
    Reflection Question
    </p>

    <p>
    {selectedJournal.aiReflection.question}
    </p>

    </div>

    <div>

    <p className="text-gray-500">
    Tiny Step For Tomorrow
    </p>

    <p>
    {selectedJournal.aiReflection.tinyStep}
    </p>

    </div>

    </div>

    )
    }

    {
    selectedJournal.sentiment && (

    <div
    className="
    bg-pink-50
    rounded-[28px]
    p-6
    space-y-5
    border
    border-pink-100
    "
    >

    <h3 className="text-xl sm:text-2xl font-bold text-pink-700">

    AI Emotional Analysis

    </h3>

    <div>

    <p className="text-gray-500">

    Dominant Emotion

    </p>

    <p className="font-bold">

    {selectedJournal.sentiment.emotion}

    </p>

    </div>

    <div>

    <p className="text-gray-500">

    Sentiment

    </p>

    <p className="font-bold">

    {selectedJournal.sentiment.sentiment}

    </p>

    </div>

    <div>

    <p className="text-gray-500">

    Confidence

    </p>

    <p className="font-bold">

    {

    Math.round(
    selectedJournal.sentiment.score * 100
    )

    }%

    </p>

    </div>

    <div>

    <p className="text-gray-500">

    Emotional Insight

    </p>

    <p>

    {selectedJournal.sentiment.insight}

    </p>

    </div>

    </div>

    )

    }

    </div>
    </div>
    </div>

    )
    }

    {
    showVoiceModal && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-[9999]
    px-5
    "
    >

    <div
    className="
    bg-white
    rounded-[32px]
    max-w-[400px]
    w-full
    mx-4
    p-5 sm:p-6
    shadow-2xl
    relative
    "
    >

    <button
    onClick={() => {

        stopListening();

        setShowVoiceModal(false);

    }}
    className="
    absolute
    top-6
    right-7
    text-3xl
    text-gray-400
    hover:text-red-500
    cursor-pointer
    "
    >
    ×
    </button>


    <div className="flex flex-col items-center gap-5">

        <div className="relative">

            <div
                style={{
                    transform: `scale(${1 + volume * 0.02})`
                }}
                className="
                    w-[55px]
                    h-[55px]
                    sm:w-[65px]
                    sm:h-[65px]
                    rounded-full
                    bg-gradient-to-r
                    from-purple-600
                    to-fuchsia-500
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-[0_0_30px_rgba(168,85,247,0.4)]
                    transition-all
                    duration-100
                "
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="9" y="2" width="6" height="11" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
            </div>

        </div>

        <div className="text-center">

            <h2 className="text-xl sm:text-2xl font-bold text-purple-700">
                Voice Journal
            </h2>

            <p className="text-gray-500 text-sm mt-2">
                Speak freely and capture your thoughts
            </p>

        </div>

        <button
            onClick={
                isListening
                    ? stopListening
                    : handleVoiceInput
            }
            className={`
                w-full
                py-4
                rounded-2xl
                text-white
                font-semibold
                transition-all
                cursor-pointer

                ${
                    isListening
                        ? "bg-red-500 animate-pulse"
                        : "bg-gradient-to-r from-purple-600 to-fuchsia-500"
                }
            `}
        >
            {
                isListening
                    ? "Stop Recording"
                    : "Start Recording"
            }
        </button>

        {transcriptText && (

            <div
                className="
                    w-full
                    rounded-[24px]
                    bg-purple-50
                    p-5
                    border border-purple-100
                "
            >

                <p className="font-semibold text-purple-700 mb-3">
                    Voice Preview
                </p>

                <p className="text-gray-700 leading-7">
                    {transcriptText}
                </p>

                <div className="flex gap-3 mt-5">

                    <button
                        onClick={handleAddVoiceToJournal}
                        className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-green-500
                            text-white
                            font-semibold
                            cursor-pointer
                        "
                    >
                        Add To Journal
                    </button>

                    <button
                        onClick={handleClearVoice}
                        className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-gray-200
                            text-gray-700
                            font-semibold
                            cursor-pointer
                        "
                    >
                        Clear
                    </button>

                </div>

            </div>

        )}

        {audioURL && (

            <div
                className="
                    w-full
                    rounded-[24px]
                    bg-indigo-50
                    p-5
                    border border-indigo-100
                "
            >

                <p className="font-semibold text-indigo-700 mb-4">
                    Playback
                </p>

                <audio controls className="w-full">

                    <source
                        src={audioURL}
                        type="audio/webm"
                    />

                </audio>

            </div>

        )}

    </div>
    </div>

    </div>

    )
    }

    {
    showPinModal && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-[9999]
    "
    >

    <div
    className="
    bg-white
    rounded-[35px]
    p-5 sm:p-8
    w-full
    max-w-[400px]
    mx-4
    shadow-2xl
    relative
    "
    >

    <button
        onClick={() => {

            setShowPinModal(false);

            setEnteredPin("");

        }}
        className="
            absolute
            top-5
            right-6
            text-3xl
            text-gray-400
            hover:text-red-500
            transition-all
            cursor-pointer
        "
    >
        ×
    </button>

    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-5">
    Private Journal
    </h2>

    <p className="text-gray-500 mb-5">
    Enter PIN to unlock this journal
    </p>

    <input
    type="password"
    value={enteredPin}
    onChange={(e)=>setEnteredPin(e.target.value)}
    placeholder="PIN"
    className="
    w-full
    p-4
    rounded-2xl
    border
    border-gray-300
    mb-5
    "
    />

    <button
    onClick={verifyPin}
    className="
    w-full
    py-4
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    to-fuchsia-500
    text-white
    font-semibold
    cursor-pointer
    "
    >
    Unlock Journal
    </button>

    <button

    onClick={unlockWithBiometrics}

    className="
    mt-4
    w-full
    py-4
    rounded-2xl
    bg-green-500
    text-white
    cursor-pointer
    "

    >

    Use Face ID

    </button>

    </div>

    </div>

    )
    }

    {
    showExitDecoyModal && (

    <div
    className="
    fixed
    inset-0
    bg-black/40
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-[9999]
    "
    >

    <div
    className="
    bg-white
    rounded-[35px]
    w-full
    max-w-[400px]
    mx-4
    p-5 sm:p-8
    shadow-2xl
    "
    >

    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-5">

    Exit Decoy Mode

    </h2>

    <p className="text-gray-500 mb-5">

    Enter your REAL Master PIN

    </p>

    <input

    type="password"

    value={exitPin}

    onChange={(e)=>setExitPin(e.target.value)}

    className="
    w-full
    p-4
    rounded-2xl
    border
    border-gray-300
    mb-5
    "

    />

    <button

    onClick={exitDecoyMode}

    className="
    w-full
    py-4
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    to-fuchsia-500
    text-white
    font-semibold
    cursor-pointer
    "

    >

    Exit Decoy Mode

    </button>

    </div>

    </div>

    )
    }

    {
    showMailboxModal && (

    <div
    className="
    fixed inset-0
    bg-black/40
    backdrop-blur-sm
    flex items-center justify-center
    z-[9999]
    px-4
    "
    >

    <div
    className="
    bg-white
    w-full
    max-w-[720px]

    max-h-[80vh]
    sm:h-[80vh]

    h-auto

    rounded-[30px]
    sm:rounded-[40px]

    shadow-2xl

    overflow-hidden

    flex
    flex-col
    "
    >

    <div
    className="
    text-2xl sm:text-3xl
    px-5 sm:px-8
    py-5 sm:py-7
    border-b
    border-purple-100
    flex
    justify-between
    items-center
    "
    >

    <div>

    <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">

    Future Mailbox

    </h2>

    <p className="text-base sm:text-xl leading-6 text-gray-500 mt-1">
    Messages from your past self
    </p>

    </div>

    <button
    onClick={() => setShowMailboxModal(false)}
    className="
    w-12
    h-12
    rounded-full
    bg-purple-50
    text-3xl
    text-gray-500
    hover:text-red-500
    transition-all
    cursor-pointer
    "
    >
    ×
    </button>

    </div>

    <div className="px-5 sm:px-8 pt-6">

    <div
    className="
    grid
    grid-cols-2
    gap-4
    "
    >

    <div
    className="
    bg-green-50
    border
    border-green-200
    rounded-3xl
    p-5
    "
    >

    <div className="flex items-center justify-between">

    <div>

    <p className="text-green-600 text-sm">
    Ready To Open
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mt-1">
    {futureLettersReady.length}
    </h2>

    </div>

    </div>

    </div>

    <div
    className="
    bg-purple-50
    border
    border-purple-200
    rounded-3xl
    p-5
    "
    >

    <div className="flex items-center justify-between">

    <div>

    <p className="text-indigo-600 text-sm">
    Coming Soon
    </p>

    <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mt-1">
    {futureLettersLocked.length}
    </h2>

    </div>

    <div className="text-4xl">
    🔒
    </div>

    </div>

    </div>

    </div>

    </div>

    <div
    className="
    sm:flex-1
    overflow-y-auto
    max-h-[55vh]
    px-5 sm:px-8
    py-6
    space-y-6
    "
    >

    {
    futureLettersReady.length > 0 && (

    <div>

    <h2 className="text-2xl font-bold text-green-700 mb-5">

    Ready To Open

    </h2>

    <div className="space-y-4">

    {
    futureLettersReady.map(letter => (

    <div
    key={letter._id}
    className="
    bg-green-50
    border
    border-green-100
    rounded-[30px]
    p-6
    shadow-sm
    "
    >

    <div className="flex justify-between items-start">

    <div>

    <h3 className="text-xl font-bold text-gray-800">

    {letter.title}

    </h3>

    <p className="text-gray-500 mt-3">

    Written on {" "}

    {
    new Date(letter.createdAt)
    .toLocaleDateString()
    }

    </p>

    </div>

    <button

    onClick={() => {

    setShowMailboxModal(false);

    handleOpenJournal(letter);

    }}

    className="
    px-4 sm:px-6
    py-2 sm:py-3
    text-sm sm:text-base
    rounded-2xl
    bg-green-500
    text-white
    font-semibold
    hover:bg-green-600
    transition-all
    cursor-pointer
    "
    >

    Open

    </button>

    </div>

    </div>

    ))
    }

    </div>

    </div>

    )
    }

    {
    futureLettersLocked.length > 0 && (

    <div>

    <h2 className="text-2xl font-bold text-indigo-700 mb-5">

    Coming Soon

    </h2>

    <div className="space-y-4">

    {
    futureLettersLocked.map(letter => (

    <div
    key={letter._id}
    className="
    bg-purple-50
    border
    border-purple-100
    rounded-[30px]
    p-6
    shadow-sm
    "
    >

    <h3 className="text-xl font-bold">

    {letter.title}

    </h3>

    <p className="mt-4 text-indigo-600">

    {getDaysLeft(letter.futureDate)} days remaining

    </p>

    <p className="mt-2 text-gray-500">

    Opens on {" "}

    {
    new Date(letter.futureDate)
    .toLocaleDateString()
    }

    </p>

    <div
    className="
    inline-flex
    mt-5
    px-5
    py-2
    rounded-full
    bg-purple-100
    text-indigo-700
    font-medium
    "
    >

    Locked

    </div>

    </div>

    ))
    }

    </div>

    </div>

    )
    }

    {
    futureLettersReady.length === 0 &&
    futureLettersLocked.length === 0 && (

    <div className="text-center py-20">

    <h3 className="text-2xl font-bold text-purple-700">

    No future letters yet

    </h3>

    <p className="text-gray-500 mt-4">

    Write a message to your future self and it will appear here

    </p>

    </div>

    )
    }

    </div>

    <div
    className="
    mx-8
    mb-6
    rounded-3xl
    bg-gradient-to-r
    from-pink-50
    to-purple-50
    border
    border-purple-100
    p-4
    text-center
    "
    >

    <p className="text-purple-700">

    Keep writing beautiful memories today for a better tomorrow

    </p>

    </div>

    </div>

    </div>

    )
    }

    </div>
    </div>

    {
    showJournalCalendar && (

    <div className="
    fixed inset-0
    bg-black/40
    backdrop-blur-sm
    flex items-center justify-center
    z-[9999]
    px-5
    ">

    <div className="
    bg-white
    rounded-[40px]
    max-w-[950px]
    w-full
    p-4 sm:p-8
    shadow-2xl
    ">

        <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

                <h2 className="text-xl sm:text-2xl whitespace-nowrap font-bold text-purple-800">

                    Journal Calendar

                </h2>

                    <button
                        onClick={() => setShowJournalCalendar(false)}
                        className="
                        text-3xl
                        text-gray-400
                        hover:text-red-500
                        transition-all
                        cursor-pointer
                        px-3
                        "
                    >
                        ×
                    </button>

                    </div>

                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        text-xl
                        font-semibold
                        text-gray-700
                        "
                    >

                    <button
                        onClick={previousMonth}
                        className="text-lg font-bold"
                    >
                        ‹
                    </button>

                    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                        {monthNames[month]} {year}
                    </span>

                    <button
                        onClick={nextMonth}
                        className="text-lg font-bold"
                    >
                        ›
                    </button>

                </div>

        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-4">

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

        <div className="grid grid-cols-7 gap-1 sm:gap-3">

            {calendarCells.map((cell, index) => {

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

                        onClick={() => {

                            if (cell.journals.length > 0) {

                                setShowJournalCalendar(false);

                                setSelectedDateJournal(cell.journals);

                                setShowDateEntriesModal(true);

                            }

                        }}

                        className={`
                            h-10 sm:h-14
                            rounded-xl
                            flex
                            flex-col
                            items-center
                            justify-center
                            transition-all
                            hover:scale-105
                            cursor-pointer

                            ${
                                cell.journals.length === 0
                                    ? "bg-gray-50"
                                    : cell.journals[0].mood === "😊 Happy"
                                    ? "bg-green-100"
                                    : cell.journals[0].mood === "😌 Calm"
                                    ? "bg-emerald-100"
                                    : cell.journals[0].mood === "😐 Neutral"
                                    ? "bg-yellow-100"
                                    : cell.journals[0].mood === "😔 Low"
                                    ? "bg-orange-100"
                                    : "bg-red-100"
                            }

                            ${
                                cell.journal
                                ? "cursor-pointer hover:ring-2 hover:ring-purple-400"
                                : ""
                            }
                        `}
                    >

                        <span className="text-[10px] sm:text-xs text-gray-500">

                            {cell.day}

                        </span>

                        {
                            cell.journals.length > 0 && (

                                <span
                                className="
                                text-[10px] sm:text-[15px]
                                font-semibold
                                text-gray-700
                                mt-1
                                "
                                >
                                    {cell.journals.length} 
                                    {cell.journals.length > 1 ? " entries" : " entry"}
                                </span>

                            )
                        }

                    </div>

                );

            })}

        </div>

        <div className="flex gap-3 mt-8 overflow-x-auto pb-2 hide-scrollbar sm:flex-wrap">

                <div className="bg-green-100 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    Happy Journals
                </div>

                <div className="bg-emerald-100 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    Calm Journals
                </div>

                <div className="bg-yellow-100 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    Neutral Journals
                </div>

                <div className="bg-orange-100 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    Low Journals
                </div>

                <div className="bg-red-100 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    Sad Journals
                </div>

            </div>

            </div>

    </div>

    )
    }

        <button
            onClick={() => {
                document
                journalFormRef.current?.scrollIntoView({
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
</>
);
}

export default Journal;