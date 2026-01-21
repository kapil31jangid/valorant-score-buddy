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
                  <p className="text-sm font-display text-foreground">29 January 2026 • 11:00 AM ONWARDS</p>
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
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://discord.gg/your-server" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-[#5865F2] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span className="text-xs font-display uppercase tracking-wider">Discord</span>
              </a>
              
              <a 
                href="https://instagram.com/your-account" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-[#E4405F] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <span className="text-xs font-display uppercase tracking-wider">Instagram</span>
              </a>
            </div>
            
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
