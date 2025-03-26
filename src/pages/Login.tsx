
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, LogIn, UserPlus, Mail, Lock, Loader2, User } from 'lucide-react';
import { ButtonGlow } from '@/components/ui/button-glow';
import { GlowCard } from '@/components/ui/glow-card';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/scanner');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;

      if (isLogin) {
        success = await login(email, password);
      } else {
        if (!name) {
          toast({
            title: "Name is required",
            description: "Please enter your name to register",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        success = await signup(name, email, password);
      }

      if (success) {
        navigate('/scanner');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-cyber-primary/10 rounded-full mb-4">
            <ShieldAlert className="h-8 w-8 text-cyber-primary" />
          </div>
          <h1 className="text-3xl font-bold cyber-text-gradient mb-2">CyberGlow</h1>
          <p className="text-cyber-foreground/70">Advanced AI Security Scanner</p>
        </div>

        <GlowCard className="p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <ButtonGlow 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              {isLogin ? 'Sign Up' : 'Sign In'}
            </ButtonGlow>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-cyber-foreground/70">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-foreground/50">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full py-2 pl-10 pr-3 bg-cyber-muted/30 border border-cyber-border rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-primary focus:border-cyber-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-cyber-foreground/70">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-foreground/50">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-2 pl-10 pr-3 bg-cyber-muted/30 border border-cyber-border rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-primary focus:border-cyber-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-cyber-foreground/70">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-foreground/50">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2 pl-10 pr-3 bg-cyber-muted/30 border border-cyber-border rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-primary focus:border-cyber-primary"
                />
              </div>
            </div>

            <ButtonGlow 
              type="submit" 
              className="w-full" 
              animation="pulse"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </ButtonGlow>
          </form>
        </GlowCard>
      </div>
    </div>
  );
};

export default Login;
