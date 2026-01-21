import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[100px] animate-float-medium" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Geometric shapes */}
      <GeometricShapes />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent h-[200px] animate-scan" />
      </div>
      
      {/* Grid overlay with subtle animation */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.7 ? 'bg-neon-cyan' : 'bg-primary',
  }));

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} animate-float-particle`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: particle.color === 'bg-neon-cyan' 
              ? '0 0 10px hsl(185 100% 50% / 0.8)' 
              : '0 0 10px hsl(355 100% 60% / 0.8)',
          }}
        />
      ))}
    </div>
  );
}

function GeometricShapes() {
  const shapes = [
    { type: 'diamond', x: 10, y: 20, size: 40, delay: 0 },
    { type: 'diamond', x: 85, y: 60, size: 30, delay: 2 },
    { type: 'line', x: 5, y: 40, length: 100, angle: 45, delay: 1 },
    { type: 'line', x: 90, y: 30, length: 80, angle: -30, delay: 3 },
    { type: 'triangle', x: 70, y: 15, size: 50, delay: 1.5 },
    { type: 'triangle', x: 20, y: 75, size: 35, delay: 0.5 },
    { type: 'hexagon', x: 50, y: 85, size: 45, delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className="absolute animate-geometric-float"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animationDelay: `${shape.delay}s`,
          }}
        >
          {shape.type === 'diamond' && (
            <div
              className="border border-primary/20 rotate-45 animate-spin-slow"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === 'line' && (
            <div
              className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-line-extend"
              style={{ 
                width: shape.length, 
                transform: `rotate(${shape.angle}deg)`,
              }}
            />
          )}
          {shape.type === 'triangle' && (
            <div
              className="border-l border-b border-neon-cyan/20 animate-pulse-slow"
              style={{ 
                width: shape.size, 
                height: shape.size,
                transform: 'rotate(-45deg)',
              }}
            />
          )}
          {shape.type === 'hexagon' && (
            <svg
              width={shape.size}
              height={shape.size}
              viewBox="0 0 100 100"
              className="animate-spin-slow opacity-20"
            >
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="hsl(355 100% 60%)"
                strokeWidth="1"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
