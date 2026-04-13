import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackSection } from "./FeedbackSection";
import { PollSection } from "./PollSection";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  BarChart3,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const TeamSection = ({ ideaId, isOwner }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ideas/${ideaId}/applications`);
      setApplications(res.data.map(doc => ({ id: doc._id, ...doc })));
    } catch (e) {
      console.error(e);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user || !role) return;

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/ideas/${ideaId}/applications`, {
        userId: user.uid,
        userName: user.displayName,
        role,
        message,
        status: "pending"
      });
      fetchApplications();
      toast.success("Application sent!");
      setRole("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to apply.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isOwner && (
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Join the Team</CardTitle>
            <CardDescription>
              Interested in this idea? Apply to collaborate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApply} className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  placeholder="e.g., Frontend Developer, Marketing"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Why are you interested?</Label>
                <Textarea
                  placeholder="Share your skills and commitment level..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                Apply to Join
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="font-bold text-zinc-900 flex items-center gap-2">
          Applicants & Collaborators
          <span className="bg-zinc-100 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full">
            {applications.length}
          </span>
        </h4>
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start justify-between"
          >
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{app.userName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-zinc-900">
                  {app.userName}
                </p>
                <p className="text-xs text-zinc-500 font-medium">{app.role}</p>
                <p className="text-xs text-zinc-600 mt-1">{app.message}</p>
              </div>
            </div>
            <Badge
              variant={app.status === "accepted" ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wider"
            >
              {app.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IdeaDetails = ({ idea, onBack }) => {
  const { user } = useAuth();
  const isOwner = user?.uid === idea.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-zinc-500 hover:text-zinc-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-zinc-100 text-zinc-600 font-medium"
              >
                {idea.category}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">
                {idea.qualityScore}% Quality Score
              </Badge>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight">
              {idea.title}
            </h1>
            <div className="flex items-center gap-2 pt-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={idea.userPhoto} />
                <AvatarFallback>{idea.userName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-zinc-500 font-medium">
                Proposed by{" "}
                <span className="text-zinc-900 font-bold">{idea.userName}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
                The Problem
              </h3>
              <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                {idea.problem}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-zinc-400" />
                The Solution
              </h3>
              <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                {idea.solution}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-400" />
                Target Audience
              </h3>
              <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                {idea.targetAudience}
              </p>
            </section>

            <Separator className="bg-zinc-100" />

            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-100/50 p-1">
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger
                  value="polls"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Polls
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feedback" className="pt-6">
                <FeedbackSection ideaId={idea.id} />
              </TabsContent>
              <TabsContent value="polls" className="pt-6">
                <PollSection ideaId={idea.id} isOwner={isOwner} />
              </TabsContent>
              <TabsContent value="team" className="pt-6">
                <TeamSection ideaId={idea.id} isOwner={isOwner} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-zinc-200 shadow-sm bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Quality Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-black text-amber-400">
                  {idea.qualityScore}
                  <span className="text-sm font-medium text-zinc-400 ml-1">
                    / 100
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  "{idea.aiFeedback}"
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">
                  Founder Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Ideas Shared</span>
                  <span className="font-bold text-zinc-900">1</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Commitment</span>
                  <span className="font-bold text-emerald-600">High</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
