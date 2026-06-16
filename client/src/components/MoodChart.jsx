import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartDataLabels
);

function MoodChart({
  moods,
  chartRef
}) {

  const moodEmoji = {
    5: "😊 5",
    4: "🙂 4",
    3: "😐 3",
    2: "😟 2",
    1: "😭 1"
  };

  const emoji = {
    5: "😊",
    4: "🙂",
    3: "😐",
    2: "😟",
    1: "😭"
  };

  const isMobile = window.innerWidth < 640;

  const chartData = {

    labels: (moods || []).map(
      mood =>
        new Date(
          mood.date_only
        ).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short"
          }
        )
    ),

    elements: {
      point: {
        radius: 0
      }
    },

    datasets: [
      {
        label: "Mood",

        data: (moods || []).map(
          mood => mood.score
        ),

        borderColor: "#8b5cf6",

        backgroundColor:
          "rgba(139,92,246,0.15)",

        fill: !isMobile,
        tension: isMobile ? 0.25 : 0.45,
        borderWidth: isMobile ? 3 : 4,

        pointRadius: 0,

        pointHoverRadius: 0,

        pointBackgroundColor:
          "#8b5cf6",

        pointBorderColor:
          "#8b5cf6",
      },
    ]
  };

  const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    layout: {
        padding: {
          top: 25,
          left: 5,
          right: 5,
          bottom: 5
        }
      },

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
        enabled: true
      },

      datalabels: {

        formatter: (value) =>
          emoji[value],

        font: {
          size: isMobile ? 12 : 18
        },
        align: "top",

        offset: window.innerWidth < 640 ? 16 : 10
      }
    },

    scales: {

      y: {
        display: true,

        min: 1,

        max: 5.5,

        ticks: {

          stepSize: 1,

          callback: function(value) {

            const mobileMap = {
              5: "😊",
              4: "🙂",
              3: "😐",
              2: "😟",
              1: "😭"
            };

            return window.innerWidth < 640
              ? mobileMap[value]
              : moodEmoji[value];
          },

          font: {
            size: window.innerWidth < 640 ? 10 : 15
          }
        },

        grid: {
          color:
            "rgba(139,92,246,0.12)"
        },

        border: {
          display: false
        }
      },

      x: {
        grid: {
          display: window.innerWidth >= 640,
        },

        border: {
          display: false
        }
      }
    }
  };

  return (
   <div className="h-[280px] lg:h-[320px] px-2">
      <Line
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export default MoodChart;