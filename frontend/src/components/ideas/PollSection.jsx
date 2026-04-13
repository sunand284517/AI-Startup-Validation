import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Plus, BarChart2 } from "lucide-react";
import { toast } from "sonner";

export const PollSection = ({ ideaId, isOwner }) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });

const fetchPolls = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ideas/${ideaId}/polls`);
      setPolls(res.data.map(doc => ({ id: doc._id, ...doc })));
    } catch (e) {
      console.error(e);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleVote = async (pollId, optionIndex) => {
    if (!user) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/ideas/${ideaId}/polls/${pollId}/vote`, {
        optionIndex
      });
      setPolls(res.data.map(doc => ({ id: doc._id, ...doc })));
      toast.success("Vote recorded!");
    } catch (error) {
      toast.error("Failed to vote.");
    }
  };

  const handleCreatePoll = async () => {
    if (
      newPoll.question.trim() === "" ||
      newPoll.options.some((o) => o.trim() === "")
    )
      return;
    try {
      const res = await axios.post(`http://localhost:5000/api/ideas/${ideaId}/polls`, {
        question: newPoll.question,
        options: newPoll.options,
      });
      setPolls(res.data.map(doc => ({ id: doc._id, ...doc })));
      toast.success("Poll created!");
      setShowCreate(false);
      setNewPoll({ question: "", options: ["", ""] });
    } catch (error) {
      toast.error("Failed to create poll.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-zinc-400" />
          Idea Validation Polls
        </h3>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreate(!showCreate)}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Poll
          </Button>
        )}
      </div>

      {showCreate && (
        <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                placeholder="e.g., Would you pay $10/mo for this?"
                value={newPoll.question}
                onChange={(e) =>
                  setNewPoll({ ...newPoll, question: e.target.value })
                }
              />
            </div>
            {newPoll.options.map((opt, i) => (
              <div key={i} className="space-y-2">
                <Label>Option {i + 1}</Label>
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...newPoll.options];
                    newOpts[i] = e.target.value;
                    setNewPoll({ ...newPoll, options: newOpts });
                  }}
                />
              </div>
            ))}
            <Button className="w-full" onClick={handleCreatePoll}>
              Create Poll
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {polls.map((poll) => {
          const totalVotes = Object.values(poll.votes || {}).reduce(
            (a, b) => a + b,
            0,
          );
          return (
            <Card key={poll.id} className="border-zinc-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-md">{poll.question}</CardTitle>
                <CardDescription>{totalVotes} votes cast</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {poll.options.map((opt, i) => {
                  const votes = poll.votes?.[i] || 0;
                  const percentage =
                    totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-zinc-700">{opt}</span>
                        <span className="text-zinc-400 font-bold">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="relative h-8 flex items-center group">
                        <Progress
                          value={percentage}
                          className="h-full bg-zinc-100"
                        />
                        <Button
                          variant="ghost"
                          className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-zinc-900/5 transition-opacity justify-end px-4"
                          onClick={() => handleVote(poll.id, i)}
                        >
                          <CheckCircle2 className="w-4 h-4 text-zinc-900" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
