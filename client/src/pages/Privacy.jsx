import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaLock,
  FaShieldAlt,
  FaDatabase,
  FaArrowLeft,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";

function Privacy() {

  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();
  const faqData = [

    {
      question: "Who can view my wellness entries?",

      answer:
        "Only you can access your reminders, mood logs, and journal entries. Your personal wellness data remains private to your account.",
    },

    {
      question: "Will my journals remain confidential?",

      answer:
        "Yes. MannMitra is designed to provide a safe and private space for reflection, journaling, and emotional wellbeing.",
    },

    {
      question: "Can I remove my data anytime?",

      answer:
        "Absolutely. You can permanently delete your account and wellness history directly from Settings whenever you choose.",
    },

    {
      question: "Does MannMitra track sensitive personal information?",

      answer:
        "We only collect the information required to support your wellness experience, such as reminders, mood tracking, and account preferences.",
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
            via-fuchsia-700
            to-pink-600
            p-16
            text-white
            flex-col
            justify-between
          "
        >

          <div className="absolute w-[320px] h-[320px] rounded-full bg-white/10 top-[-100px] right-[-100px]" />

          <div className="absolute w-[260px] h-[260px] rounded-full bg-white/10 bottom-[-120px] left-[-80px]" />

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


              <FaLock className="text-4xl" />

            </div>

            <h1
              className="
                text-4xl
                lg:text-6xl
                font-bold
                leading-tight
              "
            >
              Your Data
              <br />
              Stays Safe
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
              We prioritize secure storage,
              encrypted authentication,
              and complete privacy for your
              wellness journey.
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

              <FaShieldAlt />

              <span>Encrypted Auth</span>

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

              <FaDatabase />

              <span>Protected Storage</span>

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
                Privacy Policy
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

                <FaShieldAlt className="text-purple-600 text-2xl" />

                <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
                  Secure Information
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                MannMitra securely stores your
                reminders, journals, mood logs,
                and wellness activity data.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaLock className="text-indigo-500 text-2xl" />

                <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
                  Password Encryption
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                Passwords are encrypted and
                never stored in plain text.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaCheckCircle className="text-pink-500 text-2xl" />

                <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
                  No Data Selling
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                We never sell or share your
                personal wellness data with
                third parties.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaUserShield className="text-green-500 text-2xl" />

                <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
                  User Control
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                Users can request account
                deletion anytime directly
                from Settings.
              </p>

            </div>

            <div>

              <div className="flex items-center gap-3 mb-4">

                <FaDatabase className="text-orange-500 text-2xl" />

                <h3 className="text-xl sm:text-2xl font-bold text-purple-700">
                  Protected Infrastructure
                </h3>

              </div>

              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                We use secure authentication,
                protected APIs, and secure
                database storage to safeguard
                your information.
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

export default Privacy;