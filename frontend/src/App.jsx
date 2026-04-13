import React, { useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { IdeaFeed } from "./components/ideas/IdeaFeed";
import { IdeaForm } from "./components/ideas/IdeaForm";
import { IdeaDetails } from "./components/ideas/IdeaDetails";
import { SessionTimer } from "./components/session/SessionTimer";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Lock, Clock, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const AppContent = () => {
  const { user, session, loading, startSession } = useAuth();
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 text-zinc-900 animate-pulse" />
          <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">
            Initializing Platform
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-zinc-900 tracking-tighter leading-none">
                Validate Your <span className="text-amber-500">Startup</span>{" "}
                Vision.
              </h1>
              <p className="text-zinc-500 font-medium">
                The student-focused ecosystem for structured feedback, AI
                validation, and team matching.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-zinc-900">AI Filtering</p>
                <p className="text-[10px] text-zinc-400">
                  No spam, only quality ideas.
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <Clock className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-xs font-bold text-zinc-900">Focused Usage</p>
                <p className="text-[10px] text-zinc-400">
                  15-min sessions for productivity.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col pb-20">
      <Navbar />
      <SessionTimer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {!session?.isActive ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900">
                Platform Locked
              </h2>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Start a 15-minute session to explore ideas, provide feedback,
                and validate your vision.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 font-bold px-8"
              onClick={startSession}
            >
              Start Focused Session
            </Button>
            {session?.cooldownEnd && (
              <p className="text-xs text-zinc-400 font-medium italic">
                Next session available in a few hours.
              </p>
            )}
          </div>
        ) : (
          <>
            {selectedIdea ? (
              <IdeaDetails
                idea={selectedIdea}
                onBack={() => setSelectedIdea(null)}
              />
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                      Founder Feed
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium">
                      Personalized for your interests and skills.
                    </p>
                  </div>
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-zinc-900 hover:bg-zinc-800 font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Share Idea
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <IdeaForm onSuccess={() => setIsFormOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                <IdeaFeed onSelectIdea={setSelectedIdea} />
              </div>
            )}
          </>
        )}
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
