import { useEffect, useState } from "react";
import { RiChatSmile3Fill } from "react-icons/ri";
import ChatWindow from "./ChatWindow";
import API from "../../services/api";
import { useLocation } from "react-router-dom";

function AIChatWidget() {

  const [isOpen, setIsOpen] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);

  const [loading, setLoading] = useState(false);

  const [historyLoaded, setHistoryLoaded] = useState(false);

  const currentHour = new Date().getHours();

  const isNight = currentHour >= 18 || currentHour < 5;

  const location = useLocation();

  const hasFloatingButton =
    location.pathname === "/journal" ||
    location.pathname === "/reminders" ||
    location.pathname === "/mood";

  const hiddenRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/terms",
    "/privacy"
  ];

  useEffect(() => {

    if (
      isOpen &&
      !historyLoaded
    ) {

      fetchChatHistory();

      setHistoryLoaded(true);

    }

  }, [isOpen]);

  const [messages, setMessages] =
    useState([]);

  const handleOpen = () => {

    setIsOpen(true);

    setIsMinimized(false);

  };

  const sendMessage = async (message) => {

    try {

      setLoading(true);

      const userMessage = {

        role: "user",

        content: message,

        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })

      };

      setMessages(prev => [

        ...prev,

        userMessage

      ]);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await API.post(
        "/api/chat",
        {
          email: user.email,
          message
        }
      );

      const aiMessage = {

        role: "assistant",

        content: response.data.reply,

        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })

      };

      setMessages(prev => [

        ...prev,

        aiMessage

      ]);

    }

    catch (error) {

      console.log(error);

      setMessages(prev => [

        ...prev,

        {

          role: "assistant",

          content:
            "Sorry, something went wrong. Please try again.",

          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })

        }

      ]);

    }

    finally {

      setLoading(false);

    }

  };

  const fetchChatHistory = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const response = await API.get(
        `/api/chat-history?email=${user.email}`
      );

      if (
        response.data.messages &&
        response.data.messages.length > 0
      ) {

        setMessages(
          response.data.messages
        );

      }

      else {

        setMessages([

          {

            role: "assistant",

            content:
              "👋 Hello! I'm MannMitra AI.\n\nI'm here to support you with stress, emotional wellbeing, and organizing your thoughts.\n\nHow are you feeling today?",

            timestamp:
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })

          }

        ]);

      }

    }

    catch (error) {

      console.log(
        "Failed to load chat history",
        error
      );

    }

  };

  const clearConversation = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await API.delete(
        `/api/chat-history?email=${user.email}`
      );

      setMessages([
        {
          role: "assistant",

          content:
            "👋 Hello! I'm MannMitra AI.\n\nHow are you feeling today?",

          timestamp:
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })

        }
      ]);

    }

    catch (error) {

      console.log(error);

    }

  };

  const shouldHide =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/reset-pin");

  if (shouldHide) return null;

  return (

    <>

      {

        isOpen && (

          <ChatWindow
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            isNight={isNight}
            messages={messages}
            sendMessage={sendMessage}
            loading={loading}
            clearConversation={clearConversation}
          />

        )

      }

      <button

        onClick={handleOpen}

        className={`
          fixed

          ${
            hasFloatingButton
              ? "bottom-[100px] md:bottom-7 w-14 h-14 right-3 z-[40]"
              : "bottom-7 right-7 w-[70px] h-[70px] z-[9999]"
          }

          w-[70px]
          h-[70px]

          rounded-full

          bg-gradient-to-r
          from-purple-600
          to-fuchsia-500

          backdrop-blur-xl

          border
          border-white/20

          text-white

          flex
          items-center
          justify-center

          shadow-[0_15px_50px_rgba(168,85,247,0.45)]

          hover:scale-110

          transition-all
          duration-300

          cursor-pointer

          z-[9999]
        `}

      >

        <RiChatSmile3Fill className="text-[25px]" />

      </button>

    </>

  );

}

export default AIChatWidget;