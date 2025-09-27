import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import AuthRegister from "./pages/auth/Register";
import AuthLogin from "./pages/auth/Login";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientRecords from "./pages/patient/Records";
import PatientPermissions from "./pages/patient/Permissions";
import PatientAIChat from "./pages/patient/AIChat";
import PatientEmergencyAccess from "./pages/patient/EmergencyAccess";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatientRecords from "./pages/doctor/PatientRecords";
import DoctorPatient from "./pages/doctor/Patient";
import DoctorClinicalSupport from "./pages/doctor/ClinicalSupport";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;