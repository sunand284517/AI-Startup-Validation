import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

export const SessionTimer = () => {
  const { session, endSession } = useAuth();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (!session?.isActive || !session?.lastSessionStart) return;

    const startTime = session.lastSessionStart.toDate().getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, 15 * 60 - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        endSession();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, endSession]);

  if (!session?.isActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (15 * 60)) * 100;

  return (
    <div className="fixed bottom-4 right-4 w-64 bg-white p-4 rounded-xl shadow-2xl border border-zinc-200 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
          <Clock className="w-4 h-4" />
          <span>Session Time</span>
        </div>
        <span className="text-zinc-900 font-bold tabular-nums">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-[10px] text-zinc-400 mt-2 text-center uppercase tracking-wider font-semibold">
        Focused Engagement Mode
      </p>
    </div>
  );
};
