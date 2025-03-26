import React, { useState } from 'react';
import axios from 'axios';
import { ButtonGlow } from '../ui/button-glow';
import { Shield, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Upload } from 'lucide-react';

const scanSteps = [
  { name: 'Initializing scan engine', duration: 1500 },
  { name: 'Analyzing system files', duration: 2000 },
  { name: 'Scanning for vulnerabilities', duration: 2200 },
  { name: 'Checking network connections', duration: 1800 },
  { name: 'Examining application permissions', duration: 1600 },
  { name: 'Finalizing scan results', duration: 1200 }
];

const MalwareScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResults, setScanResults] = useState(null);
  const [threatLevels, setThreatLevels] = useState([
    { level: 'Safe', count: 0, color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
    { level: 'Suspicious', count: 0, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertTriangle },
    { level: 'Critical', count: 0, color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle }
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const startScan = async () => {
    if (!selectedFile) {
      alert('Please select a file to scan');
      return;
    }

    setIsScanning(true);
    setCurrentStep(0);
    setProgress(0);
    setScanComplete(false);
    setScanResults(null);

    // Progress animation
    const totalDuration = scanSteps.reduce((acc, step) => acc + step.duration, 0);
    const interval = 30; // Update every 30ms
    let elapsed = 0;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
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
          setTimeout(async () => {
            try {
              // Upload and scan file
              const uploadResponse = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              const predictResponse = await axios.post('/predict', {
                features: [] // You'll need to extract features from the uploaded file
              });

              setScanResults(predictResponse.data);
              updateThreatLevels(predictResponse.data);
              setScanComplete(true);
            } catch (error) {
              console.error('Scan error:', error);
              setScanComplete(true);
            }
          }, 500);
        }
      }, interval);
    } catch (error) {
      console.error('Scan initialization error:', error);
      setIsScanning(false);
    }
  };

  const updateThreatLevels = (results) => {
    const updatedThreats = [...threatLevels];
    
    if (results.is_malicious) {
      if (results.confidence > 0.8) {
        updatedThreats[2].count++; // Critical
      } else {
        updatedThreats[1].count++; // Suspicious
      }
    } else {
      updatedThreats[0].count++; // Safe
    }

    setThreatLevels(updatedThreats);
  };

  const resetScan = () => {
    setIsScanning(false);
    setScanComplete(false);
    setCurrentStep(0);
    setProgress(0);
    setScanResults(null);
    setSelectedFile(null);
    setThreatLevels([
      { level: 'Safe', count: 0, color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
      { level: 'Suspicious', count: 0, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertTriangle },
      { level: 'Critical', count: 0, color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle }
    ]);
  };

  return (
    <section className="py-20 relative bg-cyber-muted overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-cyber-background rounded-xl border border-cyber-border p-6 relative overflow-hidden">
          {/* File Upload */}
          <div className="mb-6 flex items-center space-x-4">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isScanning}
            />
            <label 
              htmlFor="file-upload" 
              className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                selectedFile 
                  ? 'border-cyber-primary bg-cyber-primary/10' 
                  : 'border-cyber-border hover:border-cyber-primary'
              }`}
            >
              <div className="flex items-center justify-center">
                <Upload className="mr-2 h-5 w-5 text-cyber-primary" />
                <span className="text-sm">
                  {selectedFile 
                    ? `Selected: ${selectedFile.name}` 
                    : 'Click to upload a file for scanning'}
                </span>
              </div>
            </label>
            
            <ButtonGlow
              onClick={startScan}
              disabled={!selectedFile || isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Scan
                </>
              )}
            </ButtonGlow>
          </div>

          {/* Scan Progress */}
          {isScanning && (
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
          )}

          {/* Scan Steps */}
          {isScanning && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Scan Visualization */}
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
              
              {/* Scan Details */}
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
          )}

          {/* Scan Results */}
          {scanComplete && scanResults && (
            <div className="mt-6 p-4 bg-cyber-muted/30 rounded-lg border border-cyber-border">
              <h4 className="text-lg font-semibold mb-4">Scan Results</h4>
              <div className={`p-3 rounded-lg ${
                scanResults.is_malicious 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : 'bg-green-500/10 border border-green-500/30'
              }`}>
                <div className="flex items-center mb-2">
                  {scanResults.is_malicious ? (
                    <XCircle className="mr-2 h-6 w-6 text-red-500" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                  )}
                  <span className={`font-medium ${
                    scanResults.is_malicious ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {scanResults.is_malicious ? 'Malicious File Detected' : 'File is Safe'}
                  </span>
                </div>
                <div className="text-sm text-cyber-foreground/70">
                  <p>Confidence: {(scanResults.confidence * 100).toFixed(2)}%</p>
                  <p>Prediction: {scanResults.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {scanComplete && (
            <div className="mt-4 flex justify-end">
              <ButtonGlow onClick={resetScan}>
                <Search className="mr-2 h-4 w-4" />
                Scan Another File
              </ButtonGlow>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MalwareScanner;