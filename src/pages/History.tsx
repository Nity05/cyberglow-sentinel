
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useScanHistory, ScanResult } from '@/contexts/ScanHistoryContext';
import { cn } from '@/lib/utils';
import { Shield, ChevronDown, ChevronUp, Trash2, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ButtonGlow } from '@/components/ui/button-glow';
import { toast } from '@/hooks/use-toast';
import { GlowCard } from '@/components/ui/glow-card';
import { format } from 'date-fns';

const History = () => {
  const { scanHistory, clearHistory } = useScanHistory();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'safe' | 'suspicious' | 'critical'>('all');
  const navigate = useNavigate();

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your scan history? This action cannot be undone.')) {
      clearHistory();
      toast({
        title: "History cleared",
        description: "Your scan history has been cleared successfully",
      });
    }
  };

  const filteredHistory = scanHistory.filter(item => {
    if (filter === 'all') return true;
    return item.threatLevel.toLowerCase() === filter;
  });

  const getThreatLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getThreatLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'safe':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'suspicious':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      default:
        return 'bg-cyber-muted border-cyber-border text-cyber-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 cyber-text-gradient">Scan History</h1>
            <p className="text-cyber-foreground/70 max-w-3xl">
              View and manage your previous security scans. Track threats and vulnerabilities detected over time.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlowCard className="md:col-span-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">Scan Logs</h2>
                
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value as any)} 
                    className="bg-cyber-background border border-cyber-border rounded-md p-2 text-sm"
                  >
                    <option value="all">All Threats</option>
                    <option value="safe">Safe Only</option>
                    <option value="suspicious">Suspicious Only</option>
                    <option value="critical">Critical Only</option>
                  </select>
                  
                  <ButtonGlow 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleClearHistory}
                    disabled={scanHistory.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear History
                  </ButtonGlow>
                </div>
              </div>
              
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-cyber-border rounded-lg">
                  <Shield className="h-12 w-12 mx-auto text-cyber-foreground/30 mb-3" />
                  <h3 className="text-xl font-medium mb-2">No scan history found</h3>
                  <p className="text-cyber-foreground/60 mb-4">
                    You haven't performed any scans yet, or they've been filtered out.
                  </p>
                  <ButtonGlow onClick={() => navigate('/scanner')} animation="pulse">
                    Perform a Scan
                  </ButtonGlow>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((scan) => (
                    <div 
                      key={scan.id} 
                      className="border border-cyber-border rounded-lg overflow-hidden bg-cyber-muted/40 transition-all"
                    >
                      <div 
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-cyber-muted/60"
                        onClick={() => toggleExpand(scan.id)}
                      >
                        <div className="flex items-center gap-3">
                          {getThreatLevelIcon(scan.threatLevel)}
                          <div>
                            <h3 className="font-medium">{scan.fileName}</h3>
                            <div className="flex items-center text-sm text-cyber-foreground/60">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{format(new Date(scan.scanDate), 'MMM d, yyyy - h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs border",
                            getThreatLevelClass(scan.threatLevel)
                          )}>
                            {scan.threatLevel}
                          </div>
                          
                          <button className="text-cyber-foreground/70 hover:text-cyber-primary">
                            {expandedItems[scan.id] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {expandedItems[scan.id] && (
                        <div className="p-4 border-t border-cyber-border bg-cyber-background/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-cyber-foreground/50 mb-1">File Size</p>
                              <p>{scan.fileSize}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cyber-foreground/50 mb-1">File Path</p>
                              <p className="font-mono text-sm">{scan.filePath || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-xs text-cyber-foreground/50 mb-1">AI Assessment</p>
                            <p>
                              {scan.threatLevel === 'Safe' && 'No threats detected. This file appears to be safe.'}
                              {scan.threatLevel === 'Suspicious' && 'Potential security risks detected. Review recommended.'}
                              {scan.threatLevel === 'Critical' && 'High-risk security threats detected! Immediate action required.'}
                            </p>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <ButtonGlow size="sm" variant="outline">
                              View Full Details
                            </ButtonGlow>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlowCard>
            
            <GlowCard>
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-cyber-foreground/70 mb-2">Scan Summary</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-cyber-muted/30 rounded-lg border border-cyber-border">
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-foreground/70">Total Scans</span>
                        <span className="font-semibold">{scanHistory.length}</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-green-500">Safe Files</span>
                        <span className="font-semibold">
                          {scanHistory.filter(s => s.threatLevel === 'Safe').length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-500">Suspicious Files</span>
                        <span className="font-semibold">
                          {scanHistory.filter(s => s.threatLevel === 'Suspicious').length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-red-500">Critical Threats</span>
                        <span className="font-semibold">
                          {scanHistory.filter(s => s.threatLevel === 'Critical').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-cyber-border">
                  <h3 className="text-sm font-medium text-cyber-foreground/70 mb-3">Last Scan</h3>
                  {scanHistory.length > 0 ? (
                    <div>
                      <p className="mb-1 font-medium">{scanHistory[0].fileName}</p>
                      <p className="text-sm text-cyber-foreground/70 mb-2">
                        {format(new Date(scanHistory[0].scanDate), 'MMM d, yyyy - h:mm a')}
                      </p>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs border inline-flex items-center gap-1",
                        getThreatLevelClass(scanHistory[0].threatLevel)
                      )}>
                        {getThreatLevelIcon(scanHistory[0].threatLevel)}
                        <span>{scanHistory[0].threatLevel}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-cyber-foreground/60">No scans performed yet</p>
                  )}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
