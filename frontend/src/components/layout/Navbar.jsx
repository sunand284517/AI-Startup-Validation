import React from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, LogOut, Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const { user, profile, login, logout, session, startSession } = useAuth();

  return (
    <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-black text-xl tracking-tighter text-zinc-900">
            IdeaSpark
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {!session?.isActive && (
                <Button
                  size="sm"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
                  onClick={startSession}
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Start Session
                </Button>
              )}

              {session?.isActive && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-3 py-1"
                >
                  <Clock className="w-3 h-3 mr-1.5" />
                  Active Session
                </Badge>
              )}

              <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900">
                    {user.displayName}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                    Student Founder
                  </p>
                </div>
                <Avatar className="w-8 h-8 border border-zinc-200">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-zinc-400 hover:text-rose-500"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={login}
              className="bg-zinc-900 hover:bg-zinc-800 font-bold"
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
