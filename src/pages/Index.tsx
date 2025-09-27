import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CarouselHero } from '@/components/ui/carousel-hero';
import { AnimatedText } from '@/components/ui/animated-text';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { AnimatedStatCard } from '@/components/ui/animated-stat-card';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { useScrollAnimation, useStaggeredAnimation, useParallax } from '@/hooks/useScrollAnimation';
import { 
  Shield, 
  Brain, 
  Globe, 
  Users, 
  Lock, 
  Zap, 
  Eye, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  FileCheck,
  Upload,
  Sparkles,
  DollarSign,
  Activity,
  Building,
  Coins,
  Settings,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { setDemoMode } = useAuth();

  const handleGetStarted = () => {
    navigate('/auth/register');
  };

  const handleDemoAccess = (role: 'patient' | 'doctor') => {
    setDemoMode(role);
    navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Blockchain Security",
      description: "Your medical data is secured on Flow blockchain with immutable records and cryptographic protection."
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "World ID Authentication",
      description: "Biometric verification ensures only you can access your medical records with iris scanning technology."
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "AI Health Assistant",
      description: "Hedera AI analyzes your medical history to provide personalized health insights and recommendations."
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Permission Control",
      description: "Grant granular access to doctors and revoke permissions instantly. You control who sees your data."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Universal Access",
      description: "Access your medical records anywhere in the world. Emergency care without borders."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Instant Updates",
      description: "Real-time synchronization across all authorized healthcare providers and devices."
    }
  ];

  const stats = [
    { number: "250K+", label: "Patients Protected" },
    { number: "50K+", label: "Healthcare Providers" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "0", label: "Data Breaches" }
  ];

  const technologies = [
    { name: "Flow Blockchain", color: "bg-primary text-primary-foreground" },
    { name: "World ID", color: "bg-secondary text-secondary-foreground" },
    { name: "Hedera AI", color: "bg-accent text-accent-foreground" },
    { name: "IPFS Storage", color: "bg-muted text-muted-foreground" }
  ];

  // Scroll animation refs for major sections
  const [tokenizationRef, tokenizationVisible] = useScrollAnimation(0);
  const [tvlRef, tvlVisible] = useScrollAnimation(0);
  const [analyticsRef, analyticsVisible] = useScrollAnimation(0);
  const [featuresRef, featuresVisible] = useStaggeredAnimation(6, 100);
  const [statsRef, statsVisible] = useStaggeredAnimation(4, 100);
  const [parallaxRef, parallaxTransform] = useParallax(-0.3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <CarouselHero user={null} />

      {/* Tokenization Platform Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 opacity-5"
          style={{ transform: parallaxTransform }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div ref={tokenizationRef}>
                <div
                  className={`inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
                    tokenizationVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-90"
                  }`}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Medical Data Security
                </div>

                <AnimatedText
                  text="The only medical data platform you'll ever need"
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                  delay={100}
                />

                <div className="space-y-6 mb-8" ref={featuresRef}>
                  {[
                    {
                      icon: Upload,
                      title: "Upload and verify with ease",
                      description:
                        "Submit documentation for your medical records including test results, prescriptions, and diagnoses.",
                    },
                    {
                      icon: Sparkles,
                      title: "Mint verified NFTs",
                      description:
                        "AI-powered verification system creates immutable blockchain tokens of your medical data.",
                    },
                    {
                      icon: DollarSign,
                      title: "Access instant insights",
                      description:
                        "Use your medical NFTs to get AI-powered health analysis and personalized recommendations.",
                    },
                    {
                      icon: Globe,
                      title: "Connect to global healthcare",
                      description:
                        "Deploy across multiple healthcare networks for optimal access and comprehensive care.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                        featuresVisible[index]
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-12"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-500 ${
                          featuresVisible[index]
                            ? "scale-100 rotate-0"
                            : "scale-0 rotate-180"
                        }`}
                        style={{ transitionDelay: `${index * 100 + 150}ms` }}
                      >
                        <feature.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-gray-900 mb-2 transition-all duration-500 ${
                            featuresVisible[index]
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${index * 100 + 250}ms` }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={`text-gray-600 transition-all duration-500 ${
                            featuresVisible[index]
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${index * 100 + 350}ms` }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    tokenizationVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <Button
                    onClick={handleGetStarted}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Content - Dashboard Preview */}
              <div
                className={`relative transition-all duration-1500 ease-out ${
                  tokenizationVisible
                    ? "opacity-100 translate-x-0 rotate-0"
                    : "opacity-0 translate-x-12 rotate-3"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Dashboard Header */}
                  <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Mv</span>
                      </div>
                      <span className="text-white font-medium">
                        Dr.0G Dashboard
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                        style={{ animationDelay: "500ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: "1000ms" }}
                      ></div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div
                        className={`bg-blue-50 rounded-xl p-4 transition-all duration-700 ${
                          tokenizationVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: "1200ms" }}
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          $2.5M
                        </div>
                        <div className="text-blue-600 text-sm font-medium">
                          Records Secured
                        </div>
                      </div>
                      <div
                        className={`bg-green-50 rounded-xl p-4 transition-all duration-700 ${
                          tokenizationVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: "1400ms" }}
                      >
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          850K
                        </div>
                        <div className="text-green-600 text-sm font-medium">
                          AI Insights Generated
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: "Blood Test Results",
                          type: "Lab Report • Verified",
                          value: "Normal",
                          change: "+2.1%",
                        },
                        {
                          name: "X-Ray Scan",
                          type: "Imaging • Pending",
                          value: "Clear",
                          change: "+5.7%",
                        },
                        {
                          name: "Prescription",
                          type: "Medication • Verified",
                          value: "Active",
                          change: "-1.2%",
                        },
                      ].map((record, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-700 ${
                            tokenizationVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4"
                          }`}
                          style={{ transitionDelay: `${1600 + index * 200}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FileCheck className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {record.name}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {record.type}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {record.value}
                            </div>
                            <div
                              className={`text-sm ${record.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {record.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Total Value Locked Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div ref={tvlRef}>
              <AnimatedCounter
                targetValue={250000000}
                prefix="$"
                duration={3000}
                className={`text-6xl lg:text-8xl font-mono font-bold text-gray-900 mb-4 tracking-wider transition-all duration-1500 ${
                  tvlVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
              <div
                className={`flex items-center justify-center gap-2 mb-16 transition-all duration-1000 ${
                  tvlVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <h3 className="text-lg font-semibold text-gray-600 uppercase tracking-wide">
                  MEDICAL RECORDS SECURED ON BLOCKCHAIN
                </h3>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div
                className={`text-left transition-all duration-1200 ${
                  tvlVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <AnimatedText
                  text="Why Dr.0G is the healthcare standard"
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
                  delay={1000}
                />

                <div className="space-y-8">
                  {[
                    {
                      title: "Institutional-grade security",
                      description:
                        "Dr.0G protocols are secured by enterprise-level security audits with a proven track record of protecting millions of medical records.",
                    },
                    {
                      title: "Cross-platform compatibility",
                      description:
                        "Dr.0G connects existing healthcare systems to any blockchain network and enables seamless multi-platform data management.",
                    },
                    {
                      title: "Healthcare-ready infrastructure",
                      description:
                        "Dr.0G provides healthcare institutions with comprehensive documentation, dedicated support, and proven scalability.",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-1000 ${
                        tvlVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${1200 + index * 300}ms` }}
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6" ref={statsRef}>
                <AnimatedStatCard
                  value={250000}
                  label="Medical Records Secured"
                  delay={statsVisible[0] ? 0 : 1000}
                  color="blue"
                />
                <AnimatedStatCard
                  value={50000}
                  label="Healthcare Providers"
                  delay={statsVisible[1] ? 200 : 1000}
                  color="purple"
                />
                <AnimatedStatCard
                  value={99.9}
                  suffix="%"
                  label="Uptime Guarantee"
                  delay={statsVisible[2] ? 400 : 1000}
                  color="green"
                />
                <AnimatedStatCard
                  value={0}
                  label="Data Breaches"
                  delay={statsVisible[3] ? 600 : 1000}
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-48 bg-gray-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div ref={analyticsRef}>
                <div
                  className={`inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${
                    analyticsVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-90"
                  }`}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Analytics
                </div>

                <AnimatedText
                  text="Medical data is in our DNA"
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                  delay={200}
                />

                <div
                  className={`space-y-6 mb-8 transition-all duration-1000 ${
                    analyticsVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Explore comprehensive medical data, analyze health trends, or
                    simply learn more about blockchain-secured healthcare.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Comprehensive medical data API",
                      "Industry-leading analytics dashboard",
                      "Real-time health insights",
                      "Trend analysis and predictions",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 transition-all duration-700 ${
                          analyticsVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                        }`}
                        style={{ transitionDelay: `${600 + index * 150}ms` }}
                      >
                        <div
                          className={`w-2 h-2 bg-blue-500 rounded-full transition-all duration-500 ${
                            analyticsVisible ? "scale-100" : "scale-0"
                          }`}
                          style={{ transitionDelay: `${800 + index * 150}ms` }}
                        ></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`transition-all duration-1000 ${
                    analyticsVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: "1200ms" }}
                >
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Explore Analytics
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Content - Analytics Dashboard */}
              <div
                className={`relative transition-all duration-1500 ease-out ${
                  analyticsVisible
                    ? "opacity-100 translate-x-0 rotate-0"
                    : "opacity-0 translate-x-12 rotate-3"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Dashboard Header */}
                  <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center transition-all duration-700 ${
                          analyticsVisible
                            ? "scale-100 rotate-0"
                            : "scale-0 rotate-180"
                        }`}
                        style={{ transitionDelay: "1000ms" }}
                      >
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className={`text-white font-medium transition-all duration-700 ${
                          analyticsVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        }`}
                        style={{ transitionDelay: "1200ms" }}
                      >
                        Dr.0G Analytics Dashboard
                      </span>
                    </div>
                    <div
                      className={`text-orange-400 text-sm font-medium transition-all duration-700 ${
                        analyticsVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4"
                      }`}
                      style={{ transitionDelay: "1400ms" }}
                    >
                      Live Data
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        {
                          value: "$2.5B",
                          label: "Records Secured",
                          color: "text-gray-900",
                        },
                        {
                          value: "25.7K",
                          label: "NFTs Minted",
                          color: "text-blue-600",
                        },
                        {
                          value: "99.8%",
                          label: "Success Rate",
                          color: "text-green-600",
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className={`text-center transition-all duration-700 ${
                            analyticsVisible
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${1600 + index * 200}ms` }}
                        >
                          <div
                            className={`text-2xl font-bold mb-1 ${stat.color}`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart Area */}
                    <div
                      className={`bg-gray-50 rounded-xl p-4 h-32 flex items-center justify-center mb-4 transition-all duration-1000 ${
                        analyticsVisible
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                      style={{ transitionDelay: "2200ms" }}
                    >
                      <div className="flex items-end gap-2">
                        {[16, 20, 12, 24, 18, 22, 14].map((height, index) => (
                          <div
                            key={index}
                            className={`w-4 bg-blue-500 rounded-t transition-all duration-1000 ease-out ${
                              analyticsVisible ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                              height: `${height * 4}px`,
                              transitionDelay: `${2400 + index * 100}ms`,
                              backgroundColor: `hsl(${210 + index * 10}, 70%, ${50 + index * 5}%)`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { category: "Lab Reports", percentage: "68.4%" },
                        { category: "Imaging", percentage: "23.1%" },
                        { category: "Prescriptions", percentage: "8.5%" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between text-sm transition-all duration-700 ${
                            analyticsVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4"
                          }`}
                          style={{ transitionDelay: `${3000 + index * 200}ms` }}
                        >
                          <span className="text-gray-600">{item.category}</span>
                          <span className="font-medium text-gray-900">
                            {item.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;