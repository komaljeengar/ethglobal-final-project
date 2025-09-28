import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";

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
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Web3Provider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
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
        </AuthProvider>
      </Web3Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;