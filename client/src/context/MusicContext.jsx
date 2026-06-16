import { createContext, useContext, useRef, useState } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  return (
    <MusicContext.Provider
      value={{
        audioRef,
        playing,
        setPlaying,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);