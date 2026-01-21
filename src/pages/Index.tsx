import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Swords, Target, ExternalLink, MapPin, Calendar } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import valorantAgents from "@/assets/valorant-agents-lineup.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="absolute top-4 left-4 z-20">
          <Button 
            onClick={() => navigate('/scoreboard')}
            variant="outline"
            size="sm"
            className="border-valorant-red/50 text-valorant-red hover:bg-valorant-red/10 font-display text-xs"
          >
            <Trophy className="w-3 h-3 mr-1" />
            SCOREBOARD
          </Button>
        </nav>

        {/* Hero Section */}
        <header className="pt-8 pb-4 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-valorant-red/20 border border-valorant-red/30 mb-6">
              <Target className="w-4 h-4 text-valorant-red" />
              <span className="text-sm font-display text-valorant-red tracking-wider uppercase">
                Tournament Hub
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-tight">
              <span className="text-glow-red text-valorant-red">VALORANT</span>
              <br />
              <span className="text-foreground">ESPORTS</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 font-body">
              Track your tournament standings, view match history, and compete for glory
            </p>

            {/* Venue & Time Details */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3">
                <MapPin className="w-5 h-5 text-valorant-red" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Venue</p>
                  <p className="text-sm font-display text-foreground">Silver Oak University</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3">
                <Calendar className="w-5 h-5 text-neon-cyan" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Date & Time</p>
                  <p className="text-sm font-display text-foreground">29 January 2026</p>
                </div>
              </div>
            </div>
            
            <Button 
              asChild
              size="lg"
              className="bg-valorant-red hover:bg-valorant-red/90 text-white font-display text-lg px-8 py-6 clip-angle hover-glow-red transition-all duration-300 group"
            >
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfBNQ4XFBX1p1FYLY5k-tLMZuRXc7me05Jwd2xXjLyKHcEyFA/viewform" target="_blank" rel="noopener noreferrer">
                <Swords className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                REGISTER NOW
                <ExternalLink className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
              </a>
            </Button>
          </div>
        </header>

        {/* Agents Section */}
        <main className="flex-1 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-border/50 hover:border-valorant-red/50 transition-all duration-500 hover-glow-red">
              <img 
                src={valorantAgents} 
                alt="Valorant Agents Lineup"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-border/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-body">
              © 2026 Valorant Esports Tournament
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground/60 font-display tracking-wider uppercase">
                Powered by Lovable
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
