import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaHeart,
  FaArrowLeft,
  FaUserShield,
  FaExclamationTriangle,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
} from "react-icons/fa";

function Terms() {

  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  const faqData = [

    {
      question: "Is MannMitra a replacement for therapy?",

      answer:
        "No. MannMitra is designed to support mindfulness, self-care, and emotional wellness, but it does not replace professional medical or psychological support.",
    },

    {
      question: "Can I use MannMitra daily?",

      answer:
        "Absolutely. MannMitra is built to encourage healthy daily wellness habits through reminders, journaling, mood tracking, and mindful reflection.",
    },

    {
      question: "What happens if someone misuses the platform?",

      answer:
        "Accounts involved in harmful activity, abusive behavior, unauthorized access attempts, or misuse may be restricted or permanently removed.",
    },

    {
      question: "Can MannMitra features change over time?",

      answer:
        "Yes. We continuously improve our wellness platform and may update features, experiences, or policies to better support users.",
    },

  ];

  return (

    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-[#f8f4ff]
        via-[#fdf7ff]
        to-[#eef4ff]

        flex
        items-start
        lg:items-center
        lg:justify-center

        px-6
        sm:px-6
        lg:px-10

        pt-28
        sm:pt-32
        lg:pt-6

        pb-6
      "
    >

      <div
            className="
                fixed
                top-0
                left-0
                w-full
                z-50
                  
                flex
                items-center
                justify-between
        
                px-4
                sm:px-10
                lg:px-16
        
                py-3
                bg-white/65
                backdrop-blur-2xl
                border-b
                border-white/30
                shadow-[0_4px_30px_rgba(168,85,247,0.06)]
            "
            >
        
            <div
                className="
                flex
                items-center
                gap-3
                -ml-2
            "
            >
        
            <img
                src="/mannmitra-logo.png"
                alt="MannMitra"
                className="
                    w-11
                    h-11
                    rounded-2xl
                    object-cover
                    shadow-lg
                "
            />
        
            <div>
        
            <h2
                className="
                    text-xl
                    font-bold
                    text-purple-700
                "
                >
                MannMitra
            </h2>
        
            <p
                className="
                    text-xs
                    text-gray-900
                "
                >
                Your Mind, Our Care
            </p>
        
            </div>
        
            </div>
        
            <button
                onClick={() => navigate("/register")}
        
                className="
                    w-14
                    h-14
        
                    rounded-2xl
        
                    bg-white/70
                    backdrop-blur-xl
        
                    border
                    border-white/40
        
                    shadow-lg
        
                    flex
                    items-center
                    justify-center
        
                    text-purple-700
                    text-xl
        
                    hover:scale-105
                    hover:text-pink-500
        
                    transition-all
                    duration-300
        
                    cursor-pointer
                  "
                >
                  <FaArrowLeft />
                </button>
        
              </div>

      <div
        className="
          w-full
          max-w-7xl
          h-auto
          lg:h-[82vh]
          lg:mt-16
          rounded-[40px]
          overflow-hidden
          shadow-2xl
          grid
          grid-cols-1
          lg:grid-cols-2
          bg-white/60
          backdrop-blur-2xl
        "
      >

        <div
          className="
            hidden
            lg:flex

            relative
            overflow-hidden
            bg-gradient-to-br
            from-purple-700
            via-fuchsia-600
            to-pink-500
            p-16
            text-white
            flex-col
            justify-between
          "
        >

          <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 top-[-80px] right-[-80px]" />

          <div className="absolute w-[250px] h-[250px] rounded-full bg-white/10 bottom-[-100px] left-[-80px]" />

          <div className="relative z-10">

            <div
              className="
                w-20
                h-20
                rounded-3xl
                bg-white/20
                flex
                items-center
                justify-center
                mb-10
                backdrop-blur-xl
              "
            >

              <FaShieldAlt className="text-4xl" />

            </div>

            <h1
              className="
                text-4xl
                lg:text-6xl
                font-bold
                leading-tight
              "
            >
              Mindful & Safe Wellness
            </h1>

            <p
              className="
                mt-8
                text-base
                lg:text-xl
                text-white/80
                leading-relaxed
                max-w-lg
              "
            >
              MannMitra is designed to create
              a calm, secure, and mindful
              digital wellness experience.
            </p>

          </div>

          <div className="relative z-10 flex flex-wrap gap-4">

            <div
              className="
                bg-white/10
                border
                border-white/20
                backdrop-blur-xl
                rounded-2xl
                px-5
                py-4
                flex
                items-center
                gap-3
              "
            >

              <FaLock />

              <span>Secure Data</span>

            </div>

            <div
              className="
                bg-white/10
                border
                border-white/20
                backdrop-blur-xl
                rounded-2xl
                px-5
                py-4
                flex
                items-center
                gap-3
              "
            >

              <FaHeart />

              <span>Wellness First</span>

            </div>

          </div>

        </div>

        <div
          className="
            relative
            z-20
            bg-white/70
            backdrop-blur-2xl
            p-6
            w-full
            sm:p-8
            lg:p-14
            overflow-y-auto scroll-smooth
          "
        >

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-gray-900
                "
              >
                Terms of Service
              </h2>

              <div className="mt-4 space-y-2">

                <div className="mt-4 space-y-1">

                  <p className="text-gray-500 text-lg">
                    Effective Date • May 24, 2026
                  </p>

                  <p className="text-gray-400 text-sm">
                    Last Reviewed • May 24, 2026
                  </p>

                </div>

                <div className="flex items-center gap-3 text-purple-700">

                  <FaEnvelope />

                  <a
                    href="mailto:mannmitra.support@gmail.com"
                    className="hover:underline cursor-pointer relative z-50"
                  >
                    mannmitra.support@gmail.com
                  </a>

                </div>

              </div>

            </div>

          </div>

          <div className="mt-12 space-y-10">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaCheckCircle className="text-purple-600 text-2xl" />

                <h3 className="text-xl lg:text-2xl font-bold text-purple-700">
                  Responsible Usage
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                By using MannMitra, you agree
                to use the platform respectfully
                and responsibly.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaHeart className="text-pink-500 text-2xl" />

                <h3 className="text-xl lg:text-2xl font-bold text-purple-700">
                  Wellness Disclaimer
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                MannMitra supports emotional
                wellness and self-care, but it
                does not replace professional
                medical or psychological advice.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaUserShield className="text-indigo-500 text-2xl" />

                <h3 className="text-xl lg:text-2xl font-bold text-purple-700">
                  Account Security
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                Users are responsible for
                maintaining the security of
                their account credentials.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaExclamationTriangle className="text-orange-500 text-2xl" />

                <h3 className="text-xl lg:text-2xl font-bold text-purple-700">
                  Platform Integrity
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                Harmful behavior, abuse,
                unauthorized access attempts,
                or misuse may result in account
                suspension.
              </p>

            </div>

            <div className="pt-8">

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">

                {faqData.map((faq, index) => (

                  <div
                    key={index}
                    className="
                      bg-white/80
                      border
                      border-gray-200
                      rounded-2xl
                      overflow-hidden
                      shadow-sm
                      hover:shadow-lg
                      transition-all
                      duration-300
                    "
                  >

                    <button
                      onClick={() =>
                        setOpenFAQ(
                          openFAQ === index
                            ? null
                            : index
                        )
                      }

                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        px-4
                        lg:px-6
                        py-4
                        lg:py-5
                        text-left
                        hover:bg-purple-50
                        transition-all
                      "
                    >

                      <span className="font-semibold text-base lg:text-lg text-gray-800">
                        {faq.question}
                      </span>

                      {
                        openFAQ === index
                        ? (
                          <FaChevronUp className="text-purple-600" />
                        ) : (
                          <FaChevronDown className="text-purple-600" />
                        )
                      }

                    </button>

                    <div
                      className={`
                        transition-all
                        duration-300
                        overflow-hidden

                        ${
                          openFAQ === index
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                        }
                      `}
                    >

                      <div className="px-6 pb-5 text-gray-600 leading-relaxed">

                        {faq.answer}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Terms;