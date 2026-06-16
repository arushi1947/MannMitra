import { useEffect } from "react";
import { useMusic } from "../context/MusicContext";

function GlobalAudio() {
  const { audioRef } = useMusic();

  const currentHour = new Date().getHours();

  let audioFile = "";

  if (currentHour >= 5 && currentHour < 12) {
    audioFile = "/music/calm.mp3";
  } else if (currentHour >= 12 && currentHour < 18) {
    audioFile = "/music/forest.mp3";
  } else {
    audioFile = "/music/rain.mp3";
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioFile]);

  return (
    <audio
      ref={audioRef}
      loop
    >
      <source
        src={audioFile}
        type="audio/mp3"
      />
    </audio>
  );
}

export default GlobalAudio;