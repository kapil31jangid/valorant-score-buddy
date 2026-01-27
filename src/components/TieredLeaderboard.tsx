import { cn } from "@/lib/utils";
import { Edit2, Trash2, Trophy, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBucketDisplay, BucketConfiguration } from "@/lib/groupUtils";

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

// Color palette for different buckets
const BUCKET_COLORS: Record<string, { border: string; headerBg: string; title: string; glow: string }> = {
  A: { border: "border-neon-cyan/50", headerBg: "from-cyan-500/20 to-cyan-600/5", title: "text-neon-cyan", glow: "shadow-cyan-500/20" },
  B: { border: "border-primary/50", headerBg: "from-primary/20 to-primary/5", title: "text-primary", glow: "shadow-primary/20" },
  C: { border: "border-amber-500/50", headerBg: "from-amber-500/20 to-amber-600/5", title: "text-amber-500", glow: "shadow-amber-500/20" },
  D: { border: "border-emerald-500/50", headerBg: "from-emerald-500/20 to-emerald-600/5", title: "text-emerald-500", glow: "shadow-emerald-500/20" },
  E: { border: "border-violet-500/50", headerBg: "from-violet-500/20 to-violet-600/5", title: "text-violet-500", glow: "shadow-violet-500/20" },
  F: { border: "border-rose-500/50", headerBg: "from-rose-500/20 to-rose-600/5", title: "text-rose-500", glow: "shadow-rose-500/20" },
  G: { border: "border-indigo-500/50", headerBg: "from-indigo-500/20 to-indigo-600/5", title: "text-indigo-500", glow: "shadow-indigo-500/20" },
  H: { border: "border-pink-500/50", headerBg: "from-pink-500/20 to-pink-600/5", title: "text-pink-500", glow: "shadow-pink-500/20" },
};

const DEFAULT_COLOR = { border: "border-muted/50", headerBg: "from-muted/20 to-muted/5", title: "text-muted-foreground", glow: "shadow-muted/20" };

export function TieredLeaderboard({ teams, onEdit, onDelete, isAdmin = false }: TieredLeaderboardProps) {
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

  // Calculate optimal bucket configuration and distribute teams
  const { config, buckets } = getBucketDisplay(teams);
  const bucketEntries = Array.from(buckets.entries());

  // Determine grid columns based on number of buckets
  const gridCols = config.buckets <= 2 ? "lg:grid-cols-2" : 
                   config.buckets <= 3 ? "lg:grid-cols-3" : 
                   config.buckets <= 4 ? "lg:grid-cols-2 xl:grid-cols-4" :
                   "lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Configuration Info Banner */}
      <ConfigBanner config={config} />
      
      {/* Bucket Grid */}
      <div className={cn("grid grid-cols-1 gap-6", gridCols)}>
        {bucketEntries.map(([bucketName, bucketTeams]) => {
          const colors = BUCKET_COLORS[bucketName] || DEFAULT_COLOR;
          
          return (
            <BucketTable
              key={bucketName}
              title={`Bucket ${bucketName}`}
              bucketName={bucketName}
              teams={bucketTeams}
              teamsPerBucket={config.teams_per_bucket}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
              colors={colors}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ConfigBannerProps {
  config: BucketConfiguration;
}

function ConfigBanner({ config }: ConfigBannerProps) {
  const showWarning = config.note?.includes("prime") || config.note?.includes("not possible");

  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-sm border backdrop-blur-sm",
      showWarning 
        ? "border-amber-500/50 bg-amber-500/10" 
        : "border-border bg-card/30"
    )}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="font-display tracking-wider">
          {config.total_teams} Teams
        </Badge>
        <Badge variant="outline" className="font-display tracking-wider">
          {config.buckets} {config.buckets === 1 ? "Bucket" : "Buckets"}
        </Badge>
        <Badge variant="outline" className="font-display tracking-wider">
          {config.teams_per_bucket} per bucket
        </Badge>
        {config.balanced && (
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50 font-display tracking-wider">
            ✓ Balanced
          </Badge>
        )}
      </div>
      
      {showWarning && (
        <div className="flex items-center gap-2 text-amber-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-body">{config.note}</span>
        </div>
      )}
    </div>
  );
}

interface BucketTableProps {
  title: string;
  bucketName: string;
  teams: Team[];
  teamsPerBucket: number;
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
  colors: { border: string; headerBg: string; title: string; glow: string };
}

function BucketTable({ title, bucketName, teams, teamsPerBucket, onEdit, onDelete, isAdmin = false, colors }: BucketTableProps) {
  // Sort teams within bucket by points
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  return (
    <div className={cn(
      "rounded-sm border backdrop-blur-sm overflow-hidden",
      colors.border,
      "bg-card/50"
    )}>
      {/* Bucket Header */}
      <div className={cn(
        "px-4 py-3 bg-gradient-to-r border-b",
        colors.headerBg,
        colors.border
      )}>
        <h3 className={cn("font-display text-xl tracking-wider", colors.title)}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {teams.length}/{teamsPerBucket} teams
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
            No teams in this bucket
          </div>
        )}
      </div>
    </div>
  );
}
