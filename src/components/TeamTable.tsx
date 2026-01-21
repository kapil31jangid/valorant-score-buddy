import { useState } from "react";
import { Edit2, Trash2, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
}

interface TeamTableProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "text-rank-gold text-glow-red font-bold animate-flicker";
    case 2:
      return "text-rank-silver font-semibold";
    case 3:
      return "text-rank-bronze font-semibold";
    default:
      return "text-muted-foreground";
  }
};

const getRankIcon = (rank: number) => {
  if (rank === 1) {
    return <Trophy className="w-5 h-5 text-rank-gold inline-block mr-1" />;
  }
  return null;
};

export function TeamTable({ teams, onEdit, onDelete, isAdmin = false }: TeamTableProps) {
  // Sort teams by points (descending), then by wins
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  return (
    <div className="w-full overflow-hidden rounded-sm border border-border bg-card/50 backdrop-blur-sm border-glow-red animate-scale-in relative scanlines">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="w-16 text-center font-display text-xs uppercase tracking-widest text-primary">
              Rank
            </TableHead>
            <TableHead className="font-display text-xs uppercase tracking-widest text-primary">
              Team
            </TableHead>
            <TableHead className="w-20 text-center font-display text-xs uppercase tracking-widest text-neon-cyan">
              Wins
            </TableHead>
            <TableHead className="w-20 text-center font-display text-xs uppercase tracking-widest text-destructive">
              Losses
            </TableHead>
            <TableHead className="w-24 text-center font-display text-xs uppercase tracking-widest text-primary">
              Points
            </TableHead>
            {isAdmin && (
              <TableHead className="w-28 text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="h-32 text-center">
                <p className="text-muted-foreground font-body text-lg">
                  No teams registered yet
                </p>
                {isAdmin && (
                  <p className="text-muted-foreground/60 text-sm mt-1">
                    Add your first team to get started
                  </p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            sortedTeams.map((team, index) => {
              const rank = index + 1;
              const winRate = team.wins + team.losses > 0 
                ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0) 
                : "0";
              
              return (
                <TableRow
                  key={team.id}
                  className={cn(
                    "border-b border-border/50 transition-all duration-300 opacity-0 animate-fade-in-up group",
                    rank === 1 && "bg-primary/5 hover-glow-red",
                    rank !== 1 && "hover:bg-secondary/50"
                  )}
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <TableCell className="text-center">
                    <span className={cn("font-display text-xl", getRankStyle(rank))}>
                      {getRankIcon(rank)}
                      #{rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center clip-angle-sm overflow-hidden transition-transform duration-300 group-hover:scale-110">
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-display text-lg">
                            {team.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-lg text-foreground tracking-wide transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                          {team.name}
                        </p>
                        <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
                          Win Rate: {winRate}%
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-neon-cyan" />
                      <span className="font-display text-xl text-neon-cyan">
                        {team.wins}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4 text-destructive" />
                      <span className="font-display text-xl text-destructive">
                        {team.losses}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "font-display text-2xl",
                      rank === 1 ? "text-primary text-glow-red" : "text-foreground"
                    )}>
                      {team.points}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(team)}
                          className="h-8 w-8 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(team.id)}
                          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
