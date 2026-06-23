import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { Toaster } from "react-hot-toast";
import './index.css'
import 'react-calendar/dist/Calendar.css';
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPin from "./pages/ResetPin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import MoodTracker from "./pages/MoodTracker";
import MoodHistory from "./pages/MoodHistory";
import { MusicProvider } from "./context/MusicContext";
import GlobalAudio from "./components/GlobalAudio";
import AIChatWidget from "./components/chat/AIChatWidget";
import AudioWrapper from "./components/AudioWrapper";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import BreathingExercise from "./pages/BreathingExercise";
import MeditationPage from "./pages/MeditationPage";
import WellnessHub from "./pages/WellnessHub";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <MusicProvider>

      <BrowserRouter>

        <AudioWrapper />

        <AIChatWidget />

        <Routes>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/reset-pin/:token" element={<ResetPin />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/privacy" element={<Privacy />} />

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/mood"
          element={
          <ProtectedRoute>
            <MoodTracker />
          </ProtectedRoute>
        }
        />

        <Route
          path="/mood-history"
          element={
          <ProtectedRoute>
            <MoodHistory />
          </ProtectedRoute>}
        />

        <Route
          path="/journal"
          element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
        />

        <Route 
          path="/analytics" 
          element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
        />

        <Route
          path="/breathing"
          element={
            <ProtectedRoute>
              <BreathingExercise />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meditation"
          element={
            <ProtectedRoute>
              <MeditationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wellness-hub"
          element={
            <ProtectedRoute>
              <WellnessHub/>
            </ProtectedRoute>
          }
      />

        </Routes>
      </BrowserRouter>
    </MusicProvider>
  </React.StrictMode>,
)