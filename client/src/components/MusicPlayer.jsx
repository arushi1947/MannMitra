import { FaPause } from "react-icons/fa";
import { HiOutlineMusicNote } from "react-icons/hi";
import { useMusic } from "../context/MusicContext";
import { isSoundEnabled } from "../utils/soundSettings";

function MusicPlayer() {
  const { audioRef, playing, setPlaying } = useMusic();

  const currentHour = new Date().getHours();

  let themeName = "";

  if (currentHour >= 5 && currentHour < 12) {
    themeName = "Morning Piano";
  } else if (currentHour >= 12 && currentHour < 18) {
    themeName = "Forest Focus";
  } else {
    themeName = "Rain Relaxation";
  }

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (isSoundEnabled()) {
        try {
          await audioRef.current.play();
          setPlaying(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        alert("Enable Sound Effects in Settings");
      }
    }
  };

  return (
      <button
        onClick={toggleMusic}
        className={`
          w-14
          h-14
          rounded-full
          shadow-xl
          flex
          items-center
          justify-center
          text-2xl
          z-50
          transition-all
          duration-300
          cursor-pointer
          ${
            playing
              ? "bg-white text-purple-600 scale-110"
              : "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white hover:scale-105"
          }
        `}
      >
        {playing ? (
          <FaPause className="text-[20px]" />
        ) : (
          <HiOutlineMusicNote className="text-[22px] text-white" />
        )}
      </button>
  );
}

export default MusicPlayer;