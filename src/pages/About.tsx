
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlowCard } from '@/components/ui/glow-card';
import { Shield, Zap, Code, Database, Users } from 'lucide-react';
import { ButtonGlow } from '@/components/ui/button-glow';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    year: '2019',
    title: 'Research Begins',
    description: 'Our team of cybersecurity experts began researching AI applications in malware detection.',
    icon: <Code />
  },
  {
    year: '2020',
    title: 'First Prototype',
    description: 'Developed a prototype AI system capable of detecting known malware patterns with 87% accuracy.',
    icon: <Zap />
  },
  {
    year: '2021',
    title: 'Machine Learning Integration',
    description: 'Integrated advanced machine learning algorithms to detect previously unknown malware variants.',
    icon: <Database />
  },
  {
    year: '2022',
    title: 'Beta Release',
    description: 'Released our beta version to security researchers and received critical feedback for improvement.',
    icon: <Users />
  },
  {
    year: '2023',
    title: 'CyberGlow Sentinel Launch',
    description: 'Officially launched CyberGlow Sentinel with real-time protection and cloud integration.',
    icon: <Shield />
  }
];

const teamMembers = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief AI Scientist',
    bio: 'Ph.D. in Computer Science with 10+ years of experience in machine learning and cybersecurity.',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    name: 'Alex Rodriguez',
    role: 'Lead Security Engineer',
    bio: 'Former security consultant for Fortune 500 companies specializing in threat detection.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Mia Johnson',
    role: 'Software Architect',
    bio: 'Full-stack developer with expertise in building scalable security applications and systems.',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    name: 'James Wilson',
    role: 'Threat Intelligence Lead',
    bio: 'Former intelligence analyst with expertise in tracking emerging cyber threats and attack vectors.',
    photo: 'https://randomuser.me/api/portraits/men/62.jpg'
  }
];

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    if (timelineItems) {
      timelineItems.forEach((item) => {
        observer.observe(item);
      });
    }
    
    return () => {
      if (timelineItems) {
        timelineItems.forEach((item) => {
          observer.unobserve(item);
        });
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            About <span className="cyber-text-gradient">CyberGlow</span>
          </h1>
          <p className="text-cyber-foreground/70 mb-10 max-w-2xl">
            We're building the next generation of AI-powered security tools to protect individuals and organizations from evolving cyber threats.
          </p>
          
          {/* Mission Statement */}
          <GlowCard variant="glass" animation="glow" className="mb-16">
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-cyber-foreground/80 mb-4">
                  At CyberGlow, we believe that advanced security should be accessible to everyone. Our mission is to harness the power of artificial intelligence to create intuitive, powerful cybersecurity tools that protect users against both known and emerging threats.
                </p>
                <p className="text-cyber-foreground/80 mb-4">
                  We're committed to staying at the forefront of threat intelligence, constantly evolving our detection algorithms to counter the latest attack vectors and zero-day exploits before they can cause harm.
                </p>
                <ButtonGlow className="mt-2">
                  <Shield className="mr-2 h-4 w-4" />
                  Join Our Mission
                </ButtonGlow>
              </div>
              
              <div className="md:w-1/2 md:pl-10 flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Animated concentric circles */}
                  <div className="absolute inset-0 rounded-full border border-cyber-primary animate-pulse opacity-20"></div>
                  <div className="absolute inset-8 rounded-full border border-cyber-primary animate-pulse opacity-30" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute inset-16 rounded-full border border-cyber-primary animate-pulse opacity-40" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute inset-24 rounded-full border border-cyber-primary animate-pulse opacity-50" style={{animationDelay: '0.6s'}}></div>
                  
                  {/* Center shield */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-cyber-primary" />
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>
          
          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
            
            <div className="relative" ref={timelineRef}>
              {/* Center line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-cyber-border"></div>
              
              {timelineEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "timeline-item relative mb-12 opacity-0 transition-opacity duration-500",
                    index % 2 === 0 ? "md:pl-1/2" : "md:pr-1/2 md:text-right md:flex md:flex-row-reverse"
                  )}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10">
                    <div className="w-12 h-12 rounded-full bg-cyber-primary flex items-center justify-center">
                      {React.cloneElement(event.icon, { className: "h-6 w-6 text-cyber-background" })}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div 
                    className={cn(
                      "bg-cyber-muted relative border border-cyber-border rounded-lg p-6 md:w-[calc(100%-40px)] ml-auto mr-auto",
                      index % 2 === 0 ? "md:ml-10" : "md:mr-10"
                    )}
                  >
                    <div className="absolute top-6 h-0.5 w-10 bg-cyber-border hidden md:block" 
                      style={{
                        [index % 2 === 0 ? 'left' : 'right']: '-10px',
                      }}
                    ></div>
                    
                    <span className="inline-block px-3 py-1 rounded-full bg-cyber-primary/20 text-cyber-primary text-sm mb-2">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-cyber-foreground/70">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Team Section */}
          <h2 className="text-2xl font-bold mb-8 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {teamMembers.map((member, index) => (
              <GlowCard 
                key={index} 
                variant="glass" 
                animation="glow" 
                className="team-card overflow-hidden transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-muted via-transparent to-transparent"></div>
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full aspect-square object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-cyber-primary mb-3 text-sm">{member.role}</p>
                <p className="text-cyber-foreground/70 text-sm">{member.bio}</p>
                
                {/* Bottom glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                  <div className="glow-line-horizontal"></div>
                </div>
              </GlowCard>
            ))}
          </div>
          
          {/* Technology Stack */}
          <h2 className="text-2xl font-bold mb-8 text-center">Our Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Advanced Neural Networks",
                description: "Our AI engine uses multi-layered neural networks trained on millions of malware samples to identify both known and zero-day threats.",
                icon: <Database className="h-10 w-10 text-cyber-primary" />
              },
              {
                title: "Behavioral Analysis",
                description: "Beyond signature-based detection, we monitor system behavior to identify suspicious activities and prevent ransomware encryption.",
                icon: <Zap className="h-10 w-10 text-cyber-primary" />
              },
              {
                title: "Cloud Intelligence",
                description: "Our systems connect to a global threat intelligence network that shares and analyzes new threats in real-time.",
                icon: <Shield className="h-10 w-10 text-cyber-primary" />
              }
            ].map((tech, index) => (
              <GlowCard key={index} variant="glass" animation="none" className="h-full">
                <div className="p-3 rounded-full bg-cyber-primary/10 mb-4 inline-block">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                <p className="text-cyber-foreground/70">{tech.description}</p>
              </GlowCard>
            ))}
          </div>
          
          {/* Contact Section */}
          <GlowCard variant="glass" animation="glow" className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Join the Cybersecurity Revolution</h2>
            <p className="text-cyber-foreground/80 mb-6 max-w-2xl mx-auto">
              Whether you're looking to protect your personal devices or secure your organization's infrastructure, 
              CyberGlow Sentinel provides the advanced AI protection you need in today's threat landscape.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonGlow animation="pulse" size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Get Started Today
              </ButtonGlow>
              <ButtonGlow variant="outline" size="lg">
                Contact Us
              </ButtonGlow>
            </div>
          </GlowCard>
        </div>
      </main>
    </div>
  );
};

export default About;
