import React, { useEffect, useState } from "react";
import axios from "axios";
import { IdeaCard } from "./IdeaCard";
import { useAuth } from "@/src/lib/AuthContext";
import { Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const IdeaFeed = ({ onSelectIdea }) => {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/ideas?category=${categoryFilter}`);
        const ideasData = res.data.map(doc => ({ id: doc._id, ...doc }));
        
        if (profile?.interests?.length > 0) {
          ideasData.sort((a, b) => {
            const aMatch = profile.interests.includes(a.category) ? 1 : 0;      
            const bMatch = profile.interests.includes(b.category) ? 1 : 0;      
            if (aMatch !== bMatch) return bMatch - aMatch;
            return b.qualityScore - a.qualityScore;
          });
        }
        setIdeas(ideasData);
      } catch (e) {
        console.error("Failed to fetch ideas", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [categoryFilter, profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="text-zinc-500 font-medium">
          Curating personalized feed...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Explore Ideas</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Sustainability">Sustainability</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
          <p className="text-zinc-500">No ideas found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onClick={() => onSelectIdea(idea)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
