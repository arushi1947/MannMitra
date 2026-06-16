import { useLocation } from "react-router-dom";
import GlobalAudio from "./GlobalAudio";

function AudioWrapper() {
  const location = useLocation();

  const hiddenRoutes = [
    "/",
    "/login",
    "/register",
    "/terms",
    "/privacy",
    "/forgot-password",
  ];

  const isResetPassword =
    location.pathname.startsWith("/reset-password");

  if (
    hiddenRoutes.includes(location.pathname) ||
    isResetPassword
  ) {
    return null;
  }

  return <GlobalAudio />;
}

export default AudioWrapper;