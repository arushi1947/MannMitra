import React from "react";

function SuggestionChips({ onSelect }) {

  const suggestions = [
    "I'm feeling overwhelmed",
    "Help me organize my day",
    "Suggest breathing exercises",
    "I'm anxious today",
    "I forgot important tasks"
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        px-5
        mb-5
      "
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="
            px-4
            py-4

            rounded-3xl

            bg-white/80
            backdrop-blur-xl

            border
            border-purple-100

            text-sm
            text-purple-700
            font-medium

            shadow-sm

            transition-all
            duration-300

            hover:bg-gradient-to-r
            hover:from-purple-600
            hover:to-fuchsia-500

            hover:text-white
            hover:shadow-lg
            hover:scale-[1.03]

            cursor-pointer
          "
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default SuggestionChips;