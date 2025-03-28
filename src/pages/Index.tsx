
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import ScanAnimation from '@/components/home/ScanAnimation';
import StatsSection from '@/components/home/StatsSection';
import { Shield, ArrowRight } from 'lucide-react';
import { ButtonGlow } from '@/components/ui/button-glow';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeatureSection />
        <ScanAnimation />
        <StatsSection />
        
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 cyber-dots opacity-20 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto glass-card rounded-2xl border border-cyber-blue/20 p-8 md:p-12 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyber-blue opacity-10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">Secure</span> Your System?
                  </h2>
                  <p className="text-cyber-foreground/70 mb-6">
                    Get started with our advanced security solution today and experience the peace of mind 
                    that comes with real-time AI-powered protection.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <ButtonGlow animation="pulse" size="lg" className="neon-button group">
                      <Shield className="mr-2 h-5 w-5" />
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </ButtonGlow>
                    <ButtonGlow variant="outline" size="lg" className="neon-button">
                      Learn More
                    </ButtonGlow>
                  </div>
                </div>
                
                <div className="w-56 h-56 relative">
                  <div className="absolute inset-0 rounded-full border border-cyber-blue animate-pulse opacity-20"></div>
                  <div className="absolute inset-2 rounded-full border border-cyber-blue animate-pulse opacity-30" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute inset-4 rounded-full border border-cyber-blue animate-pulse opacity-40" style={{animationDelay: '0.4s'}}></div>
                  <div className="w-full h-full rounded-full bg-cyber-blue/10 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-cyber-blue" />
                  </div>
                </div>
              </div>
              
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div className="glow-line-horizontal"></div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="bg-cyber-dark-blue py-10 border-t border-cyber-blue/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 text-cyber-blue font-bold text-xl mb-4 md:mb-0">
                <Shield className="h-5 w-5" />
                <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">CyberGlow Sentinel</span>
              </div>
              
              <div className="text-sm text-cyber-foreground/70">
                &copy; 2023 CyberGlow Sentinel. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
