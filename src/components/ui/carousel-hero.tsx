import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Star, 
  Sparkles, 
  Globe, 
  Building, 
  Coins, 
  Settings, 
  TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Carousel Hero Component
interface CarouselHeroProps {
  user?: any;
}

export function CarouselHero({ user }: CarouselHeroProps) {
  const navigate = useNavigate();
  const { setDemoMode } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      badge: "New Partnership",
      icon: Star,
      title: "Dr Hedera x Healthcare Alliance",
      description: "Multi-chain medical data tokenization with AI verification.",
      link: "/partnership",
    },
    {
      badge: "New Feature",
      icon: Sparkles,
      title: "AI-Powered Health Insights",
      description: "Real-time health analysis using machine learning.",
      link: "/features/ai-insights",
    },
    {
      badge: "Update",
      icon: Globe,
      title: "Global Access",
      description: "Now supporting healthcare providers worldwide.",
      link: "/features/global-access",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slides with pause on hover
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleGetStarted = () => {
    navigate('/auth/register');
  };

  const handleDemoAccess = (role: 'patient' | 'doctor') => {
    setDemoMode(role);
    navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        {/* Floating 3D Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 transform rotate-45 animate-pulse opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 transform perspective-1000 rotateX-45 rotateY-45 shadow-2xl"></div>
        </div>

        <div
          className="absolute top-40 right-32 w-24 h-24 transform -rotate-12 animate-pulse opacity-30"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 transform perspective-1000 rotateX-30 rotateY-30 shadow-xl"></div>
        </div>

        <div
          className="absolute bottom-32 left-32 w-40 h-40 transform rotate-12 animate-pulse opacity-15"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 transform perspective-1000 rotateX-60 rotateY-45 shadow-2xl"></div>
        </div>

        <div
          className="absolute bottom-40 right-20 w-28 h-28 transform -rotate-45 animate-pulse opacity-25"
          style={{ animationDelay: "3s" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 transform perspective-1000 rotateX-45 rotateY-60 shadow-xl"></div>
        </div>

        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 transform rotate-90 animate-pulse opacity-20"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 transform perspective-1000 rotateX-30 rotateY-45 shadow-lg"></div>
        </div>

        <div
          className="absolute top-1/3 right-1/4 w-20 h-20 transform -rotate-30 animate-pulse opacity-30"
          style={{ animationDelay: "2.5s" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 transform perspective-1000 rotateX-45 rotateY-30 shadow-xl"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Announcement Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 bg-purple-100 backdrop-blur-sm text-purple-700 rounded-full text-sm font-medium mb-8 border border-purple-200 transition-all duration-1000 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Introducing: Healthcare Blockchain
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>

          {/* Main Headline */}
          <h1
            className={`text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight transition-all duration-1200 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Medical Data,
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Secured.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl lg:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            Enabling a secure ecosystem of medical records that
            feels like a single, unified platform. Powered by blockchain and AI-driven insights.
          </p>

          {/* Central Dashboard Button */}
          <div
            className={`mb-12 transition-all duration-1000 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white font-bold text-lg rounded-2xl hover:from-purple-500 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border border-purple-400/30 backdrop-blur-sm overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

              <div className="relative flex items-center">
                <Building className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm" />
                {user ? "Go to Dashboard" : "Start Securing Your Data"}
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm" />
              </div>
            </button>
            {user && (
              <p className="text-gray-300 mt-3 text-sm animate-pulse">
                Welcome back! Access your medical records and manage your health data.
              </p>
            )}
          </div>

          {/* Three Main Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Secure Card */}
            <div
              className={`group bg-gradient-to-br from-purple-50 to-white backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-100 hover:to-white hover:scale-105 hover:shadow-xl ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Secure</h3>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:text-purple-700 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-gray-700 mb-8 text-left">
                Store your medical records with blockchain security and biometric authentication for maximum protection.
              </p>
              <div className="text-left">
                <button
                  onClick={() => handleDemoAccess('patient')}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:text-blue-700 transition-colors"
                >
                  Get started securing
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Share Card */}
            <div
              className={`group bg-gradient-to-br from-purple-50 to-white backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-100 hover:to-white hover:scale-105 hover:shadow-xl ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Share</h3>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:text-purple-700 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-gray-700 mb-8 text-left">
                Grant controlled access to healthcare providers with granular permissions and instant revocation.
              </p>
              <div className="text-left">
                <button
                  onClick={() => handleDemoAccess('doctor')}
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:text-purple-700 transition-colors"
                >
                  Start sharing now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Analyze Card */}
            <div
              className={`group bg-gradient-to-br from-purple-50 to-white backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-100 hover:to-white hover:scale-105 hover:shadow-xl ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1400ms" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Analyze</h3>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:text-purple-700 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-gray-700 mb-8 text-left">
                Get AI-powered health insights and recommendations based on your complete medical history.
              </p>
              <div className="text-left">
                <button
                  onClick={() => handleDemoAccess('patient')}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group-hover:text-emerald-700 transition-colors"
                >
                  Explore insights
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            {/* Carousel Container */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-200/50 overflow-hidden shadow-xl">
              {/* Slide Indicators */}
              <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                <span className="text-purple-700 text-sm font-medium">
                  0{currentSlide + 1}
                </span>
                <div className="w-8 h-0.5 bg-purple-300"></div>
                <span className="text-purple-700 text-sm font-medium">
                  0{totalSlides}
                </span>
              </div>

              {/* Slide Content */}
              <div className="relative h-80 flex items-center">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/40 via-purple-50/30 to-purple-100/40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>

                {/* Content */}
                <div className="relative z-10 w-full px-16 py-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl">
                    {/* Left Content */}
                    <div>
                      <div className="inline-flex items-center px-3 py-1.5 bg-purple-100 backdrop-blur-md text-purple-700 rounded-full text-sm font-medium mb-4 border border-purple-200">
                        <CurrentIcon className="w-4 h-4 mr-2" />
                        {slides[currentSlide].badge}
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {slides[currentSlide].title}
                      </h3>

                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {slides[currentSlide].description}
                      </p>

                      <button
                        onClick={() => navigate(slides[currentSlide].link)}
                        className="inline-flex items-center px-5 py-2.5 bg-purple-100 backdrop-blur-md text-purple-700 font-medium rounded-xl border border-purple-200 hover:bg-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>

                    {/* Right Content - Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 ml-0 lg:ml-0">
                      <div className="bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-purple-200 hover:bg-purple-100 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-900 font-semibold text-xs">
                            Medical Records
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          $2.1B
                        </div>
                        <div className="text-gray-600 text-xs">Protected</div>
                      </div>

                      <div className="bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-purple-200 hover:bg-purple-100 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="w-5 h-5 text-yellow-600" />
                          <span className="text-gray-900 font-semibold text-xs">
                            Healthcare Providers
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          50K+
                        </div>
                        <div className="text-gray-600 text-xs">Connected</div>
                      </div>

                      <div className="bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-purple-200 hover:bg-purple-100 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-emerald-600" />
                          <span className="text-gray-900 font-semibold text-xs">
                            AI Analysis
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          99.8%
                        </div>
                        <div className="text-gray-600 text-xs">Accuracy</div>
                      </div>

                      <div className="bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-purple-200 hover:bg-purple-100 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-900 font-semibold text-xs">
                            Growth
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          +247%
                        </div>
                        <div className="text-gray-600 text-xs">YoY</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
