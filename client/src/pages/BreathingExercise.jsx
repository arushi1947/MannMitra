import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import BreathingCircle from "../components/BreathingCircle";
import { FaBars, FaTimes, FaCog, FaSignOutAlt, FaBrain, FaHeart, FaLungs, FaMoon, FaUndo, FaPause, FaPlay, FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function BreathingExercise() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1280);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);
    
  const navigate = useNavigate();

  const phases = [
    "inhale",
    "hold",
    "exhale"
  ];

  const phaseDurations = {
    inhale: 4000,
    hold: 4000,
    exhale: 6000
    };

  const [phaseIndex, setPhaseIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef(null);

  const currentPhase = phases[phaseIndex];

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

    if (isPaused) return;

    const duration =
        phaseDurations[phases[phaseIndex]];

    intervalRef.current = setTimeout(() => {

        setPhaseIndex(
        prev =>
        (prev + 1) % phases.length
        );

    }, duration);

    return () => clearTimeout(intervalRef.current);

    }, [phaseIndex, isPaused]);

    const handlePause = () => {

        if (isPaused) {

            setIsPaused(false);

        } else {

            clearTimeout(intervalRef.current);

            setIsPaused(true);

        }

    };

        const handleReset = () => {

            clearTimeout(intervalRef.current);

            setPhaseIndex(0);

            setIsPaused(false);

        };

        const handleStop = () => {

            clearTimeout(intervalRef.current);

            setPhaseIndex(0);

            setIsPaused(true);

        };

  const breathingCards = [
    {
    icon:"🫁",
    title:"Inhale",
    duration:4,
    color:"purple",
    phase:"inhale"
    },
    {
    icon:"⏸",
    title:"Hold",
    duration:4,
    color:"orange",
    phase:"hold"
    },
    {
    icon:"🌬",
    title:"Exhale",
    duration:6,
    color:"blue",
    phase:"exhale"
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
              px-3
            py-5

            sm:px-6

            lg:p-10
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
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-bold
              text-gray-800
              whitespace-nowrap
              "
              >
                  Breathing Exercise
              </h1>
      
             <p className="text-xs sm:text-sm leading-5 max-w-[120px] sm:max-w-none text-gray-500">
                  Follow the rhythm. Breathe in peace, breathe out stress
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
                      lg:block
  
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
            className="
            bg-white/75
            backdrop-blur-xl

            rounded-[28px]

            px-5
            py-3

            flex
            items-center
            gap-3
            sm:gap-6

            shadow-lg
            "
            >

                <div
                className="
                flex
                flex-col
                items-center
                gap-2
                "
                >

                    <button
                    onClick={handleReset}
                    className="
                    w-14
                    h-14

                    rounded-full

                    bg-white

                    shadow-md

                    flex
                    items-center
                    justify-center

                    text-gray-500

                    hover:scale-105
                    transition-all
                    cursor-pointer
                    "
                    >
                    <FaUndo />
                    </button>

                    <span className="text-sm text-gray-500">
                    Reset
                    </span>

                </div>

                <div
                className="
                flex
                flex-col
                items-center
                gap-2
                "
                >

                    <button
                    onClick={handlePause}
                    className="
                    w-12
                    h-12

                    sm:w-16
                    sm:h-16

                    rounded-full

                    bg-gradient-to-r
                    from-fuchsia-500
                    to-purple-600

                    text-white

                    shadow-[0_10px_30px_rgba(192,132,252,.4)]

                    flex
                    items-center
                    justify-center

                    text-2xl

                    hover:scale-105
                    transition-all
                    cursor-pointer
                    "
                    >
                    {
                    isPaused
                    ?
                    <FaPlay />
                    :
                    <FaPause />
                    }
                    </button>

                    <span className="text-gray-600">
                    {
                    isPaused
                    ?
                    "Resume"
                    :
                    "Pause"
                    }
                    </span>

                </div>

                <div
                className="
                flex
                flex-col
                items-center
                gap-2
                "
                >

                    <button
                    onClick={handleStop}
                    className="
                    w-14
                    h-14

                    rounded-full

                    bg-white

                    shadow-md

                    flex
                    items-center
                    justify-center

                    text-gray-500

                    hover:scale-105
                    transition-all
                    cursor-pointer
                    "
                    >
                    <FaStop />
                    </button>

                    <span className="text-sm text-gray-500">
                    Stop
                    </span>

                </div>

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
                          lg:flex
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
            absolute

            left-0
            right-0

            top-[240px]

            h-[180px]

            opacity-30

            pointer-events-none
            "
            >

            <div
            className="
            w-full
            h-full

            bg-gradient-to-r
            from-purple-200
            via-pink-200
            to-fuchsia-200

            blur-[70px]

            rounded-full
            "
            />

            </div>

            <div className="mt-10 md:mt-16">

              <BreathingCircle
                phase={phases[phaseIndex]}
                duration={
                    phaseDurations[
                    phases[phaseIndex]
                    ] / 1000
                }
                isPaused={isPaused}
                />

            </div>

            <div
            className="
            flex

            overflow-x-auto
            hide-scrollbar

            gap-4

            px-2

            mt-10

            justify-start
            lg:justify-center
            "
            >

            {

            breathingCards.map((card,index)=>{

            const active = currentPhase === card.phase;

            return (

            <motion.div
                key={index}

                animate={{
                    scale: active ? 1.04 : 1
                }}

                transition={{
                    duration: .4
                }}

                className={`
                w-[190px]
                sm:w-[220px]

                flex-shrink-0
                h-[92px]

                rounded-[28px]

                px-5

                flex
                items-center
                gap-4

                relative

                overflow-hidden

                transition-all
                duration-500

                ${
                active
                ?
                "bg-white shadow-[0_10px_35px_rgba(168,85,247,.18)] border border-purple-200"
                :
                "bg-white/70 border border-gray-100"
                }
            `}
            >

            <div
            className={`
            w-14
            h-14

            rounded-[18px]

            flex
            items-center
            justify-center

            text-3xl

            flex-shrink-0

            ${
            card.color==="purple"
            ?
            "bg-purple-100 text-purple-600"
            :
            card.color==="orange"
            ?
            "bg-orange-100 text-orange-500"
            :
            "bg-blue-100 text-blue-500"
            }
            `}
            >
            {card.icon}
            </div>

            <div className="flex-1">

            <h2
            className={`
            text-2xl
            font-bold

            ${
            card.color==="purple"
            ?
            "text-purple-600"
            :
            card.color==="orange"
            ?
            "text-orange-500"
            :
            "text-blue-500"
            }
            `}
            >
            {card.title}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
            {card.duration} sec
            </p>

            <div
            className="
            mt-3

            h-1.5

            bg-gray-100

            rounded-full

            overflow-hidden
            "
            >

            <motion.div

            key={currentPhase}

            initial={{
            width:"0%"
            }}

            animate={{
            width:active?"100%":"0%"
            }}

            transition={{
            duration:card.duration,
            ease:"linear"
            }}

            className={`
            h-full

            rounded-full

            ${
            card.color==="purple"
            ?
            "bg-purple-500"
            :
            card.color==="orange"
            ?
            "bg-orange-400"
            :
            "bg-blue-500"
            }
            `}

            />

            </div>

            </div>

            </motion.div>

            );

            })

            }

            </div>

                <div
                className="
                mt-16

                bg-white/80
                backdrop-blur-xl

                rounded-[32px]

                px-5
                sm:px-8

                py-7

                shadow-[0_10px_30px_rgba(0,0,0,.04)]
                "
                >

                <div className="flex items-center gap-3 mb-8">

                <h2 className="font-bold text-gray-800 text-lg">
                Benefits
                </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

                    <div className="flex items-start gap-4">

                    <div
                    className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-purple-100

                    flex
                    items-center
                    justify-center

                    text-3xl
                    "
                    >
                    <FaBrain />
                    </div>

                    <div>

                    <h3 className="font-bold text-xl text-gray-800">
                    Reduces Stress
                    </h3>

                    <p className="text-gray-500 mt-2 leading-8">
                    Calms your mind<br/>
                    and body
                    </p>

                    </div>

                    </div>

                    <div className="flex items-start gap-4">

                    <div
                    className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-pink-100

                    flex
                    items-center
                    justify-center

                    text-3xl
                    "
                    >
                    <FaHeart />
                    </div>

                    <div>

                    <h3 className="font-bold text-xl">
                    Improves Focus
                    </h3>

                    <p className="text-gray-500 mt-2 leading-8">
                    Enhances clarity<br/>
                    and attention
                    </p>

                    </div>

                    </div>

                    <div className="flex items-start gap-4">

                    <div
                    className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-green-100

                    flex
                    items-center
                    justify-center

                    text-3xl
                    "
                    >
                    <FaLungs />
                    </div>

                    <div>

                    <h3 className="font-bold text-xl">
                    Better Breathing
                    </h3>

                    <p className="text-gray-500 mt-2 leading-8">
                    Increases lung<br/>
                    capacity
                    </p>

                    </div>

                    </div>

                    <div className="flex items-start gap-4">

                    <div
                    className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-indigo-100

                    flex
                    items-center
                    justify-center

                    text-3xl
                    "
                    >
                    <FaMoon />
                    </div>

                    <div>

                    <h3 className="font-bold text-xl">
                    Better Sleep
                    </h3>

                    <p className="text-gray-500 mt-2 leading-8">
                    Promotes deeper<br/>
                    and restful sleep
                    </p>

                    </div>

                    </div>

                    </div>

                    </div>

                <div
                className="
                mt-8

                relative

                bg-white/80
                backdrop-blur-xl

                rounded-[28px]

                px-8
                py-6

                flex

                flex-col
                sm:flex-row

                items-start
                sm:items-center

                shadow-[0_10px_30px_rgba(0,0,0,.04)]

                overflow-hidden
                "
                >

                    <div
                    className="
                    w-14
                    h-14

                    rounded-full

                    bg-gradient-to-r
                    from-purple-500
                    to-fuchsia-500

                    flex
                    items-center
                    justify-center

                    text-white
                    text-2xl

                    flex-shrink-0

                    shadow-lg
                    "
                    >
                    ❝
                    </div>

                    <div className="mt-5 sm:mt-0 sm:ml-6">

                        <p className="text-base sm:text-xl text-gray-700">

                            <span className="font-bold text-gray-900">
                                Tip:
                            </span>

                            {" "}
                            Sit comfortably, relax your shoulders,
                            and breathe through your nose.

                        </p>

                    </div>

                </div>

          </div>

        </div>

    </>
  );
}

export default BreathingExercise;