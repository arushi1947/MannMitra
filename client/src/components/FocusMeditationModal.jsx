import { useEffect, useState } from "react";

function FocusMeditationModal() {

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [selectedTask, setSelectedTask] = useState("");

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [paused, setPaused] = useState(false);

  const reminders = [
    "Are you still present?",
    "Thoughts are normal.",
    "Gently return your attention.",
    "No need to force anything.",
    "Stay with this moment.",
    "Focus creates clarity."
  ];

  const [currentReminder, setCurrentReminder] = useState(0);

  useEffect(() => {

    if (!started || completed || paused) return;

    const timer = setInterval(() => {

        setTimeLeft((prev) => {

        if (prev === 1) {

            setCompleted(true);

            return 0;

        }

        return prev - 1;

        });

    }, 1000);

    return () => clearInterval(timer);

    }, [started, completed, paused]);

  useEffect(() => {

    if (!started || completed || paused) return;

    const reminderInterval = setInterval(() => {

        setCurrentReminder(
        (prev) => (prev + 1) % reminders.length
        );

    }, 30000);

    return () => clearInterval(reminderInterval);

    }, [started, completed, paused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const tasks = [
    {
      emoji: "📚",
      label: "Studying"
    },
    {
      emoji: "💻",
      label: "Work"
    },
    {
      emoji: "✍️",
      label: "Writing"
    },
    {
      emoji: "📖",
      label: "Reading"
    },
    {
      emoji: "🎨",
      label: "Creativity"
    }
  ];

  if (completed) {

    return (

      <div className="text-center">

        <h1 className="text-4xl font-bold mt-6 text-gray-800">
          Session Complete
        </h1>

        <p className="mt-5 text-gray-500 leading-relaxed">

          Wonderful work.

          <br />

          You spent 15 minutes focusing on

          <span className="font-semibold text-purple-600">
            {" "} {selectedTask}
          </span>

        </p>

        <div
          className="
          mt-8
          bg-green-50
          rounded-[25px]
            p-4 sm:p-6
          "
        >

          <p className="text-green-700 text-lg sm:text-xl font-semibold">
            Focus Streak Completed
          </p>

          <p className="text-green-600 mt-4">
            Every time you returned your attention,
            you strengthened your concentration.
          </p>

        </div>

        <button

        onClick={() => {

        setStarted(false);

        setCompleted(false);

        setPaused(false);

        setTimeLeft(15 * 60);

        setCurrentReminder(0);

        setSelectedTask("");

        }}

        className="
        mt-8

        px-10
        py-4

        rounded-full

        bg-gradient-to-r
        from-purple-600
        to-pink-500

        text-white

        font-semibold

        hover:scale-105

        transition-all

        cursor-pointer
        "
        >

        Start Again

        </button>

      </div>

    );

  }

  if (started) {

    return (

      <div className="text-center">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 text-gray-800">
          Deep Focus Session
        </h1>

        <p className="mt-2 text-purple-600 font-semibold">
          Current focus: {selectedTask}
        </p>

        {
            paused && (

                <p className="mt-2 text-orange-500 font-medium">
                Session Paused
                </p>

            )
            }

        <div
          className="
          mt-8

          w-32
        h-32

        sm:w-40
        sm:h-40

        md:w-48
        md:h-48

          mx-auto

          rounded-full

          bg-gradient-to-r
          from-purple-600
          to-pink-500

          flex
          items-center
          justify-center

          shadow-2xl
          "
        >

          <div className="text-white">

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">

              {String(minutes).padStart(2, "0")}:

              {String(seconds).padStart(2, "0")}

            </h2>

          </div>

        </div>

        <div
          className="
          mt-6

          bg-purple-50

          rounded-[30px]

          p-4 sm:p-5
          "
        >

          <p className="text-purple-700 text-base sm:text-lg font-semibold">

            {reminders[currentReminder]}

          </p>

        </div>

        <div className="space-y-2 mt-6 text-sm sm:text-base text-gray-600">

          <p>Remove distractions.</p>

          <p>Focus only on one thing.</p>

          <p>If your mind wanders, gently come back.</p>

          <p>Be patient with yourself.</p>

        </div>

        <div
        className="
        mt-8

        flex
        flex-col
        sm:flex-row

        justify-center
        items-center

        gap-4
        "
        >

        <button

            onClick={() => setPaused(!paused)}

            className="
            px-7
            py-3

            rounded-full

            bg-purple-100

            text-purple-700

            font-semibold

            hover:scale-105

            transition-all

            cursor-pointer
            "
        >

            {paused ? "Resume" : "Pause"}

        </button>

        <button

            onClick={() => {

            setStarted(false);

            setCompleted(false);

            setTimeLeft(15 * 60);

            setCurrentReminder(0);

            }}

            className="
            px-7
            py-3

            rounded-full

            bg-pink-100

            text-pink-600

            font-semibold

            hover:scale-105

            transition-all

            cursor-pointer
            "
        >

            End Session

        </button>

        </div>

      </div>

    );

  }

  return (

    <div className="text-center">

      <h1 className="text-3xl font-bold mt-4 text-gray-800">
        Focus Meditation
      </h1>

      <p className="mt-3 text-gray-500 leading-relaxed">

        Choose what you want to focus on today.

        <br />

        Spend 15 minutes practicing deep attention.

      </p>

      <div
        className="
        mt-8

        grid
        grid-cols-1
        sm:grid-cols-2

        gap-4
        "
      >

        {
          tasks.map((task, index) => (

            <button

              key={index}

              onClick={() => setSelectedTask(task.label)}

              className={`
              p-3 sm:p-4

              rounded-[22px]

              border-2

              transition-all
              duration-300

              cursor-pointer

              ${
                selectedTask === task.label
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-white"
              }
              `}
            >

              <div className="text-3xl sm:text-4xl">
                {task.emoji}
              </div>

              <h3 className="mt-2 text-sm sm:text-base font-semibold">
                {task.label}
              </h3>

            </button>

          ))
        }

      </div>

      <button

        disabled={!selectedTask}

        onClick={() => setStarted(true)}

        className="
        mt-7

        w-full
        sm:w-auto

        px-8
        sm:px-10

        py-3
        sm:py-4

        text-base
        sm:text-lg

        rounded-full

        bg-gradient-to-r
        from-purple-600
        to-pink-500

        text-white
        font-semibold

        hover:scale-105

        transition-all

        disabled:opacity-50

        cursor-pointer
        "
      >

        Start Session

      </button>

    </div>

  );

}

export default FocusMeditationModal;