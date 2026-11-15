import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  CircleUserRound,
} from "lucide-react";

function Navbar({ title }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const userName = user.name || user.username || "User";

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-20 px-5 md:px-8 flex items-center justify-between gap-4 bg-[#080d19]/85 backdrop-blur-xl border-b border-cyan-400/10">
      {/* Page Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <Sparkles size={15} className="text-cyan-400" />
        </div>

        <p className="text-xs text-slate-500 mt-1">
          Manage your intelligent workspace
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* AI Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/[0.06] border border-emerald-400/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-xs text-emerald-300 font-medium">
            AI Systems Active
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111a2b]/80 border border-white/[0.06] focus-within:border-cyan-400/40 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.08)] transition-all">
          <Search size={17} className="text-slate-500" />
          <input
            placeholder="Search workspace..."
            className="bg-transparent outline-none text-sm w-40 text-white placeholder:text-slate-600"
          />
          <span className="text-[10px] text-slate-600 border border-white/10 rounded px-1.5 py-0.5">
            /
          </span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-3 rounded-xl bg-[#111a2b]/80 border border-white/[0.06] text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-300"
        >
          <Bell size={19} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-400 rounded-full border border-[#111a2b]" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-cyan-400/[0.06] border border-cyan-400/10 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-cyan-300 font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs text-white font-semibold max-w-24 truncate">
                {userName}
              </p>
              <p className="text-[10px] text-slate-500">Workspace User</p>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-14 w-64 bg-[#101a2b] border border-cyan-400/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)] z-50 p-4">
                {/* User Details */}
                <div className="border-b border-white/10 pb-4 mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <CircleUserRound size={21} className="text-cyan-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {userName}
                      </p>
                      <p className="text-[10px] text-emerald-400">
                        Personal Account
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs break-all">
                    {user.email || "No email available"}
                  </p>
                </div>

                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 text-slate-300 hover:text-cyan-300 hover:bg-cyan-400/[0.07] rounded-xl p-3 text-sm transition-all"
                >
                  <User size={17} />
                  My Profile
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-xl p-3 text-sm transition-all"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
