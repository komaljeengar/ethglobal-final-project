import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './button';
import {
  BarChart3,
  Wallet,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Building2,
  Coins,
  Truck,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  FileText,
  Lock,
  Phone,
  Mail,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { Badge } from './badge';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Simulate user loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="relative flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold">
            🏥 Live: 250K+ Medical Records Secured • AI Health Insights Available
          </span>
          <Link
            to="/auth/register"
            className="ml-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-300"
          >
            Get Started →
          </Link>
        </div>
      </div>

      <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
                  <span className="text-2xl font-extrabold text-white">Mv</span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="hidden lg:flex items-center space-x-12">
              <div className="hidden lg:flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Features
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-80 bg-white border border-gray-200 shadow-xl rounded-xl"
                  >
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Healthcare Features
                      </div>
                      <div className="grid gap-3">
                        <DropdownMenuItem asChild>
                          <Link
                            to="#medical-records"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                Medical Records
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Secure blockchain-stored health data
                              </div>
                            </div>
                            <div className="text-xs text-purple-600 font-semibold">
                              Live
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#ai-insights"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                              <Brain className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                AI Health Insights
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Personalized health recommendations
                              </div>
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              AI Powered
                            </div>
                          </Link>
                        </DropdownMenuItem>


                        <DropdownMenuSeparator className="my-2" />

                        <DropdownMenuItem asChild>
                          <Link
                            to="#analytics"
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <BarChart3 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Health Analytics
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#api"
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Shield className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              API Access
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                    >
                      <Users className="w-4 h-4" />
                      Solutions
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-80 bg-white border border-gray-200 shadow-xl rounded-xl"
                  >
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        Healthcare Solutions
                      </div>
                      <div className="grid gap-3">
                        <DropdownMenuItem asChild>
                          <Link
                            to="#patient-portal"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <Heart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                Patient Portal
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Complete health record management
                              </div>
                            </div>
                            <div className="text-xs text-purple-600 font-semibold">
                              250K+ Users
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#doctor-dashboard"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                Doctor Dashboard
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Access authorized patient records
                              </div>
                            </div>
                            <div className="text-xs text-blue-600 font-semibold">
                              50K+ Doctors
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#telemedicine"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                              <Phone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">
                                Telemedicine
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Remote healthcare consultations
                              </div>
                            </div>
                            <div className="text-xs text-emerald-600 font-semibold">
                              HIPAA Compliant
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        <div className="text-xs font-semibold text-gray-500 mb-2 px-3">
                          ENTERPRISE SOLUTIONS
                        </div>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#hospital-management"
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Building2 className="w-4 h-4 text-gray-600" />
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 font-medium">
                                Hospital Management
                              </span>
                              <div className="text-xs text-gray-500">
                                Complete healthcare system integration
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#analytics"
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <BarChart3 className="w-4 h-4 text-gray-600" />
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 font-medium">
                                Health Analytics
                              </span>
                              <div className="text-xs text-gray-500">
                                Advanced reporting and insights
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#security"
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Shield className="w-4 h-4 text-gray-600" />
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 font-medium">
                                Security & Compliance
                              </span>
                              <div className="text-xs text-gray-500">
                                HIPAA and blockchain security
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                    >
                      <Shield className="w-4 h-4" />
                      Docs
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 bg-white border border-gray-200 shadow-xl rounded-xl"
                  >
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Documentation
                      </div>
                      <div className="grid gap-2">
                        <DropdownMenuItem asChild>
                          <Link
                            to="#getting-started"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                Getting Started
                              </div>
                              <div className="text-xs text-gray-500">
                                Quick setup guide
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#api-reference"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                API Reference
                              </div>
                              <div className="text-xs text-gray-500">
                                Complete API documentation
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#tutorials"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Heart className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                Tutorials
                              </div>
                              <div className="text-xs text-gray-500">
                                Step-by-step guides
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        <DropdownMenuItem asChild>
                          <Link
                            to="#sdk"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Truck className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              SDK Downloads
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#changelog"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Sparkles className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Changelog
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#support"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Support Center
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                    >
                      <Building2 className="w-4 h-4" />
                      About
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 bg-white border border-gray-200 shadow-xl rounded-xl"
                  >
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        Company
                      </div>
                      <div className="grid gap-2">
                        <DropdownMenuItem asChild>
                          <Link
                            to="#our-story"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                Our Story
                              </div>
                              <div className="text-xs text-gray-500">
                                How we started
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#team"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                Team
                              </div>
                              <div className="text-xs text-gray-500">
                                Meet our experts
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#careers"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                Careers
                              </div>
                              <div className="text-xs text-gray-500">
                                Join our team
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        <DropdownMenuItem asChild>
                          <Link
                            to="#press"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Sparkles className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Press & Media
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#investors"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <TrendingUp className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Investors
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#contact"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Shield className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              Contact Us
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="#blog"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                          >
                            <Heart className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Blog</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop only */}
              <div className="hidden md:flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-64 justify-start text-gray-500 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search medical records...
                </Button>
              </div>

              {/* User Profile or Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden md:block text-sm font-medium">
                        {user.name || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/patient/dashboard')}>
                      <Heart className="w-4 h-4 mr-2" />
                      Patient Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/doctor/dashboard')}>
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Doctor Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/auth/login"
                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all duration-200"
                  >
                    <Wallet className="w-4 h-4" />
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
