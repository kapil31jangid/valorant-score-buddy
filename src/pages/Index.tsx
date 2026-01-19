import { useState } from "react";
import { Plus, Trophy, Users, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamTable } from "@/components/TeamTable";
import { TeamFormDialog } from "@/components/TeamFormDialog";
import { useTeams } from "@/hooks/useTeams";
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

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  wins: number;
  losses: number;
  points: number;
}

const Index = () => {
  const { teams, loading, addTeam, updateTeam, deleteTeam } = useTeams();
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
    <div className="min-h-screen bg-background bg-grid">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary clip-angle flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider text-glow-red">
                VALORANT
              </h1>
            </div>
            <p className="font-display text-xl md:text-2xl text-muted-foreground tracking-[0.3em] uppercase">
              Tournament Scoreboard
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle">
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

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle">
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

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-sm p-4 clip-angle">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-rank-gold" />
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
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingTeam(null);
              setFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 font-display uppercase tracking-wider clip-angle-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-glow">
              <Gamepad2 className="w-16 h-16 text-primary" />
            </div>
          </div>
        ) : (
          <TeamTable
            teams={teams}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
