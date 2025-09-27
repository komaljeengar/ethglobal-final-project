import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Share,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Stethoscope,
  Activity,
  Shield,
  User,
  Building,
  Globe,
  Zap,
  ChevronRight,
  Target,
  Network,
  DollarSign,
  TrendingUp,
  TrendingDown,
  InfoIcon,
  ArrowUpRight,
  Landmark,
  Wallet,
  Coins,
  Truck,
  Home,
  Car,
  Bell,
  Settings,
  RefreshCw,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const PatientRecords = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const patients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      patientId: 'PT-001',
      age: 45,
      condition: 'Hypertension',
      status: 'stable',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-15',
      riskLevel: 'low',
      records: 12,
      permissions: 'Full Access'
    },
    {
      id: '2',
      name: 'Michael Brown',
      patientId: 'PT-002',
      age: 52,
      condition: 'Post-Surgery Monitoring',
      status: 'monitoring',
      lastVisit: '2024-01-21',
      nextAppointment: '2024-01-28',
      riskLevel: 'high',
      records: 8,
      permissions: 'Full Access'
    },
    {
      id: '3',
      name: 'Emma Davis',
      patientId: 'PT-003',
      age: 38,
      condition: 'Diabetes Type 2',
      status: 'improving',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-02-01',
      riskLevel: 'medium',
      records: 15,
      permissions: 'Limited Access'
    },
    {
      id: '4',
      name: 'John Smith',
      patientId: 'PT-004',
      age: 60,
      condition: 'Cardiovascular Disease',
      status: 'stable',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-10',
      riskLevel: 'medium',
      records: 20,
      permissions: 'Full Access'
    },
    {
      id: '5',
      name: 'Lisa Wilson',
      patientId: 'PT-005',
      age: 35,
      condition: 'Thyroid Disorder',
      status: 'stable',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-02-05',
      riskLevel: 'low',
      records: 6,
      permissions: 'Lab Results Only'
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
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
      monitoring: { variant: "secondary" as const, icon: Eye, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stable;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const riskConfig = {
      low: { variant: "default" as const, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      medium: { variant: "secondary" as const, color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
      high: { variant: "destructive" as const, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" }
    };

    const config = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.low;

    return (
      <Badge variant={config.variant} className={`${config.bgColor} ${config.color} ${config.borderColor} border`}>
        {riskLevel} Risk
      </Badge>
    );
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Records</h1>
              <p className="text-purple-100">
                Access and manage patient medical records with permission-based security
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                {filteredPatients.length} Patients
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Records
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Total Patients</span>
              </div>
              <div className="text-2xl font-bold">{patients.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Stable Patients</span>
              </div>
              <div className="text-2xl font-bold">{patients.filter(p => p.status === 'stable').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-orange-300" />
                <span className="text-sm text-purple-100">Under Monitoring</span>
              </div>
              <div className="text-2xl font-bold">{patients.filter(p => p.status === 'monitoring').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">Total Records</span>
              </div>
              <div className="text-2xl font-bold">{patients.reduce((sum, p) => sum + p.records, 0)}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients, conditions, IDs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Visits
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
                  <h3 className="font-semibold text-green-900">Records Synced!</h3>
                  <p className="text-green-700 text-sm">
                    Patient records have been updated from all connected systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Bar */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Upload Records
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Access Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No patients found</p>
                <Button onClick={() => navigate('/doctor/patients/add')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Patient
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {patient.patientId}
                          </Badge>
                          {getStatusBadge(patient.status)}
                          {getRiskBadge(patient.riskLevel)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {patient.condition} • Age: {patient.age} • {patient.records} records
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Last visit: {patient.lastVisit}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Next: {patient.nextAppointment}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            {patient.permissions}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {patient.records} Records
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/doctor/patient/${patient.id}`)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Records
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;