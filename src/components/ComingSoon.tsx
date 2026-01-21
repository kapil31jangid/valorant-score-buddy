import { Clock, Trophy, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export function ComingSoon() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Glowing icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
          </div>
          <div className="relative w-24 h-24 mx-auto bg-card/50 backdrop-blur-sm border border-primary/50 rounded-lg flex items-center justify-center clip-angle hover-glow-red">
            <Clock className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          <span className="text-glow-red text-valorant-red">COMING</span>
          <br />
          <span className="text-foreground">SOON</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-8 font-body">
          The tournament scoreboard is not yet active. Stay tuned for live updates, team standings, and match results!
        </p>

        {/* Stats preview */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="w-5 h-5 text-rank-gold" />
            <span className="font-display text-sm uppercase tracking-wider">Rankings</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gamepad2 className="w-5 h-5 text-neon-cyan" />
            <span className="font-display text-sm uppercase tracking-wider">Matches</span>
          </div>
        </div>

        {/* Back button */}
        <Link to="/">
          <Button
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 font-display uppercase tracking-wider"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
