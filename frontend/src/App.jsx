import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";

import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import AgentWorkspace from "./pages/AgentWorkspace";
import ChatHistory from "./pages/ChatHistory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { getCurrentUser } from "./services/auth";

function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        setAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        sessionStorage.setItem("user", JSON.stringify(response.user));

        setAuthenticated(true);
      } catch (error) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        setAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#080d19] flex items-center justify-center text-white">
        Verifying your session...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const pageTitles = {
    "/": "Dashboard",
    "/agents": "AI Agents",
    "/history": "Chat History",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const title = location.pathname.startsWith("/agent/")
    ? "Agent Workspace"
    : pageTitles[location.pathname] || "AgentHub";

  return (
    <div className="relative flex min-h-screen bg-[#080d19]">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Main application content */}
      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar
          activePage={pageTitles[location.pathname] || "AI Agents"}
          onNavigate={(name, path) => navigate(path)}
        />

        <div className="flex-1 min-w-0">
          <Navbar title={title} />

          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agent/:agentId" element={<AgentWorkspace />} />
              <Route path="/history" element={<ChatHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
