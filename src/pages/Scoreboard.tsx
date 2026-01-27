import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trophy, Users, Gamepad2, Shield, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TieredLeaderboard } from "@/components/TieredLeaderboard";
import { TeamFormDialog } from "@/components/TeamFormDialog";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MatchHistory } from "@/components/MatchHistory";
import { ComingSoon } from "@/components/ComingSoon";
import { useTeams, Team } from "@/hooks/useTeams";
import { useMatches } from "@/hooks/useMatches";
import { useAuth } from "@/hooks/useAuth";
import { useEventSettings } from "@/hooks/useEventSettings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { teams, loading, addTeam, updateTeam, deleteTeam } = useTeams();
  const { matches, loading: matchesLoading, addMatch, deleteMatch } = useMatches();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const { isEventActive, loading: eventLoading, toggleEventStatus } = useEventSettings();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTeam(deleteId);
      setDeleteId(null);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const handleToggleEvent = async () => {
    const { error } = await toggleEventStatus();
    if (error) {
      toast({
        title: "Error updating event status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: isEventActive ? "Scoreboard hidden" : "Scoreboard visible",
        description: isEventActive 
          ? "The scoreboard is now hidden from viewers." 
          : "The scoreboard is now visible to everyone.",
      });
    }
  };

  // Show coming soon for non-admins when event is not active
  if (!eventLoading && !isEventActive && !isAdmin) {
    return <ComingSoon />;
  }

  const handleFormSubmit = async (data: any) => {
    if (data.id) {
      await updateTeam(data.id, {
        name: data.name,
        logo_url: data.logo_url || null,
        wins: data.wins,
        losses: data.losses,
        points: data.points,
      });
    } else {
      await addTeam({
        name: data.name,
        logo_url: data.logo_url || null,
        wins: data.wins,
        losses: data.losses,
        points: data.points,
      });
    }
    setEditingTeam(null);
  };

  const totalTeams = teams.length;
  const totalMatches = teams.reduce((acc, t) => acc + t.wins + t.losses, 0) / 2;
  const topTeam = teams.length > 0 
    ? [...teams].sort((a, b) => b.points - a.points)[0]?.name 
    : "—";

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Admin bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {!authLoading && (
            <>
              {user && isAdmin ? (
                <div className="flex items-center gap-2">
                  {/* Event visibility toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleEvent}
                    className={`text-xs font-display uppercase tracking-wider ${
                      isEventActive 
                        ? "border-green-500/50 text-green-500 hover:bg-green-500/10" 
                        : "border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                    }`}
                  >
                    {isEventActive ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hidden
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-sm px-3 py-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-xs font-display uppercase tracking-wider text-primary">Admin</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-xs font-display uppercase tracking-wider hover:bg-destructive/20 hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-display uppercase tracking-wider hover:bg-primary/20 hover:text-primary"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col items-center text-center mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary clip-angle flex items-center justify-center animate-neon-pulse">
                <Gamepad2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 
                className="font-display text-4xl md:text-5xl font-bold tracking-wider text-glow-red glitch-text" 
                data-text="VALORANT"
              >
                VALORANT
              </h1>
            </div>
            <p className="font-display text-xl md:text-2xl text-muted-foreground tracking-[0.3em] uppercase animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Tournament Scoreboard
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle hover-glow-cyan transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-neon-cyan" />
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
                    Teams
                  </p>
                  <p className="font-display text-3xl text-neon-cyan text-glow-cyan">
                    {totalTeams}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle hover-glow-red transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
                    Matches Played
                  </p>
                  <p className="font-display text-3xl text-primary text-glow-red">
                    {Math.floor(totalMatches)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle hover-glow-red transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-rank-gold animate-pulse-glow" />
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
                    Leading Team
                  </p>
                  <p className="font-display text-xl text-rank-gold truncate max-w-[120px]">
                    {topTeam}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl tracking-wider text-foreground">
              Team Standings
            </h2>
          <p className="text-muted-foreground text-sm">
              Live tournament rankings • Auto-updates in real-time
              {!isAdmin && " • View only mode"}
            </p>
          </div>

          {isAdmin && (
            <Button
              onClick={() => {
                setEditingTeam(null);
                setFormOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 font-display uppercase tracking-wider clip-angle-sm animate-neon-pulse hover:animate-none transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-glow">
              <Gamepad2 className="w-16 h-16 text-primary" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <TieredLeaderboard
              teams={teams}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
            
            <MatchHistory
              matches={matches}
              teams={teams}
              loading={matchesLoading}
              isAdmin={isAdmin}
              onAddMatch={addMatch}
              onDeleteMatch={deleteMatch}
            />
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <TeamFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTeam(null);
        }}
        team={editingTeam}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-destructive/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Remove Team?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The team will be permanently removed
              from the tournament.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-display uppercase tracking-wider">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 font-display uppercase tracking-wider"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
