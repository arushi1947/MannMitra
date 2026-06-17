import { motion } from "framer-motion";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="
          max-w-[75%]
          px-4
          py-3
          rounded-[22px]
          bg-white/80
          backdrop-blur-xl
          border border-purple-100
          shadow-md
        "
      >
        <div className="flex items-center gap-1">
          <motion.span
            className="w-2 h-2 rounded-full bg-purple-400"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0,
            }}
          />

          <motion.span
            className="w-2 h-2 rounded-full bg-purple-500"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.2,
            }}
          />

          <motion.span
            className="w-2 h-2 rounded-full bg-fuchsia-500"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          MannMitra AI is thinking...
        </p>
      </div>
    </div>
  );
}

export default TypingIndicator;