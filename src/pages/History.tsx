
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlowCard } from '@/components/ui/glow-card';
import { Shield, Calendar, ArrowDownUp, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock data
const generatePastScans = () => {
  const scans = [];
  const threatTypes = ['Trojan', 'Spyware', 'Ransomware', 'Adware', 'Worm'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate past 3 months of data
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Not every day has a scan
    if (Math.random() > 0.3) continue;
    
    const threats = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    const filesScanned = Math.floor(Math.random() * 300) + 100;
    
    const scanResults = [];
    
    // Generate threat details
    for (let j = 0; j < threats; j++) {
      const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const filePath = `/system/${Math.random() > 0.5 ? 'program files' : 'users'}/${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `file_${Math.random().toString(36).substring(2, 8)}.${Math.random() > 0.5 ? 'exe' : 'dll'}`;
      const severity = Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'suspicious' : 'low';
      
      scanResults.push({
        id: Math.random().toString(36).substring(2, 9),
        threatType,
        filePath,
        fileName,
        severity,
        action: Math.random() > 0.3 ? 'quarantined' : 'deleted'
      });
    }
    
    scans.push({
      id: Math.random().toString(36).substring(2, 9),
      date,
      filesScanned,
      threats,
      duration: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
      scanType: Math.random() > 0.7 ? 'Full System' : Math.random() > 0.5 ? 'Quick Scan' : 'Custom Scan',
      results: scanResults
    });
  }
  
  return scans.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const scanHistory = generatePastScans();

// Chart data
const monthlyData = scanHistory.reduce((acc: any, scan) => {
  const month = scan.date.toLocaleString('default', { month: 'short' });
  
  if (!acc[month]) {
    acc[month] = { name: month, scans: 0, threats: 0 };
  }
  
  acc[month].scans += 1;
  acc[month].threats += scan.threats;
  
  return acc;
}, {});

const chartData = Object.values(monthlyData);

const threatSeverityData = scanHistory.reduce((acc: any, scan) => {
  scan.results.forEach(result => {
    if (!acc[result.severity]) {
      acc[result.severity] = 0;
    }
    acc[result.severity] += 1;
  });
  
  return acc;
}, { low: 0, suspicious: 0, critical: 0 });

const pieData = [
  { name: 'Critical', value: threatSeverityData.critical, color: '#FF3A5E' },
  { name: 'Suspicious', value: threatSeverityData.suspicious, color: '#FFB547' },
  { name: 'Low', value: threatSeverityData.low, color: '#00FFD1' }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filteredScans = scanHistory.filter(scan => {
    // Filter by search term
    const searchMatch = searchTerm === '' || 
      scan.scanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.results.some(result => 
        result.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.threatType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filter by threat level
    const filterMatch = selectedFilter === 'all' || 
      (selectedFilter === 'threats' && scan.threats > 0) ||
      (selectedFilter === 'clean' && scan.threats === 0);
    
    return searchMatch && filterMatch;
  });
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-cyber-destructive';
      case 'suspicious': return 'text-yellow-500';
      case 'low': return 'text-cyber-secondary';
      default: return 'text-cyber-foreground';
    }
  };
  
  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-cyber-destructive/10';
      case 'suspicious': return 'bg-yellow-500/10';
      case 'low': return 'bg-cyber-secondary/10';
      default: return 'bg-cyber-muted';
    }
  };
  
  return (
    <div className="min-h-screen bg-cyber-background text-cyber-foreground pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Scan <span className="cyber-text-gradient">History</span>
          </h1>
          <p className="text-cyber-foreground/70 mb-8">
            View and analyze your previous scan results and security trends
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Charts */}
            <GlowCard variant="glass" className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Monthly Scan Activity</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3C" />
                    <XAxis dataKey="name" stroke="#F8FAFC" />
                    <YAxis stroke="#F8FAFC" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1A27', 
                        border: '1px solid #2A2A3C',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="scans" fill="#38BDF8" name="Scans" />
                    <Bar dataKey="threats" fill="#FF3A5E" name="Threats" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
            
            <GlowCard variant="glass">
              <h3 className="text-xl font-semibold mb-4">Threat Severity</h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1A27', 
                        border: '1px solid #2A2A3C',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
          </div>
          
          {/* Filter and search */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-2">
              <button 
                className={cn(
                  "px-4 py-2 rounded-md border transition-colors",
                  selectedFilter === 'all' 
                    ? "border-cyber-primary bg-cyber-primary/10 text-cyber-primary" 
                    : "border-cyber-border text-cyber-foreground/70 hover:border-cyber-primary/50"
                )}
                onClick={() => setSelectedFilter('all')}
              >
                All Scans
              </button>
              <button 
                className={cn(
                  "px-4 py-2 rounded-md border transition-colors",
                  selectedFilter === 'threats' 
                    ? "border-cyber-destructive bg-cyber-destructive/10 text-cyber-destructive" 
                    : "border-cyber-border text-cyber-foreground/70 hover:border-cyber-primary/50"
                )}
                onClick={() => setSelectedFilter('threats')}
              >
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                With Threats
              </button>
              <button 
                className={cn(
                  "px-4 py-2 rounded-md border transition-colors",
                  selectedFilter === 'clean' 
                    ? "border-cyber-secondary bg-cyber-secondary/10 text-cyber-secondary" 
                    : "border-cyber-border text-cyber-foreground/70 hover:border-cyber-primary/50"
                )}
                onClick={() => setSelectedFilter('clean')}
              >
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Clean Scans
              </button>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-foreground/50" />
              <input
                type="text"
                placeholder="Search scans..."
                className="bg-cyber-muted border border-cyber-border text-cyber-foreground py-2 pl-10 pr-4 rounded-md w-full sm:w-64 focus:outline-none focus:border-cyber-primary transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Scan history */}
          <GlowCard variant="glass" animation="none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Scan Records</h3>
              <p className="text-cyber-foreground/70 text-sm">Showing {filteredScans.length} scans</p>
            </div>
            
            <div className="space-y-2">
              {filteredScans.length === 0 ? (
                <div className="text-center py-8 text-cyber-foreground/50">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No scans match your criteria</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredScans.map((scan) => (
                    <AccordionItem 
                      key={scan.id} 
                      value={scan.id}
                      className={cn(
                        "border border-cyber-border rounded-lg mb-3 px-4 py-2 hover:border-cyber-primary/50 transition-colors",
                        scan.threats > 0 ? "bg-cyber-destructive/5" : "bg-cyber-secondary/5"
                      )}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full text-left">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-cyber-primary" />
                            <span>{formatDate(scan.date)}</span>
                          </div>
                          <div>
                            <span className="text-cyber-foreground/70 mr-2">Type:</span>
                            <span>{scan.scanType}</span>
                          </div>
                          <div>
                            <span className="text-cyber-foreground/70 mr-2">Files:</span>
                            <span>{scan.filesScanned}</span>
                          </div>
                          <div>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs",
                              scan.threats > 0 
                                ? "bg-cyber-destructive/10 text-cyber-destructive" 
                                : "bg-cyber-secondary/10 text-cyber-secondary"
                            )}>
                              {scan.threats > 0 ? `${scan.threats} Threats` : "Clean"}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="animate-accordion-down">
                        <div className="border-t border-cyber-border/30 pt-4 mt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p>
                                <span className="text-cyber-foreground/70">Duration:</span>{' '}
                                <span>{scan.duration} seconds</span>
                              </p>
                              <p>
                                <span className="text-cyber-foreground/70">Files Scanned:</span>{' '}
                                <span>{scan.filesScanned}</span>
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="text-cyber-foreground/70">Threats Found:</span>{' '}
                                <span className={scan.threats > 0 ? 'text-cyber-destructive' : 'text-cyber-secondary'}>
                                  {scan.threats}
                                </span>
                              </p>
                              <p>
                                <span className="text-cyber-foreground/70">Scan Type:</span>{' '}
                                <span>{scan.scanType}</span>
                              </p>
                            </div>
                          </div>
                          
                          {scan.results.length > 0 ? (
                            <div>
                              <h4 className="font-medium mb-2 border-b border-cyber-border/30 pb-2">
                                Detected Threats
                              </h4>
                              <div className="space-y-2">
                                {scan.results.map((result) => (
                                  <div 
                                    key={result.id} 
                                    className={cn(
                                      "p-3 rounded-md",
                                      getSeverityBg(result.severity)
                                    )}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                      <div>
                                        <p className="font-medium flex items-center">
                                          <span className={cn("mr-1", getSeverityColor(result.severity))}>
                                            {result.severity === 'critical' ? (
                                              <AlertTriangle className="h-4 w-4 inline" />
                                            ) : (
                                              <Shield className="h-4 w-4 inline" />
                                            )}
                                          </span>
                                          {result.threatType}
                                        </p>
                                        <p className="text-sm text-cyber-foreground/70">
                                          {result.filePath}/{result.fileName}
                                        </p>
                                      </div>
                                      <div className="sm:text-right">
                                        <span 
                                          className={cn(
                                            "inline-block px-2 py-0.5 rounded text-xs uppercase",
                                            result.severity === 'critical' 
                                              ? "bg-cyber-destructive/20 text-cyber-destructive" 
                                              : result.severity === 'suspicious'
                                              ? "bg-yellow-500/20 text-yellow-500"
                                              : "bg-cyber-secondary/20 text-cyber-secondary"
                                          )}
                                        >
                                          {result.severity}
                                        </span>
                                        <p className="text-sm text-cyber-foreground/70">
                                          Action: <span className="font-medium">{result.action}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="py-2 text-center text-cyber-secondary">
                              <CheckCircle className="h-5 w-5 inline mr-2" />
                              No threats detected in this scan
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </GlowCard>
        </div>
      </main>
    </div>
  );
};

export default History;
