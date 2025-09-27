import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  FileText, 
  Users, 
  Brain, 
  Calendar, 
  Heart, 
  Activity, 
  Phone, 
  Settings,
  Upload,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Clock,
  Search,
  Filter,
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
  Plus,
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
  ArrowUpDown as ArrowUpDownIcon,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for healthcare dashboard
  const quickStats = [
    { label: 'Total Records', value: '47', icon: <FileText className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { label: 'Active Permissions', value: '3', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { label: 'AI Chats', value: '12', icon: <Brain className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { label: 'Appointments', value: '2', icon: <Calendar className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  ];

  const recentRecords = [
    {
      id: '1',
      title: 'Blood Test Results',
      doctor: 'Dr. Emily Rodriguez',
      date: '2024-01-20',
      type: 'Lab Results',
      status: 'normal',
      badge: 'Lab',
      value: '$150'
    },
    {
      id: '2',
      title: 'Cardiology Consultation',
      doctor: 'Dr. Emily Rodriguez',
      date: '2024-01-18',
      type: 'Consultation',
      status: 'review',
      badge: 'Visit',
      value: '$300'
    },
    {
      id: '3',
      title: 'Prescription Update',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-15',
      type: 'Medication',
      status: 'active',
      badge: 'Rx',
      value: '$85'
    }
  ];

  const activePermissions = [
    {
      doctor: 'Dr. Emily Rodriguez',
      specialization: 'Cardiologist',
      access: 'Full Access',
      expires: '2024-06-20',
      lastAccess: '2 hours ago',
      status: 'active'
    },
    {
      doctor: 'Dr. Michael Chen',
      specialization: 'Primary Care',
      access: 'Limited Access',
      expires: '2024-12-31',
      lastAccess: '1 day ago',
      status: 'active'
    },
    {
      doctor: 'Dr. Sarah Williams',
      specialization: 'Endocrinologist',
      access: 'Lab Results Only',
      expires: '2024-04-15',
      lastAccess: '1 week ago',
      status: 'expiring'
    }
  ];

  const healthInsights = [
    {
      title: 'Blood Pressure Trend',
      description: 'Your blood pressure has improved by 8% over the last 3 months.',
      type: 'improvement',
      action: 'Continue current medication regimen',
      value: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Medication Reminder',
      description: 'Consider discussing vitamin D supplementation with Dr. Rodriguez.',
      type: 'suggestion',
      action: 'Schedule consultation',
      value: 'Due Soon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Lab Follow-up',
      description: 'Your cholesterol levels need monitoring. Next test due in 2 weeks.',
      type: 'reminder',
      action: 'Book lab appointment',
      value: '2 weeks',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const upcomingAppointments = [
    {
      time: '09:00 AM',
      patient: 'Dr. Emily Rodriguez',
      type: 'Cardiology Follow-up',
      duration: '30 min',
      status: 'confirmed'
    },
    {
      time: '02:00 PM',
      patient: 'Lab Appointment',
      type: 'Blood Work',
      duration: '15 min',
      status: 'confirmed'
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
      normal: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      review: { variant: "secondary" as const, icon: Eye, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      active: { variant: "default" as const, icon: Activity, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
      expiring: { variant: "destructive" as const, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.normal;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border text-black`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRecords = recentRecords.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dr Hedera Patient Dashboard</h1>
              <p className="text-purple-100">
                Welcome back, {user?.name}! Your health data is secure and up to date
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
                  <span className="text-sm text-purple-100">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg">
          <div className="relative flex-1 max-w-md bg-white">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
                <Input
                  placeholder="Search medical records, doctors, appointments..."
                  className="pl-10 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
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
                    Your medical records have been updated across all connected systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Healthcare Info Banner */}
        <Card className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <InfoIcon className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-purple-900">
                  MedVault: Secure Healthcare Data Management
                </p>
                <p className="text-sm text-purple-700">
                  Your medical records are encrypted and stored on the blockchain. 
                  You control who has access to your health information.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    HIPAA Compliant
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Blockchain Secured
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    AI Powered
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Bar */}
        <Card className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300" onClick={() => navigate('/patient/records')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Upload Records
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300" onClick={() => navigate('/patient/ai-chat')}>
                <Brain className="h-4 w-4 mr-2" />
                AI Health Chat
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300" onClick={() => navigate('/patient/permissions')}>
                <Shield className="h-4 w-4 mr-2" />
                Manage Access
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievement/Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Health Milestone</h4>
                  <p className="text-sm text-purple-700">
                    {recentRecords.length >= 10 ? "Health Champion!" : `${10 - recentRecords.length} more records to Health Champion level`}
                  </p>
                </div>
              </div>
              <Progress value={(recentRecords.length / 10) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Data Security Score</h4>
                  <p className="text-sm text-blue-700">
                    {Math.round((activePermissions.filter(p => p.status === 'active').length / Math.max(activePermissions.length, 1)) * 100)}% of permissions active
                  </p>
                </div>
              </div>
              <Progress value={(activePermissions.filter(p => p.status === 'active').length / Math.max(activePermissions.length, 1)) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Connected Providers</h4>
                  <p className="text-sm text-purple-700">
                    Connected to {activePermissions.length} healthcare providers
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {activePermissions.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded ${i < activePermissions.length ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-200"}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Health Records Overview */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <FileText className="h-5 w-5 text-purple-600" />
                Recent Medical Records
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  LIVE
                </Badge>
              </CardTitle>
              <CardDescription>
                Your latest medical records and test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-600">No records found</p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" onClick={() => navigate('/patient/records')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First Record
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 via-white to-blue-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-purple-900">{record.title}</p>
                          <p className="text-xs text-purple-600">
                            {record.doctor} • {record.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm text-purple-700">{record.value}</p>
                        <div className="flex items-center gap-1">
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Health Insights */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Health Insights
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI
                </Badge>
              </CardTitle>
              <CardDescription>
                Personalized health recommendations from AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-black">{insight.title}</h4>
                      <Badge className={`${insight.bgColor} ${insight.color} border-0`}>
                        {insight.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-purple-600 mb-2">{insight.description}</p>
                    <Button variant="link" className="p-0 text-xs h-auto text-purple-600 hover:text-purple-800">
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments & Permissions */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                Your scheduled medical appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Appointments */}
              <div className="space-y-3">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 via-white to-indigo-50 rounded-lg border border-purple-200">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-purple-900">{appointment.time}</p>
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700">{appointment.patient}</p>
                      <p className="text-xs text-purple-600">
                        {appointment.type} • {appointment.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Active Permissions */}
              <div>
                <h4 className="font-semibold text-sm mb-3 text-black">Active Permissions</h4>
                <div className="text-black space-y-2">
                  {activePermissions.slice(0, 3).map((permission, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 via-white to-indigo-50 rounded-lg border border-purple-200">
                      <div className="flex-1">
                        <p className="font-medium text-xs text-purple-900">{permission.doctor}</p>
                        <p className="text-xs text-purple-600">{permission.specialization}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(permission.status)}
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

export default Dashboard;