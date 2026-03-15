import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  useGetGroups,
  useGetMessages,
  useSendMessage,
} from "../hooks/useQueries";

export default function FanGroupView() {
  const { groupName: rawGroupName } = useParams({ strict: false }) as {
    groupName: string;
  };
  const groupName = decodeURIComponent(rawGroupName ?? "");
  const navigate = useNavigate();

  const [fanName, setFanName] = useState("");
  const [chatInput, setChatInput] = useState("");

  const { data: groups = [] } = useGetGroups();
  const { data: messages = [] } = useGetMessages(groupName);
  const { mutateAsync: sendMsg, isPending: isSending } = useSendMessage();

  const group = groups.find((g) => g.name === groupName);
  const isLive = group?.isLive ?? false;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendMsg({
      groupName,
      senderName: fanName.trim() || "Anonymous Fan",
      message: chatInput.trim(),
    });
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <button
          type="button"
          onClick={() => navigate({ to: "/fan" })}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-bold">{groupName}</h1>
          {isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-bold bg-live text-live-foreground rounded-full px-3 py-1 live-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              LIVE NOW
            </span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              Offline
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full gap-4">
        {isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-live/10 border border-live/40 p-6 flex flex-col items-center gap-2 glow-red"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-live inline-block live-pulse" />
              <span className="font-display text-2xl font-bold text-live-foreground">
                {groupName} IS LIVE
              </span>
              <span className="w-3 h-3 rounded-full bg-live inline-block live-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              Chat below and let them know you are watching!
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-bold">Live Chat</h2>
          </div>
          <ScrollArea className="flex-1 h-72 p-4">
            <div className="flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  {isLive
                    ? "Be the first to send a message!"
                    : "No messages yet."}
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
              placeholder="Your fan name (optional)"
              value={fanName}
              onChange={(e) => setFanName(e.target.value)}
              className="bg-background border-border text-sm h-8"
            />
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                data-ocid="fan_view.chat_input"
                placeholder="Send a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-background border-border"
              />
              <Button
                data-ocid="fan_view.chat.submit_button"
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
