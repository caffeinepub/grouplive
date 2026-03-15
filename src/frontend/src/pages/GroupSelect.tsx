import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mic2 } from "lucide-react";
import { motion } from "motion/react";
import { useGetGroups } from "../hooks/useQueries";

export default function GroupSelect() {
  const navigate = useNavigate();
  const { data: groups, isLoading } = useGetGroups();

  const handleSelect = (name: string) => {
    sessionStorage.setItem("selectedGroup", name);
    navigate({ to: "/group/passcode" });
  };

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
        <h1 className="font-display text-xl font-bold">Select Your Group</h1>
      </header>

      <main className="flex-1 p-6 max-w-xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            <p className="text-muted-foreground mb-4">Which group are you?</p>
            {(groups ?? []).map((group, idx) => (
              <motion.button
                key={group.name}
                type="button"
                data-ocid={`group_select.item.${idx + 1}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                onClick={() => handleSelect(group.name)}
                className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mic2 className="w-5 h-5 text-primary" />
                </div>
                <span className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {group.name}
                </span>
                {group.isLive && (
                  <span className="ml-auto text-xs font-bold bg-live/20 text-live-foreground border border-live/40 rounded-full px-2 py-0.5 live-pulse">
                    LIVE
                  </span>
                )}
              </motion.button>
            ))}
            {(groups ?? []).length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                No groups found yet.
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
