import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useVerifyPasscode } from "../hooks/useQueries";

export default function GroupPasscode() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync: verify, isPending } = useVerifyPasscode();

  const selectedGroup = sessionStorage.getItem("selectedGroup") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const ok = await verify(passcode);
      if (ok) {
        sessionStorage.setItem("verifiedGroup", selectedGroup);
        navigate({ to: "/group/dashboard" });
      } else {
        setError("Wrong passcode, try again");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-4 p-6 border-b border-border">
        <button
          type="button"
          onClick={() => navigate({ to: "/group/select" })}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold">Enter Passcode</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center glow-orange">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold">
                {selectedGroup || "Your Group"}
              </h2>
              <p className="text-muted-foreground mt-1">
                Enter your group passcode to continue
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <Input
                data-ocid="passcode.input"
                type="password"
                inputMode="numeric"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="text-center text-2xl tracking-[0.5em] h-14 bg-card border-border focus:border-primary"
                autoFocus
              />
              {error && (
                <p
                  data-ocid="passcode.error_state"
                  className="text-destructive text-sm text-center font-medium"
                >
                  {error}
                </p>
              )}
              <Button
                data-ocid="passcode.submit_button"
                type="submit"
                disabled={isPending || passcode.length === 0}
                className="h-12 font-display font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Enter"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
