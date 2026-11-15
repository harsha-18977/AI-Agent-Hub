import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  BrainCircuit,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "AI Agents", icon: Bot, path: "/agents" },
  { name: "Chat History", icon: MessageSquare, path: "/history" },
  { name: "Analytics", icon: ChartNoAxesCombined, path: "/analytics" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ activePage, onNavigate }) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const userName = user.name || user.username || "My Workspace";

  return (
    <aside className="relative z-20 w-64 min-h-screen shrink-0 bg-[#0a1120]/95 backdrop-blur-xl border-r border-cyan-400/10 p-5 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="relative bg-cyan-400/10 border border-cyan-400/20 p-3 rounded-2xl shadow-[0_0_25px_rgba(0,229,255,0.12)]">
          <BrainCircuit className="text-cyan-400" size={27} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a1120]" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            AI-Agent<span className="text-cyan-400">Hub</span>
          </h1>
          <p className="text-[9px] tracking-[2px] text-cyan-400/60 font-semibold mt-1">
            INTELLIGENT WORKSPACE
          </p>
        </div>
      </div>

      {/* Workspace label */}
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-[10px] text-gray-500 font-bold tracking-[2px]">
          WORKSPACE
        </p>
        <Sparkles size={14} className="text-cyan-400/50" />
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name, item.path)}
              className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_18px_rgba(0,229,255,0.07)]"
                  : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white hover:border-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
              )}

              <Icon
                size={19}
                className={`transition-all duration-300 ${
                  active
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:text-cyan-300 group-hover:scale-110"
                }`}
              />

              <span className="flex-1 text-left">{item.name}</span>

              {active && <ChevronRight size={16} className="text-cyan-400" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        {/* AI Status */}
        <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-br from-cyan-400/[0.09] to-blue-500/[0.04] border border-cyan-400/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-xs text-emerald-300 font-medium">
              Systems Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Your AI workspace is ready.
          </p>
        </div>

        {/* User Profile */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-cyan-300 font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {userName}
              </p>
              <p className="text-[11px] text-slate-500">Personal Account</p>
            </div>

            <LogOut size={17} className="text-slate-500" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
