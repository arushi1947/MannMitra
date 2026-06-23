import Sidebar from "../components/Sidebar";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import TrustedContactsCard from "../components/TrustedContactsCard";
import EmergencyCard from "../components/EmergencyCard";
import CrisisHistoryCard from "../components/CrisisHistoryCard";

function WellnessHub() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1280);
    
    const user = JSON.parse(localStorage.getItem("user"));
    
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [selectedCard, setSelectedCard] = useState(null);
    
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

    const cards = [

    {
    title: "Trusted Contacts",
    emoji: "❤️"
    },

    {
    title: "Emergency Support",
    emoji: "🆘"
    },

    {
    title: "Crisis History",
    emoji: "📊"
    },

    ];

return (  
      <>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
  
        <div className="min-h-screen bg-[#f6f3ff] flex overflow-x-hidden overflow-y-auto">
        
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
                Care Circle
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
mt-10 sm:mt-16 lg:mt-24

grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3

gap-6
"
>
{
cards.map((item,index)=>(

<div
key={index}

className="
bg-white/80
rounded-[30px]
p-5 sm:p-8
min-h-[200px] sm:min-h-[240px]

shadow-xl

flex
flex-col
justify-between

"
>

<div className="flex flex-col items-center text-center">

<div className="text-5xl sm:text-6xl">
{item.emoji}
</div>

<h2
className="
text-xl
sm:text-2xl
font-bold
mt-4
text-gray-800
"
>
{item.title}
</h2>

</div>

<div className="flex justify-center mt-8">

<button
onClick={() => setSelectedCard(item)}
className="
px-6 sm:px-8
py-3
w-full sm:w-auto

rounded-full

bg-gradient-to-r
from-purple-600
to-pink-500

text-white
font-semibold

hover:scale-105
transition-all
duration-300

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

{
selectedCard && (

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

w-full
max-w-5xl

h-[92vh]
md:h-auto
md:max-h[92vh]

rounded-[30px]
sm:rounded-[40px]

shadow-2xl

overflow-hidden

flex
flex-col
"
>

<button
onClick={()=>setSelectedCard(null)}
className="
absolute
top-3
right-3
sm:top-5
sm:right-5

w-10
h-10

flex
items-center
justify-center

rounded-full

bg-gray-100
hover:bg-gray-200

text-xl
text-gray-500

transition-all
duration-300

cursor-pointer

z-20
"
>
✕
</button>

{
selectedCard.title==="Trusted Contacts" && (

<div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-hidden">

    <TrustedContactsCard/>

</div>

)
}

{
selectedCard.title === "Emergency Support" && (

<div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">

    <EmergencyCard/>

</div>

)
}

{
selectedCard.title==="Crisis History" && (

<div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
    <CrisisHistoryCard/>
</div>

)
}

</div>

</div>

)
}
</div>
</>

);

}

export default WellnessHub;