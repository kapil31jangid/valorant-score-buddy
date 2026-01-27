import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy, Medal, Award, Star, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { TeamTable } from "./TeamTable";

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

interface Bucket {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  minPoints: number;
  maxPoints: number;
}

const BUCKETS: Bucket[] = [
  {
    id: "champion",
    name: "Champion",
    icon: <Trophy className="w-5 h-5" />,
    color: "text-rank-gold",
    bgGradient: "from-yellow-500/20 to-amber-600/10",
    borderColor: "border-yellow-500/50",
    minPoints: 15,
    maxPoints: Infinity,
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: <Star className="w-5 h-5" />,
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-500/10",
    borderColor: "border-cyan-500/50",
    minPoints: 10,
    maxPoints: 14,
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: <Medal className="w-5 h-5" />,
    color: "text-slate-300",
    bgGradient: "from-slate-400/20 to-zinc-500/10",
    borderColor: "border-slate-400/50",
    minPoints: 6,
    maxPoints: 9,
  },
  {
    id: "gold",
    name: "Gold",
    icon: <Award className="w-5 h-5" />,
    color: "text-amber-500",
    bgGradient: "from-amber-500/20 to-orange-600/10",
    borderColor: "border-amber-500/50",
    minPoints: 3,
    maxPoints: 5,
  },
  {
    id: "silver",
    name: "Silver",
    icon: <Shield className="w-5 h-5" />,
    color: "text-gray-400",
    bgGradient: "from-gray-400/20 to-gray-600/10",
    borderColor: "border-gray-500/50",
    minPoints: 0,
    maxPoints: 2,
  },
];

function getBucketForTeam(team: Team): Bucket {
  for (const bucket of BUCKETS) {
    if (team.points >= bucket.minPoints && team.points <= bucket.maxPoints) {
      return bucket;
    }
  }
  return BUCKETS[BUCKETS.length - 1]; // Default to lowest bucket
}

function groupTeamsByBucket(teams: Team[]): Map<string, Team[]> {
  const grouped = new Map<string, Team[]>();
  
  // Initialize all buckets with empty arrays
  BUCKETS.forEach(bucket => grouped.set(bucket.id, []));
  
  // Sort teams by points first
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
  
  // Assign teams to buckets
  sortedTeams.forEach(team => {
    const bucket = getBucketForTeam(team);
    const bucketTeams = grouped.get(bucket.id) || [];
    bucketTeams.push(team);
    grouped.set(bucket.id, bucketTeams);
  });
  
  return grouped;
}

export function TieredLeaderboard({ teams, onEdit, onDelete, isAdmin = false }: TieredLeaderboardProps) {
  const [openBuckets, setOpenBuckets] = useState<Set<string>>(new Set(BUCKETS.map(b => b.id)));
  
  const groupedTeams = groupTeamsByBucket(teams);
  
  const toggleBucket = (bucketId: string) => {
    setOpenBuckets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bucketId)) {
        newSet.delete(bucketId);
      } else {
        newSet.add(bucketId);
      }
      return newSet;
    });
  };

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
    <div className="space-y-4 animate-fade-in">
      {BUCKETS.map((bucket, bucketIndex) => {
        const bucketTeams = groupedTeams.get(bucket.id) || [];
        const isOpen = openBuckets.has(bucket.id);
        
        return (
          <Collapsible
            key={bucket.id}
            open={isOpen}
            onOpenChange={() => toggleBucket(bucket.id)}
            className="animate-fade-in-up"
            style={{ animationDelay: `${bucketIndex * 100}ms` }}
          >
            <div
              className={cn(
                "rounded-sm border backdrop-blur-sm transition-all duration-300",
                bucket.borderColor,
                `bg-gradient-to-r ${bucket.bgGradient}`,
                isOpen && "shadow-lg"
              )}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-t-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-sm bg-black/30", bucket.color)}>
                      {bucket.icon}
                    </div>
                    <div className="text-left">
                      <h3 className={cn("font-display text-xl tracking-wide", bucket.color)}>
                        {bucket.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {bucket.minPoints === 0 && bucket.maxPoints === 2 
                          ? "0-2 points"
                          : bucket.maxPoints === Infinity 
                            ? `${bucket.minPoints}+ points`
                            : `${bucket.minPoints}-${bucket.maxPoints} points`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={cn("font-display", bucket.color, bucket.borderColor)}
                    >
                      {bucketTeams.length} {bucketTeams.length === 1 ? "team" : "teams"}
                    </Badge>
                    {isOpen ? (
                      <ChevronUp className={cn("w-5 h-5 transition-transform", bucket.color)} />
                    ) : (
                      <ChevronDown className={cn("w-5 h-5 transition-transform", bucket.color)} />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 pt-0">
                  {bucketTeams.length > 0 ? (
                    <BucketTeamList 
                      teams={bucketTeams} 
                      bucket={bucket}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isAdmin={isAdmin}
                    />
                  ) : (
                    <div className="text-center py-6 text-muted-foreground/60 text-sm">
                      No teams in this tier yet
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}

interface BucketTeamListProps {
  teams: Team[];
  bucket: Bucket;
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

function BucketTeamList({ teams, bucket, onEdit, onDelete, isAdmin = false }: BucketTeamListProps) {
  return (
    <div className="space-y-2">
      {teams.map((team, index) => {
        const winRate = team.wins + team.losses > 0 
          ? ((team.wins / (team.wins + team.losses)) * 100).toFixed(0) 
          : "0";
        
        return (
          <div
            key={team.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border/30",
              "transition-all duration-300 hover:bg-black/30 hover:border-border/50 group",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className={cn("font-display text-lg w-8 text-center", bucket.color)}>
                #{index + 1}
              </span>
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
              <div>
                <p className="font-display text-lg text-foreground tracking-wide transition-all duration-300 group-hover:text-primary">
                  {team.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {team.wins}W - {team.losses}L • {winRate}% WR
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={cn("font-display text-2xl", bucket.color)}>
                  {team.points}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(team)}
                    className="p-2 hover:bg-neon-cyan/20 hover:text-neon-cyan rounded-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(team.id)}
                    className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
