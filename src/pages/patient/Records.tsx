import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Upload, 
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
  Brain,
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
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EncryptedDocumentUpload from '@/components/EncryptedDocumentUpload';
import MedicalRecordVault from '@/components/MedicalRecordVault';

const Records = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useWeb3();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userRecords, setUserRecords] = useState([]);

  // Check if user is in demo mode
  React.useEffect(() => {
    const isDemo = user?.email?.includes('demo') || user?.name?.includes('Demo') || user?.id === '1' || user?.id === '2';
    setIsDemoMode(isDemo);
  }, [user]);

  // Demo records for demo users, empty for real users
  const demoRecords = [
    {
      id: '1',
      title: 'Blood Test Results',
      doctor: 'Dr. Emily Rodriguez',
      date: '2024-01-20',
      type: 'Lab Results',
      status: 'normal',
      badge: 'Lab',
      value: '$150',
      description: 'Complete blood count, lipid panel, and metabolic panel results'
    },
    {
      id: '2',
      title: 'Cardiology Consultation',
      doctor: 'Dr. Emily Rodriguez',
      date: '2024-01-18',
      type: 'Consultation',
      status: 'review',
      badge: 'Visit',
      value: '$300',
      description: 'Cardiovascular examination and EKG interpretation'
    },
    {
      id: '3',
      title: 'Prescription Update',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-15',
      type: 'Medication',
      status: 'active',
      badge: 'Rx',
      value: '$85',
      description: 'Updated medication regimen for hypertension management'
    },
    {
      id: '4',
      title: 'X-Ray Results',
      doctor: 'Dr. Sarah Williams',
      date: '2024-01-12',
      type: 'Imaging',
      status: 'normal',
      badge: 'X-Ray',
      value: '$200',
      description: 'Chest X-ray showing clear lung fields and normal heart size'
    },
    {
      id: '5',
      title: 'MRI Scan',
      doctor: 'Dr. David Kim',
      date: '2024-01-10',
      type: 'Imaging',
      status: 'pending',
      badge: 'MRI',
      value: '$800',
      description: 'Brain MRI for headache evaluation - results pending'
    }
  ];

  const medicalRecords = isDemoMode ? demoRecords : userRecords;

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
      normal: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      review: { variant: "secondary" as const, icon: Eye, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      active: { variant: "default" as const, icon: Activity, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
      pending: { variant: "destructive" as const, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" }
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

  const filteredRecords = medicalRecords.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
              <p className="text-purple-100">
                Manage and access your complete medical history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Activity className="h-3 w-3 mr-1" />
                {filteredRecords.length} Records
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
                <FileText className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Total Records</span>
              </div>
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Completed</span>
              </div>
              <div className="text-2xl font-bold">{medicalRecords.filter(r => r.status === 'normal').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-300" />
                <span className="text-sm text-purple-100">Pending</span>
              </div>
              <div className="text-2xl font-bold">{medicalRecords.filter(r => r.status === 'pending').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">Under Review</span>
              </div>
              <div className="text-2xl font-bold">{medicalRecords.filter(r => r.status === 'review').length}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg">
          <div className="relative flex-1 max-w-md bg-white">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
            <Input
              placeholder="Search medical records, doctors, types..."
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

        {/* Demo Mode Warning */}
        {isDemoMode && (
          <Card className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-yellow-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-yellow-900">
                    Demo Mode Active
                  </p>
                  <p className="text-sm text-yellow-700">
                    You are viewing demo medical records. Create a real account to start managing your actual medical records.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Demo Data
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Sample Records
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Records Synced!</h3>
                  <p className="text-green-700 text-sm">
                    Your medical records have been updated from all connected providers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Bar */}
        <Card className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Record
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Share className="h-4 w-4 mr-2" />
                Share Records
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical Record Vault */}
        {isConnected && (
          <MedicalRecordVault />
        )}

        {/* Encrypted Document Upload */}
        {isConnected && (
          <EncryptedDocumentUpload />
        )}

        {/* Medical Records List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isDemoMode ? "No medical records found" : "No medical records yet"}
                </p>
                {!isDemoMode && (
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your first medical record to get started
                  </p>
                )}
                <Button onClick={() => navigate('/patient/records/upload')}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isDemoMode ? "Upload Your First Record" : "Upload Medical Records"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-black">{record.title}</h3>
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                            {record.badge}
                          </Badge>
                          {getStatusBadge(record.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {record.doctor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {record.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {record.value}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <Share className="h-4 w-4 mr-1" />
                        Share
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

export default Records;