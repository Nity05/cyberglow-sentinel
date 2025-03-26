
import React from 'react';
import { GlowCard } from '../ui/glow-card';
import { ShieldCheck, Zap, Cloud, Smartphone, Database, Lock } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-cyber-primary" />,
    title: "Advanced Threat Detection",
    description: "AI-powered detection identifies zero-day exploits and emerging malware patterns before they can do harm."
  },
  {
    icon: <Zap className="h-10 w-10 text-cyber-primary" />,
    title: "Real-Time Protection",
    description: "Continuous scanning with minimal system impact, keeping you protected without slowing you down."
  },
  {
    icon: <Cloud className="h-10 w-10 text-cyber-primary" />,
    title: "Cloud Integration",
    description: "Sync your security settings across devices with secure cloud backup and remote scanning capabilities."
  },
  {
    icon: <Smartphone className="h-10 w-10 text-cyber-primary" />,
    title: "Cross-Platform Security",
    description: "Protect all your devices with a single solution that works across desktops, laptops, and mobile devices."
  },
  {
    icon: <Database className="h-10 w-10 text-cyber-primary" />,
    title: "Behavioral Analysis",
    description: "Monitors application behavior to detect suspicious activities and prevent ransomware encryption."
  },
  {
    icon: <Lock className="h-10 w-10 text-cyber-primary" />,
    title: "Secure Vault",
    description: "Keep your sensitive data encrypted and password-protected with our secure digital vault."
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-cyber-background">
      <div className="absolute inset-0 bg-cyber-background cyber-dots opacity-30 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Next-Generation <span className="cyber-text-gradient">Protection</span>
          </h2>
          <p className="text-cyber-foreground/70">
            Our AI-powered security suite provides comprehensive protection against evolving cyber threats,
            keeping your digital life secure with cutting-edge technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlowCard 
              key={index} 
              className="h-full flex flex-col items-start"
              variant="glass"
              animation="glow"
            >
              <div className="p-3 rounded-full bg-cyber-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cyber-foreground">{feature.title}</h3>
              <p className="text-cyber-foreground/70">{feature.description}</p>
              
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-cyber-primary/20 flex items-center justify-center opacity-20">
                <div className="w-6 h-6 rounded-full border border-cyber-primary/40"></div>
              </div>
              
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

export default FeatureSection;
