import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function SleepMeditationModal() {

    const sleepSteps = [

        {
            message: "Lie down comfortably and close your eyes."
        },

        {
            message: "Take a slow deep breath in."
        },

        {
            message: "Exhale gently and relax your shoulders."
        },

        {
            message: "Let go of the thoughts from today."
        },

        {
            message: "Feel your body becoming lighter and calmer."
        },

        {
            message: "Allow yourself to drift into peaceful sleep."
        }

    ];

    const [page, setPage] = useState("welcome");

    const [currentStep, setCurrentStep] = useState(0);

    const [countdown, setCountdown] = useState(15);

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {

        if (page !== "session" || isPaused) return;

        const interval = setInterval(() => {

            setCurrentStep(prev => {

                if (prev < sleepSteps.length - 1) {

                    return prev + 1;

                }

                return prev;

            });

        }, 15000);

        return () => clearInterval(interval);

    }, [page, isPaused]);

    useEffect(() => {

        if (page !== "session" || isPaused) return;

        const timer = setInterval(() => {

            setCountdown(prev => {

                if (prev <= 1) {

                    return 15;

                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [currentStep, page, isPaused]);

    useEffect(() => {

        setCountdown(15);

    }, [currentStep]);

    useEffect(() => {

        if (currentStep === sleepSteps.length - 1 && countdown === 1) {

            setTimeout(() => {

                setPage("complete");

            }, 1000);

        }

    }, [currentStep, countdown]);

    const progress =
        ((currentStep + 1) / sleepSteps.length) * 100;

    if (page === "welcome") {

        return (

            <div className="text-center py-8">

                <h1
                className="
                text-3xl
                sm:text-4xl
                md:text-5xl

                font-bold
                text-gray-800
                mt-4
                "
                >
                    Sleep Meditation
                </h1>

                <p
                className="
                mt-5

                text-sm
                sm:text-base
                md:text-lg

                leading-7
                text-gray-500

                max-w-xl
                mx-auto
                "
                >
                    Slow down your thoughts and prepare your body
                    for deep and peaceful sleep.
                </p>

                <button
                    onClick={() => setPage("session")}
                    className="
                    mt-8

                    px-7
                    sm:px-10

                    py-3
                    sm:py-4

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
            relative
            text-center

            px-8
            py-6

            min-h-[65vh]
            sm:min-h-[70vh]

            flex
            flex-col
            justify-between

            overflow-hidden
            "
            >

                <h1
                className="
                text-2xl
                sm:text-3xl
                md:text-4xl

                font-bold
                text-gray-800
                "
                >
                    Sleep Meditation
                </h1>

                <p className="text-gray-500 mt-3">
                    Relax and prepare for restful sleep
                </p>

                <div className="mt-8 h-3 bg-purple-100 rounded-full overflow-hidden">

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

                <div className="mt-10">

                    <div
                    className="
                    text-5xl
                    sm:text-6xl
                    md:text-7xl
                    "
                    >
                        {sleepSteps[currentStep].emoji}
                    </div>

                    <p
                    className="
                    mt-6

                    text-lg
                    sm:text-xl
                    md:text-2xl

                    text-purple-700

                    leading-relaxed

                    px-2
                    sm:px-10
                    "
                    >
                        {sleepSteps[currentStep].message}
                    </p>

                </div>

                <div
                className="
                mt-8

                flex
                flex-col
                sm:flex-row

                justify-center
                items-center

                gap-3
                sm:gap-4
                "
                >

                    <button

                        onClick={() =>
                            setCurrentStep(prev =>
                                prev > 0 ? prev - 1 : 0
                            )
                        }

                        className="
                        w-full
                        sm:w-auto

                        px-5
                        py-3

                        text-sm
                        sm:text-base
                        rounded-2xl
                        bg-white
                        shadow-lg
                        text-purple-700
                        font-semibold
                        cursor-pointer
                        "
                    >
                        ⏮ Previous
                    </button>

                    <button

                        onClick={() => setIsPaused(!isPaused)}

                        className="
                        w-full
                        sm:w-auto

                        px-5
                        py-3

                        text-sm
                        sm:text-base
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-600
                        to-pink-500
                        text-white
                        font-semibold
                        shadow-xl
                        cursor-pointer
                        "
                    >
                        {isPaused ? "▶ Resume" : "⏸ Pause"}
                    </button>

                    <button

                        onClick={() =>
                            setCurrentStep(prev =>
                                prev < sleepSteps.length - 1
                                    ? prev + 1
                                    : prev
                            )
                        }

                        className="
                        w-full
                        sm:w-auto

                        px-5
                        py-3

                        text-sm
                        sm:text-base
                        rounded-2xl
                        bg-white
                        shadow-lg
                        text-purple-700
                        font-semibold
                        cursor-pointer
                        "
                    >
                        ⏭ Next
                    </button>

                </div>

                <div className="mt-3">

                    <p
                    className="
                    text-sm
                    sm:text-base
                    text-gray-500
                    "
                    >
                        {countdown} seconds remaining
                    </p>

                    <p
                    className="
                    mt-2

                    text-sm
                    sm:text-base

                    font-semibold
                    text-purple-600
                    "
                    >
                        Step {currentStep + 1} of {sleepSteps.length}
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="text-center py-12">

            <h1
            className="
            text-3xl
            sm:text-4xl
            md:text-5xl

            font-bold
            mt-4

            text-gray-800
            "
            >
                Session Complete
            </h1>

            <p
            className="
            mt-6

            text-base
            sm:text-lg
            md:text-xl

            leading-8

            text-gray-500
            "
            >

                Sweet dreams.

                <br />

                Your mind is quieter.

                <br />

                Your body is relaxed.

                <br />

                You deserve peaceful rest tonight.

            </p>

            <div
            className="
            mt-12
            bg-gradient-to-r
            from-purple-50
            to-pink-50
            rounded-[40px]
            p-5
            sm:p-8
            "
            >

                <h2 className="text-2xl font-bold text-gray-800">
                    Sleep Well
                </h2>

                <p className="mt-4 text-gray-500">
                    Carry this peaceful feeling into your dreams.
                </p>

            </div>

        </div>

    );

}

export default SleepMeditationModal;