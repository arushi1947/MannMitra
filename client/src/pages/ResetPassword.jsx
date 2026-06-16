import { useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaArrowLeft
} from "react-icons/fa";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [success, setSuccess] = useState(false);

  const getPasswordStrength = () => {

    if (password.length < 6) {

      return "Weak";

    }

    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[^A-Za-z0-9]/)
    ) {

      return "Strong";

    }

    return "Medium";

  };

  const handleReset = async () => {

    if (password !== confirmPassword) {

      alert("Passwords do not match");

      return;

    }

    if (password.length < 8) {

      alert("Password must be at least 8 characters");

      return;

    }

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/reset-password",

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            token,
            password

          })

        }

      );

      const data = await response.json();

      if (
        data.message ===
        "Password reset successful"
      ) {

        setSuccess(true);

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      className="
        min-h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        pt-23
        sm:pt-24
        bg-gradient-to-br
        from-[#f3e8ff]
        via-[#fdf4ff]
        to-[#ede9fe]
        relative
        px-4
        "
    >

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
            onClick={() => navigate("/forgot-password")}
        
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
          absolute
          top-[-120px]
          left-[-120px]
          w-[450px]
          h-[450px]
          bg-purple-300/20
          blur-3xl
          rounded-full
        "
      />

      <div
        className="
          absolute
          bottom-[-100px]
          right-[-100px]
          w-[400px]
          h-[400px]
          bg-pink-300/20
          blur-3xl
          rounded-full
        "
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-[850px]
          bg-white/70
          backdrop-blur-2xl
          border
          border-white/30
          rounded-[35px]
          shadow-[0_20px_60px_rgba(168,85,247,0.15)]
          px-5 sm:px-6
          py-5
        "
      >

        {
          success ? (

            <div className="text-center">

              <h1
                className="
                  text-4xl
                  font-bold
                  text-purple-700
                  mb-4
                "
              >
                Password Updated
              </h1>

              <p className="text-gray-500 mb-5">
                Your password has been reset successfully.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  text-white
                  font-bold
                  text-lg
                  cursor-pointer
                "
              >
                Back to Login
              </button>

            </div>

          ) : (

            <>

              <div
                className="
                  w-[72px]
                  h-[72px]
                  rounded-3xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-3xl
                  mb-5
                  shadow-lg
                "
              >

                <FaLock />

              </div>

              <h1
                className="
                  text-2xl sm:text-3xl lg:text-4xl
                  leading-tight
                  font-bold
                  text-gray-900
                  leading-tight
                  mb-4
                "
              >
                Create New Password
              </h1>

              <p
                className="
                  text-gray-500
                  text-base sm:text-lg
                  mb-7
                "
              >
                Enter a strong password to secure
                your wellness account
              </p>

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-4
                  mb-6
                  sm:mb-5
                "
              >

                <div className="space-y-4">

                  <div className="relative">

                    <input
                      type={
                        showPassword
                        ? "text"
                        : "password"
                      }

                      placeholder="New Password"

                      value={password}

                      onChange={(e) =>
                        setPassword(e.target.value)
                      }

                      className="
                        w-full
                        px-4 sm:px-5 py-3
                        rounded-2xl
                        border
                        border-transparent
                        bg-[#f8f5ff]
                        outline-none
                        text-gray-700
                        focus:border-purple-500
                        focus:bg-white
                        transition-all
                        duration-300
                        shadow-sm
                      "
                    />

                    <button
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }

                      className="
                        absolute
                        right-5
                        top-4
                        text-gray-400
                        cursor-pointer
                      "
                    >

                      {
                        showPassword
                        ? <FaEyeSlash />
                        : <FaEye />
                      }

                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                        ? "text"
                        : "password"
                      }

                      placeholder="Confirm Password"

                      value={confirmPassword}

                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }

                      className="
                        w-full
                        px-4 sm:px-5 py-3
                        rounded-2xl
                        border
                        border-transparent
                        bg-[#f8f5ff]
                        outline-none
                        text-gray-700
                        focus:border-purple-500
                        focus:bg-white
                        transition-all
                        duration-300
                        shadow-sm
                      "
                    />

                    <button
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }

                      className="
                        absolute
                        right-5
                        top-4
                        text-gray-400
                        cursor-pointer
                      "
                    >

                      {
                        showConfirmPassword
                        ? <FaEyeSlash />
                        : <FaEye />
                      }

                    </button>

                  </div>

                </div>

                <div
                  className="
                    bg-[#faf5ff]
                    rounded-3xl
                    p-4 sm:p-5
                    border
                    border-purple-100
                    flex
                    flex-col
                    justify-center
                  "
                >

                  <p className="text-gray-500 mb-2">
                    Password Strength
                  </p>

                  <div
                    className={`
                      font-bold
                      mb-5

                      ${
                        getPasswordStrength() === "Weak"
                        ? "text-red-500"
                        : getPasswordStrength() === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                      }
                    `}
                  >
                    {getPasswordStrength()}
                  </div>

                  <div className="space-y-3 text-sm">

                    <p className={
                      password.length >= 8
                      ? "text-green-500"
                      : "text-gray-400"
                    }>
                      ✓ Minimum 8 characters
                    </p>

                    <p className={
                      /[A-Z]/.test(password)
                      ? "text-green-500"
                      : "text-gray-400"
                    }>
                      ✓ One uppercase letter
                    </p>

                    <p className={
                      /[0-9]/.test(password)
                      ? "text-green-500"
                      : "text-gray-400"
                    }>
                      ✓ One number
                    </p>

                    <p className={
                      /[^A-Za-z0-9]/.test(password)
                      ? "text-green-500"
                      : "text-gray-400"
                    }>
                      ✓ One special character
                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={handleReset}
                className="
                  w-full sm:w-[320px] lg:w-[360px]
                  mx-auto
                  block
                  py-3.5
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  text-white
                  font-bold
                  text-lg
                  shadow-[0_15px_40px_rgba(168,85,247,0.35)]
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  hover:shadow-[0_20px_50px_rgba(236,72,153,0.4)]
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                Update Password
              </button>

              <p className="text-center text-sm text-gray-400 mt-5">
                Your password is securely encrypted
              </p>

            </>

          )
        }

      </div>

    </div>

  );

}

export default ResetPassword;