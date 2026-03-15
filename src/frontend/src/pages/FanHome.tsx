import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mic2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useGetGroups } from "../hooks/useQueries";

export default function FanHome() {
  const navigate = useNavigate();
  const { data: groups = [], isLoading } = useGetGroups();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-4 p-6 border-b border-border">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Live Groups</h1>
          <p className="text-xs text-muted-foreground">
            Watch your favorite groups live
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No groups available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group, idx) => (
              <motion.button
                key={group.name}
                type="button"
                data-ocid={`fan_home.item.${idx + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() =>
                  navigate({ to: `/fan/${encodeURIComponent(group.name)}` })
                }
                className={`relative flex flex-col gap-4 p-6 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:scale-105 ${
                  group.isLive
                    ? "border-live/50 bg-live/10 hover:border-live/80 hover:bg-live/15 glow-red"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {group.isLive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold bg-live text-live-foreground rounded-full px-2 py-0.5 live-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                    LIVE
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${group.isLive ? "bg-live/20" : "bg-primary/20"}`}
                >
                  <Mic2
                    className={`w-6 h-6 ${group.isLive ? "text-live-foreground" : "text-primary"}`}
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">{group.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {group.isLive
                      ? "Streaming now - join the chat!"
                      : "Offline"}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
