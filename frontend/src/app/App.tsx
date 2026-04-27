import { useRef, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import * as api from "../services/api";
import { AuthServiceError, saveHistory } from "../services/auth";
import { mapConcern, mapSensitivity, mapSkinType } from "../utils/mappers";
import { AnalysisForm } from "./components/AnalysisForm";
import { Hero } from "./components/Hero";
import { Insights } from "./components/Insights";
import { Navbar } from "./components/Navbar";
import { ProductRecommendations } from "./components/ProductRecommendations";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Results } from "./components/Results";
import { RoutineBuilder } from "./components/RoutineBuilder";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

function HomePage() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token, logout } = useAuth();
  const [analysisData, setAnalysisData] = useState({
    ingredient: "Niacinamide",
    cluster: "Type A - Balanced",
    confidence: 94,
  });
  const [formData, setFormData] = useState({
    skinType: "",
    sensitivity: "",
    concern: "",
  });
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleAnalyzeClick = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (data: {
    skinType: string;
    sensitivity: string;
    concern: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setFormData(data);

    try {
      const mappedSensitivity = mapSensitivity(data.sensitivity);
      const mappedConcern = mapConcern(data.concern);
      const mappedSkinType = mapSkinType(data.skinType);

      console.log("FORM DATA:", data);
      console.log("Mapped sensitivity:", mappedSensitivity);
      console.log("Mapped concern:", mappedConcern);
      console.log("Mapped skin type:", mappedSkinType);

      // Call the predict API
      const response = await api.predictSkin({
        skin_type: mappedSkinType,
        sensitivity: mappedSensitivity,
        concern: mappedConcern,
      });

      if (response.success) {
        const normalizedConfidence =
          response.confidence <= 1 ? response.confidence * 100 : response.confidence;

        setAnalysisData({
          ingredient: response.ingredient,
          cluster: response.cluster_label,
          confidence: Math.min(100, Math.max(0, Math.round(normalizedConfidence))),
        });
        setShowResults(true);
        setTimeout(() => {
          document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        if (isAuthenticated && token) {
          try {
            await saveHistory({
              skin_type: mappedSkinType,
              sensitivity: mappedSensitivity,
              concern: mappedConcern,
              result: {
                ingredient: response.ingredient,
                confidence: Math.min(100, Math.max(0, Math.round(normalizedConfidence))),
              },
            }, token);
          } catch (saveError) {
            if (saveError instanceof AuthServiceError && saveError.status === 401) {
              logout();
            }
            console.error("History save failed:", saveError);
          }
        }
      } else {
        throw new Error(response.error || "Prediction failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent)] before:content-['']">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.08),transparent_35%)]" />
      <div className="relative z-10">
      <Hero onAnalyzeClick={handleAnalyzeClick} />

      <div ref={analysisRef}>
        <AnalysisForm
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {error && (
        <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-red-400/30 bg-red-500/10 px-8 py-6 text-red-100 shadow-xl backdrop-blur-xl">
          <p className="font-semibold">Error: {error}</p>
          <p className="mt-2 text-sm text-red-100/80">Make sure the backend is running at {import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}</p>
        </div>
      )}

      {showResults && (
        <div id="results">
          <Results
            ingredient={analysisData.ingredient}
            cluster={analysisData.cluster}
            confidence={analysisData.confidence}
          />
          <ProductRecommendations
            ingredient={analysisData.ingredient}
            concern={formData.concern}
            skinType={formData.skinType}
            sensitivity={formData.sensitivity}
          />
          <RoutineBuilder
            skinType={formData.skinType}
            sensitivity={formData.sensitivity}
            concern={formData.concern}
            ingredients={analysisData.ingredient}
          />
          <Insights />
        </div>
      )}

      <footer className="mt-8 border-t border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-xl md:px-16">
        <p className="text-sm text-gray-300">
          © 2026 Skinlytix — AI-Powered Skincare Intelligence
        </p>
      </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent)] before:content-['']">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.08),transparent_35%)]" />
      <div className="relative z-10 min-h-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}