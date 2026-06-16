import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function formatActivityTime(date) {

    const activityDate =
        new Date(date);

    const now =
        new Date();

    const yesterday =
        new Date();

    yesterday.setDate(
        now.getDate() - 1
    );

    if (
        activityDate.toDateString()
        ===
        now.toDateString()
    ) {

        return (
            "Today • " +
            activityDate.toLocaleTimeString(
                "en-IN",
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata"
                }
            )
        );

    }

    if (
        activityDate.toDateString()
        ===
        yesterday.toDateString()
    ) {

        return (
            "Yesterday • " +
            activityDate.toLocaleTimeString(
                "en-IN",
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata"
                }
            )
        );

    }

    return activityDate.toLocaleString(
        "en-IN",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        }
    );

}

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [sidebarOpen, setSidebarOpen] =
    useState(window.innerWidth >= 1024);

  const [activities, setActivities] =
    useState([]);

  const [profileInsight, setProfileInsight] =
    useState(
    "Start tracking moods and habits to unlock personalized wellness insights"
    );

  useEffect(() => {

    if (!user?.email) return;

    fetch(
        `http://localhost:8000/api/recent-activity?email=${user.email}`
    )
        .then(res => res.json())
        .then(data => {

            console.log("Activities response:", data);

            setActivities(data);

            fetch(
            `http://localhost:8000/api/profile-insight?email=${user.email}`
            )
            .then(res=>res.json())
            .then(data=>{

                setProfileInsight(
                    data.insight
                );

});

        });

}, []);

  return (
    <>
    <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
    />

    <div
        className="
            min-h-screen
            lg:h-screen

            overflow-y-auto
            lg:overflow-hidden
            ml-0
            lg:ml-[250px]

            bg-gradient-to-br
            from-[#f4eefe]
            via-[#f8f0ff]
            to-[#f3e8ff]

            p-4
            sm:p-6
            lg:p-8
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

                <div
                    className="
                        mt-2
                        mb-5
                        ml-14
                        lg:ml-0
                    "
                    >

                    <h1 className="text-4xl font-bold text-gray-800">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your personal information and wellness journey.
                    </p>

                    <div className="flex gap-3 mt-4">
                        <span className="px-4 py-2 rounded-full bg-white shadow text-purple-600 font-medium">
                            Wellness Journey
                        </span>

                        <span className="px-4 py-2 rounded-full bg-white shadow text-purple-600 font-medium">
                            Member
                        </span>
                        </div>

                    </div>

        <div
        className="
            mt-4
            relative
            overflow-hidden
            rounded-[28px]
            lg:rounded-[32px]
            bg-white/70
            backdrop-blur-2xl
            shadow-xl
            p-6
            lg:p-7
            w-full
            
        "
        >

        <div
            className="
            absolute
            top-0
            left-0
            w-full
            h-[220px]
            bg-gradient-to-r
            from-purple-500/20
            to-pink-500/20
            "
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            <div className="flex items-center gap-5">

            <div
                className="
                w-20
                h-20
                lg:w-20
                lg:h-20
                rounded-[30px]
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                flex
                items-center
                justify-center
                text-white
                text-3xl
                lg:text-4xl
                font-bold
                shadow-xl
                "
            >
                {user?.name?.charAt(0)}
            </div>

            <div>

                <h1 className="text-3xl sm:text-2xl font-bold text-gray-800">
                {user?.name}
                </h1>

                <p className="text-gray-500 text-base sm:text-base mt-1">
                {user?.email}
                </p>

                <p className="text-purple-600 font-semibold mt-3">
                    {user?.createdAt &&
                    !isNaN(new Date(user.createdAt).getTime())
                        ? `Member since ${new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                            month: "long",
                            year: "numeric",
                            }
                        )}`
                        : "Recently Joined"}
                    </p>

            </div>

            </div>

        </div>

        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 mt-6">

        <div
            className="
            relative
            overflow-hidden
            rounded-[40px]
            bg-gradient-to-br
            from-purple-600
            via-purple-500
            to-pink-500
            p-6
            text-white
            shadow-[0_10px_40px_rgba(168,85,247,0.35)]
            flex
            flex-col
            justify-between
            min-h-[220px]
            h-[320px]
            "
        >

            <div
            className="
                absolute
                -top-20
                -right-20
                w-52
                h-52
                rounded-full
                bg-white/10
            "
            />

            <div className="relative z-10">

            <h2 className="text-xl lg:text-2xl font-bold leading-snug">

                Wellness Snapshot

            </h2>

            <p className="mt-8 text-base lg:text-lg leading-relaxed text-white/90">

                {profileInsight}

            </p>

            </div>

        </div>

        <div
            className="
                bg-white/60
                backdrop-blur-2xl
                rounded-[40px]
                p-6
                h-[320px]
                overflow-hidden
                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            "
            >

        <div className="flex items-center gap-3 mb-10">

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Recent Activity
            </h2>

        </div>

        <div
        className="
        space-y-8
        h-[210px]
        overflow-y-auto
        pr-2
        "
        >

        {
        activities.map((activity,index)=>(

        <div
        key={index}
        className="flex items-start gap-5"
        >

        <div
        className={`
        mt-2
        w-4
        h-4
        rounded-full

        ${
        activity.color==="green"
        ? "bg-green-500"

        : activity.color==="yellow"
        ? "bg-yellow-500"

        : activity.color==="purple"
        ? "bg-purple-500"

        : "bg-pink-500"
        }
        `}
        />

        <div>

        <p
        className="
        text-base
        sm:text-lg
        lg:text-xl
        font-semibold
        text-gray-800
        "
        >

        {activity.title}

        </p>

        <p className="text-gray-500 mt-1">

        {
        formatActivityTime(
            activity.time
        )
        }

        </p>

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

export default Profile;