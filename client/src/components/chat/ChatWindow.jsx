import { FaBrain, FaMinus, FaTimes, FaTrash } from "react-icons/fa";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";

function ChatWindow({
  isOpen,
  setIsOpen,
  isMinimized,
  setIsMinimized,
  isNight,
  messages,
  sendMessage,
  loading,
  clearConversation
}) {

  if (!isOpen) return null;

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: messages.length <= 2
        ? "auto"
        : "smooth"
    });

  }, [messages, loading]);

  return (
    <div
      className={`
        fixed
        right-6

        bottom-28

        max-md:right-3
        max-md:left-3
        max-md:w-auto

        w-[390px]

        ${
            isMinimized
                ? "h-[95px]"
                : "h-[650px]"
            }
        max-h-[calc(100vh-140px)]

        rounded-[32px]

        overflow-hidden

        z-[9999]

        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        backdrop-blur-2xl
        `}
    >
      <div
        className={`
            flex
            flex-col

            transition-all
            duration-500

            overflow-hidden

            ${
            isNight
                ? "bg-[#1e1b2e]/95"
                : "bg-white/90"
            }

            ${
            isMinimized
                ? "h-[95px]"
                : "h-full"
            }
        `}
        >
        <div
            onClick={() => {

                if (isMinimized) {

                setIsMinimized(false);

                }

            }}
            className="
                px-6
                py-5

                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500

                flex
                items-center
                justify-between

                cursor-pointer
            "
            >
          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12

                rounded-full

                bg-white/20

                flex
                items-center
                justify-center
              "
            >
              <FaBrain className="text-white text-lg" />
            </div>

            <div>
              <h2 className="text-white font-bold text-lg">
                MannMitra AI
              </h2>

              <p className="text-white/80 text-xs">
                Always here to support you
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={clearConversation}
              className="
                w-9
                h-9

                rounded-full

                bg-white/15

                flex
                items-center
                justify-center

                text-white

                hover:bg-red-500

                transition

                cursor-pointer
              "
            >
              <FaTrash size={11}/>
            </button>

            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="
                    w-9
                    h-9
                    rounded-full
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    text-white
                    hover:bg-white/25
                    transition
                    cursor-pointer
                "
                >
                <FaMinus size={12}/>
                </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(false);
              }}
              className="
                w-9
                h-9

                rounded-full

                bg-white/15

                flex
                items-center
                justify-center

                text-white

                hover:bg-red-500

                transition
                cursor-pointer
              "
            >
              <FaTimes size={12} />
            </button>

          </div>
        </div>

        {!isMinimized && (

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6
            space-y-4
            custom-scroll
          "
        >

          <div className="flex flex-col gap-4">

            {messages.map((message, index) => (

              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />

            ))}

            {loading && (

              <TypingIndicator />

            )}

          <div ref={bottomRef}></div>

          </div>

        </div>

        )}

        {
          !isMinimized &&
          messages.length === 1 && (
            <SuggestionChips
              onSelect={sendMessage}
            />
          )
        }

        {
          !isMinimized && (

            <ChatInput
              onSend={sendMessage}
              disabled={loading}
            />

          )
        }

          </div>
        </div>
  );
}

export default ChatWindow;