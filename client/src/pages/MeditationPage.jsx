import Sidebar from "../components/Sidebar";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import QuickRelaxationModal from "../components/QuickRelaxationModal";
import BodyScanModal from "../components/BodyScanModal";
import SleepMeditationModal from "../components/SleepMeditationModal";
import FocusMeditationModal from "../components/FocusMeditationModal";

function MeditationPage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedMeditation, setSelectedMeditation] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1280);
    
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const profileMenuRef = useRef(null);
      
  const navigate = useNavigate();

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

      if (selectedMeditation) {

          document.body.style.overflow = "hidden";

      }

      else {

          document.body.style.overflow = "auto";

      }

      return () => {

          document.body.style.overflow = "auto";

      };

  }, [selectedMeditation]);

  const meditations = [

    {
      title: "Quick Relaxation",
      duration: "2 min",
      emoji: "🌸"
    },

    {
    title: "Body Scan Meditation",
    duration: "5 min",
    emoji: "🌊"
    },

    {
      title: "Sleep Meditation",
      duration: "10 min",
      emoji: "🌙"
    },

    {
      title: "Focus Meditation",
      duration: "15 min",
      emoji: "✨"
    }

  ];

  return (  
      <>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
  
        <div className="min-h-screen md:h-screen bg-[#f6f3ff] flex overflow-x-hidden">
        
              <div
                className={`
                    relative
                    w-full
                    overflow-hidden
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
  
              <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-gray-800">
                Guided Meditation
              </h1>
  
          </div>
          
                  <div className="flex items-center gap-3">
          
                      <div
                      className="
                          bg-white/70
                          backdrop-blur-xl
                          rounded-2xl
                          px-5 py-3
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
        className="
        grid

        grid-cols-1
        md:grid-cols-2

        gap-5
        sm:gap-8

        mt-8
        "
        >

          {meditations.map((item, index) => (

            <div
              key={index}
              className="
              bg-white/80

              rounded-[28px]

              p-6
              sm:p-8

              shadow-xl

              "
            >

              <div className="text-4xl sm:text-5xl">
                {item.emoji}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mt-5">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-3">
                Duration: {item.duration}
              </p>

              <button

              onClick={() => setSelectedMeditation(item)}

              className="
              mt-6
              bg-gradient-to-r
              from-purple-600
              to-pink-500

              w-full
              sm:w-auto

              px-6
              py-3

              rounded-full

              text-white
              font-semibold

              hover:scale-105
              transition-all
              cursor-pointer
              "
              >

              Start Session

              </button>

            </div>

          ))}

        </div>

      </div>

      {
      selectedMeditation && (

      <div
      className="
      fixed

      inset-0

      z-50

      bg-black/40
      backdrop-blur-md

      flex
      items-center
      justify-center

      p-4
      "
      >

      <div
      className="
      relative

      bg-white/90
      backdrop-blur-xl

      rounded-[30px]
      sm:rounded-[40px]

      shadow-2xl

      w-full
      max-w-3xl

      max-h-[92vh]

      overflow-y-auto
      hide-scrollbar

      p-5
      sm:p-8
      md:p-10
      "
      >

      <button

      onClick={() => setSelectedMeditation(null)}

      className="
      absolute

      top-4
      right-4

      sm:top-6
      sm:right-6

      text-2xl
      sm:text-3xl

      text-gray-400
      "
      >

      ✕

      </button>

      {
      selectedMeditation.title==="Quick Relaxation" &&
      <QuickRelaxationModal/>
      }

      {
      selectedMeditation.title==="Body Scan Meditation" &&
      <BodyScanModal/>
      }

      {
      selectedMeditation.title==="Sleep Meditation" &&
      <SleepMeditationModal/>
      }

      {
      selectedMeditation.title==="Focus Meditation" &&
      <FocusMeditationModal/>
      }

      </div>

      </div>

      )
      }

    </div>

    </>

  );
}

export default MeditationPage;