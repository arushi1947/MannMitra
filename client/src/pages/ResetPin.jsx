import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaArrowLeft
} from "react-icons/fa";

function ResetPin() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleResetPin = async () => {

        if (pin.length !== 4) {

            alert("PIN must be 4 digits");

            return;

        }

        if (pin !== confirmPin) {

            alert("PINs do not match");

            return;

        }

        try {

            const response = await API.post(

                "/reset-pin",

                {

                    token,

                    pin

                }

            );

            setSuccess(true);

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Invalid or expired link"

            );

        }

    };

    const getPinStrength = () => {

        if (pin.length < 4) {

            return "Weak";

        }

        if (/^\d{4}$/.test(pin)) {

            return "Strong";

        }

        return "Medium";

    };

    return (

    <div
    className="
    min-h-screen
    overflow-hidden
    flex
    items-center
    justify-center
    pt-24
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
    bg-white/65
    backdrop-blur-2xl
    border-b
    border-white/30
    shadow-[0_4px_30px_rgba(168,85,247,0.06)]
    px-6
    py-3
    flex
    items-center
    justify-between
    "
    >

    <div className="flex items-center gap-3">

    <img
    src="/mannmitra-logo.png"
    alt="MannMitra"
    className="w-11 h-11 rounded-2xl shadow-lg"
    />

    <div>

    <h2 className="text-xl font-bold text-purple-700">
    MannMitra
    </h2>

    <p className="text-xs text-gray-900">
    Your Mind, Our Care
    </p>

    </div>

    </div>

    <button
    onClick={() => navigate("/settings")}
    className="
    w-14
    h-14
    rounded-2xl
    bg-white
    shadow-lg
    flex
    items-center
    justify-center
    text-purple-700
    text-xl
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
    w-full
    max-w-[850px]
    bg-white/70
    backdrop-blur-2xl
    border
    border-white/30
    rounded-[35px]
    shadow-[0_20px_60px_rgba(168,85,247,0.15)]
    px-6
    py-6
    "
    >

    {
    success ?

    (

    <div className="text-center">

    <h1
    className="
    text-4xl
    font-bold
    text-purple-700
    mb-4
    "
    >
    Master PIN Updated
    </h1>

    <p className="text-gray-500 mb-6">

    Your master PIN has been reset successfully.

    </p>

    <button
    onClick={() => navigate("/settings")}
    className="
    w-full
    py-4
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    to-pink-500
    text-white
    font-bold
    cursor-pointer
    "
    >

    Back

    </button>

    </div>

    )

    :

    (

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
    text-4xl
    font-bold
    text-gray-900
    mb-4
    "
    >

    Reset Master PIN

    </h1>

    <p
    className="
    text-gray-500
    text-lg
    mb-7
    "
    >

    Enter a new 4-digit PIN

    </p>


    <div
    className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-4
    mb-6
    "
    >

    <div className="space-y-4">

    <div className="relative">

    <input
    type={showPin ? "text" : "password"}
    placeholder="New PIN"
    value={pin}
    maxLength={4}
    onChange={(e)=>setPin(e.target.value)}
    className="
    w-full
    px-5
    py-3
    rounded-2xl
    bg-[#f8f5ff]
    outline-none
    "
    />

    <button
    onClick={() => setShowPin(!showPin)}
    className="
    absolute
    right-5
    top-4
    text-gray-400
    cursor-pointer
    "
    >

    {
    showPin
    ?
    <FaEyeSlash/>
    :
    <FaEye/>
    }

    </button>

    </div>


    <div className="relative">

    <input
    type={showConfirmPin ? "text" : "password"}
    placeholder="Confirm PIN"
    value={confirmPin}
    maxLength={4}
    onChange={(e)=>setConfirmPin(e.target.value)}
    className="
    w-full
    px-5
    py-3
    rounded-2xl
    bg-[#f8f5ff]
    outline-none
    "
    />

    <button
    onClick={() => setShowConfirmPin(!showConfirmPin)}
    className="
    absolute
    right-5
    top-4
    text-gray-400
    cursor-pointer
    "
    >

    {
    showConfirmPin
    ?
    <FaEyeSlash/>
    :
    <FaEye/>
    }

    </button>

    </div>

    </div>

    <div
    className="
    bg-[#faf5ff]
    rounded-3xl
    p-5
    border
    border-purple-100
    "
    >

    <p className="text-gray-500 mb-2">

    PIN Strength

    </p>

    <div
    className={`
    font-bold
    mb-5
    ${
    getPinStrength() === "Weak"
    ?
    "text-red-500"
    :
    "text-green-500"
    }
    `}
    >

    {getPinStrength()}

    </div>

    <div className="space-y-3 text-sm">

    <p
    className={
    pin.length >= 4
    ?
    "text-green-500"
    :
    "text-gray-400"
    }
    >

    ✓ Exactly 4 digits

    </p>

    <p
    className={
    /^\d+$/.test(pin)
    ?
    "text-green-500"
    :
    "text-gray-400"
    }
    >

    ✓ Numbers only

    </p>

    </div>

    </div>

    </div>


    <button
    onClick={handleResetPin}
    className="
    w-full
    sm:w-[320px]
    lg:w-[360px]
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
    cursor-pointer
    "
    >

    Update Master PIN

    </button>

    <p className="text-center text-sm text-gray-400 mt-5">

    Your PIN is securely encrypted

    </p>

    </>

    )

    }

    </div>

    </div>

    );

}

export default ResetPin;