import React from 'react';
import { Link } from 'react-router-dom';
import {
  Twitter,
  Linkedin,
  Github,
  Sparkles,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Users,
  Building,
  FileText,
  Lock,
  Phone,
  Mail,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Diagonal Stripes Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.1) 0px,
              rgba(255,255,255,0.1) 2px,
              transparent 2px,
              transparent 20px
            )`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Logo and tagline section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-extrabold text-purple-600">Mv</span>
            </div>
            <h3 className="text-3xl font-bold text-white">Dr Hedera</h3>
          </div>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing healthcare through blockchain security and AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Platform Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Platform</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#features"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/patient/dashboard"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Patient Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/doctor/dashboard"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Doctor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  AI Health Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Healthcare Solutions Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Solutions</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Medical Records
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Patient Management
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  AI Diagnostics
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Telemedicine
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Resources</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Legal</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  HIPAA Compliance
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-purple-200 mb-4 md:mb-0 text-sm">
              © {currentYear} Dr Hedera. All rights reserved.
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-purple-200 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-purple-200 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-purple-200 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Brand statement */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="text-xs text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Dr Hedera is a revolutionary healthcare platform that transforms
            medical data management through blockchain security, AI-powered insights,
            and biometric authentication. Our platform supports Flow blockchain,
            World ID verification, and Hedera AI with enterprise-grade security and HIPAA compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
