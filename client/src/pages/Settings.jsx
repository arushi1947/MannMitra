import {
  FaMoon,
  FaBell,
  FaLock,
  FaUserShield,
  FaChevronRight,
  FaDownload,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Settings() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [decoyPin,setDecoyPin]=useState("");
  const [newDecoyPin,setNewDecoyPin] = useState("");
  const [masterPin,setMasterPin] = useState("");
  const [hasDecoyPin, setHasDecoyPin] = useState(false);
  const [currentPin,setCurrentPin]=useState("");
  const [newPin,setNewPin]=useState("");
  const [confirmPin,setConfirmPin]=useState("");
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [journalLocked, setJournalLocked] = useState(false);
  const [password, setPassword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const [settings, setSettings] = useState({
    reminderNotifications: true,
    dailyMoodReminder: true,
    journalReminder: false,
    soundEffects: true,
    });
    const [showAccount, setShowAccount] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

    fetch(`http://127.0.0.1:8000/get-settings/${email}`)

        .then((res) => res.json())

        .then((data) => {

        if (data.settings) {

            setSettings(data.settings);

            localStorage.setItem(
                "settings",
                JSON.stringify(data.settings)
                );

        }

        setLoading(false);

        })

        .catch((error) => {

        console.log(error);

        setLoading(false);

        });

    }, []);

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/get-devices/${email}`)

            .then((res) => res.json())

            .then((data) => {

            setDevices(data);

            })

            .catch((err) => console.log(err));

        }, []);

    useEffect(() => {

        if (window.innerWidth >= 768) {

            setShowAccount(true);

            setShowNotifications(true);

            setShowPrivacy(true);

        }

        const fetchFaceIdStatus = async () => {

            try {

                const response = await API.get(
                    `/face-id-status/${user.email}`
                );

                setFaceIdEnabled(
                    response.data.enabled
                );

            }

            catch(error){

                console.log(error);

            }

        };

        const fetchDecoyStatus = async () => {

            try {

                const response = await API.get(
                    `/decoy-pin-status/${user.email}`
                );

                setHasDecoyPin(
                    response.data.hasDecoyPin
                );

            }

            catch(error){

                console.log(error);

            }

        };

        fetchFaceIdStatus();

        fetchDecoyStatus();

        const fetchLockStatus = async () => {

            try {

                const response =
                await API.get(
                    `/journal-lock-status/${user.email}`
                );

                setJournalLocked(
                    response.data.locked
                );

            }

            catch(error){

                console.log(error);

            }

        };

        fetchLockStatus();

    }, []);

  const toggleSetting = async (key) => {

    const updatedSettings = {

        ...settings,

        [key]: !settings[key]

    };

    setSettings(updatedSettings);

    localStorage.setItem(
        "settings",
        JSON.stringify(updatedSettings)
        );

    try {

        await fetch(
        "http://127.0.0.1:8000/save-settings",
        {

            method: "POST",

            headers: {
            "Content-Type": "application/json"
            },

            body: JSON.stringify({

            email,

            settings: updatedSettings

            })

        }
        );

    } catch (error) {

        console.log(error);

    }

    };
  const [activeModal, setActiveModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const getPasswordStrength = () => {

    if (newPassword.length < 4) return "Weak";

    if (newPassword.length < 8) return "Medium";

    return "Strong";
    };

    if (loading) {

    return (

        <div
        className="
            h-screen
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-[#f3e8ff]
            via-[#fdf4ff]
            to-[#ede9fe]
        "
        >

        <div
            className="
            w-16
            h-16
            border-4
            border-purple-300
            border-t-purple-700
            rounded-full
            animate-spin
            "
        />

        </div>

    );

    }

    const saveMasterPin = async () => {

        try {

            await API.post(

                "/set-master-pin",

                {

                    email: user.email,

                    pin: masterPin

                }

            );

            alert(
                "Master PIN saved"
            );

        }

        catch(error){

            console.log(error);

        }

    };

    const saveDecoyPin = async () => {

        try {

            await API.post(

                "/set-decoy-pin",

                {

                    email: user.email,

                    pin: decoyPin

                }

            );

            alert(

                "Decoy PIN saved"

            );

            setDecoyPin("");
            setMasterPin("");
            setHasDecoyPin(true);

        }

        catch(error){

            console.log(error);

        }

    };

    const changeDecoyPin = async () => {

        try {

            await API.put(

                "/change-decoy-pin",

                {

                    email: user.email,

                    masterPin,

                    newDecoyPin: decoyPin

                }

            );

            alert("Decoy PIN updated");

            setDecoyPin("");
            setMasterPin("");
            
        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Failed to update Decoy PIN"

            );

        }

    };

    const changeMasterPin = async () => {

        if (newPin !== confirmPin) {

            alert("PINs do not match");

            return;

        }

        try {

            await API.put(

                "/change-master-pin",

                {

                    email: user.email,

                    currentPin,

                    newPin

                }

            );

            alert(

                "Master PIN updated successfully"

            );

            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Failed to update PIN"

            );

        }

    };

    const handleForgotMasterPin = async () => {

        try {

            await API.post(

                "/forgot-master-pin",

                {

                    email: user.email

                }

            );

            alert(

                "A reset link has been sent to your email."

            );

        }

        catch (error) {

            alert(

                "Unable to send reset link."

            );

        }

    };

    const removeDecoyPin = async () => {

        try {

            await API.delete(

                "/remove-decoy-pin",

                {

                    data: {

                        email: user.email,

                        masterPin

                    }

                }

            );

            alert("Decoy PIN removed");

            setDecoyPin("");
            setMasterPin("");
            setHasDecoyPin(false);
        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Failed to remove Decoy PIN"

            );

        }

    };

  return (
    <>
    <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
    />

    <div
        className="
        min-h-screen
        overflow-x-hidden

        overflow-y-auto

        ml-0
        lg:ml-[250px]

        bg-gradient-to-br
        from-[#f3e8ff]
        via-[#fdf4ff]
        to-[#ede9fe]

        p-4
        sm:p-6
        lg:p-8
        "
    >

      <div className="w-full max-w-7xl mx-auto">

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

        <div className="mt-2 mb-10 ml-14 lg:ml-0">

          <h1
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-gray-900
              mb-3
            "
          >
            Settings
          </h1>

          <p className="text-gray-500 text-lg">
            Personalize your wellness experience
          </p>

          {
            user?.googleAuth && (

                <div
                className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    bg-white/70
                    px-4
                    py-2
                    rounded-2xl
                    shadow-sm
                    text-sm
                    text-gray-700
                "
                >

                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="google"
                    className="w-4 h-4"
                />

                Signed in with Google

                </div>

            )
            }

        </div>

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-5
                mt-10
            "
            >

        <div
            className="
                bg-white/70
                backdrop-blur-xl
                rounded-3xl
                p-4
                shadow-xl
            "
            >


            <div
                onClick={() => setShowAccount(!showAccount)}
                className="
                    md:pointer-events-none

                    flex
                    items-center
                    justify-between

                    cursor-pointer

                    mb-3
                "
                >
                <h2
                    className="
                    text-xl
                    font-bold
                    text-purple-700
                    "
                >
                    Account Settings
                </h2>

                <div className="md:hidden">
                    {showAccount ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                </div>

            <div
                className={`
                    space-y-4

                    ${
                    showAccount
                        ? "block"
                        : "hidden"
                    }

                    md:block
                `}
                >

            <button
                onClick={() => setActiveModal("name")}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
                >

                <div>

                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Change Name
                    </h3>

                    <p className="text-gray-500 text-sm">
                    Update your display name
                    </p>

                </div>

                <FaChevronRight className="text-gray-400" />

                </button>

            <button
                onClick={() => setActiveModal("email")}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
                >

                <div>

                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Change Email
                    </h3>

                    <p className="text-gray-500 text-sm">
                    Update your account email
                    </p>

                </div>

                <FaChevronRight className="text-gray-400" />

                </button>

            {
                !user?.googleAuth && (

                    <button
                        onClick={() => setActiveModal("password")}
                        className="
                            w-full
                            flex
                            items-center
                            justify-between
                            p-4
                            rounded-2xl
                            bg-white
                            shadow-md
                            hover:shadow-xl
                            transition-all
                            cursor-pointer
                        "
                    >

                        <div>

                            <h3 className="font-bold text-base md:text-lg text-gray-900">
                            Change Password
                            </h3>

                            <p className="text-gray-500 text-sm">
                            Secure your account password
                            </p>

                        </div>

                        <FaChevronRight className="text-gray-400" />

                    </button>

                )
                }

            </div>

            </div>

        <div
            className="
                bg-white/70
                backdrop-blur-xl
                rounded-3xl
                p-4
                shadow-xl
            "
            >

            <div
                onClick={() =>
                    setShowNotifications(!showNotifications)
                }
                className="
                    md:pointer-events-none

                    flex
                    justify-between
                    items-center

                    cursor-pointer

                    mb-3
                "
                >
                <h2
                    className="
                    text-xl
                    font-bold
                    text-purple-700
                    "
                >
                    Notifications
                </h2>

                <div className="md:hidden">
                    {showNotifications
                    ? <FaChevronUp />
                    : <FaChevronDown />}
                </div>
                </div>

            <div
                className={`
                    space-y-4

                    ${
                    showNotifications
                        ? "block"
                        : "hidden"
                    }

                    md:block
                `}
                >

            <div
                className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-white
                shadow-md
                "
            >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Reminder Notifications
                </h3>

                <p className="text-gray-500 text-sm">
                    Enable reminder alerts
                </p>

                </div>

                <input
                    type="checkbox"
                    checked={settings.reminderNotifications}
                    onChange={() => toggleSetting("reminderNotifications")}
                    />

            </div>

            <div
                className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-white
                shadow-md
                "
            >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Daily Mood Reminder
                </h3>

                <p className="text-gray-500 text-sm">
                    Track your mood daily
                </p>

                </div>

                <input
                    type="checkbox"
                    checked={settings.dailyMoodReminder}
                    onChange={() => toggleSetting("dailyMoodReminder")}
                    />

            </div>

            <div
                className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-white
                shadow-md
                "
            >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Journal Reminder
                </h3>

                <p className="text-gray-500 text-sm">
                    Never miss journaling
                </p>

                </div>

                <input
                    type="checkbox"
                    checked={settings.journalReminder}
                    onChange={() => toggleSetting("journalReminder")}
                    />

            </div>

            <div
                className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-white
                shadow-md
                "
            >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Sound Effects
                </h3>

                <p className="text-gray-500 text-sm">
                    Enable app sounds
                </p>

                </div>

                <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={() => toggleSetting("soundEffects")}
                    />

            </div>

            </div>

                </div>

                <div
                    className="
                        bg-white/70
                        backdrop-blur-xl
                        rounded-3xl
                        p-4
                        shadow-xl
                    "
                    >

            <div
                onClick={() =>
                    setShowPrivacy(!showPrivacy)
                }
                className="
                    md:pointer-events-none

                    flex
                    items-center
                    justify-between

                    cursor-pointer

                    mb-3
                "
                >
                <h2
                    className="
                    text-xl
                    font-bold
                    text-purple-700
                    "
                >
                    Privacy & Security
                </h2>

                <div className="md:hidden">
                    {showPrivacy
                    ? <FaChevronUp />
                    : <FaChevronDown />}
                </div>
                </div>

            <div
                className={`
                    space-y-4

                    ${
                    showPrivacy
                        ? "block"
                        : "hidden"
                    }

                    md:block
                `}
                >

            <button
                onClick={() => setActiveModal("masterPin")}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
            >
                <div>

                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                        Master PIN
                    </h3>

                    <p className="text-gray-500 text-sm">
                        Secure private journals
                    </p>

                </div>

                <FaChevronRight className="text-gray-400" />

            </button>

            <button
                onClick={() => setActiveModal("decoyPin")}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
            >
                <div>

                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                        Decoy PIN
                    </h3>

                    <p className="text-gray-500 text-sm">
                        Emergency safe mode
                    </p>

                </div>

                <FaChevronRight className="text-gray-400" />

            </button>

            <div
            className="
            w-full
            p-4
            rounded-2xl
            bg-white
            shadow-md
            "
            >

            <h3 className="font-bold text-base md:text-lg text-gray-900">

            Emergency Lock Mode

            </h3>

            <p className="text-gray-500 text-sm mt-1">

            {
            journalLocked
            ?
            "Journals Locked"
            :
            "Protected"
            }

            </p>

            </div>

            <button
                onClick={() => setActiveModal("faceid")}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
            >
                <div>

                    <h3 className="font-bold text-base md:text-lg text-gray-900">
                        Face ID / Fingerprint
                    </h3>

                    <p className="text-gray-500 text-sm">
                        Unlock journals with biometrics
                    </p>

                </div>

                <FaChevronRight className="text-gray-400" />

            </button>

            <button
                onClick={() => setShowLogoutModal(true)}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
                >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Logout All Devices
                </h3>

                <p className="text-gray-500 text-sm">
                    Sign out from every device
                </p>

                </div>

                <FaChevronRight className="text-gray-400" />

            </button>

            <button
                onClick={async () => {

                    setDownloading(true);

                    try {

                        const response = await fetch(
                            `http://127.0.0.1:8000/download-user-data/${email}`
                        );

                        const blob = await response.blob();

                        const url = window.URL.createObjectURL(blob);

                        const a = document.createElement("a");

                        a.href = url;

                        a.download = "mannmitra-data.zip";

                        document.body.appendChild(a);

                        a.click();

                        a.remove();

                        window.URL.revokeObjectURL(url);

                    } catch (error) {

                        console.log(error);

                    }

                    setDownloading(false);

                }}

                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-white
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    cursor-pointer
                "
                >

                <div>

                <h3 className="font-bold text-base md:text-lg text-gray-900">
                    Download Data
                </h3>

                <p className="text-gray-500 text-sm">
                    Export reminders and journals
                </p>

                </div>

                <FaChevronRight className="text-gray-400" />

            </button>

            <button
                onClick={() => setShowDeleteModal(true)}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-red-50
                    border
                    border-red-200
                    hover:bg-red-100
                    transition-all
                    cursor-pointer
                "
                >

                <div>

                <h3 className="font-bold text-base md:text-lg text-red-500">
                    Delete Account
                </h3>

                <p className="text-red-400 text-sm">
                    Permanently remove account
                </p>

                </div>

                <FaChevronRight className="text-red-400" />

            </button>

            </div>

            </div>

            </div>

            </div>

            {
                activeModal === "name" && (

                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                    <div className="bg-white w-[95%] max-w-[450px] rounded-3xl p-5 md:p-8 shadow-2xl">

                        <h2 className="text-4xl font-bold text-purple-700 mb-6">
                        Change Display Name
                        </h2>

                        <div className="mb-5">

                        <p className="text-gray-500 mb-2">
                            Current Name
                        </p>

                        <div className="bg-gray-100 rounded-2xl p-4 text-lg">

                            {
                                JSON.parse(
                                    localStorage.getItem("user")
                                )?.name
                            }

                        </div>

                        </div>

                        <input
                        type="text"
                        placeholder="Enter new name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full p-4 rounded-2xl border outline-none mb-6"
                        />

                        <div className="flex flex-col md:flex-row gap-4">

                        <button

                            onClick={async () => {

                                try {

                                const token =
                                    localStorage.getItem("token");

                                const response = await fetch(
                                    "http://127.0.0.1:8000/change-name",
                                    {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type": "application/json",

                                        Authorization: `Bearer ${token}`
                                    },

                                    body: JSON.stringify({
                                        newName
                                    })
                                    }
                                );

                                const data = await response.json();

                                alert(data.message);

                                const user = JSON.parse(
                                    localStorage.getItem("user")
                                );

                                user.name = newName;

                                localStorage.setItem(
                                    "user",
                                    JSON.stringify(user)
                                );

                                setActiveModal(null);

                                } catch (error) {

                                console.log(error);

                                }

                            }}

                            className="
                                flex-1
                                py-4
                                rounded-2xl
                                bg-gradient-to-r
                                from-purple-600
                                to-pink-500
                                text-white
                                font-bold
                                cursor-pointer
                            "
                            >

                            Save Changes

                            </button>

                        <button
                            onClick={() => setActiveModal(null)}
                            className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold cursor-pointer"
                        >
                            Cancel
                        </button>

                        </div>

                    </div>

                    </div>
                )
                }

                {
                    activeModal === "email" && (

                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                        <div className="bg-white w-[95%] max-w-[500px] rounded-3xl p-5 md:p-8 shadow-2xl">

                            <h2 className="text-4xl font-bold text-purple-700 mb-6">
                            Change Email
                            </h2>

                            <div className="space-y-4">

                            <input
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full p-4 rounded-2xl border outline-none"
                                />

                            <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-4 rounded-2xl border outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="
                                    w-full
                                    p-4
                                    rounded-2xl
                                    border
                                    outline-none
                                "
                                />

                            </div>

                            {
                            verificationSent && (

                                <p className="text-green-600 mt-4 font-semibold">
                                Verification email sent
                                </p>
                            )
                            }

                            <div className="flex gap-4 mt-6">

                            <button

                                onClick={async () => {

                                    try {

                                    const token =
                                        localStorage.getItem("token");

                                    const response = await fetch(
                                        "http://127.0.0.1:8000/send-email-otp",
                                        {
                                            method: "POST",

                                            headers: {
                                            "Content-Type": "application/json"
                                            },

                                            body: JSON.stringify({
                                            newEmail
                                            })
                                        }
                                        );

                                    const data = await response.json();

                                    alert(data.message);

                                    setVerificationSent(true);

                                    } catch (error) {

                                    console.log(error);

                                    }

                                }}

                                className="
                                    flex-1
                                    py-4
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-purple-600
                                    to-pink-500
                                    text-white
                                    font-bold
                                    cursor-pointer
                                "
                                >

                                Send Verification

                                </button>

                                <button

                                    onClick={async () => {

                                        try {

                                            const token =
                                                localStorage.getItem("token");

                                            const response = await fetch(
                                                "http://127.0.0.1:8000/verify-email-otp",
                                                {
                                                    method: "PUT",

                                                    headers: {
                                                        "Content-Type": "application/json",

                                                        Authorization: `Bearer ${token}`
                                                    },

                                                    body: JSON.stringify({

                                                        newEmail,

                                                        otp

                                                    })
                                                }
                                            );

                                            const data = await response.json();

                                            alert(data.message);

                                            const user = JSON.parse(
                                                localStorage.getItem("user")
                                            );

                                            user.email = newEmail;

                                            localStorage.setItem(
                                                "user",
                                                JSON.stringify(user)
                                            );

                                            setActiveModal(null);

                                            setVerificationSent(false);

                                            setOtp("");

                                        } catch (error) {

                                            console.log(error);

                                        }

                                    }}

                                    className="
                                        flex-1
                                        py-4
                                        rounded-2xl
                                        bg-green-500
                                        text-white
                                        font-bold
                                        cursor-pointer
                                    "
                                >

                                    Verify OTP

                                </button>

                            <button
                                onClick={() => {
                                setActiveModal(null);
                                setVerificationSent(false);
                                }}
                                className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold cursor-pointer"
                            >
                                Cancel
                            </button>

                            </div>

                        </div>

                        </div>
                    )
                    }

                    {
                        activeModal === "password" && (

                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                            <div className="bg-white w-[95%] max-w-[500px] rounded-3xl p-5 md:p-8 shadow-2xl">

                                <h2 className="text-4xl font-bold text-purple-700 mb-6">
                                Change Password
                                </h2>

                                <div className="space-y-4">

                                <div className="relative">

                                    <input
                                    type={showPassword ? "text" : "password"}
                                    value={currentPassword}

                                    onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                    }
                                    placeholder="Current Password"
                                    className="w-full p-4 rounded-2xl border outline-none"
                                    />

                                    <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-5"
                                    >
                                    {
                                        showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                    </button>

                                </div>

                                <div className="relative">

                                    <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-4 rounded-2xl border outline-none"
                                    />

                                    <button
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-5 top-5"
                                    >
                                    {
                                        showNewPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                    </button>

                                </div>

                                <div>

                                    <p className="text-gray-500">
                                    Password Strength
                                    </p>

                                    <div
                                    className={`
                                        mt-2
                                        font-bold

                                        ${
                                        getPasswordStrength() === "Weak"
                                            ? "text-red-500"
                                            : getPasswordStrength() === "Medium"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                        }
                                    `}
                                    >
                                    {getPasswordStrength()}
                                    </div>

                                </div>

                                <div className="relative">

                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-4 rounded-2xl border outline-none"
                                        />

                                    <button
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-5 top-5"
                                    >
                                    {
                                        showConfirmPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }
                                    </button>

                                </div>

                                </div>

                                <div className="flex gap-4 mt-6">

                                <button

                                    onClick={async () => {

                                        if (newPassword !== confirmPassword) {

                                        alert("Passwords do not match");

                                        return;
                                        }

                                        try {

                                        const token =
                                            localStorage.getItem("token");

                                        const response = await fetch(
                                            "http://127.0.0.1:8000/change-password",
                                            {
                                            method: "PUT",

                                            headers: {
                                                "Content-Type": "application/json",

                                                Authorization: `Bearer ${token}`
                                            },

                                            body: JSON.stringify({

                                                currentPassword,

                                                newPassword

                                            })
                                            }
                                        );

                                        const data = await response.json();

                                        alert(data.message);

                                        setActiveModal(null);

                                        setCurrentPassword("");

                                        setNewPassword("");

                                        setConfirmPassword("");

                                        } catch (error) {

                                        console.log(error);

                                        }

                                    }}

                                    className="
                                        flex-1
                                        py-4
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-purple-600
                                        to-pink-500
                                        text-white
                                        font-bold
                                        cursor-pointer
                                    "
                                    >

                                    Update Password

                                    </button>

                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 py-4 rounded-2xl bg-gray-200 font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>

                                </div>

                            </div>

                            </div>
                        )
                        }

                        {
                        downloading && (

                            <div
                            className="
                                fixed
                                inset-0
                                bg-black/40
                                backdrop-blur-sm
                                flex
                                items-center
                                justify-center
                                z-50
                                px-4
                            "
                            >

                            <div
                                className="
                                bg-white
                                rounded-3xl
                                p-8
                                shadow-2xl
                                text-center
                                w-[90%]
                                max-w-[350px]
                                "
                            >

                                <h2 className="text-2xl font-bold mb-2">
                                Preparing Download
                                </h2>

                                <p className="text-gray-500">
                                Preparing your wellness archive...
                                </p>

                            </div>

                            </div>

                        )
                        }

                        {
                        showLogoutModal && (

                            <div
                            className="
                                fixed
                                inset-0
                                bg-black/40
                                backdrop-blur-sm
                                flex
                                items-start
                                justify-center
                                overflow-y-auto
                                z-50
                                px-4
                                py-6
                            "
                            >

                            <div
                                className="
                                bg-white
                                rounded-3xl
                                p-6
                                md:p-8
                                w-[95%]
                                max-w-[400px]
                                max-h-[80vh]
                                shadow-2xl
                                "
                            >

                                <h2 className="text-3xl font-bold mb-4">
                                Logout All Devices?
                                </h2>

                                <p className="text-gray-500 mb-5">
                                This will sign you out from:
                                </p>

                                <div className="space-y-3 mb-8 max-h-[250px] overflow-y-auto">

                                    {devices.length === 0 ? (

                                        <p className="text-center text-gray-500 py-6">
                                            No active sessions found
                                        </p>

                                    ) : (

                                    devices.map((device, index) => (

                                        <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            bg-gray-100
                                            rounded-2xl
                                            px-4
                                            py-3
                                        "
                                        >

                                        <div>

                                            <p className="font-semibold text-gray-800">

                                            {device.device}

                                            </p>

                                            <p className="text-sm text-gray-500">

                                            {device.browser} • {device.os}

                                            </p>

                                        </div>

                                        <div
                                            className="
                                            bg-green-100
                                            text-green-600
                                            text-xs
                                            px-3
                                            py-1
                                            rounded-full
                                            font-semibold
                                            "
                                        >
                                            Active
                                        </div>

                                        </div>

                                    ))

                                )}

                                    </div>

                                <div className="flex flex-col md:flex-row gap-4">

                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="
                                    flex-1
                                    py-3
                                    rounded-2xl
                                    bg-gray-100
                                    hover:bg-gray-200
                                    cursor-pointer
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {

                                        try {

                                        const token =
                                            localStorage.getItem("token");

                                        const response = await fetch(
                                            "http://127.0.0.1:8000/logout-all-devices",
                                            {
                                            method: "POST",

                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                            }
                                        );

                                        const data = await response.json();

                                        alert(data.message);

                                        localStorage.clear();

                                        navigate("/");

                                        } catch (error) {

                                        console.log(error);

                                        }

                                    }}


                                    className="
                                    flex-1
                                    py-3
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-purple-600
                                    to-pink-500
                                    text-white
                                    font-semibold
                                    cursor-pointer
                                    "
                                >
                                    Logout
                                </button>

                                </div>

                            </div>

                            </div>

                        )
                        }

                        {
                        showDeleteModal && (

                            <div
                            className="
                                fixed
                                inset-0
                                bg-black/40
                                backdrop-blur-sm
                                flex
                                items-center
                                justify-center
                                z-50
                                px-4
                            "
                            >

                            <div
                                className="
                                bg-white
                                rounded-3xl
                                p-8
                                w-[95%]
                                max-w-[450px]
                                shadow-2xl
                                "
                            >

                                <h2 className="text-3xl font-bold mb-4 text-red-500">
                                Delete Account?
                                </h2>

                                <p className="text-gray-500 mb-6">
                                This action cannot be undone.
                                All journals, reminders, moods,
                                and analytics will be permanently deleted.
                                </p>

                                <div className="relative">

                                    <input

                                        type={showDeletePassword ? "text" : "password"}

                                        placeholder="Enter password to continue"

                                        value={password}

                                        onChange={(e) => setPassword(e.target.value)}

                                        className="
                                            w-full
                                            p-4
                                            rounded-2xl
                                            border
                                            border-gray-200
                                            mb-6
                                            outline-none
                                            pr-14
                                        "
                                    />

                                    <button

                                        type="button"

                                        onClick={() =>
                                            setShowDeletePassword(!showDeletePassword)
                                        }

                                        className="
                                            absolute
                                            right-5
                                            top-5
                                            text-gray-500
                                        "
                                    >

                                        {
                                            showDeletePassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        }

                                    </button>

                                </div>

                                <div className="flex flex-col md:flex-row gap-4">

                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="
                                    flex-1
                                    py-3
                                    rounded-2xl
                                    bg-gray-100
                                    hover:bg-gray-200
                                    "
                                >
                                    Cancel
                                </button>

                                <button

                                    onClick={async () => {

                                        try {

                                            const response = await fetch(

                                                "http://127.0.0.1:8000/delete-account",

                                                {

                                                    method: "DELETE",

                                                    headers: {

                                                        "Content-Type": "application/json"

                                                    },

                                                    body: JSON.stringify({

                                                        email,

                                                        password

                                                    })

                                                }

                                            );

                                            const data = await response.json();

                                            alert(data.message);

                                            if (
                                                data.message ===
                                                "Account deleted successfully"
                                            ) {

                                                localStorage.clear();

                                                navigate("/");

                                            }

                                        } catch (error) {

                                            console.log(error);

                                        }

                                    }}

                                    className="
                                        flex-1
                                        py-3
                                        rounded-2xl
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        font-semibold
                                        cursor-pointer
                                    "
                                >

                                    Delete Permanently

                                </button>

                                </div>

                            </div>

                            </div>

                        )
                        }

            </div>

            {
            activeModal === "masterPin" && (

            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-[95%] max-w-[450px] shadow-2xl">

            <h2 className="text-4xl font-bold text-purple-700 mb-6">
            Master PIN
            </h2>

            <p className="text-gray-500 mb-6">
            Secure your private journals with a master PIN.
            </p>

            <input
            type="password"
            placeholder="Current PIN"
            value={currentPin}
            onChange={(e)=>setCurrentPin(e.target.value)}
            className="
            w-full
            p-4
            border
            rounded-2xl
            mb-4
            "
            />

            <input
            type="password"
            placeholder="New PIN"
            value={newPin}
            onChange={(e)=>setNewPin(e.target.value)}
            className="
            w-full
            p-4
            border
            rounded-2xl
            mb-4
            "
            />

            <input
            type="password"
            placeholder="Confirm New PIN"
            value={confirmPin}
            onChange={(e)=>setConfirmPin(e.target.value)}
            className="
            w-full
            p-4
            border
            rounded-2xl
            mb-6
            "
            />

            <div className="flex gap-4">

            <button
            onClick={changeMasterPin}
            className="
            flex-1
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            text-white
            font-bold
            cursor-pointer
            "
            >
            Update Master PIN
            </button>

            <button
            onClick={()=>setActiveModal(null)}
            className="
            flex-1
            py-4
            rounded-2xl
            bg-gray-200
            font-bold
            cursor-pointer
            "
            >
            Cancel
            </button>

            </div>

            <div className="text-center mt-4">
            <button
            onClick={handleForgotMasterPin}
            className="
            text-purple-600
            font-semibold
            hover:underline
            cursor-pointer
            "
            >
            Forgot Your Master PIN?
            </button>

            </div>

            </div>

            </div>

            )
            }

            {
            activeModal === "decoyPin" && (

            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-[95%] max-w-[500px] shadow-2xl">

            <h2 className="text-4xl font-bold text-purple-700 mb-6">
            Decoy PIN
            </h2>

            <p className="text-gray-500 mb-6">
            Create a fake PIN that opens harmless journals.
            </p>

            <input
            type="password"
            placeholder="New Decoy PIN"
            value={decoyPin}
            onChange={(e)=>setDecoyPin(e.target.value)}
            className="
            w-full
            p-4
            border
            rounded-2xl
            mb-4
            "
            />

            <input
            type="password"
            placeholder="Master PIN"
            value={masterPin}
            onChange={(e)=>setMasterPin(e.target.value)}
            className="
            w-full
            p-4
            border
            rounded-2xl
            mb-6
            "
            />


            <div className="space-y-4">

            {

            !hasDecoyPin

            ?

            (

            <button
            onClick={saveDecoyPin}
            className="
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            text-white
            font-bold
            cursor-pointer
            "
            >
            Save Decoy PIN
            </button>

            )

            :

            (

            <>

            <button
            onClick={changeDecoyPin}
            className="
            w-full
            py-4
            rounded-2xl
            bg-blue-500
            text-white
            font-bold
            cursor-pointer
            "
            >

            Change Decoy PIN

            </button>


            <button
            onClick={() => {

                if (

                    window.confirm(

                        "Are you sure you want to remove the Decoy PIN?"

                    )

                ) {

                    removeDecoyPin();

                }

            }}
            className="
            w-full
            py-4
            rounded-2xl
            bg-red-500
            text-white
            font-bold
            cursor-pointer
            "
            >

            Remove Decoy PIN

            </button>

            </>

            )

            }


            <button
            onClick={()=>setActiveModal(null)}
            className="
            w-full
            py-4
            rounded-2xl
            bg-gray-200
            font-bold
            cursor-pointer
            "
            >
            Cancel
            </button>

            </div>

            </div>

            </div>

            )
            }

            {
            activeModal === "faceid" && (

            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="relative bg-white rounded-3xl p-8 w-[95%] max-w-[450px] shadow-2xl">

            <button
                onClick={() => setActiveModal(null)}
                className="
                    absolute
                    top-4
                    right-5
                    text-3xl
                    text-gray-400
                    hover:text-red-500
                    transition-all
                    duration-200
                    cursor-pointer
                "
            >
                ×
            </button>
            
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Face ID / Fingerprint
            </h2>

            <p className="text-gray-500 mb-8">
            Unlock private journals using biometrics.
            </p>

            <button

            onClick={async()=>{

            try{

            if(faceIdEnabled){

            await API.post("/disable-face-id",{
            email:user.email
            });

            setFaceIdEnabled(false);

            }

            else {

                if (!window.PublicKeyCredential) {

                    alert("Face ID not supported");

                    return;

                }

                const response = await API.post(
                    "/generate-registration-options",
                    {
                        email: user.email
                    }
                );

                let options = response.data;

                if (typeof options === "string") {
                    options = JSON.parse(options);
                }

                options.challenge = Uint8Array.from(
                    atob(options.challenge.replace(/-/g, "+").replace(/_/g, "/")),
                    c => c.charCodeAt(0)
                );

                options.user.id = Uint8Array.from(
                    atob(options.user.id.replace(/-/g, "+").replace(/_/g, "/")),
                    c => c.charCodeAt(0)
                );

                const credential =
                    await navigator.credentials.create({

                        publicKey: options

                    });

                await API.post(

                    "/verify-registration",

                    {

                        email: user.email,

                        credential

                    }

                );

                setFaceIdEnabled(true);

                alert("Face ID enabled successfully");

            }

            setActiveModal(null);

            }

            catch(error){

            console.log(error);

            }

            }}

            className="
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            text-white
            font-bold
            cursor-pointer
            "
            >

            {
            faceIdEnabled
            ?
            "Disable Face ID"
            :
            "Enable Face ID"
            }

            </button>

            </div>

            </div>

            )
            }

        </>

  );
}

export default Settings;