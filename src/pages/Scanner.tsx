
import React, { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlowCard } from '@/components/ui/glow-card';
import { ButtonGlow } from '@/components/ui/button-glow';
import { Shield, Upload, FileSearch, X, AlertTriangle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScanHistory } from '@/contexts/ScanHistoryContext';

type ThreatLevel = 'Safe' | 'Suspicious' | 'Critical';

interface ScanningResult {
  fileName: string;
  fileSize: string;
  threatLevel: ThreatLevel;
  detailsPath?: string;
  filePath?: string;
}

const Scanner = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanningResult | null>(null);
  const [scanningSystem, setScanningSystem] = useState(false);
  const [systemScanProgress, setSystemScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addScanResult } = useScanHistory();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const handleFile = (file: File) => {
    setFile(file);
    setScanResult(null);
    toast({
      title: "File uploaded",
      description: `${file.name} is ready for scanning`,
    });
  };

  const clearFile = () => {
    setFile(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateScan = () => {
    return new Promise<ScanningResult>((resolve) => {
      setIsScanning(true);
      setScanProgress(0);
      
      // Threat levels for simulation
      const threatLevels: ThreatLevel[] = ['Safe', 'Suspicious', 'Critical'];
      // Randomly select one, with safe having higher probability
      const randomIndex = Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 2;
      const threatLevel = threatLevels[randomIndex];
      
      // Simulate a scan progress
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
              setIsScanning(false);
              resolve({
                fileName: file!.name,
                fileSize: formatFileSize(file!.size),
                threatLevel,
                filePath: '/uploads/' + file!.name
              });
            }, 500);
            
            return 100;
          }
          return newProgress;
        });
      }, 200);
    });
  };

  const handleScanFile = async () => {
    if (!file) return;
    
    try {
      const result = await simulateScan();
      setScanResult(result);
      
      // Add to scan history
      addScanResult(result);
      
      // Show toast based on threat level
      if (result.threatLevel === 'Safe') {
        toast({
          title: "Scan Complete: No Threats Detected",
          description: "Your file is secure and contains no malware.",
        });
      } else if (result.threatLevel === 'Suspicious') {
        toast({
          title: "Scan Complete: Suspicious Content",
          description: "Potential security risks detected. Review recommended.",
          variant: "warning"
        });
      } else {
        toast({
          title: "Scan Complete: Critical Threat!",
          description: "Malware detected! Immediate action required.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "An error occurred during scanning. Please try again.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const simulateSystemScan = () => {
    setScanningSystem(true);
    setSystemScanProgress(0);
    
    const interval = setInterval(() => {
      setSystemScanProgress(prev => {
        const newProgress = prev + (Math.random() * 5);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanningSystem(false);
            
            // Randomly decide how many threats to find (0-3)
            const threatCount = Math.floor(Math.random() * 4);
            
            if (threatCount === 0) {
              addScanResult({
                fileName: "System Scan",
                fileSize: "Multiple Files",
                threatLevel: "Safe"
              });
              toast({
                title: "System Scan Complete",
                description: "No threats detected. Your system is secure.",
              });
            } else {
              const threatLevel: ThreatLevel = threatCount > 1 ? 'Critical' : 'Suspicious';
              addScanResult({
                fileName: "System Scan",
                fileSize: "Multiple Files",
                threatLevel
              });
              toast({
                title: `System Scan Complete: ${threatCount} ${threatCount === 1 ? 'threat' : 'threats'} found`,
                description: `${threatLevel} security issues detected. Check scan history for details.`,
                variant: threatLevel === 'Critical' ? "destructive" : "warning"
              });
            }
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const getThreatLevelColor = (level: ThreatLevel) => {
    switch (level) {
      case 'Safe': return 'text-green-500';
      case 'Suspicious': return 'text-yellow-500';
      case 'Critical': return 'text-red-500';
      default: return 'text-cyber-foreground';
    }
  };

  const getThreatLevelIcon = (level: ThreatLevel) => {
    switch (level) {
      case 'Safe': return <CheckCircle className={cn("h-6 w-6", getThreatLevelColor(level))} />;
      case 'Suspicious': return <AlertTriangle className={cn("h-6 w-6", getThreatLevelColor(level))} />;
      case 'Critical': return <AlertTriangle className={cn("h-6 w-6", getThreatLevelColor(level))} />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const getThreatLevelBackground = (level: ThreatLevel) => {
    switch (level) {
      case 'Safe': return 'bg-green-500/5 border-green-500/20';
      case 'Suspicious': return 'bg-yellow-500/5 border-yellow-500/20';
      case 'Critical': return 'bg-red-500/5 border-red-500/20';
      default: return 'bg-cyber-muted border-cyber-border';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 cyber-text-gradient">
              AI-Powered Security Scanner
            </h1>
            <p className="text-cyber-foreground/70 max-w-3xl">
              Scan files or your entire system for malware, viruses, and other security threats using our advanced AI detection system.
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlowCard className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">File Scanner</h2>
              
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 transition-all text-center relative",
                  isDragging ? "border-cyber-primary bg-cyber-primary/5" : "border-cyber-border",
                  file ? "bg-cyber-muted/30" : ""
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!file ? (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                    />
                    
                    <Upload className="h-12 w-12 mx-auto text-cyber-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {isDragging ? "Drop file here" : "Drag & Drop file here"}
                    </h3>
                    <p className="text-cyber-foreground/60 mb-4">
                      or
                    </p>
                    <ButtonGlow
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      <FileSearch className="mr-2 h-4 w-4" />
                      Browse Files
                    </ButtonGlow>
                  </>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-cyber-primary" />
                        <div className="text-left">
                          <h3 className="font-medium truncate max-w-xs">{file.name}</h3>
                          <p className="text-sm text-cyber-foreground/60">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={clearFile}
                        className="text-cyber-foreground/60 hover:text-cyber-destructive transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {isScanning ? (
                      <div className="space-y-4">
                        <div className="w-full bg-cyber-muted/50 rounded-full h-2.5 dark:bg-cyber-muted">
                          <div
                            className="bg-cyber-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-cyber-foreground/70 text-center animate-pulse">
                          Scanning file... {Math.round(scanProgress)}%
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <ButtonGlow
                          onClick={handleScanFile}
                          animation="pulse"
                          disabled={isScanning}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Scan for Threats
                        </ButtonGlow>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {scanResult && (
                <div className={cn(
                  "mt-6 p-4 rounded-lg border",
                  getThreatLevelBackground(scanResult.threatLevel)
                )}>
                  <div className="flex items-start">
                    <div className="mr-4">
                      {getThreatLevelIcon(scanResult.threatLevel)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={cn("text-lg font-semibold", getThreatLevelColor(scanResult.threatLevel))}>
                        {scanResult.threatLevel === 'Safe' && "No Threats Detected"}
                        {scanResult.threatLevel === 'Suspicious' && "Suspicious Content Detected"}
                        {scanResult.threatLevel === 'Critical' && "Critical Threat Detected!"}
                      </h3>
                      
                      <p className="text-cyber-foreground/70 mb-4">
                        {scanResult.threatLevel === 'Safe' && "Your file has been scanned and no security threats were found."}
                        {scanResult.threatLevel === 'Suspicious' && "Our AI has detected potentially suspicious content. Review recommended."}
                        {scanResult.threatLevel === 'Critical' && "This file contains dangerous malware that could harm your system."}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-cyber-foreground/70">
                        <div>
                          <span className="font-medium">File:</span> {scanResult.fileName}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {scanResult.fileSize}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <ButtonGlow size="sm">
                          View Full Report
                        </ButtonGlow>
                        {scanResult.threatLevel !== 'Safe' && (
                          <ButtonGlow variant="destructive" size="sm">
                            Quarantine File
                          </ButtonGlow>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GlowCard>
            
            <GlowCard>
              <h2 className="text-xl font-semibold mb-4">System Scanner</h2>
              
              <div className="border border-cyber-border rounded-lg p-6 bg-cyber-muted/30 mb-4">
                <Shield className="h-12 w-12 mx-auto text-cyber-primary mb-4" />
                <h3 className="text-lg font-medium mb-2 text-center">Full System Scan</h3>
                <p className="text-cyber-foreground/60 mb-6 text-center">
                  Scan your entire system for malware, vulnerabilities, and security threats.
                </p>
                
                {scanningSystem ? (
                  <div className="space-y-4">
                    <div className="w-full bg-cyber-muted/50 rounded-full h-2.5">
                      <div 
                        className="bg-cyber-primary h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${systemScanProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-cyber-foreground/70 text-center animate-pulse">
                      Scanning system... {Math.round(systemScanProgress)}%
                    </p>
                  </div>
                ) : (
                  <ButtonGlow
                    onClick={simulateSystemScan}
                    className="w-full justify-center"
                    animation="pulse"
                    disabled={scanningSystem}
                  >
                    {scanningSystem ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Start System Scan
                      </>
                    )}
                  </ButtonGlow>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scanner Features</h3>
                
                <div className="space-y-3">
                  {[
                    { title: "AI-Powered Detection", description: "Uses machine learning to identify new and unknown threats" },
                    { title: "Real-Time Protection", description: "Actively monitors your system for suspicious activity" },
                    { title: "Deep File Analysis", description: "Examines file contents beyond traditional signature-based detection" },
                    { title: "Behavior Monitoring", description: "Identifies malware based on suspicious behavior patterns" }
                  ].map((feature, i) => (
                    <div key={i} className="p-3 border border-cyber-border rounded-lg bg-cyber-muted/20 hover:bg-cyber-muted/40 transition-colors">
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-cyber-foreground/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
