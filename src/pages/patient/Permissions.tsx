import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Shield, 
  Search,
  Filter,
  Calendar,
  Plus,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Stethoscope,
  Activity,
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
  RefreshCw,
  UserPlus,
  UserMinus,
  Lock,
  Unlock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BlockchainPermissions from '@/components/BlockchainPermissions';
import MedicalRecordVault from '@/components/MedicalRecordVault';

const Permissions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useWeb3();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activePermissions = [
    {
      id: '1',
      doctor: 'Dr. Emily Rodriguez',
      specialization: 'Cardiologist',
      access: 'Full Access',
      expires: '2024-06-20',
      lastAccess: '2 hours ago',
      status: 'active',
      permissions: ['Medical Records', 'Lab Results', 'Imaging', 'Prescriptions'],
      description: 'Primary cardiologist with full access to all medical records'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialization: 'Primary Care',
      access: 'Limited Access',
      expires: '2024-12-31',
      lastAccess: '1 day ago',
      status: 'active',
      permissions: ['Lab Results', 'Prescriptions'],
      description: 'Primary care physician with access to lab results and prescriptions'
    },
    {
      id: '3',
      doctor: 'Dr. Sarah Williams',
      specialization: 'Endocrinologist',
      access: 'Lab Results Only',
      expires: '2024-04-15',
      lastAccess: '1 week ago',
      status: 'expiring',
      permissions: ['Lab Results'],
      description: 'Endocrinologist with access to lab results only'
    }
  ];

  const pendingRequests = [
    {
      id: '1',
      doctor: 'Dr. David Kim',
      specialization: 'Neurologist',
      requestedAccess: ['Medical Records', 'Imaging'],
      requestDate: '2024-01-22',
      reason: 'Neurological consultation for headache evaluation',
      status: 'pending'
    },
    {
      id: '2',
      doctor: 'Dr. Lisa Johnson',
      specialization: 'Dermatologist',
      requestedAccess: ['Medical Records'],
      requestDate: '2024-01-21',
      reason: 'Skin condition consultation',
      status: 'pending'
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
      active: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      expiring: { variant: "destructive" as const, icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border text-black`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredPermissions = activePermissions.filter(permission =>
    permission.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.access.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = pendingRequests.filter(request =>
    request.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Access Permissions</h1>
              <p className="text-purple-100">
                Manage who can access your medical records
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                {activePermissions.length} Active
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Permissions
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Active Permissions</span>
              </div>
              <div className="text-2xl font-bold">{activePermissions.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-300" />
                <span className="text-sm text-purple-100">Pending Requests</span>
              </div>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-300" />
                <span className="text-sm text-purple-100">Expiring Soon</span>
              </div>
              <div className="text-2xl font-bold">{activePermissions.filter(p => p.status === 'expiring').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">Security Score</span>
              </div>
              <div className="text-2xl font-bold">95%</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg">
          <div className="relative flex-1 max-w-md bg-white">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
            <Input
              placeholder="Search doctors, specializations, permissions..."
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
              Expiring Soon
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
                  <h3 className="font-semibold text-green-900">Permissions Synced!</h3>
                  <p className="text-green-700 text-sm">
                    Your access permissions have been updated across all systems.
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
                <UserPlus className="h-4 w-4 mr-2" />
                Grant Access
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <UserMinus className="h-4 w-4 mr-2" />
                Revoke Access
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Activity className="h-4 w-4 mr-2" />
                Access Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {filteredRequests.length > 0 && (
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Clock className="h-5 w-5 text-purple-600" />
                Pending Access Requests
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {filteredRequests.length} Pending
                </Badge>
              </CardTitle>
              <CardDescription>
                Doctors requesting access to your medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{request.doctor}</h3>
                        <p className="text-sm text-gray-600">{request.specialization}</p>
                        <p className="text-sm text-gray-500 mt-1">{request.reason}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {request.requestedAccess.map((access) => (
                            <Badge key={access} variant="outline" className="text-xs border-purple-200 text-purple-700">
                              {access}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <UserMinus className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Record Vault Permissions */}
        {isConnected && (
          <MedicalRecordVault />
        )}

        {/* Blockchain Permissions */}
        {isConnected && (
          <BlockchainPermissions />
        )}

        {/* Active Permissions */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Users className="h-5 w-5 text-purple-600" />
              Active Permissions
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {filteredPermissions.length} Active
              </Badge>
            </CardTitle>
            <CardDescription>
              Healthcare providers with access to your medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPermissions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No active permissions found</p>
                <Button onClick={() => navigate('/patient/permissions/grant')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Grant First Permission
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-black">{permission.doctor}</h3>
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                            {permission.access}
                          </Badge>
                          {getStatusBadge(permission.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{permission.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {permission.specialization}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Expires: {permission.expires}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            Last access: {permission.lastAccess}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {permission.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs border-purple-200 text-purple-700">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                        <Settings className="h-4 w-4 mr-1" />
                        Modify
                      </Button>
                      <Button variant="outline" size="sm" className="bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600 hover:border-red-600 transition-all duration-300">
                        <UserMinus className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Permissions;