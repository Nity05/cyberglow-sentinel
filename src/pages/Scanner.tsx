
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlowCard } from '@/components/ui/glow-card';
import { ButtonGlow } from '@/components/ui/button-glow';
import { Shield, FileSearch, Pause, X, FileText, AlertTriangle, CheckCircle, File } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type ScanStatus = 'idle' | 'scanning' | 'paused' | 'completed';
type ThreatLevel = 'safe' | 'suspicious' | 'critical';

interface ScanResult {
  id: string;
  fileName: string;
  path: string;
  threatLevel: ThreatLevel;
  details: string;
  timestamp: Date;
}

const Scanner = () => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [filesScanned, setFilesScanned] = useState(0);
  const [threatFound, setThreatFound] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    toast({
      title: "Files received",
      description: `Preparing to scan ${files.length} files`,
    });
    startScan('file');
  };
  
  const startScan = (type: 'file' | 'system') => {
    if (scanStatus === 'scanning') return;
    
    setScanStatus('scanning');
    setProgress(0);
    setFilesScanned(0);
    setThreatFound(0);
    
    // Reset results for a new scan
    setResults([]);
    
    // Simulate a scan
    let scanProgress = 0;
    let filesCount = 0;
    let threatCount = 0;
    
    const interval = setInterval(() => {
      scanProgress += type === 'system' ? 0.5 : 2;
      filesCount += type === 'system' ? Math.floor(Math.random() * 10) + 1 : 1;
      
      // Random chance to find threats
      if (Math.random() > 0.9) {
        threatCount += 1;
        
        // Add a fake scan result
        const threatLevel: ThreatLevel = Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'suspicious' : 'safe';
        const newResult: ScanResult = {
          id: Math.random().toString(36).substring(2, 9),
          fileName: `file_${Math.random().toString(36).substring(2, 8)}.${Math.random() > 0.5 ? 'exe' : 'dll'}`,
          path: `/system/${Math.random() > 0.5 ? 'program files' : 'users'}/${Math.random().toString(36).substring(2, 8)}`,
          threatLevel,
          details: threatLevel === 'critical' ? 'Malware detected' : threatLevel === 'suspicious' ? 'Suspicious behavior' : 'Clean file',
          timestamp: new Date()
        };
        
        setResults(prev => [newResult, ...prev]);
        
        if (threatLevel === 'critical') {
          toast({
            title: "Critical Threat Detected!",
            description: `Malware found in ${newResult.fileName}`,
            variant: "destructive"
          });
        }
      }
      
      setProgress(scanProgress);
      setFilesScanned(filesCount);
      setThreatFound(threatCount);
      
      if (scanProgress >= 100) {
        clearInterval(interval);
        setScanStatus('completed');
        toast({
          title: "Scan Complete",
          description: `${filesCount} files scanned, ${threatCount} threats found`,
        });
      }
    }, 200);
    
    // Store the interval so we can clear it if needed
    (window as any).scanInterval = interval;
  };
  
  const pauseScan = () => {
    if (scanStatus !== 'scanning') return;
    
    clearInterval((window as any).scanInterval);
    setScanStatus('paused');
    toast({
      title: "Scan Paused",
      description: "You can resume or cancel the scan",
    });
  };
  
  const resumeScan = () => {
    if (scanStatus !== 'paused') return;
    
    setScanStatus('scanning');
    
    // Continue the scan
    let scanProgress = progress;
    let filesCount = filesScanned;
    let threatCount = threatFound;
    
    const interval = setInterval(() => {
      scanProgress += 1;
      filesCount += Math.floor(Math.random() * 5) + 1;
      
      if (Math.random() > 0.9) {
        threatCount += 1;
        
        // Add a fake scan result
        const threatLevel: ThreatLevel = Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'suspicious' : 'safe';
        const newResult: ScanResult = {
          id: Math.random().toString(36).substring(2, 9),
          fileName: `file_${Math.random().toString(36).substring(2, 8)}.${Math.random() > 0.5 ? 'exe' : 'dll'}`,
          path: `/system/${Math.random() > 0.5 ? 'program files' : 'users'}/${Math.random().toString(36).substring(2, 8)}`,
          threatLevel,
          details: threatLevel === 'critical' ? 'Malware detected' : threatLevel === 'suspicious' ? 'Suspicious behavior' : 'Clean file',
          timestamp: new Date()
        };
        
        setResults(prev => [newResult, ...prev]);
      }
      
      setProgress(scanProgress);
      setFilesScanned(filesCount);
      setThreatFound(threatCount);
      
      if (scanProgress >= 100) {
        clearInterval(interval);
        setScanStatus('completed');
        toast({
          title: "Scan Complete",
          description: `${filesCount} files scanned, ${threatCount} threats found`,
        });
      }
    }, 200);
    
    (window as any).scanInterval = interval;
  };
  
  const cancelScan = () => {
    if (scanStatus === 'idle' || scanStatus === 'completed') return;
    
    clearInterval((window as any).scanInterval);
    setScanStatus('idle');
    setProgress(0);
    toast({
      title: "Scan Cancelled",
      description: "The scan was stopped before completion",
    });
  };
  
  const getThreatIcon = (level: ThreatLevel) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-cyber-destructive" />;
      case 'suspicious':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-cyber-secondary" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            <span className="cyber-text-gradient">AI-Powered</span> Scanner
          </h1>
          <p className="text-cyber-foreground/70 mb-8">
            Upload files or scan your entire system for threats using our advanced AI detection engine
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Upload and Scan */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <GlowCard 
                className="h-full" 
                variant="glass"
                animation={dragActive ? "glow" : "none"}
              >
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center relative",
                    dragActive ? "border-cyber-primary bg-cyber-primary/5" : "border-cyber-border",
                    scanStatus !== 'idle' && "opacity-50 pointer-events-none"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileText className="h-16 w-16 text-cyber-primary/50 mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & Drop Files Here</p>
                  <p className="text-cyber-foreground/60 mb-4">or</p>
                  
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="fileInput">
                    <ButtonGlow animation="pulse" disabled={scanStatus !== 'idle'}>
                      <File className="mr-2 h-5 w-5" />
                      Browse Files
                    </ButtonGlow>
                  </label>
                </div>
              </GlowCard>
              
              {/* System Scan */}
              <GlowCard variant="glass" animation="none">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">System Scan</h3>
                    <p className="text-cyber-foreground/70 text-sm">
                      {scanStatus === 'idle' 
                        ? 'Scan your entire system for malware and vulnerabilities' 
                        : scanStatus === 'scanning'
                        ? 'Scanning in progress...'
                        : scanStatus === 'paused'
                        ? 'Scan paused'
                        : 'Scan completed'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    {scanStatus === 'idle' && (
                      <ButtonGlow onClick={() => startScan('system')} animation="pulse">
                        <Shield className="mr-2 h-5 w-5" />
                        Scan System
                      </ButtonGlow>
                    )}
                    
                    {scanStatus === 'scanning' && (
                      <>
                        <ButtonGlow variant="outline" onClick={pauseScan}>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </ButtonGlow>
                        <ButtonGlow variant="destructive" onClick={cancelScan}>
                          <X className="mr-2 h-5 w-5" />
                          Cancel
                        </ButtonGlow>
                      </>
                    )}
                    
                    {scanStatus === 'paused' && (
                      <>
                        <ButtonGlow onClick={resumeScan} animation="pulse">
                          <Shield className="mr-2 h-5 w-5" />
                          Resume
                        </ButtonGlow>
                        <ButtonGlow variant="destructive" onClick={cancelScan}>
                          <X className="mr-2 h-5 w-5" />
                          Cancel
                        </ButtonGlow>
                      </>
                    )}
                    
                    {scanStatus === 'completed' && (
                      <ButtonGlow onClick={() => startScan('system')} animation="pulse">
                        <Shield className="mr-2 h-5 w-5" />
                        Scan Again
                      </ButtonGlow>
                    )}
                  </div>
                </div>
                
                {scanStatus !== 'idle' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Progress value={progress} className="h-2 bg-cyber-muted" />
                      <div 
                        className="absolute top-0 h-2 bg-cyber-primary/20 animate-pulse-neon rounded-full"
                        style={{ width: `${Math.min(progress + 10, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-cyber-muted/30 p-3 rounded border border-cyber-border">
                        <p className="text-cyber-primary text-xl font-bold">{progress.toFixed(0)}%</p>
                        <p className="text-xs text-cyber-foreground/70">Completed</p>
                      </div>
                      <div className="bg-cyber-muted/30 p-3 rounded border border-cyber-border">
                        <p className="text-cyber-secondary text-xl font-bold">{filesScanned}</p>
                        <p className="text-xs text-cyber-foreground/70">Files Scanned</p>
                      </div>
                      <div className="bg-cyber-muted/30 p-3 rounded border border-cyber-border">
                        <p className={`text-xl font-bold ${threatFound > 0 ? 'text-cyber-destructive' : 'text-cyber-secondary'}`}>
                          {threatFound}
                        </p>
                        <p className="text-xs text-cyber-foreground/70">Threats Found</p>
                      </div>
                    </div>
                  </div>
                )}
              </GlowCard>
              
              {/* Scan Results */}
              {results.length > 0 && (
                <GlowCard variant="glass" animation="none">
                  <h3 className="text-xl font-semibold mb-4">Scan Results</h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 cyber-scrollbar">
                    {results.map((result) => (
                      <div 
                        key={result.id}
                        className={cn(
                          "border p-3 rounded-md transition-all hover:border-cyber-primary/50 relative overflow-hidden",
                          result.threatLevel === 'critical' ? "border-cyber-destructive/50 bg-cyber-destructive/5" :
                          result.threatLevel === 'suspicious' ? "border-yellow-500/50 bg-yellow-500/5" :
                          "border-cyber-border bg-cyber-muted/20"
                        )}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {getThreatIcon(result.threatLevel)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{result.fileName}</h4>
                              <span className="text-xs text-cyber-foreground/50">
                                {result.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <p className="text-sm text-cyber-foreground/70 mb-1">{result.path}</p>
                            <p className="text-sm">
                              <span 
                                className={cn(
                                  "inline-block px-2 py-0.5 rounded text-xs",
                                  result.threatLevel === 'critical' ? "bg-cyber-destructive/20 text-cyber-destructive" :
                                  result.threatLevel === 'suspicious' ? "bg-yellow-500/20 text-yellow-500" :
                                  "bg-cyber-secondary/20 text-cyber-secondary"
                                )}
                              >
                                {result.threatLevel.toUpperCase()}
                              </span>
                              <span className="ml-2">{result.details}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Bottom glow line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                          <div className={cn(
                            "glow-line-horizontal",
                            result.threatLevel === 'critical' ? "bg-gradient-to-r from-transparent via-cyber-destructive to-transparent" :
                            result.threatLevel === 'suspicious' ? "bg-gradient-to-r from-transparent via-yellow-500 to-transparent" :
                            "bg-gradient-to-r from-transparent via-cyber-secondary to-transparent"
                          )}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              )}
            </div>
            
            {/* Right side: System Health & Recommendations */}
            <div className="space-y-6">
              <GlowCard variant="glass" animation="glow" className="h-full">
                <h3 className="text-xl font-semibold mb-4">System Health</h3>
                
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-cyber-muted flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-4 border-cyber-primary border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="text-3xl font-bold cyber-text-gradient">85%</div>
                  </div>
                  <p className="text-center text-cyber-foreground/70">System Health Score</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium border-b border-cyber-border pb-2">Recommendations</h4>
                  
                  {[
                    { title: "Update System Drivers", description: "Your graphics drivers are 60 days out of date" },
                    { title: "Enable Firewall", description: "Your system firewall is currently disabled" },
                    { title: "Check Browser Extensions", description: "3 browser extensions have excessive permissions" }
                  ].map((item, i) => (
                    <div key={i} className="border border-cyber-border rounded-md p-3 hover:border-cyber-primary/50 transition-all">
                      <h5 className="font-medium text-cyber-primary">{item.title}</h5>
                      <p className="text-sm text-cyber-foreground/70">{item.description}</p>
                    </div>
                  ))}
                </div>
              </GlowCard>
              
              <GlowCard variant="glass" animation="none">
                <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
                
                <div className="relative p-4 border border-cyber-primary/20 rounded-md bg-cyber-primary/5 mb-4">
                  <div className="absolute top-0 right-0 rounded-full bg-cyber-primary/10 w-16 h-16 -mt-6 -mr-6"></div>
                  <p className="text-sm">
                    Based on your system activity, our AI recommends running a full system scan weekly to protect against emerging threats.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyber-foreground/70">Vulnerability Risk</span>
                    <span className="text-yellow-500">Medium</span>
                  </div>
                  <div className="h-1.5 bg-cyber-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyber-secondary to-yellow-500 w-[65%]"></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-cyber-foreground/70">Malware Protection</span>
                    <span className="text-cyber-secondary">Strong</span>
                  </div>
                  <div className="h-1.5 bg-cyber-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary w-[85%]"></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-cyber-foreground/70">Privacy Score</span>
                    <span className="text-cyber-primary">Good</span>
                  </div>
                  <div className="h-1.5 bg-cyber-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary w-[75%]"></div>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
