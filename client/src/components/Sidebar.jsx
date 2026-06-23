import {
  FaHome,
  FaBell,
  FaSmile,
  FaBook,
  FaChartPie,
  FaAngleRight,
  FaTimes,
  FaHeart
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({
    sidebarOpen,
    setSidebarOpen
  }) {

  const navigate = useNavigate();

  const location = useLocation();

  const isDashboard =
    location.pathname === "/dashboard";

  const isReminders =
    location.pathname === "/reminders";

  const isMood =
    location.pathname === "/mood";

  const isJournal =
    location.pathname === "/journal";

  const isAnalytics =
    location.pathname === "/analytics";

  const isWellnessHub =
    location.pathname === "/wellness-hub";

  const isProfile =
    location.pathname === "/profile";

  const user = JSON.parse(localStorage.getItem("user"));

  const goToDashboard = () => {
    navigate("/dashboard");
    setSidebarOpen(false);
  };

  const goToReminders = () => {
    navigate("/reminders");
    setSidebarOpen(false);
  };

  const goToMood = () => {
    navigate("/mood");
    setSidebarOpen(false);
  };

  const goToJournal = () => {
    navigate("/journal");
    setSidebarOpen(false);
  };

  const goToAnalytics = () => {
    navigate("/analytics");
    setSidebarOpen(false);
  };

  const goToWellnessHub = () => {
    navigate("/wellness-hub");
    setSidebarOpen(false);
  };

  const currentHour = new Date().getHours();

  const isNight = currentHour >= 18 || currentHour < 5;

  const useDynamicTheme =
    location.pathname === "/dashboard";

  const sidebarNight =
    useDynamicTheme && isNight;

  const textPrimary = sidebarNight
    ? "text-purple-200"
    : "text-purple-700";

  const textSecondary = sidebarNight
    ? "text-purple-100"
    : "text-gray-600";

  const hoverStyle = sidebarNight
    ? "hover:bg-white/10 hover:text-white"
    : "hover:bg-purple-100/80 hover:text-purple-700";
  
  return (
    <>
    {sidebarOpen && (
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
    )}
    <div
      className={`

        fixed
        top-[20px]
        left-5

        w-[190px]
        sm:w-[210px]
        md:w-[220px]
        h-[calc(100vh-40px)]

        rounded-[36px]

        ${sidebarNight ? "bg-[#1e1b2e]/95" : "bg-[#ffffffcc]"}
        backdrop-blur-[25px]

        border
        border-white/20

        shadow-[0_10px_40px_rgba(0,0,0,0.10)]

        px-3
        py-4 pb-8

        flex
        flex-col
        justify-between

        transition-all
        duration-500

        z-40

        lg:translate-x-0
        lg:opacity-100

        ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0 lg:translate-x-0 lg:opacity-100"
        }

      `}
    >

      <div
        className="
          flex
          justify-center
          mb-5
        "
      >

        <div
          className="
            bg-white
            p-3
            rounded-2xl
            shadow-lg
          "
        >

          <img
            src={logo}
            alt="logo"
            className="w-24 object-contain"
          />

        </div>

      </div>

      <div className="space-y-1 mt-1">

        <button
          onClick={goToDashboard}
          className={`
            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isDashboard ? "bg-white/10" : "hover:bg-white/5"}
            ? "bg-white/10"
            : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isDashboard
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaHome className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]

              ${
                isDashboard
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Dashboard
          </span>

        </button>

        <button
          onClick={goToReminders}
          className={`
            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isReminders ? "bg-white/10" : "hover:bg-white/5"}
            ? "bg-white/10"
            : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isReminders
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaBell className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]

              ${
                isReminders
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Reminders
          </span>

        </button>

        <button
          onClick={goToMood}
          className={`
            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isMood ? "bg-white/10" : "hover:bg-white/5"}
            ? "bg-white/10"
            : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isMood
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaSmile className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]
              whitespace-nowrap

              ${
                isMood
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Mood Tracker
          </span>

        </button>

        <button
          onClick={goToJournal}
          className={`
            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isJournal ? "bg-white/10" : "hover:bg-white/5"}
            ? "bg-white/10"
            : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isJournal
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaBook className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]

              ${
                isJournal
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Journal
          </span>

        </button>

        <button
          onClick={goToAnalytics}
          className={`
            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isAnalytics ? "bg-white/10" : "hover:bg-white/5"}
            ? "bg-white/10"
            : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isAnalytics
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaChartPie className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]

              ${
                isAnalytics
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Analytics
          </span>

        </button>

        <button
          onClick={goToWellnessHub}
          className={`
            lg:hidden

            flex
            items-center
            gap-4

            w-full

            px-3
            py-3

            rounded-xl

            ${isWellnessHub ? "bg-white/10" : "hover:bg-white/5"}

            transition-all
            duration-300

            cursor-pointer
          `}
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl

              flex
              items-center
              justify-center

              ${
                isWellnessHub
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : `${sidebarNight ? "text-gray-300" : "text-gray-500"}`
              }
            `}
          >
            <FaHeart className="text-lg" />
          </div>

          <span
            className={`
              text-[16px]

              ${
                isWellnessHub
                  ? "text-purple-400 font-semibold"
                  : sidebarNight
                  ? "text-gray-200"
                  : "text-gray-600"
              }
            `}
          >
            Care Circle
          </span>

        </button>

      </div>

      <div
        onClick={() => {
          navigate("/profile");
          setSidebarOpen(false);
        }}
        className={`
          mt-6
          pt-4
          border-t
          border-purple-200
          cursor-pointer

          ${
            isProfile
              ? "bg-purple-50 rounded-2xl p-3"
              : ""
          }
        `}
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-full
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500
                text-white
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {user?.name?.charAt(0)}
            </div>

            <div>

              <p
                className={`
                  text-sm
                  font-semibold
                  ${sidebarNight ? "text-purple-100" : "text-purple-500"}
                `}
              >
                {user?.name}
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  "
              >
                View Profile
              </p>

            </div>

          </div>

          <div
            onClick={() => navigate("/profile")}
            className="
              w-8
              h-8
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
          </div>

        </div>

      </div>

    </div>

  </>
  );
}

export default Sidebar;