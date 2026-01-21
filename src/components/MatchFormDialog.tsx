import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Team } from '@/hooks/useTeams';
import { MatchInsert } from '@/hooks/useMatches';

const VALORANT_MAPS = [
  'Ascent',
  'Bind',
  'Breeze',
  'Fracture',
  'Haven',
  'Icebox',
  'Lotus',
  'Pearl',
  'Split',
  'Sunset',
  'Abyss',
];

interface MatchFormDialogProps {
  teams: Team[];
  onSubmit: (match: MatchInsert) => Promise<boolean>;
}

export function MatchFormDialog({ teams, onSubmit }: MatchFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [mapName, setMapName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTeam1Id('');
    setTeam2Id('');
    setTeam1Score('');
    setTeam2Score('');
    setMapName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Id || !team2Id || team1Score === '' || team2Score === '') return;

    setIsSubmitting(true);
    const success = await onSubmit({
      team1_id: team1Id,
      team2_id: team2Id,
      team1_score: parseInt(team1Score, 10),
      team2_score: parseInt(team2Score, 10),
      map_name: mapName || undefined,
    });

    if (success) {
      resetForm();
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  const availableTeam2 = teams.filter((t) => t.id !== team1Id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground 
                     hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 animate-fade-in-up"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Match
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Record Match Result
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1</Label>
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team2">Team 2</Label>
              <Select value={team2Id} onValueChange={setTeam2Id} disabled={!team1Id}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeam2.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team1Score">Team 1 Score</Label>
              <Input
                id="team1Score"
                type="number"
                min="0"
                max="99"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                className="bg-background/50 border-primary/30"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team2Score">Team 2 Score</Label>
              <Input
                id="team2Score"
                type="number"
                min="0"
                max="99"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                className="bg-background/50 border-primary/30"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="map">Map</Label>
            <Select value={mapName} onValueChange={setMapName}>
              <SelectTrigger className="bg-background/50 border-primary/30">
                <SelectValue placeholder="Select map (optional)" />
              </SelectTrigger>
              <SelectContent>
                {VALORANT_MAPS.map((map) => (
                  <SelectItem key={map} value={map}>
                    {map}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={!team1Id || !team2Id || team1Score === '' || team2Score === '' || isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isSubmitting ? 'Recording...' : 'Record Match'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
