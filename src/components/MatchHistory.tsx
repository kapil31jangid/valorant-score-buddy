import { Match } from '@/hooks/useMatches';
import { Team } from '@/hooks/useTeams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Calendar, Swords } from 'lucide-react';
import { format } from 'date-fns';
import { MatchFormDialog } from './MatchFormDialog';
import { MatchInsert } from '@/hooks/useMatches';

interface MatchHistoryProps {
  matches: Match[];
  teams: Team[];
  loading: boolean;
  isAdmin: boolean;
  onAddMatch: (match: MatchInsert) => Promise<boolean>;
  onDeleteMatch: (id: string) => Promise<boolean>;
}

export function MatchHistory({
  matches,
  teams,
  loading,
  isAdmin,
  onAddMatch,
  onDeleteMatch,
}: MatchHistoryProps) {
  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 animate-pulse">
        <CardHeader>
          <CardTitle className="text-foreground">Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Loading matches...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary animate-neon-pulse" />
          Match History
        </CardTitle>
        {isAdmin && <MatchFormDialog teams={teams} onSubmit={onAddMatch} />}
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No matches recorded yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="group relative bg-background/50 rounded-lg p-4 border border-primary/10 
                           hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Team 1 */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="font-semibold text-foreground truncate">
                        {match.team1?.name || 'Unknown'}
                      </span>
                      {match.team1?.logo_url && (
                        <img
                          src={match.team1.logo_url}
                          alt={match.team1.name}
                          className="w-8 h-8 rounded-full object-cover border border-primary/20"
                        />
                      )}
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 px-4">
                      <span
                        className={`text-2xl font-bold ${
                          match.team1_score > match.team2_score
                            ? 'text-green-400'
                            : match.team1_score < match.team2_score
                            ? 'text-red-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {match.team1_score}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span
                        className={`text-2xl font-bold ${
                          match.team2_score > match.team1_score
                            ? 'text-green-400'
                            : match.team2_score < match.team1_score
                            ? 'text-red-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {match.team2_score}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-2 flex-1">
                      {match.team2?.logo_url && (
                        <img
                          src={match.team2.logo_url}
                          alt={match.team2.name}
                          className="w-8 h-8 rounded-full object-cover border border-primary/20"
                        />
                      )}
                      <span className="font-semibold text-foreground truncate">
                        {match.team2?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 ml-4 text-sm text-muted-foreground">
                    {match.map_name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{match.map_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(match.played_at), 'MMM d, yyyy')}</span>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteMatch(match.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 
                                   text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
