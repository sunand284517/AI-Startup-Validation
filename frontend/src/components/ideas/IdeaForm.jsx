import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/src/lib/AuthContext";
import { evaluateIdea } from "@/src/lib/geminiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export const IdeaForm = ({ onSuccess }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    targetAudience: "",
    solution: "",
    category: "Technology",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. AI Evaluation
      const aiResult = await evaluateIdea(
        formData.title,
        formData.problem,
        formData.solution,
      );
      if (aiResult.isSpam) {
        toast.error(
          "Idea flagged as low-quality or spam. Please provide more detail.",
        );
        setLoading(false);
        return;
      }

      // 2. Save to Backend via REST
      await axios.post("http://localhost:5000/api/ideas", {
        ...formData,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        qualityScore: aiResult.score,
        aiFeedback: aiResult.feedback,
        category: aiResult.category || formData.category,
      });

      toast.success("Idea published successfully!");
      setFormData({
        title: "",
        problem: "",
        targetAudience: "",
        solution: "",
        category: "Technology",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Failed to publish idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Share Your Startup Idea
        </CardTitle>
        <CardDescription>
          Provide structured details for AI-powered validation and quality
          feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Idea Title</Label>
            <Input
              id="title"
              placeholder="e.g., Uber for Pet Grooming"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Busy professionals with pets"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">The Problem</Label>
            <Textarea
              id="problem"
              placeholder="What pain point are you solving?"
              className="min-h-[100px]"
              value={formData.problem}
              onChange={(e) =>
                setFormData({ ...formData, problem: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">The Solution</Label>
            <Textarea
              id="solution"
              placeholder="How does your idea solve this problem?"
              className="min-h-[100px]"
              value={formData.solution}
              onChange={(e) =>
                setFormData({ ...formData, solution: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI Evaluating...
              </>
            ) : (
              "Publish Idea"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
