import { useEffect, useState } from "react";

function BodyScanModal() {

    const bodyParts = [

        {
            name: "Forehead",
            message: "Release all tension from your forehead"
        },

        {
            name: "Eyes",
            message: "Allow your eyes to soften and rest"
        },

        {
            name: "Jaw",
            message: "Relax your jaw and let it loosen"
        },

        {
            name: "Shoulders",
            message: "Drop your shoulders and feel lighter"
        },

        {
            name: "Arms",
            message: "Let your arms feel completely relaxed"
        },

        {
            name: "Chest",
            message: "Breathe gently and relax your chest"
        },

        {
            name: "Stomach",
            message: "Allow your stomach to soften"
        },

        {
            name: "Legs",
            message: "Release tension from your legs"
        },

        {
            name: "Feet",
            message: "Feel your feet becoming calm and heavy"
        }

    ];

    const [page, setPage] = useState("welcome");

    const [currentStep, setCurrentStep] = useState(0);

    const [countdown, setCountdown] = useState(10);

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {

      if (isPaused) return;

      const interval = setInterval(() => {

          setCurrentStep(prev => {

              if (prev < bodyParts.length - 1) {

                  return prev + 1;

              }

              return prev;

          });

      }, 10000);

      return () => clearInterval(interval);

  }, [isPaused]);

    useEffect(() => {

      if (page !== "session" || isPaused) return;

      const timer = setInterval(() => {

          setCountdown(prev => {

              if (prev <= 1) {

                  return 10;

              }

              return prev - 1;

          });

      }, 1000);

      return () => clearInterval(timer);

  }, [currentStep, page, isPaused]);

  useEffect(() => {

      setCountdown(10);

  }, [currentStep]);

    const progress =
        ((currentStep + 1) / bodyParts.length) * 100;

    if (page === "welcome") {

        return (

            <div className="text-center py-8 px-6">

                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mt-6">
                    Body Scan Meditation
                </h1>

                <p className="mt-5 text-gray-500 text-lg leading-8 max-w-xl mx-auto">
                    Slowly release tension from head to toe and reconnect
                    with your body through gentle awareness.
                </p>

                <div
                className="
                mt-12

                grid
                grid-cols-1
                sm:grid-cols-3

                gap-5
                "
                >

                    <div
                    className="
                    bg-purple-50
                    rounded-[28px]

                    p-5

                    flex
                    flex-col
                    items-center

                    shadow-lg
                    "
                    >

                        <p className="mt-3 font-medium text-gray-700 text-center">
                            Relaxes your body
                        </p>

                    </div>


                    <div
                    className="
                    bg-pink-50
                    rounded-[28px]

                    p-5

                    flex
                    flex-col
                    items-center

                    shadow-lg
                    "
                    >

                        <p className="mt-3 font-medium text-gray-700 text-center">
                            Reduces stress
                        </p>

                    </div>


                    <div
                    className="
                    bg-indigo-50
                    rounded-[28px]

                    p-5

                    flex
                    flex-col
                    items-center

                    shadow-lg
                    "
                    >

                        <p className="mt-3 font-medium text-gray-700 text-center">
                            Promotes calmness
                        </p>

                    </div>

                </div>

                <button
                    onClick={() => setPage("session")}
                    className="
                    mt-10
                    px-10
                    py-4
                    rounded-full
                    bg-gradient-to-r
                    from-purple-600
                    to-pink-500
                    text-white
                    font-semibold
                    shadow-xl
                    hover:scale-105
                    transition-all
                    cursor-pointer
                    "
                >
                    Begin Session
                </button>

            </div>

        );
    }

    if (page === "session") {

        return (

                <div
                className="
                h-[75vh]
                sm:h-[80vh]

                flex
                flex-col

                text-center

                px-4
                sm:px-6

                py-5
                sm:py-8
                "
                >

                <h1 className="text-4xl font-bold text-gray-800">
                    Body Scan Meditation
                </h1>

                <p className="text-gray-500 mt-3">
                    Relax each part of your body
                </p>

                <div
                    className="
                    mt-8
                    h-3
                    bg-purple-100
                    rounded-full
                    overflow-hidden
                    "
                >

                    <div
                        className="
                        h-full
                        bg-gradient-to-r
                        from-purple-500
                        to-pink-500
                        transition-all
                        duration-1000
                        "
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

                <div className="mt-14">

                    <h2 className="text-5xl font-bold text-gray-800">

                        {bodyParts[currentStep].name}

                    </h2>

                    <p
                        className="
                        mt-6
                        text-lg
                        sm:text-2xl
                        text-purple-700
                        leading-relaxed
                        "
                    >

                        {bodyParts[currentStep].message}

                    </p>

                </div>

                <div
                className="
                flex-1

                overflow-y-auto

                mt-10

                hide-scrollbar

                flex
                flex-col
                items-center
                "
                >

                <div className="mt-5 flex justify-center">

                    <div className="relative flex flex-col items-center">

                        <div
                        className={`
                        w-12
                        h-12

                        sm:w-16
                        sm:h-16
                        rounded-full
                        transition-all duration-700

                        ${
                            currentStep <= 2
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                            : "bg-purple-200"
                        }
                        `}
                        />

                        <div
                        className={`
                        mt-5

                        w-28
                        h-4

                        sm:w-36
                        sm:h-5

                        rounded-full

                        transition-all duration-700

                        ${
                            currentStep === 3
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                            : "bg-purple-200"
                        }
                        `}
                        />

                        <div
                        className={`
                        mt-3

                        w-5
                        h-24

                        sm:w-7
                        sm:h-32

                        rounded-full

                        transition-all duration-700

                        ${
                            currentStep >= 5 && currentStep <= 6
                            ? "bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                            : "bg-purple-200"
                        }
                        `}
                        />

                        <div
                        className="
                        absolute

                        top-[72px]
                        sm:top-[98px]

                        flex
                        gap-22
                        sm:gap-28
                        "
                        >

                            <div
                            className={`
                            w-3
                            h-16

                            sm:w-4
                            sm:h-20

                            rounded-full

                            transition-all
                            duration-700

                            ${
                                currentStep === 4
                                ? "bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                                : "bg-purple-200"
                            }
                            `}
                            />

                            <div
                            className={`
                            w-3
                            h-16

                            sm:w-4
                            sm:h-20

                            rounded-full

                            transition-all
                            duration-700

                            ${
                                currentStep === 4
                                ? "bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                                : "bg-purple-200"
                            }
                            `}
                            />

                        </div>

                        <div className="flex gap-5 sm:gap-7 mt-3">

                            <div
                            className={`
                            w-4
                            h-24

                            sm:w-5
                            sm:h-36

                            rounded-full

                            transition-all duration-700

                            ${
                                currentStep >= 7
                                ? "bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                                : "bg-purple-200"
                            }
                            `}
                            />

                            <div
                            className={`
                            w-4
                            h-24

                            sm:w-5
                            sm:h-36

                            rounded-full

                            transition-all duration-700

                            ${
                                currentStep >= 7
                                ? "bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.5)]"
                                : "bg-purple-200"
                            }
                            `}
                            />

                        </div>

                    </div>

                </div>

                <div
                className="
                mt-8

                flex
                flex-wrap

                justify-center

                gap-4
                "
                >
                    <button

                    onClick={() =>
                        setCurrentStep(prev =>
                            prev > 0 ? prev - 1 : 0
                        )
                    }

                    className="
                    px-5
                    py-3

                    rounded-2xl

                    bg-white

                    shadow-lg

                    text-purple-700
                    font-semibold

                    hover:scale-105
                    transition-all
                    "
                    >
                        ⏮ Previous
                    </button>

                    <button

                    onClick={() => setIsPaused(!isPaused)}

                    className="
                    px-5
                    py-3

                    rounded-2xl

                    bg-gradient-to-r
                    from-purple-600
                    to-pink-500

                    shadow-xl

                    text-white
                    font-semibold

                    hover:scale-105
                    transition-all
                    "
                    >
                        {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </button>

                    <button

                    onClick={() =>
                        setCurrentStep(prev =>
                            prev < bodyParts.length - 1
                                ? prev + 1
                                : prev
                        )
                    }

                    className="
                    px-5
                    py-3

                    rounded-2xl

                    bg-white

                    shadow-lg

                    text-purple-700
                    font-semibold

                    hover:scale-105
                    transition-all
                    "
                    >
                        ⏭ Next
                    </button>

                    <button

                    onClick={() => {

                        setCurrentStep(0);

                        setIsPaused(false);

                    }}

                    className="
                    px-5
                    py-3

                    rounded-2xl

                    bg-red-500

                    text-white
                    font-semibold

                    shadow-lg

                    hover:scale-105
                    transition-all
                    "
                    >
                        🔄 Restart
                    </button>

                </div>

                <div
                className="
                mt-8

                text-4xl
                sm:text-5xl
                font-bold

                bg-gradient-to-r
                from-purple-600
                to-pink-500

                bg-clip-text
                text-transparent
                "
                >
                    {countdown}
                </div>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    seconds
                </p>

                <div
                    className="
                    mt-10
                    inline-flex
                    px-6
                    sm:px-8

                    py-3
                    sm:py-4
                    rounded-full
                    bg-white
                    shadow-xl
                    "
                >

                    <span className="text-sm sm:text-base text-purple-700 font-semibold">

                        Step {currentStep + 1} of {bodyParts.length}

                    </span>

                </div>

            </div>

            </div>

        );
    }

    return (

        <div className="text-center py-10 px-6">

            <h1
                className="
                mt-8
                text-5xl
                font-bold
                bg-gradient-to-r
                from-purple-700
                to-pink-500
                bg-clip-text
                text-transparent
                "
            >
                Session Complete
            </h1>

            <p
                className="
                mt-8
                text-xl
                text-gray-500
                leading-10
                "
            >
                Your body feels lighter.
                <br />
                Your mind feels calmer.
                <br />
                Carry this peaceful feeling with you.
            </p>

            <div
                className="
                mt-14
                bg-gradient-to-r
                from-purple-50
                to-pink-50
                rounded-[40px]
                p-8
                "
            >

                <h2 className="text-2xl font-bold text-gray-800">
                    Great job
                </h2>

                <p className="mt-4 text-gray-500">
                    You've completed a full body scan meditation.
                </p>

            </div>

        </div>

    );

}

export default BodyScanModal;