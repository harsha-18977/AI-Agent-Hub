import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

function AgentCard({ title, description, icon: Icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full min-h-[230px] overflow-hidden text-left
      bg-[#101a2b]/65 backdrop-blur-2xl
      border border-cyan-400/15 rounded-2xl p-6
      transition-all duration-500 ease-out
      hover:-translate-y-2 hover:scale-[1.02]
      hover:border-cyan-400/50
      hover:bg-[#142238]/90
      hover:shadow-[0_15px_45px_rgba(0,229,255,0.16)]
      animated-card animate-slide-up"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
        bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-violet-500/[0.08]"
      />

      {/* Background glow */}
      <div
        className="absolute -top-20 -right-16 w-44 h-44 rounded-full
        bg-cyan-400/10 blur-[65px]
        group-hover:bg-cyan-400/25
        group-hover:scale-150
        transition-all duration-700"
      />

      <div
        className="absolute -bottom-20 -left-16 w-40 h-40 rounded-full
        bg-blue-500/[0.05] blur-[60px]
        group-hover:bg-blue-500/20
        transition-all duration-700"
      />

      {/* Top section */}
      <div className="relative flex items-start justify-between">
        <div
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center
          border border-white/10 ${color}
          transition-all duration-500
          group-hover:scale-110 group-hover:-rotate-3
          group-hover:shadow-[0_0_30px_rgba(0,229,255,0.22)]`}
        >
          <Icon
            size={26}
            className="transition-transform duration-500 group-hover:scale-110"
          />

          <span
            className="absolute inset-0 rounded-2xl border border-cyan-300/0
            group-hover:border-cyan-300/40 transition-all duration-500"
          />
        </div>

        <div
          className="p-2.5 rounded-xl bg-white/[0.04]
          border border-white/[0.07]
          group-hover:bg-cyan-400/10
          group-hover:border-cyan-400/30
          transition-all duration-300"
        >
          <ArrowUpRight
            size={19}
            className="text-slate-500 group-hover:text-cyan-300
            transition-all duration-300
            group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-7">
        <div className="flex items-center gap-2 mb-2">
          <h3
            className="text-lg font-semibold text-white
            group-hover:text-cyan-200 transition-colors duration-300"
          >
            {title}
          </h3>

          <Sparkles
            size={14}
            className="text-cyan-400/0
            group-hover:text-cyan-400
            group-hover:animate-pulse
            transition-colors duration-300"
          />
        </div>

        <p
          className="text-sm text-slate-400 leading-6
          group-hover:text-slate-300 transition-colors duration-300"
        >
          {description}
        </p>
      </div>

      {/* Bottom status */}
      <div
        className="relative flex items-center justify-between mt-6 pt-4
        border-t border-white/[0.08]"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full
              bg-emerald-400 opacity-60 animate-ping"
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2
              bg-emerald-400 shadow-[0_0_10px_#34d399]"
            />
          </span>

          <span
            className="text-[11px] text-slate-400
            group-hover:text-emerald-300 transition-colors"
          >
            Ready to use
          </span>
        </div>

        <span
          className="flex items-center gap-1.5 text-[11px]
          text-cyan-400 font-semibold
          opacity-80 group-hover:opacity-100
          transition-all duration-300"
        >
          Launch Agent
          <Zap
            size={13}
            className="group-hover:scale-125 group-hover:fill-cyan-400
            transition-transform duration-300"
          />
        </span>
      </div>

      {/* Bottom animated highlight */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0
        bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500
        group-hover:w-full transition-all duration-700"
      />
    </button>
  );
}

export default AgentCard;
