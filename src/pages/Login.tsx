
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, Fingerprint, User, ArrowRight } from 'lucide-react';
import { ButtonGlow } from '@/components/ui/button-glow';
import { GlowCard } from '@/components/ui/glow-card';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [step, setStep] = useState(1);
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    setStep(1);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic would go here
      toast({
        title: "Login Attempt",
        description: "This is a demo. No actual login will occur.",
        variant: "default"
      });
    } else if (step === 1) {
      setStep(2);
    } else {
      // Sign up logic would go here
      toast({
        title: "Account Created",
        description: "This is a demo. No actual account was created.",
        variant: "default"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-cyber-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 cyber-dots opacity-30 z-0"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyber-primary/10 filter blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyber-destructive/5 filter blur-3xl animate-pulse z-0"></div>
      
      {/* Logo and back link */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center text-cyber-primary hover:text-cyber-secondary transition-colors">
          <Shield className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl cyber-text-gradient">CyberGlow</span>
        </Link>
      </div>
      
      {/* Main content */}
      <div className="w-full max-w-md z-10">
        <GlowCard variant="glass" animation="glow" className="w-full">
          <h1 className="text-2xl font-bold mb-1 text-center">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-cyber-foreground/70 text-center mb-6">
            {isLogin 
              ? 'Log in to access your secure dashboard' 
              : step === 1 
                ? 'Let\'s set up your new account' 
                : 'Secure your account with a strong password'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && step === 1 && (
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-foreground/50" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={loginData.name}
                    onChange={handleInputChange}
                    className="cyber-input w-full pl-10 pr-4 py-3 bg-cyber-background/50 border border-cyber-border rounded-lg focus:border-cyber-primary transition-colors"
                    required
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                    <div className="glow-line-horizontal"></div>
                  </div>
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-foreground/50" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={loginData.email}
                    onChange={handleInputChange}
                    className="cyber-input w-full pl-10 pr-4 py-3 bg-cyber-background/50 border border-cyber-border rounded-lg focus:border-cyber-primary transition-colors"
                    required
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                    <div className="glow-line-horizontal"></div>
                  </div>
                </div>
              </div>
            )}
            
            {(isLogin || step === 2) && (
              <div className="space-y-4 mb-4">
                {isLogin && (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-foreground/50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={loginData.email}
                      onChange={handleInputChange}
                      className="cyber-input w-full pl-10 pr-4 py-3 bg-cyber-background/50 border border-cyber-border rounded-lg focus:border-cyber-primary transition-colors"
                      required
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                      <div className="glow-line-horizontal"></div>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-foreground/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="cyber-input w-full pl-10 pr-12 py-3 bg-cyber-background/50 border border-cyber-border rounded-lg focus:border-cyber-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-foreground/50 hover:text-cyber-primary"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                    <div className="glow-line-horizontal"></div>
                  </div>
                </div>
                
                {!isLogin && step === 2 && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-foreground/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="cyber-input w-full pl-10 pr-4 py-3 bg-cyber-background/50 border border-cyber-border rounded-lg focus:border-cyber-primary transition-colors"
                      required
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                      <div className="glow-line-horizontal"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isLogin && (
              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center text-sm cursor-pointer group">
                  <input type="checkbox" className="hidden" />
                  <div className="w-4 h-4 border border-cyber-border mr-2 relative group-hover:border-cyber-primary">
                    <div className="absolute inset-0.5 bg-cyber-primary scale-0 group-hover:scale-75 transition-transform"></div>
                  </div>
                  Remember Me
                </label>
                
                <Link to="/" className="text-sm text-cyber-primary hover:text-cyber-secondary transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}
            
            <ButtonGlow
              type="submit"
              className="w-full py-3 flex items-center justify-center group"
              animation="pulse"
            >
              {isLogin ? 'Login to Dashboard' : step === 1 ? 'Continue' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </ButtonGlow>
          </form>
          
          {isLogin && (
            <div className="mt-8 pt-6 border-t border-cyber-border/30 text-center">
              <h3 className="text-sm mb-4 text-cyber-foreground/70">Or continue with</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Google', icon: 'G' },
                  { name: 'GitHub', icon: '<>' },
                  { name: 'Fingerprint', icon: <Fingerprint className="h-5 w-5" /> }
                ].map((provider, i) => (
                  <button
                    key={i}
                    className="border border-cyber-border py-2 rounded-lg hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-colors"
                  >
                    <div className="flex justify-center items-center">
                      {typeof provider.icon === 'string' ? (
                        <span className="text-cyber-primary">{provider.icon}</span>
                      ) : (
                        provider.icon
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-cyber-foreground/70">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="ml-2 text-cyber-primary hover:text-cyber-secondary transition-colors"
                onClick={toggleView}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </GlowCard>
        
        {/* Security badge */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center text-cyber-foreground/50 text-sm bg-cyber-muted/30 px-3 py-1 rounded-full">
            <Lock className="h-3 w-3 mr-1" />
            Secured with AI-powered encryption
          </div>
        </div>
      </div>
      
      {/* Scanner animation */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
        <div className="h-full w-screen bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-70 animate-scan-line"></div>
      </div>
    </div>
  );
};

export default Login;
