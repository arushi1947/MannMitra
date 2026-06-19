import { useEffect, useState } from "react";

function QuickRelaxationModal() {

    const [timeLeft, setTimeLeft] = useState(120);
    const [isRunning, setIsRunning] = useState(false);
    const [affirmationIndex, setAffirmationIndex] = useState(0);
    const [step, setStep] = useState(1);
    const [breathPhase, setBreathPhase] = useState("Inhale");
    const [circleScale, setCircleScale] = useState(1);

    const affirmations = [

        "Take a deep breath",
        "You are safe and supported",
        "Release tension from your body",
        "Slow down and be present",
        "Everything will be okay"

    ];

    useEffect(() => {

        let timer;

        if (isRunning && timeLeft > 0) {

            timer = setInterval(() => {

                setTimeLeft(prev => prev - 1);

            }, 1000);

        }

        return () => clearInterval(timer);

    }, [isRunning, timeLeft]);

    useEffect(() => {

        if (timeLeft === 0) {

            setIsRunning(false);

            setTimeout(() => {

                setStep(3);

            }, 1500);

        }

    }, [timeLeft]);

    useEffect(() => {

        const interval = setInterval(() => {

            setAffirmationIndex(prev =>
                (prev + 1) % affirmations.length
            );

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    useEffect(() => {

        if (!isRunning) return;

        const phases = [

            {
                text: "Inhale",
                scale: 1.2
            },

            {
                text: "Hold",
                scale: 1.2
            },

            {
                text: "Exhale",
                scale: 1
            }

        ];

        let index = 0;

        setBreathPhase(phases[0].text);
        setCircleScale(phases[0].scale);

        const interval = setInterval(() => {

            index = (index + 1) % phases.length;

            setBreathPhase(phases[index].text);

            setCircleScale(phases[index].scale);

        }, 4000);

        return () => clearInterval(interval);

    }, [isRunning]);

    const minutes = String(
        Math.floor(timeLeft / 60)
    ).padStart(2, "0");

    const seconds = String(
        timeLeft % 60
    ).padStart(2, "0");

    const resetTimer = () => {

        setTimeLeft(120);

        setIsRunning(false);

        setAffirmationIndex(0);

    };

    const resetSession = () => {

        setStep(1);

        setTimeLeft(120);

        setIsRunning(false);

        setAffirmationIndex(0);

        setBreathPhase("Inhale");

        setCircleScale(1);

    };

    return (

        <div
        className="
        relative
        overflow-hidden
        text-center

        px-3
        sm:px-6

        py-4
        sm:py-6
        "
        >

            <div
            className="
            absolute

            top-1/2
            left-1/2

            -translate-x-1/2
            -translate-y-1/2

            w-[500px]
            h-[500px]

            rounded-full

            bg-purple-300/20

            blur-[120px]

            pointer-events-none
            "
            />

            {
            step === 1 && (

            <div className="relative z-10 text-center">

                <h1 className="text-3xl sm:text-4xl font-bold mt-6 text-gray-800">
                    Quick Relaxation
                </h1>

                <p className="mt-5 text-base sm:text-lg text-gray-500 leading-8">
                    Sit comfortably.
                    <br />
                    Take a slow breath.
                    <br />
                    Give yourself 2 minutes of peace.
                </p>

                <button

                onClick={() => setStep(2)}

                className="
                mt-10

                px-8
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
                    Begin Session
                </button>

            </div>

            )
            }

            {
            step === 2 && (

            <div className="relative z-10 text-center">

                <h2 className="text-3xl font-bold text-gray-800">
                    Breathe Slowly
                </h2>

                <p className="text-gray-500 mt-3">
                    Inhale deeply and exhale gently
                </p>

                <div
                className="
                absolute

                top-1/2
                left-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[600px]
                h-[600px]

                rounded-full

                bg-gradient-to-r
                from-purple-300/20
                via-pink-300/20
                to-fuchsia-300/20

                blur-[150px]

                animate-pulse

                pointer-events-none
                "
                />

                <div className="flex justify-center mt-12">

                    <div
                    className="
                    w-40
                    h-40
                    sm:w-56
                    sm:h-56

                    rounded-full

                    bg-gradient-to-r
                    from-purple-400
                    to-pink-400

                    flex
                    flex-col
                    items-center
                    justify-center

                    shadow-[0_0_80px_rgba(168,85,247,0.4)]

                    transition-all
                    duration-[4000ms]
                    ease-in-out
                    "
                    style={{
                        transform: `scale(${circleScale})`
                    }}
                    >

                        <span className="text-white text-xl sm:text-3xl font-bold">

                            {
                                breathPhase === "Inhale" && "Inhale"
                            }

                            {
                                breathPhase === "Hold" && "Hold"
                            }

                            {
                                breathPhase === "Exhale" && "Exhale"
                            }

                        </span>

                        <div className="text-white text-2xl sm:text-4xl font-bold mt-3">
                            {minutes}:{seconds}
                        </div>

                    </div>

                </div>

                <div
                className="
                mt-10
                bg-purple-50
                rounded-3xl
                p-6
                text-lg
                text-purple-700
                font-medium
                shadow-lg
                "
                >

                    {affirmations[affirmationIndex]}

                </div>

                <div
                className="
                flex

                flex-col
                sm:flex-row

                items-center
                justify-center

                gap-4
                mt-10
                "
                >

                    <button
                    onClick={() => setIsRunning(true)}
                    className="
                    px-8
                    py-3
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
                        ▶ Start
                    </button>


                    <button
                    onClick={() => setIsRunning(false)}
                    className="
                    px-8
                    py-3
                    rounded-full
                    bg-gray-200
                    text-gray-700
                    font-semibold
                    hover:scale-105
                    transition-all
                    cursor-pointer
                    "
                    >
                        ⏸ Pause
                    </button>


                    <button
                    onClick={resetTimer}
                    className="
                    px-8
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
                        🔄 Reset
                    </button>

                </div>

            </div>

            )
            }

            {
            step === 3 && (

            <div className="relative z-10 text-center">

                <div
                className="
                absolute
                left-1/2
                top-0
                -translate-x-1/2

                w-72
                h-72

                rounded-full

                bg-purple-300/20

                blur-[120px]
                "
                />

                <div className="relative z-10">

                    <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mt-10">
                        Session Complete
                    </h1>

                    <p className="mt-6 text-gray-500 text-lg leading-8">

                        Wonderful.

                        <br/>

                        You gave yourself two peaceful minutes.

                    </p>

                </div>

                <div
                className="
                mt-14

                max-w-xl
                mx-auto

                bg-white/70

                backdrop-blur-xl

                rounded-[40px]

                p-6 sm:p-10

                shadow-xl
                "
                >

                    <p className="text-lg sm:text-2xl italic text-purple-700 leading-relaxed">

                        "Almost everything will work again
                        if you unplug it for a few minutes,
                        including yourself."

                    </p>

                </div>

                <button

                onClick={resetSession}

                className="
                mt-12
                px-10
                py-5
                rounded-full
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                text-white
                font-semibold
                shadow-xl
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                "

                >

                Done

                </button>

            </div>

            )
            }            

        </div>

    );

}

export default QuickRelaxationModal;
