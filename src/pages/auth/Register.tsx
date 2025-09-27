import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { 
  Shield, 
  Eye, 
  User, 
  Stethoscope, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Wallet,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    medicalLicense: '',
    specialization: '',
    termsAccepted: false,
    privacyAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept all terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        role: userType,
        specialization: userType === 'doctor' ? formData.specialization : undefined,
      }, formData.password);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to dr Hedera!",
      });
      
      navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-muted-foreground text-black text-3xl font-bold mb-2">Choose Your Role</h2>
              <p className="text-muted-foreground text-purple-600">
                Select how you'll be using dr Hedera
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  userType === 'patient' ? 'border-purple-300 bg-gradient-to-br from-purple-300 to-purple-500' : 'border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50'
                }`}
                onClick={() => setUserType('patient')}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${userType === 'patient' ? 'bg-purple-500/20' : 'bg-purple-200'}`}>
                    <Heart className={`w-8 h-8 ${userType === 'patient' ? 'text-purple-200' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${userType === 'patient' ? 'text-white' : 'text-purple-800'}`}>Patient</h3>
                  <p className={`text-sm mb-4 ${userType === 'patient' ? 'text-purple-100' : 'text-purple-600'}`}>
                    Store, manage, and control access to your medical records
                  </p>
                  <ul className={`text-sm text-left space-y-2 ${userType === 'patient' ? 'text-purple-100' : 'text-purple-700'}`}>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'patient' ? 'text-purple-200' : 'text-purple-500'}`} />
                      Control your medical data
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'patient' ? 'text-purple-200' : 'text-purple-500'}`} />
                      AI health insights
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'patient' ? 'text-purple-200' : 'text-purple-500'}`} />
                      Permission management
                    </li>
                  </ul>
                </div>
              </Card>

              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  userType === 'doctor' ? 'border-purple-400 bg-gradient-to-br from-purple-300 to-purple-500' : 'border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50'
                }`}
                onClick={() => setUserType('doctor')}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${userType === 'doctor' ? 'bg-purple-500/20' : 'bg-purple-200'}`}>
                    <Stethoscope className={`w-8 h-8 ${userType === 'doctor' ? 'text-purple-200' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${userType === 'doctor' ? 'text-white' : 'text-purple-800'}`}>Doctor</h3>
                  <p className={`text-sm mb-4 ${userType === 'doctor' ? 'text-purple-100' : 'text-purple-600'}`}>
                    Access patient records with permission-based security
                  </p>
                  <ul className={`text-sm text-left space-y-2 ${userType === 'doctor' ? 'text-purple-100' : 'text-purple-700'}`}>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'doctor' ? 'text-purple-200' : 'text-purple-500'}`} />
                      Access authorized records
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'doctor' ? 'text-purple-200' : 'text-purple-500'}`} />
                      AI clinical support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${userType === 'doctor' ? 'text-purple-200' : 'text-purple-500'}`} />
                      Patient insights
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue as {userType === 'patient' ? 'Patient' : 'Doctor'}
            </Button>
          </div>
        );

      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-muted-foreground text-black text-3xl font-bold mb-2">Account Details</h2>
              <p className="text-muted-foreground text-purple-900">
                Complete your dr Hedera registration
              </p>
            </div>

            <div className="text-muted-foreground text-purple-600 grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="text-muted-foreground text-purple-600">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white text-black border-gray-300"
              />
            </div>

            {userType === 'doctor' && (
              <div className="text-muted-foreground text-purple-600 grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicalLicense">Medical License Number</Label>
                  <Input
                    id="medicalLicense"
                    name="medicalLicense"
                    type="text"
                    value={formData.medicalLicense}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-black border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiologist"
                    required
                    className="bg-white text-black border-gray-300"
                  />
                </div>
              </div>
            )}

            <div className="text-muted-foreground text-purple-600 grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-muted-foreground text-purple-900 text-sm">
                  I agree to the Terms of Service and End User License Agreement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, privacyAccepted: checked as boolean }))
                  }
                />
                <Label htmlFor="privacy" className="text-muted-foreground text-purple-900 text-sm">
                  I acknowledge the Privacy Policy and HIPAA compliance
                </Label>
              </div>
            </div>

            <Card className="p-4 bg-gradient-to-r from-purple-100 via-white to-blue-100 border-purple-200">
              <div className="flex items-start space-x-3">
                <Wallet className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-gray-900">Blockchain Wallet Connection</h4>
                  <p className="text-xs text-gray-700">
                    A Flow blockchain wallet will be created for you automatically. You can connect your own wallet later in settings.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex space-x-4 ">
              <Button 
                type="button" 
                className="bg-gradient-to-r from-purple-400 to-purple-700 text-white hover:from-purple-400 hover:to-purple-700 border-0" 
                onClick={() => setStep(1)}
              > 
                Back
              </Button>
              <Button type="submit" className="flex-1 gradient-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create dr Hedera Account'
                )}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header without announcement bar */}
      <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
                  <span className="text-2xl font-extrabold text-white">Mv</span>
                </div>
                <span className="text-xl font-bold text-gray-900">dr Hedera</span>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Button 
                className="bg-white border-purple-500 text-white hover:bg-purple-200 hover:text-black" 
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Registration Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNumber <= step 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                </div>
                {stepNumber < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNumber < step ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <Card className="p-8 bg-gradient-to-b from-purple-100 to-white border border-purple-200 shadow-lg">
            {renderStepContent()}
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Button variant="link" className="p-0 text-purple-600 hover:text-purple-800" onClick={() => navigate('/auth/login')}>
                Sign in here
              </Button>
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Simple Footer */}
      {/* Footer */}
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

export default Register;