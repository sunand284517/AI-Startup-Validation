import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const FeedbackSection = ({ ideaId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ideas/${ideaId}/feedback`);
      setFeedbackList(res.data.map(doc => ({ id: doc._id, ...doc })));
    } catch (e) {
      console.error(e);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/ideas/${ideaId}/feedback`, {
        userId: user.uid,
        userName: user.displayName,
        rating,
        suggestions: comment
      });
      toast.success("Feedback submitted!");
      setRating(0);
      setComment("");
      fetchFeedback();
    } catch (error) {
      toast.error("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Provide Feedback</CardTitle>
          <CardDescription>
            Help the founder improve their idea with structured input.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${rating >= star ? "text-amber-500" : "text-zinc-200"}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-sm text-zinc-500 ml-2 font-medium">
                {rating > 0 ? `${rating}/5 Stars` : "Select rating"}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Suggestions & Critique</Label>
              <Textarea
                id="comment"
                placeholder="What could be better? Is the problem clear?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || rating === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-bold text-zinc-900 flex items-center gap-2">
          Community Input
          <span className="bg-zinc-100 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full">
            {feedbackList.length}
          </span>
        </h4>
        {feedbackList.map((fb) => (
          <div
            key={fb.id}
            className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-900">
                {fb.userName}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-amber-600">
                  {fb.rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {fb.suggestions}
            </p>
            <p className="text-[10px] text-zinc-400">
              {fb.createdAt
                ? formatDistanceToNow(new Date(fb.createdAt)) + " ago"
                : "just now"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
