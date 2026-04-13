import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BarChart3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const IdeaCard = ({ idea, onClick }) => {
  const scoreColor =
    idea.qualityScore > 80
      ? "bg-emerald-100 text-emerald-700"
      : idea.qualityScore > 50
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

  return (
    <Card
      className="group cursor-pointer hover:shadow-md transition-all border-zinc-200 overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="secondary"
            className="bg-zinc-100 text-zinc-600 font-medium"
          >
            {idea.category}
          </Badge>
          <Badge className={`${scoreColor} border-none font-bold`}>
            {idea.qualityScore}% Quality
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
          {idea.title}
        </h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-zinc-600 text-sm line-clamp-3 mb-4">
          {idea.problem}
        </p>
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={idea.userPhoto} />
            <AvatarFallback>{idea.userName?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-zinc-500 font-medium">
            {idea.userName} •{" "}
            {idea.createdAt
              ? formatDistanceToNow(idea.createdAt.toDate()) + " ago"
              : "just now"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-4 border-t border-zinc-50 mt-2">
        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
          <MessageSquare className="w-3 h-3" />
          <span>Feedback</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
          <BarChart3 className="w-3 h-3" />
          <span>Polls</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
          <Users className="w-3 h-3" />
          <span>Team</span>
        </div>
      </CardFooter>
    </Card>
  );
};
