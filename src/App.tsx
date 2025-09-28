import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, Component, ErrorInfo, ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">Please refresh the page</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const AuthRegister = lazy(() => import("./pages/auth/Register"));
const AuthLogin = lazy(() => import("./pages/auth/Login"));
const PatientDashboard = lazy(() => import("./pages/patient/Dashboard"));
const PatientRecords = lazy(() => import("./pages/patient/Records"));
const PatientPermissions = lazy(() => import("./pages/patient/Permissions"));
const PatientAIChat = lazy(() => import("./pages/patient/AIChat"));
const PatientEmergencyAccess = lazy(() => import("./pages/patient/EmergencyAccess"));
const DoctorDashboard = lazy(() => import("./pages/doctor/Dashboard"));
const DoctorPatientRecords = lazy(() => import("./pages/doctor/PatientRecords"));
const DoctorPatient = lazy(() => import("./pages/doctor/Patient"));
const DoctorClinicalSupport = lazy(() => import("./pages/doctor/ClinicalSupport"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Simple fallback component for testing
const SimpleFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">dr Hedera</h1>
      <p className="text-gray-600 mb-8">Healthcare Platform</p>
      <div className="space-y-4">
        <button className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Get Started
        </button>
        <button className="block w-full px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
          Learn More
        </button>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Web3Provider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<SimpleFallback />} />
                    <Route path="/auth/register" element={<AuthRegister />} />
                    <Route path="/auth/login" element={<AuthLogin />} />
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/records" element={<PatientRecords />} />
                    <Route path="/patient/permissions" element={<PatientPermissions />} />
                    <Route path="/patient/ai-chat" element={<PatientAIChat />} />
                    <Route path="/patient/emergency-access" element={<PatientEmergencyAccess />} />
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/patients" element={<DoctorPatientRecords />} />
                    <Route path="/doctor/patient/:id" element={<DoctorPatient />} />
                    <Route path="/doctor/clinical-support" element={<DoctorClinicalSupport />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </Web3Provider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;