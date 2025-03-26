
import React, { useState, useEffect } from 'react';
import { ButtonGlow } from '../ui/button-glow';
import { Shield, Search, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const scanSteps = [
  { name: 'Initializing scan engine', duration: 1500 },
  { name: 'Analyzing system files', duration: 2000 },
  { name: 'Scanning for vulnerabilities', duration: 2200 },
  { name: 'Checking network connections', duration: 1800 },
  { name: 'Examining application permissions', duration: 1600 },
  { name: 'Finalizing scan results', duration: 1200 }
];

const threatLevels = [
  { level: 'Safe', count: 4, color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
  { level: 'Suspicious', count: 1, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertTriangle },
  { level: 'Critical', count: 0, color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle }
];

const ScanAnimation = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  const startScan = () => {
    setIsScanning(true);
    setCurrentStep(0);
    setProgress(0);
    setScanComplete(false);
    
    // Progress animation
    const totalDuration = scanSteps.reduce((acc, step) => acc + step.duration, 0);
    const interval = 30; // Update every 30ms
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(newProgress);
      
      // Update current step
      let stepDuration = 0;
      for (let i = 0; i < scanSteps.length; i++) {
        stepDuration += scanSteps[i].duration;
        if (elapsed <= stepDuration) {
          setCurrentStep(i);
          break;
        }
      }
      
      if (newProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setScanComplete(true);
        }, 500);
      }
    }, interval);
  };
  
  return (
    <section className="py-20 relative bg-cyber-muted overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience <span className="cyber-text-gradient">Real-Time</span> Scanning
          </h2>
          <p className="text-cyber-foreground/70">
            Our advanced scanning technology provides immediate threat detection and comprehensive system analysis to keep you protected.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-cyber-background rounded-xl border border-cyber-border p-6 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 cyber-dots opacity-20 z-0"></div>
          
          <div className="relative z-10">
            {/* Scan header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-cyber-primary/10 mr-3">
                  <Shield className="h-6 w-6 text-cyber-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-cyber-foreground">System Scan</h3>
                  <p className="text-sm text-cyber-foreground/70">
                    {scanComplete 
                      ? "Scan complete. System protected." 
                      : isScanning 
                        ? `${scanSteps[currentStep].name}...` 
                        : "Ready to scan your system"
                    }
                  </p>
                </div>
              </div>
              
              <ButtonGlow
                onClick={startScan}
                disabled={isScanning && !scanComplete}
                animation={isScanning && !scanComplete ? "pulse" : "none"}
              >
                {isScanning && !scanComplete ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : scanComplete ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Scan Again
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </ButtonGlow>
            </div>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${scanComplete ? 'bg-cyber-secondary' : 'bg-cyber-primary'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-cyber-foreground/70">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
            
            {/* Scan animation area */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left side - Scan visualization */}
              <div className="bg-cyber-muted/30 rounded-lg border border-cyber-border p-4 h-64 relative overflow-hidden">
                {isScanning && !scanComplete && (
                  <div className="scan-line"></div>
                )}
                
                <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full w-full">
                  {[...Array(64)].map((_, i) => (
                    <div 
                      key={i}
                      className={`rounded-sm transition-colors duration-300 ${
                        scanComplete 
                          ? i % 9 === 0 
                            ? 'bg-yellow-500/20' 
                            : 'bg-cyber-primary/20' 
                          : isScanning 
                            ? i <= (progress / 100) * 64 
                              ? 'bg-cyber-primary/40' 
                              : 'bg-cyber-background/40' 
                            : 'bg-cyber-background/40'
                      }`}
                      style={{ 
                        animationDelay: `${i * 0.02}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Right side - Scan details */}
              <div className="bg-cyber-muted/30 rounded-lg border border-cyber-border p-4 h-64 flex flex-col">
                <h4 className="text-sm font-medium text-cyber-foreground/80 mb-3">Scan Details</h4>
                
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-cyber-border">
                  {scanSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`py-2 px-3 rounded text-sm transition-all duration-300 ${
                        isScanning && index === currentStep
                          ? 'bg-cyber-primary/10 border border-cyber-primary/30'
                          : (isScanning || scanComplete) && index < currentStep
                            ? 'bg-cyber-muted/30 border border-cyber-border'
                            : 'bg-cyber-background/30 border border-cyber-border/50'
                      }`}
                    >
                      <div className="flex items-center">
                        {isScanning && index === currentStep ? (
                          <Loader2 className="h-4 w-4 mr-2 text-cyber-primary animate-spin" />
                        ) : (isScanning || scanComplete) && index < currentStep ? (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-cyber-primary" />
                        ) : (
                          <div className="h-4 w-4 mr-2 rounded-full border border-cyber-border/50" />
                        )}
                        <span className={
                          isScanning && index === currentStep
                            ? 'text-cyber-primary'
                            : 'text-cyber-foreground/70'
                        }>
                          {step.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {scanComplete && (
                  <div className="border-t border-cyber-border pt-3">
                    <div className="text-sm font-medium text-cyber-foreground/80 mb-2">Results Summary</div>
                    <div className="flex space-x-2">
                      {threatLevels.map((threat, index) => {
                        const Icon = threat.icon;
                        return (
                          <div key={index} className={`flex-1 rounded p-2 ${threat.bg} flex items-center`}>
                            <Icon className={`h-4 w-4 mr-1 ${threat.color}`} />
                            <div>
                              <div className={`text-xs font-medium ${threat.color}`}>{threat.level}</div>
                              <div className="text-xs text-cyber-foreground/70">{threat.count}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* System status */}
            <div className={`rounded-lg border p-3 transition-all duration-500 ${
              scanComplete 
                ? 'border-green-500/30 bg-green-500/5' 
                : 'border-cyber-border bg-cyber-muted/20'
            }`}>
              <div className="flex items-center">
                {scanComplete ? (
                  <div className="p-1 rounded-full bg-green-500/10 mr-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-cyber-primary/10 mr-2">
                    <Shield className="h-5 w-5 text-cyber-primary" />
                  </div>
                )}
                <div>
                  <h4 className={`text-sm font-medium ${scanComplete ? 'text-green-500' : 'text-cyber-primary'}`}>
                    {scanComplete ? 'System Protected' : 'System Status'}
                  </h4>
                  <p className="text-xs text-cyber-foreground/70">
                    {scanComplete 
                      ? 'Your system is secure. 1 suspicious item quarantined.' 
                      : 'Awaiting scan results...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanAnimation;
