import { useNavigate } from "@tanstack/react-router";
import { Mic2, Users } from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-live/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="inline-flex items-center gap-1 bg-live/20 text-live-foreground border border-live/40 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase live-pulse">
            <span className="w-2 h-2 rounded-full bg-live inline-block" />
            Live Platform
          </span>
          <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight text-foreground">
            Group<span className="text-primary">Live</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Go live with your group. Connect with fans in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-5 w-full max-w-lg"
        >
          <button
            type="button"
            data-ocid="landing.group_button"
            onClick={() => navigate({ to: "/group/select" })}
            className="group flex-1 relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary/70 transition-all duration-300 cursor-pointer glow-orange hover:scale-105"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Mic2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">
                Group
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Perform &amp; go live
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          </button>

          <button
            type="button"
            data-ocid="landing.fan_button"
            onClick={() => navigate({ to: "/fan" })}
            className="group flex-1 relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-live/40 bg-live/10 hover:bg-live/20 hover:border-live/70 transition-all duration-300 cursor-pointer glow-red hover:scale-105"
          >
            <div className="w-16 h-16 rounded-2xl bg-live/20 border border-live/40 flex items-center justify-center group-hover:bg-live/30 transition-colors">
              <Users className="w-8 h-8 text-live-foreground" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">
                Fan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Watch &amp; chat live
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-live/5 to-transparent pointer-events-none" />
          </button>
        </motion.div>
      </div>

      <footer className="absolute bottom-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
