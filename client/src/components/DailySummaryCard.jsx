import { useEffect, useState } from "react";
import API from "../services/api";

function DailySummaryCard({
  cardStyle,
  primaryText,
  secondaryText,
  isNight
}) {

  const [summary, setSummary] = useState([]);
  const [tomorrow, setTomorrow] = useState([]);

  useEffect(() => {

    fetchSummary();

  }, []);

  const fetchSummary = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await API.get(
        `/daily-summary?email=${user.email}`
      );

      setSummary(
        response.data.summary
      );

      setTomorrow(
        response.data.tomorrow
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      className={`
        ${cardStyle}
        rounded-[32px]
        p-6
        w-full
      `}
    >

      <h2
        className={`
          text-xl
          font-bold
          mb-6
          ${primaryText}
        `}
      >
        Today's Summary
      </h2>

      <div className="space-y-4">

        {summary.map((item, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-green-100

                flex
                items-center
                justify-center

                text-xl
              "
            >
              ✓
            </div>

            <p
              className={`
                text-[16px]
                ${primaryText}
              `}
            >
              {item}
            </p>

          </div>

        ))}

      </div>

      <div className="mt-8">

        <h3
          className={`
            text-xl
            font-bold
            mb-5
            ${primaryText}
          `}
        >
          Tomorrow
        </h3>

        <div className="space-y-3">

          {tomorrow.map((item, index) => (

            <div
              key={index}
              className={`
                px-5
                py-4
                rounded-2xl

                ${
                  isNight
                    ? "bg-white/5 border border-white/10"
                    : "bg-purple-50 border border-purple-100"
                }
              `}
            >

              <p
                className={`
                  ${secondaryText}
                  font-medium
                `}
              >
                • {item}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default DailySummaryCard;