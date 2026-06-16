export const getThemeByTime = () => {

    const currentHour = new Date().getHours();

    const isNight =
        currentHour >= 18 || currentHour < 5;

    let backgroundStyle = "";
    let cardStyle = "";
    let primaryText = "";
    let secondaryText = "";
    let brandSubtext = "";

    if (currentHour >= 5 && currentHour < 12) {

        backgroundStyle =
            "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100";

    }

    else if (currentHour >= 12 && currentHour < 18) {

        backgroundStyle =
            "bg-gradient-to-br from-[#f5e9ff] via-[#efe1ff] to-[#ffdff3]";

    }

    else {

        backgroundStyle =
            "bg-[length:400%_400%] animate-gradient bg-gradient-to-br from-[#2d1b4e] via-[#4b2d73] to-[#6d3ea8]";

    }

    cardStyle = isNight
        ? "bg-[#ffffff14] text-white backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        : "bg-white/60 text-gray-800 backdrop-blur-xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)]";

    primaryText = isNight
        ? "text-white"
        : "text-gray-900";

    secondaryText = isNight
        ? "text-purple-900"
        : "text-gray-900";

    brandSubtext = isNight
        ? "text-purple-200"
        : "text-gray-800";

    return {

        isNight,
        backgroundStyle,
        cardStyle,
        primaryText,
        secondaryText,
        brandSubtext
    };

};