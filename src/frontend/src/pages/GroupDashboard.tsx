import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Radio, Square } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  useEndLive,
  useGetGroups,
  useGetMessages,
  useGoLive,
  useSendMessage,
} from "../hooks/useQueries";

export default function GroupDashboard() {
  const navigate = useNavigate();
  const groupName = sessionStorage.getItem("verifiedGroup") ?? "";
  const [displayName, setDisplayName] = useState(groupName);
  const [chatInput, setChatInput] = useState("");

  const { data: groups } = useGetGroups();
  const { data: messages = [] } = useGetMessages(groupName);
  const { mutateAsync: goLive, isPending: isGoingLive } = useGoLive();
  const { mutateAsync: endLive, isPending: isEndingLive } = useEndLive();
  const { mutateAsync: sendMsg, isPending: isSending } = useSendMessage();

  const isLive = groups?.find((g) => g.name === groupName)?.isLive ?? false;

  if (!groupName) {
    navigate({ to: "/" });
    return null;
  }

  const handleToggleLive = async () => {
    if (isLive) {
      await endLive(groupName);
    } else {
      await goLive(groupName);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendMsg({
      groupName,
      senderName: displayName || groupName,
      message: chatInput.trim(),
    });
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("verifiedGroup");
            navigate({ to: "/" });
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-bold">{groupName}</h1>
          {isLive && (
            <span className="flex items-center gap-1 text-xs font-bold bg-live/20 text-live-foreground border border-live/40 rounded-full px-2 py-0.5 live-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-live inline-block" />
              LIVE
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-border bg-card flex flex-col items-center gap-4"
        >
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
            Broadcast Control
          </p>
          {isLive ? (
            <Button
              data-ocid="dashboard.end_live_button"
              onClick={handleToggleLive}
              disabled={isEndingLive}
              className="h-16 px-12 text-lg font-display font-bold rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground glow-red"
            >
              {isEndingLive ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Square className="w-5 h-5 mr-2" /> End Live
                </>
              )}
            </Button>
          ) : (
            <Button
              data-ocid="dashboard.go_live_button"
              onClick={handleToggleLive}
              disabled={isGoingLive}
              className="h-16 px-12 text-lg font-display font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground glow-orange"
            >
              {isGoingLive ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Radio className="w-5 h-5 mr-2" /> Go Live
                </>
              )}
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            {isLive
              ? "You are currently live. Your fans can see you!"
              : "Start streaming to let fans watch."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-bold text-lg">Fan Chat</h2>
          </div>
          <ScrollArea className="flex-1 h-64 p-4">
            <div className="flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No messages yet. Chat will appear here.
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={`${msg.sender}-${String(msg.timestamp)}-${idx}`}
                    className="flex flex-col gap-0.5"
                  >
                    <span className="text-xs text-primary font-semibold">
                      {msg.sender}
                    </span>
                    <span className="text-sm text-foreground">
                      {msg.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border flex flex-col gap-2">
            <Input
              placeholder="Your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-background border-border text-sm h-8"
            />
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                data-ocid="dashboard.chat_input"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-background border-border"
              />
              <Button
                data-ocid="dashboard.chat.submit_button"
                type="submit"
                disabled={isSending || !chatInput.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
