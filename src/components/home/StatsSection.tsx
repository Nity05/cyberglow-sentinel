
import React from 'react';
import { GlowCard } from '../ui/glow-card';
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Settings 
} from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-cyber-primary" />,
      value: "99.8%",
      label: "Detection Rate",
      description: "Industry-leading threat detection"
    },
    {
      icon: <Lock className="h-6 w-6 text-cyber-primary" />,
      value: "10M+",
      label: "Threats Blocked",
      description: "Protecting users worldwide"
    },
    {
      icon: <Clock className="h-6 w-6 text-cyber-primary" />,
      value: "24/7",
      label: "Monitoring",
      description: "Continuous protection"
    },
    {
      icon: <Settings className="h-6 w-6 text-cyber-primary" />,
      value: "<1%",
      label: "System Impact",
      description: "Lightweight protection"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-cyber-background">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-primary/5 to-transparent z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Security <span className="cyber-text-gradient">By The Numbers</span>
          </h2>
          <p className="text-cyber-foreground/70">
            Our platform delivers exceptional protection with minimal system impact, 
            keeping you safe without slowing you down.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <GlowCard 
              key={index}
              className="text-center py-8"
              animation="glow"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyber-primary/10 mb-4">
                {stat.icon}
              </div>
              
              <div className="cyber-text-gradient text-4xl font-bold mb-2">
                {stat.value}
              </div>
              
              <h3 className="text-lg font-medium text-cyber-foreground mb-1">{stat.label}</h3>
              <p className="text-sm text-cyber-foreground/70">{stat.description}</p>
              
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div className="glow-line-horizontal"></div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
