import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({
  onSend,
  disabled = false
}) {

  const [message, setMessage] = useState("");

  const handleSend = () => {

    if (!message.trim()) return;

    onSend(message.trim());

    setMessage("");
  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

  };

  return (

    <div
      className="
        border-t
        border-white/10
        p-4
        bg-white/5
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your thoughts..."
          rows={1}
          disabled={disabled}
          className="
            flex-1

            resize-none

            rounded-2xl

            bg-white/10

            border
            border-white/10

            px-5
            py-3

            text-[15px]
            text-gray-700

            outline-none

            placeholder:text-gray-400

            focus:border-purple-300
            focus:ring-2
            focus:ring-purple-300/40

            transition-all
            duration-300
          "
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="
            w-12
            h-12

            rounded-full

            bg-gradient-to-r
            from-purple-600
            to-fuchsia-500

            text-white

            flex
            items-center
            justify-center

            shadow-xl

            hover:scale-105

            active:scale-95

            transition-all
            duration-300

            disabled:opacity-50
            disabled:cursor-not-allowed

            cursor-pointer
          "
        >

          <FaPaperPlane className="text-sm" />

        </button>

      </div>

    </div>

  );

}

export default ChatInput;