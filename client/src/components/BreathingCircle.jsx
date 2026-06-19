import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function BreathingCircle({
  phase,
  duration,
  isPaused
}) {

  const text =
    phase === "inhale"
      ? "Inhale"
      : phase === "hold"
      ? "Hold"
      : "Exhale";

    const orbColor =
        phase === "inhale"
            ? "from-purple-500 via-pink-400 to-fuchsia-500"
            : phase === "hold"
            ? "from-orange-400 via-pink-300 to-amber-300"
            : "from-cyan-500 via-blue-400 to-indigo-500";

    const seconds = duration;

    const [countdown, setCountdown] = useState(seconds);

    useEffect(() => {

        setCountdown(seconds);

    }, [phase, seconds]);

    useEffect(() => {

        if (isPaused) return;

        const timer = setInterval(() => {

            setCountdown(prev => {

                if (prev <= 1)
                    return 1;

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [phase, isPaused]);

    const dots = Array.from({ length: 72 });

  return (
    <div className="flex justify-center">

     <motion.div
        animate={
            isPaused
            ?
            {}
            :
            {
                scale:
                phase === "inhale"
                ? 1.12
                : phase === "hold"
                ? 1.12
                : 1
            }
        }
        transition={{
            duration: seconds,
            ease: "easeInOut"
        }}
        className="
        relative

        w-[240px]
        h-[240px]

        sm:w-[300px]
        sm:h-[300px]

        md:w-[360px]
        md:h-[360px]

        rounded-full

        flex
        items-center
        justify-center
        "
        > 
    
    <div className="absolute inset-0 flex items-center justify-center overflow-visible">

    <motion.div

        animate={
        isPaused
        ?
        {}
        :
        {
        x:[-25,20,-25]
        }
        }

        transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
        }}

        className="
        absolute

        left-[-180px]

        w-[420px]
        h-[110px]

        rounded-full

        bg-gradient-to-r
        from-purple-300/10
        via-fuchsia-200/40
        to-transparent

        blur-[25px]

        rotate-[-18deg]
        "
    />

    <motion.div

        animate={
        isPaused
        ?
        {}
        :
        {
        x:[-25,20,-25]
        }
        }

        transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
        }}

        className="
        absolute

        right-[-180px]

        w-[420px]
        h-[110px]

        rounded-full

        bg-gradient-to-l
        from-pink-300/10
        via-fuchsia-200/40
        to-transparent

        blur-[25px]

        rotate-[18deg]
        "
    />

    </div>

    <div
    className="
    absolute

    inset-[-18px]

    rounded-full

    border-4
    border-purple-300/50
    "
    />

    <motion.div

    animate={
    isPaused
    ?
    {}
    :
    {
    rotate:360
    }
    }

    transition={{
    duration:50,
    repeat:Infinity,
    ease:"linear"
    }}

    className="
    absolute

    w-[430px]
    h-[430px]
    "
    >

    {
    dots.map((_, i) => {

    const radius = 215;

    const angle =
        (i * 360) / dots.length;

    const x =
        radius *
        Math.cos(
        (angle * Math.PI) / 180
        );

    const y =
        radius *
        Math.sin(
        (angle * Math.PI) / 180
        );

    return (

        <motion.div
        key={i}

        animate={
        isPaused
        ?
        {}
        :
        {
        opacity:[0.4,1,0.4]
        }
        }

        transition={{
            duration:3,
            repeat:Infinity,
            delay:i*0.03
        }}

        className={`
        absolute

        rounded-full

        w-2.5
        h-2.5

        ${
        i%2===0
        ? "bg-pink-300"
        : "bg-fuchsia-300"
        }
        `}
        style={{
            left:`calc(50% + ${x}px - 5px)`,
            top:`calc(50% + ${y}px - 5px)`
        }}
        />

    );

    })
    }

    </motion.div>

    <div
    className="
    absolute

    w-[390px]
    h-[390px]

    rounded-full

    border-[6px]

    border-white/70
    shadow-[0_0_40px_rgba(255,255,255,.8)]
    "
    />

    <div
    className={`
    absolute

    w-[210px]
    h-[210px]

    sm:w-[270px]
    sm:h-[270px]

    md:w-[320px]
    md:h-[320px]

    rounded-full

    bg-gradient-to-br

    ${orbColor}

    shadow-[

    0_0_70px_rgba(255,180,220,.55),
    0_0_140px_rgba(236,72,153,.2)

    ]
    `}
    />

    <div
    className="
    absolute

    w-[150px]
    h-[150px]

    sm:w-[180px]
    sm:h-[180px]

    md:w-[220px]
    md:h-[220px]

    rounded-full

    bg-white/15

    backdrop-blur-xl
    "
    />

    <div
    className="
    relative

    z-20

    flex
    flex-col

    items-center
    "
    >

    <motion.div

    animate={
    isPaused
    ?
    {}
    :
    {
    y:[0,-6,0]
    }
    }

    transition={{
    duration:2,
    repeat:Infinity
    }}
    >
        <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path d="M4 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />

            <path d="M4 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />

            <path d="M4 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />

        </svg>
        </motion.div>

    <h2
    className="
    text-white

    font-bold

    text-4xl
    sm:text-5xl
    md:text-6xl

    leading-none
    "
    >
    {text}
    </h2>

    <p
    className="
    text-white

    font-bold

    text-3xl
    sm:text-4xl
    md:text-5xl

    mt-6
    "
    >
    {countdown}
    </p>

    <p
    className="
    text-white/80

    text-lg

    mt-2
    "
    >
    seconds
    </p>

    </div>

    </motion.div>

    </div>
  );
}

export default BreathingCircle;