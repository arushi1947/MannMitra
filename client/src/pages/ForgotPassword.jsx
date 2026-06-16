import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleReset = async () => {

    try {

        const response = await fetch(
        "http://127.0.0.1:8000/forgot-password",
        {
            method: "POST",

            headers: {
            "Content-Type": "application/json"
            },

            body: JSON.stringify({
            email
            })
        }
        );

        const data = await response.json();

        if (!response.ok) {

        alert(
            data.detail ||
            data.message ||
            "Something went wrong"
        );

        return;

        }

        alert(
        data.message ||
        "Reset link sent successfully"
        );

    } catch (error) {

        alert("Server error");

        console.log(error);

    }

    };

  return (

    <div
        className="
            h-screen
            flex
            items-center
            justify-center
            pt-20
            bg-gradient-to-br
            from-[#f3e8ff]
            via-[#fdf4ff]
            to-[#ede9fe]
            overflow-hidden
            relative
            px-4
            py-4
        "
        >

        <div
        className="
            absolute
            w-[500px]
            h-[500px]
            bg-purple-300/20
            rounded-full
            blur-3xl
            top-[-120px]
            left-[-120px]
        "
        />

        <div
        className="
            absolute
            w-[450px]
            h-[450px]
            bg-pink-300/20
            rounded-full
            blur-3xl
            bottom-[-100px]
            right-[-100px]
        "
        />

        <div
            className="
                absolute
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
                onClick={() => navigate("/login")}
        
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
            relative
            z-10
            w-[95%]
            max-w-[1100px]

            min-h-[520px]
            lg:h-[82vh]
            lg:max-h-[600px]

            rounded-[30px]
            lg:rounded-[40px]

            overflow-hidden
            shadow-2xl

            flex
            flex-col
            lg:flex-row
            bg-white/50
            backdrop-blur-2xl
            border
            border-white/30
        "
        >

        <div
            className="
            hidden
            lg:flex
            flex-1
            bg-gradient-to-br
            from-purple-700
            via-purple-600
            to-pink-500
            text-white
            p-8
            lg:p-16
            flex
            flex-col
            justify-center
            relative
            overflow-hidden
            "
        >

            <div
            className="
                absolute
                top-[-80px]
                right-[-80px]
                w-72
                h-72
                bg-white/10
                rounded-full
            "
            />

            <div
            className="
                absolute
                bottom-[-100px]
                left-[-100px]
                w-80
                h-80
                bg-white/10
                rounded-full
            "
            />

            <div className="relative z-10">

            <h1
                className="
                text-3xl
                lg:text-5xl
                font-bold
                leading-tight
                mb-6
                "
            >
                Reset Your Password
            </h1>

            <p
                className="
                text-base lg:text-xl
                text-white/80
                leading-relaxed
                max-w-md
                "
            >
                Don’t worry.
                We’ll help you safely get back into your
                wellness journey
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <div
                className="
                    px-6
                    py-4
                    rounded-3xl
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/20
                "
                >
                Secure Reset
                </div>

                <div
                className="
                    px-6
                    py-4
                    rounded-3xl
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/20
                "
                >
                Fast Recovery
                </div>

            </div>

            </div>

        </div>

        <div
            className="
            w-full
            lg:w-[420px]
            bg-white/70
            backdrop-blur-2xl
            flex
            flex-col
            justify-start lg:justify-center
            items-center
            px-6 lg:px-12
            py-8 lg:py-0
            "
        >

            <div
                className="
                    w-20
                    h-20

                    rounded-full

                    bg-gradient-to-br
                    from-purple-50
                    to-pink-50

                    shadow-xl

                    flex
                    items-center
                    justify-center

                    mb-6
                "
                >
                <img
                    src="/mannmitra-logo.png"
                    alt="MannMitra"
                    className="w-12 h-12 object-contain"
                />
                </div>

            <h2
            className="
                mt-4 lg:mt-0
                text-3xl lg:text-4xl
                font-bold
                text-gray-900
                mb-3
            "
            >
            Forgot Password
            </h2>

            <p className="text-gray-500 mb-10">
            Enter your email to receive reset instructions
            </p>

            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
                w-full
                p-4 lg:p-5
                rounded-2xl
                border
                border-gray-200
                outline-none
                bg-white/80
                focus:border-purple-500
                transition-all
                duration-300
                mb-6
            "
            />

            <button
            onClick={handleReset}
            className="
                w-full
                py-4 lg:py-5
                rounded-2xl
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                text-white
                font-bold
                text-lg
                shadow-lg
                hover:scale-[1.02]
                transition-all
                duration-300
                cursor-pointer
            "
            >
            Send Reset Link
            </button>

        </div>

        </div>

    </div>

    );

}

export default ForgotPassword;