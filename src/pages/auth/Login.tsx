import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  ArrowLeft,
  Loader2,
  User,
  Stethoscope,
  Mail,
  Lock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/ui/footer';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, setDemoMode } = useAuth();
  const { toast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState<'email'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to dr Hedera!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };


  const handleDemoLogin = (role: 'patient' | 'doctor') => {
    setDemoMode(role);
    navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    toast({
      title: "Demo Mode Active",
      description: `Logged in as demo ${role}.`,
    });
  };

  return (
      <div className="min-h-screen bg-white flex flex-col">
      {/* Top announcement bar */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="relative flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold">
            🏥 Live: 250K+ Medical Records Secured • AI Health Insights Available
          </span>
        </div>
      </div> */}

      {/* Main navigation */}
      <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
                  <span className="text-2xl font-extrabold text-white">Mv</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Dr Hedera</span>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Button 
                className="bg-white border-purple-500 text-white hover:bg-purple-100 hover:text-black-800" 
                onClick={() => navigate('/auth/register')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="p-8 bg-gradient-to-b from-purple-100 to-white border border-purple-200 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
              <p className="text-purple-600">
                Sign in to your Dr Hedera account
              </p>
            </div>


            <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-purple-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-purple-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="bg-white text-black border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-purple-700">
                      Remember me
                    </Label>
                  </div>
                  
                  <Button variant="link" className="p-0 text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
            </form>

            <Separator className="my-6" />

            {/* Demo Access */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-purple-600 mb-4">
                  Quick Demo Access
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="w-full bg-white border-purple-300 text-white hover:bg-purple-50 hover:border-purple-400"
                  onClick={() => handleDemoLogin('patient')}
                >
                  <User className="text-white w-4 h-4 mr-2" />
                  Patient Demo
                </Button>
                <Button 
                  className="w-full bg-white border-purple-300 text-white hover:bg-purple-50 hover:border-purple-400"
                  onClick={() => handleDemoLogin('doctor')}
                >
                  <Stethoscope className="text-white w-4 h-4 mr-2" />
                  Doctor Demo
                </Button>
              </div>
            </div>
          </Card>

          <div className="text-center mt-8">
            <p className="text-purple-600">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 text-purple-600 hover:text-purple-800" onClick={() => navigate('/auth/register')}>
                Create one here
              </Button>
            </p>
          </div>
        </div>
        </div>
      </div>
      
      {/* Footer */}
      {/* <Footer /> */}
      <footer className="bg-white border-t border-purple-100 py-4 px-6">
            <div className="flex items-center justify-center text-center">
              <p className="text-xs text-purple-600">
                © 2025 dr Hedera - Licensed under MIT | Secure Healthcare Data
                Management Platform | All rights reserved
              </p>
            </div>
          </footer>
    </div>
  );
};

export default Login;