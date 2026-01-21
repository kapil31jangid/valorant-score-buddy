import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Swords, Target } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const agents = [
  {
    name: "Jett",
    role: "Duelist",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt62014548e4b5da4b/5eb7cdc17bedc8627f13e4a5/V_AGENTS_587x900_Jett.png",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Phoenix",
    role: "Duelist",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf0200e1821b5b39f/5eb7cdc1b3eb2e6288a66060/V_AGENTS_587x900_phx.png",
    color: "from-orange-400 to-red-500",
  },
  {
    name: "Sage",
    role: "Sentinel",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7d61555dce4a8493/5eb7cdc1dcbe4e2035b5236a/V_AGENTS_587x900_sage.png",
    color: "from-teal-400 to-emerald-500",
  },
  {
    name: "Reyna",
    role: "Duelist",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0eb92b497e1c8fff/5edb2e01ea19c13a5b0ec9e3/V_AGENTS_587x900_Reyna.png",
    color: "from-purple-400 to-pink-500",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
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
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
              Track your tournament standings, view match history, and compete for glory
            </p>
            
            <Button 
              onClick={() => navigate('/scoreboard')}
              size="lg"
              className="bg-valorant-red hover:bg-valorant-red/90 text-white font-display text-lg px-8 py-6 clip-angle hover-glow-red transition-all duration-300 group"
            >
              <Trophy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              VIEW SCOREBOARD
              <Swords className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </header>

        {/* Agents Section */}
        <main className="flex-1 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-2xl md:text-3xl font-display font-bold text-foreground mb-2 tracking-wide">
              SELECT YOUR AGENT
            </h2>
            <p className="text-center text-muted-foreground mb-12 font-body">
              Choose wisely. Your team depends on it.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {agents.map((agent, index) => (
                <div 
                  key={agent.name}
                  className={`group relative stagger-${index + 1}`}
                >
                  {/* Card */}
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden hover:border-valorant-red/50 transition-all duration-500 hover:scale-105 hover-glow-red">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${agent.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    {/* Agent image */}
                    <div className="relative h-48 md:h-64 overflow-hidden">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Scanline effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90" />
                    </div>
                    
                    {/* Agent info */}
                    <div className="relative p-4 text-center">
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-valorant-red transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body uppercase tracking-wider">
                        {agent.role}
                      </p>
                    </div>
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-valorant-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-valorant-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
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
