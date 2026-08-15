import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./components/LandingPage";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/generate";
export const serverUrl = "https://prompt2site-ai-website-generator.onrender.com";
import { Navigate } from "react-router-dom";
import WebsiteEditor from "./pages/WebsiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

function App() {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />

        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={userData ? <Dashboard /> : <Home />}
        />

        <Route path="/generate" element={userData ? <Generate /> : <Home />} />

        <Route
          path="/editor/:id"
          element={userData ? <WebsiteEditor /> : <Home />}
        />

        <Route path="/site/:id" element={<LiveSite />} />

        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
