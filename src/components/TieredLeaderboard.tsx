import { cn } from "@/lib/utils";
import { Edit2, Trash2, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDisplayGroups, getSelectableGroups } from "@/lib/groupUtils";

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
  group_name: string;
}

interface TieredLeaderboardProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  onChangeGroup: (teamId: string, newGroup: string) => void;
  isAdmin?: boolean;
}

// Color palette for different groups
const GROUP_COLORS: Record<string, { border: string; headerBg: string; title: string; glow: string }> = {
  A: { border: "border-neon-cyan/50", headerBg: "from-cyan-500/20 to-cyan-600/5", title: "text-neon-cyan", glow: "shadow-cyan-500/20" },
  B: { border: "border-primary/50", headerBg: "from-primary/20 to-primary/5", title: "text-primary", glow: "shadow-primary/20" },
  C: { border: "border-amber-500/50", headerBg: "from-amber-500/20 to-amber-600/5", title: "text-amber-500", glow: "shadow-amber-500/20" },
  D: { border: "border-emerald-500/50", headerBg: "from-emerald-500/20 to-emerald-600/5", title: "text-emerald-500", glow: "shadow-emerald-500/20" },
  E: { border: "border-violet-500/50", headerBg: "from-violet-500/20 to-violet-600/5", title: "text-violet-500", glow: "shadow-violet-500/20" },
  F: { border: "border-rose-500/50", headerBg: "from-rose-500/20 to-rose-600/5", title: "text-rose-500", glow: "shadow-rose-500/20" },
};

const DEFAULT_COLOR = { border: "border-muted/50", headerBg: "from-muted/20 to-muted/5", title: "text-muted-foreground", glow: "shadow-muted/20" };

export function TieredLeaderboard({ teams, onEdit, onDelete, onChangeGroup, isAdmin = false }: TieredLeaderboardProps) {
  const displayGroups = getDisplayGroups(teams);

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

  // Determine grid columns based on number of groups
  const gridCols = displayGroups.length <= 2 ? "lg:grid-cols-2" : 
                   displayGroups.length <= 3 ? "lg:grid-cols-3" : 
                   "lg:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid grid-cols-1 gap-6 animate-fade-in", gridCols)}>
      {displayGroups.map((groupId) => {
        const groupTeams = teams.filter(t => t.group_name === groupId);
        const colors = GROUP_COLORS[groupId] || DEFAULT_COLOR;
        
        return (
          <GroupTable
            key={groupId}
            title={`Group ${groupId}`}
            groupId={groupId}
            teams={groupTeams}
            allTeams={teams}
            onEdit={onEdit}
            onDelete={onDelete}
            onChangeGroup={onChangeGroup}
            isAdmin={isAdmin}
            colors={colors}
          />
        );
      })}
    </div>
  );
}

interface GroupTableProps {
  title: string;
  groupId: string;
  teams: Team[];
  allTeams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  onChangeGroup: (teamId: string, newGroup: string) => void;
  isAdmin?: boolean;
  colors: { border: string; headerBg: string; title: string; glow: string };
}

function GroupTable({ title, groupId, teams, allTeams, onEdit, onDelete, onChangeGroup, isAdmin = false, colors }: GroupTableProps) {
  // Sort teams within group by points
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  // Get available groups for moving teams
  const availableGroups = getSelectableGroups(allTeams).filter(g => g !== groupId);

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
                    {/* Move to other group dropdown */}
                    {availableGroups.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 hover:bg-amber-500/20 hover:text-amber-500 transition-colors text-xs font-display"
                          >
                            Move
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          {availableGroups.map((targetGroup) => (
                            <DropdownMenuItem
                              key={targetGroup}
                              onClick={() => onChangeGroup(team.id, targetGroup)}
                              className="font-display text-xs cursor-pointer"
                            >
                              Move to Group {targetGroup}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
