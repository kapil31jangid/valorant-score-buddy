import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
}

interface TieredLeaderboardProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  
  // Use a seeded random for consistent shuffling per session
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

export function TieredLeaderboard({ teams, onEdit, onDelete, isAdmin = false }: TieredLeaderboardProps) {
  // Split teams randomly into two groups
  const { groupA, groupB } = useMemo(() => {
    if (teams.length === 0) return { groupA: [], groupB: [] };
    
    // Use a fixed seed based on team IDs for consistent grouping
    const seed = teams.reduce((acc, t) => acc + t.id.charCodeAt(0), 0);
    const shuffled = shuffleArray(teams, seed);
    
    const midpoint = Math.ceil(shuffled.length / 2);
    return {
      groupA: shuffled.slice(0, midpoint),
      groupB: shuffled.slice(midpoint),
    };
  }, [teams]);

  if (teams.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-sm border border-border bg-card/50 backdrop-blur-sm border-glow-red animate-scale-in relative scanlines p-8">
        <div className="text-center">
          <p className="text-muted-foreground font-body text-lg">
            No teams registered yet
          </p>
          {isAdmin && (
            <p className="text-muted-foreground/60 text-sm mt-1">
              Add your first team to get started
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <GroupTable 
        title="Group A" 
        teams={groupA} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isAdmin={isAdmin}
        accentColor="cyan"
      />
      <GroupTable 
        title="Group B" 
        teams={groupB} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isAdmin={isAdmin}
        accentColor="primary"
      />
    </div>
  );
}

interface GroupTableProps {
  title: string;
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
  accentColor: "cyan" | "primary";
}

function GroupTable({ title, teams, onEdit, onDelete, isAdmin = false, accentColor }: GroupTableProps) {
  // Sort teams within group by points
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  const colorClasses = {
    cyan: {
      border: "border-neon-cyan/50",
      headerBg: "from-cyan-500/20 to-cyan-600/5",
      title: "text-neon-cyan",
      glow: "shadow-cyan-500/20",
    },
    primary: {
      border: "border-primary/50",
      headerBg: "from-primary/20 to-primary/5",
      title: "text-primary",
      glow: "shadow-primary/20",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div className={cn(
      "rounded-sm border backdrop-blur-sm overflow-hidden",
      colors.border,
      "bg-card/50"
    )}>
      {/* Group Header */}
      <div className={cn(
        "px-4 py-3 bg-gradient-to-r border-b",
        colors.headerBg,
        colors.border
      )}>
        <h3 className={cn("font-display text-xl tracking-wider", colors.title)}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {teams.length} {teams.length === 1 ? "team" : "teams"}
        </p>
      </div>

      {/* Teams List */}
      <div className="divide-y divide-border/30">
        {sortedTeams.map((team, index) => {
          const rank = index + 1;
          const winRate = team.wins + team.losses > 0 
            ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0) 
            : "0";

          return (
            <div
              key={team.id}
              className={cn(
                "flex items-center justify-between p-3 transition-all duration-300 group",
                "hover:bg-white/5",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className={cn(
                  "font-display text-lg w-8 text-center",
                  rank === 1 ? "text-rank-gold" : "text-muted-foreground"
                )}>
                  {rank === 1 && <Trophy className="w-4 h-4 inline-block mr-0.5 text-rank-gold" />}
                  #{rank}
                </span>

                {/* Logo */}
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
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

                {/* Team Info */}
                <div>
                  <p className="font-display text-base text-foreground tracking-wide transition-all duration-300 group-hover:text-primary">
                    {team.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3 text-neon-cyan" />
                      {team.wins}W
                    </span>
                    <span className="flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3 text-destructive" />
                      {team.losses}L
                    </span>
                    <span>• {winRate}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Points */}
                <div className="text-right">
                  <p className={cn(
                    "font-display text-xl",
                    rank === 1 ? "text-rank-gold" : "text-foreground"
                  )}>
                    {team.points}
                  </p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1">
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
                )}
              </div>
            </div>
          );
        })}

        {teams.length === 0 && (
          <div className="p-6 text-center text-muted-foreground/60 text-sm">
            No teams in this group
          </div>
        )}
      </div>
    </div>
  );
}
