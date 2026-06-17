import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

function ChatMessage({
  role,
  content,
  timestamp
}) {

  const isUser = role === "user";

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 15
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      transition={{
        duration: 0.25
      }}

      className={`
        flex
        items-end
        gap-3
        mb-5

        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {!isUser && (

        <div
          className="
            w-10
            h-10

            rounded-full

            bg-gradient-to-r
            from-purple-600
            to-fuchsia-500

            flex
            items-center
            justify-center

            text-white

            shadow-lg

            shrink-0
          "
        >
          <FaBrain />
        </div>

      )}

      <div
        className={`
          max-w-[80%]
          px-5
          py-4

          rounded-[26px]

          shadow-lg

          break-words

          ${
            isUser
              ? `
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500
                text-white
                rounded-br-md
              `
              : `
                bg-white/75
                backdrop-blur-xl
                border
                border-white/30
                text-gray-700
                rounded-bl-md
              `
          }
        `}
      >

        <p
          className="
            text-[15px]
            leading-relaxed
            whitespace-pre-wrap
          "
        >
          {content}
        </p>

        {
          timestamp && (

            <div
              className={`
                mt-3
                text-[11px]

                ${
                  isUser
                    ? "text-purple-100"
                    : "text-gray-400"
                }
              `}
            >

              {
                (() => {

                  const date = new Date(
                    timestamp.endsWith("Z")
                      ? timestamp
                      : `${timestamp}Z`
                  );

                  if (!isNaN(date)) {

                    return date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                  }

                  return timestamp;

                })()
              }

            </div>

          )
        }

      </div>

    </motion.div>

  );

}

export default ChatMessage;