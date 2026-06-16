import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { UAParser } from "ua-parser-js";
import {
  signInWithPopup
} from "firebase/auth";
import {
  auth,
  provider
} from "../firebase";
import { FcGoogle } from "react-icons/fc";
import {
  FaBrain,
  FaHeart,
  FaSmile,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = async () => {

    try {

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      const parser = new UAParser();

      const parsedResult = parser.getResult();

      const deviceInfo = {

        browser: parsedResult.browser.name,
        os: parsedResult.os.name,
        device: parsedResult.device.type || "Laptop/Desktop",

      };

      const response = await API.post(
        "/google-login",
        {

          name: user.displayName,

          email: user.email,

          deviceInfo

        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const parser = new UAParser();

      const result = parser.getResult();

      const deviceInfo = {

        browser: result.browser.name,

        os: result.os.name,

        device: result.device.type || "Laptop/Desktop",

      };

      const response = await API.post(
        "/login",
        {

          ...formData,

          deviceInfo

        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      setError(
        error?.response?.data?.detail ||
        "Login failed"
      );

    }
  };

  const handleFaceLogin = async () => {

    try {

      const email = prompt(
        "Enter your email"
      );

      if (!email) return;

      const response =
        await API.post(
          "/generate-auth-options",
          {
            email
          }
        );

      let options = response.data;

      console.log(options);

      options.challenge =
        Uint8Array.from(
          atob(
            options.challenge
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          ),
          c => c.charCodeAt(0)
        );

      if (options.allowCredentials) {

        options.allowCredentials =
          options.allowCredentials.map(
            cred => ({

              ...cred,

              id: Uint8Array.from(
                atob(
                  cred.id
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
                ),
                c => c.charCodeAt(0)
              )

            })
          );

      }

      const assertion =
        await navigator.credentials.get({

          publicKey: options

        });

      await API.post(
        "/verify-auth",
        {
          email,
          credential: assertion
        }
      );

      const loginResponse =
        await API.post(
          "/face-login",
          {
            email
          }
        );

      localStorage.setItem(
        "token",
        loginResponse.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loginResponse.data.user
        )
      );

      navigate("/dashboard");

    }

    catch (error) {

      console.log(error);

      alert(
        "Face ID authentication failed"
      );

    }

  };

  return (

    <div
      className="
        min-h-screen
        overflow-hidden

        pt-[90px]

        grid
        grid-cols-1
        lg:grid-cols-[1.1fr_0.9fr]

        bg-gradient-to-br
        from-[#f8f4ff]
        via-[#fdf7ff]
        to-[#eef4ff]
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
          onClick={() => navigate("/")}

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
          hidden
          lg:flex

          relative
          flex-col
          justify-center

          px-24
        "
      >

        <div
          className="
            absolute
            left-10
            top-32

            w-8
            h-8

            rounded-full

            bg-white/60

            blur-[2px]
          "
        />

        <div
          className="
            absolute
            left-20
            top-52

            w-16
            h-16

            rounded-full

            bg-purple-200/40

            blur-[2px]
          "
        />

        <div className="absolute hidden lg:block w-[500px] h-[500px] bg-purple-300 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>

        <div className="absolute hidden lg:block w-[400px] h-[400px] bg-pink-300 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[100px]"></div>

        <div className="relative z-10">

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl

              font-bold
              text-gray-800
              leading-tight
            "
          >

            Your Mind <br />

            Deserves <span className="text-purple-600">
              Care 
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
            "
          >

            A calm digital companion to help you
            manage reminders, emotions, stress,
            and daily mental wellness.

          </p>

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row

            gap-5
            mt-10
            relative
            z-10
          "
        >

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-6 w-full sm:w-[180px]">

            <FaBrain className="text-4xl text-purple-600" />

            <h2 className="text-xl font-bold mt-4 text-gray-800">
              Mood Tracking
            </h2>

            <p className="text-gray-500 mt-2">
              Understand your emotional patterns.
            </p>

          </div>

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-6 w-full sm:w-[220px]">

            <FaHeart className="text-4xl text-pink-500" />

            <h2 className="text-xl font-bold mt-4 text-gray-800">
              Wellness Care
            </h2>

            <p className="text-gray-500 mt-2">
              Gentle reminders for self-care.
            </p>

          </div>

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-6 w-full sm:w-[220px]">

            <FaSmile className="text-4xl text-yellow-500" />

            <h2 className="text-xl font-bold mt-4 text-gray-800">
              Daily Positivity
            </h2>

            <p className="text-gray-500 mt-2">
              Build healthier mental habits.
            </p>

          </div>

        </div>

      </div>

      <div
          className="
            flex
            justify-center
            items-start

            overflow-y-auto

            relative

            px-5
            sm:px-8
            lg:px-0

            pt-8
            pb-10
          "
        >

        <div className="absolute w-[400px] h-[400px] bg-purple-300 opacity-20 rounded-full blur-3xl"></div>

        <div
          className="
            relative
            z-10
          
            bg-white/72
            backdrop-blur-3xl

            shadow-[0_20px_60px_rgba(168,85,247,0.12)]

            rounded-[42px]

            px-8
            sm:px-10

            py-5
            sm:py-6

            w-full
            max-w-[470px]

            border
            border-white/50
          "
        >

          <div className="text-center">

            <img
              src="/mannmitra-logo.png"
              alt="MannMitra"

              className="
                w-14
                h-14

                mx-auto
                mb-3

                rounded-[28px]

                object-cover

                shadow-xl
              "
            />
            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-[50px]

                font-bold
                text-purple-700
              "
            >
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2 text-base">
              Continue your wellness journey
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
              onChange={handleChange}
            />

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
                onChange={handleChange}
              />

              <div className="flex justify-end mt-3">

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="
                    text-sm
                    text-purple-600
                    font-semibold
                    hover:text-pink-500
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-5 top-[28px] -translate-y-1/2 text-gray-500 hover:text-purple-600 cursor-pointer transition-all duration-300"
              >

                {showPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}

              </button>

            </div>

            {error && (

              <p className="text-red-500 text-sm">
                {error}
              </p>

            )}

            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r
                from-purple-700
                via-fuchsia-500
                to-pink-500                
                hover:scale-100
                hover:shadow-[0_0_35px_rgba(217,70,239,0.55)]
                transition-all
                duration-300
                text-white
                py-3.5
                rounded-2xl
                font-semibold
                flex
                justify-center
                items-center
                gap-4
                shadow-lg
                cursor-pointer
              "
            >
              Login
            </button>

            <div className="flex items-center gap-4 my-5">

              <div className="flex-1 h-[1px] bg-gray-300"></div>

              <p className="text-gray-400">
                OR
              </p>

              <div className="flex-1 h-[1px] bg-gray-300"></div>

            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 py-3 rounded-2xl flex justify-center items-center gap-4 shadow-md cursor-pointer"
            >

              <FcGoogle size={28} />

              <span
                className="
                  text-base
                  sm:text-lg
                  font-medium
                  text-gray-700
                "
              >
                Continue with Google
              </span>

            </button>

            <button
            type="button"
            onClick={handleFaceLogin}
            className="
              w-full
              mt-4
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-pink-500
              text-white
              font-semibold
              shadow-lg
              cursor-pointer
            "
          >

          Continue with Face ID

          </button>

          </form>

          <p className="text-center mt-6 text-lg text-gray-600">

            Don’t have an account?

            <Link
              to="/register"
              className="text-purple-700 font-bold ml-2"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;