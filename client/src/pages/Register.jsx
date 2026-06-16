import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaLeaf,
  FaMoon,
  FaHandsHelping,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";

function Register() {

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = () => {

    if (formData.password.length < 6) {

      return "Weak";

    }

    if (
      formData.password.match(/[A-Z]/) &&
      formData.password.match(/[0-9]/) &&
      formData.password.match(/[^A-Za-z0-9]/)
    ) {

      return "Strong";

    }

    return "Medium";

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.password !== confirmPassword
    ) {

      setError("Passwords do not match");

      return;

    }

    if (!acceptedTerms) {

      setError(
        "Please accept Terms & Privacy Policy"
      );

      return;

    }

    try {

      await API.post(
        "/register",
        formData
      );

      navigate("/");

    } catch (error) {

      setError(error.response.data.detail);

    }
  };

  return (

    <>

    <div
      className="
        sticky
        top-0
        left-0
        w-full
        z-50
              
        flex
        items-center
        justify-between
    
        px-6
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
        h-[calc(100vh-88px)]
        max-h-[calc(100vh-88px)]

        lg:overflow-hidden
        overflow-y-auto
        overflow-x-hidden

        grid
        grid-cols-1
        lg:grid-cols-2

        lg:items-center
        items-start
        bg-gradient-to-br
        from-[#f8f4ff]
        via-[#fdf7ff]
        to-[#eef4ff]

        px-4
        sm:px-5
        lg:px-0
      "
    >

      <div
        className="
          hidden
          lg:flex

          relative
          flex-col
          justify-center

          px-24
        "
      >

        <div className="absolute w-[500px] h-[500px] bg-pink-300 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>

        <div className="absolute w-[400px] h-[400px] bg-purple-300 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[100px]"></div>

        <div className="relative z-10">

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl

              font-bold
              text-gray-800
              leading-tight

              text-center
              lg:text-left
            "
          >

            Begin Your <br />

            Wellness <span className="text-purple-600">
              Journey
            </span>

          </h1>

          <p
            className="
              text-base
              sm:text-lg
              lg:text-xl

              text-gray-500

              mt-6
              leading-relaxed

              max-w-2xl

              text-center
              lg:text-left
            "
          >

            Build healthier emotional habits,
            reduce stress, and care for your
            mental wellness every day.

          </p>

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row

            gap-4
            mt-4

            relative
            z-10
          "
        >

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-5 w-full sm:w-[180px]">

            <FaLeaf className="text-4xl text-green-500" />

            <h2 className="text-1g font-bold mt-4 text-gray-800">
              Healthy Habits
            </h2>

            <p className="text-gray-500 mt-2">
              Build mindful daily routines.
            </p>

          </div>

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-5 w-full sm:w-[220px]">

            <FaMoon className="text-4xl text-indigo-500" />

            <h2 className="text-xl font-bold mt-4 text-gray-800">
              Stress Relief
            </h2>

            <p className="text-gray-500 mt-2">
              Slow down and recharge peacefully.
            </p>

          </div>

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-5 w-full sm:w-[220px]">

            <FaHandsHelping className="text-4xl text-pink-500" />

            <h2 className="text-xl font-bold mt-4 text-gray-800">
              Self Care
            </h2>

            <p className="text-gray-500 mt-2">
              Prioritize your emotional wellbeing.
            </p>

          </div>

        </div>

      </div>

      <div
        className="
          flex
          justify-start
          lg:justify-center

          items-start
          lg:items-center

          relative

          w-full

          pt-6
          lg:pt-0
        "
      >

        <div className="absolute w-[400px] h-[400px] bg-pink-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10 bg-white/70 backdrop-blur-2xl shadow-2xl rounded-[32px] p-4 lg:p-4 w-full max-w-[400px] mx-auto border border-white/40">

          <div className="text-center">

            <div className="text-center">

            <img
              src="/mannmitra-logo.png"
              alt="MannMitra"

              className="
                block
                lg:hidden

                w-14
                h-14

                mx-auto
                mb-3

                rounded-[28px]

                object-cover

                shadow-xl
              "
            />

            </div>

            <h2
              className="
                text-3xl
                lg:text-4xl

                font-bold
                text-purple-700
              "
            >
              Create Account
            </h2>

            <p className="text-gray-500 mt-2 text-base">
              Start your mental wellness journey
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-2 mt-3"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 rounded-2xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-2xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
              onChange={handleChange}
            />

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 rounded-2xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 cursor-pointer transition-all duration-300"
              >

                {showPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}

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
                  p-2.5
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white/60
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-400
                  text-base
                "
              />

              <button
                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-purple-600
                  cursor-pointer
                  transition-all
                  duration-300
                "
              >

                {
                  showConfirmPassword
                  ? <FaEyeSlash size={20} />
                  : <FaEye size={20} />
                }

              </button>

            </div>

            <div>

              <p className="text-gray-500 mb-2">
                Password Strength
              </p>

              <div
                className={`
                  font-bold

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

            </div>

            <div className="space-y-0.5 text-xs">

              <p className={
                formData.password.length >= 8
                ? "text-green-500"
                : "text-gray-400"
              }>
                ✓ Minimum 8 characters
              </p>

              <p className={
                /[A-Z]/.test(formData.password)
                ? "text-green-500"
                : "text-gray-400"
              }>
                ✓ One uppercase letter
              </p>

              <p className={
                /[0-9]/.test(formData.password)
                ? "text-green-500"
                : "text-gray-400"
              }>
                ✓ One number
              </p>

              <p className={
                /[^A-Za-z0-9]/.test(formData.password)
                ? "text-green-500"
                : "text-gray-400"
              }>
                ✓ One special character
              </p>

            </div>

            <label
              className="
                flex
                items-center
                gap-2
                text-gray-600
                text-xs
                cursor-pointer
              "
            >

              <input
                type="checkbox"

                checked={acceptedTerms}

                onChange={() =>
                  setAcceptedTerms(!acceptedTerms)
                }

                className="
                  w-4
                  h-4
                  accent-purple-600
                  cursor-pointer
                "
              />

              <span>

                I agree to

                <Link
                  to="/terms"
                  className="
                    text-purple-700
                    font-semibold
                    hover:underline
                  "
                >
                  {" "}Terms
                </Link>

                {" "} &

                <Link
                  to="/privacy"
                  className="
                    text-purple-700
                    font-semibold
                    hover:underline
                  "
                >
                  {" "}Privacy Policy
                </Link>

              </span>

            </label>

            <div className="h-5">

              {
                error && (

                  <p className="text-red-500 text-sm">
                    {error}
                  </p>

                )
              }

            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:scale-[1.02] transition-all duration-300 text-white p-3 rounded-2xl font-semibold text-lg shadow-lg cursor-pointer"
            >
              Register
            </button>

          </form>

          <p className="text-center mt-2 text-lg text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="text-purple-700 font-bold ml-2"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  </>
  );
}

export default Register;