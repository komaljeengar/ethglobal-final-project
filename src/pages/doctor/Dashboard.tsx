import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Stethoscope, 
  Users, 
  FileText, 
  Clock, 
  Calendar, 
  Brain, 
  MessageSquare,
  Search,
  Plus,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  UserPlus,
  Bell,
  Shield,
  Activity,
  RefreshCw,
  DollarSign,
  Building,
  Globe,
  Zap,
  PlusCircle,
  ChevronRight,
  Target,
  Network,
  Link as LinkIcon,
  Percent,
  CreditCard,
  Banknote,
  Layers,
  Trophy,
  XCircle,
  FileCheck,
  ExternalLink,
  Send,
  ArrowUpDown,
  ShieldCheck,
  Smartphone,
  ArrowLeftRight,
  BarChart3,
  TrendingDown,
  InfoIcon,
  ArrowUpRight,
  Landmark,
  Wallet,
  Coins,
  Truck,
  Home,
  Car,
  User,
  LogOut,
  Phone,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickStats = [
    { label: 'Active Patients', value: '42', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { label: 'Pending Requests', value: '7', icon: <Clock className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { label: 'Today\'s Appointments', value: '8', icon: <Calendar className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { label: 'AI Consultations', value: '15', icon: <Brain className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  ];

  const pendingRequests = [
    {
      id: '1',
      patient: 'Sarah Johnson',
      patientId: 'PT-001',
      condition: 'Heart Condition Follow-up',
      requestedAccess: ['Lab Results', 'Imaging', 'Consultations'],
      urgency: 'routine',
      requestDate: '2024-01-22',
      reason: 'Quarterly cardiology follow-up appointment scheduled for next week',
      value: '$450'
    },
    {
      id: '2',
      patient: 'Michael Brown',
      patientId: 'PT-002',
      condition: 'Post-Surgery Monitoring',
      requestedAccess: ['Full Access'],
      urgency: 'urgent',
      requestDate: '2024-01-21',
      reason: 'Post-operative complications monitoring after cardiac procedure',
      value: '$800'
    },
    {
      id: '3',
      patient: 'Emma Davis',
      patientId: 'PT-003',
      condition: 'Hypertension Management',
      requestedAccess: ['Lab Results', 'Prescriptions'],
      urgency: 'routine',
      requestDate: '2024-01-20',
      reason: 'Medication adjustment consultation for blood pressure management',
      value: '$200'
    }
  ];

  const recentPatients = [
    {
      id: '1',
      name: 'John Smith',
      patientId: 'PT-004',
      lastVisit: '2024-01-20',
      condition: 'Diabetes Type 2',
      status: 'stable',
      nextAppointment: '2024-02-15',
      riskLevel: 'low',
      value: '$300'
    },
    {
      id: '2',
      name: 'Lisa Wilson',
      patientId: 'PT-005',
      lastVisit: '2024-01-18',
      condition: 'Hypertension',
      status: 'improving',
      nextAppointment: '2024-01-25',
      riskLevel: 'medium',
      value: '$250'
    },
    {
      id: '3',
      name: 'David Chen',
      patientId: 'PT-006',
      lastVisit: '2024-01-15',
      condition: 'Post-MI Recovery',
      status: 'monitoring',
      nextAppointment: '2024-01-24',
      riskLevel: 'high',
      value: '$600'
    }
  ];

  const todaysAppointments = [
    {
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      type: 'Follow-up',
      duration: '30 min',
      status: 'confirmed',
      value: '$300'
    },
    {
      time: '10:00 AM',
      patient: 'Michael Brown',
      type: 'Post-Op Check',
      duration: '45 min',
      status: 'confirmed',
      value: '$450'
    },
    {
      time: '11:30 AM',
      patient: 'Emma Davis',
      type: 'Consultation',
      duration: '30 min',
      status: 'pending',
      value: '$200'
    },
    {
      time: '02:00 PM',
      patient: 'Robert Taylor',
      type: 'Initial Visit',
      duration: '60 min',
      status: 'confirmed',
      value: '$500'
    }
  ];

  const clinicalInsights = [
    {
      title: 'Drug Interaction Alert',
      description: 'Patient John Smith: Potential interaction between Lisinopril and new NSAID prescription',
      type: 'warning',
      patient: 'John Smith',
      action: 'Review medication list',
      value: 'High Risk',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Lab Results Follow-up',
      description: 'Lisa Wilson: HbA1c improved to 6.8% - consider medication adjustment',
      type: 'success',
      patient: 'Lisa Wilson',
      action: 'Schedule consultation',
      value: 'Improved',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Risk Assessment Update',
      description: 'David Chen: Cardiovascular risk score increased based on latest vitals',
      type: 'alert',
      patient: 'David Chen',
      action: 'Urgent review needed',
      value: 'Critical',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowRefreshed(true);
    setTimeout(() => setShowRefreshed(false), 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      improving: { variant: "default" as const, icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      monitoring: { variant: "secondary" as const, icon: Eye, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
      urgent: { variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
      routine: { variant: "secondary" as const, icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      confirmed: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.routine;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRequests = pendingRequests.filter(request =>
    request.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.urgency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = recentPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dr.0G Doctor Dashboard</h1>
              <p className="text-blue-100">
                Good morning, {user?.name}! Managing patient care with AI insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Data
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm text-blue-100">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients, conditions, appointments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Data Synced!</h3>
                  <p className="text-green-700 text-sm">
                    Your patient data has been updated across all connected systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Healthcare Info Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <InfoIcon className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-900">
                  MedVault: AI-Powered Clinical Support
                </p>
                <p className="text-sm text-blue-700">
                  Access patient records with permission-based security. 
                  AI insights help with diagnosis and treatment recommendations.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {pendingRequests.length} Pending Requests
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {todaysAppointments.length} Today's Appointments
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    AI Clinical Support
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Bar */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white" onClick={() => navigate('/doctor/patient-records')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white" onClick={() => navigate('/doctor/ai-chat')}>
                <Brain className="h-4 w-4 mr-2" />
                AI Clinical Support
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Medical Knowledge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievement/Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-100 via-white to-blue-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Patient Care Milestone</h4>
                  <p className="text-sm text-purple-700">
                    {recentPatients.length >= 50 ? "Expert Physician!" : `${50 - recentPatients.length} more patients to Expert level`}
                  </p>
                </div>
              </div>
              <Progress value={(recentPatients.length / 50) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 via-white to-indigo-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">AI Support Score</h4>
                  <p className="text-sm text-blue-700">
                    {Math.round((clinicalInsights.filter(i => i.type === 'success').length / Math.max(clinicalInsights.length, 1)) * 100)}% positive outcomes
                  </p>
                </div>
              </div>
              <Progress value={(clinicalInsights.filter(i => i.type === 'success').length / Math.max(clinicalInsights.length, 1)) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 via-white to-blue-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Connected Patients</h4>
                  <p className="text-sm text-purple-700">
                    Managing {recentPatients.length} active patients
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {recentPatients.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded ${i < recentPatients.length ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-200"}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pending Access Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Patient Access Requests
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {filteredRequests.length} Pending
                </Badge>
              </CardTitle>
              <CardDescription>
                Patient requests for medical record access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{request.patient}</p>
                          <p className="text-xs text-gray-600">
                            {request.condition} • {request.patientId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{request.value}</p>
                        <div className="flex items-center gap-1">
                          {getStatusBadge(request.urgency)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Clinical Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Clinical Insights
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-powered clinical recommendations and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicalInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge className={`${insight.bgColor} ${insight.color} border-0`}>
                        {insight.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="link" className="p-0 text-xs h-auto">
                        {insight.action}
                      </Button>
                      <Button variant="link" className="p-0 text-xs h-auto">
                        View {insight.patient}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule & Recent Patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your scheduled appointments for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Appointments */}
              <div className="space-y-3">
                {todaysAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{appointment.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.patient}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.type} • {appointment.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{appointment.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Recent Patients */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Recent Patients</h4>
                <div className="space-y-2">
                  {recentPatients.slice(0, 3).map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-xs">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.condition}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(patient.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;