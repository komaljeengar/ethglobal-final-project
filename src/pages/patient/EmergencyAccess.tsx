import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Shield, 
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Activity,
  Bell,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const EmergencyAccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for emergency settings
  const [settings, setSettings] = useState({
    autoActivate: true,
    activationDelay: 5, // minutes
    maxAccessDuration: 24, // hours
    requireVerification: true,
    notifyContacts: true,
    allowFullAccess: false
  });

  const emergencyContacts = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      relationship: 'Primary Care Physician',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@hospital.com',
      accessLevel: 'Full Medical Records',
      status: 'active',
      lastContact: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Emergency Contact - John Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
      email: 'john.smith@email.com',
      accessLevel: 'Emergency Only',
      status: 'active',
      lastContact: '2024-01-10',
      priority: 'critical'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      relationship: 'Cardiologist',
      phone: '+1 (555) 456-7890',
      email: 'michael.chen@cardio.com',
      accessLevel: 'Cardiac Records Only',
      status: 'inactive',
      lastContact: '2023-12-20',
      priority: 'medium'
    }
  ];

  // Handler functions for settings
  const handleToggleChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleTimeChange = (setting: 'activationDelay' | 'maxAccessDuration', value: number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: Math.max(1, value) // Ensure minimum value of 1
    }));
  };

  const incrementTime = (setting: 'activationDelay' | 'maxAccessDuration') => {
    setSettings(prev => ({
      ...prev,
      [setting]: prev[setting] + 1
    }));
  };

  const decrementTime = (setting: 'activationDelay' | 'maxAccessDuration') => {
    setSettings(prev => ({
      ...prev,
      [setting]: Math.max(1, prev[setting] - 1)
    }));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowRefreshed(true);
    setTimeout(() => setShowRefreshed(false), 3000);
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      critical: { variant: "destructive" as const, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
      high: { variant: "default" as const, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
      medium: { variant: "secondary" as const, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <Badge variant={config.variant} className={`${config.bgColor} ${config.color} ${config.borderColor} border text-black`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
      inactive: { variant: "secondary" as const, icon: Clock, color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border text-black`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Emergency Access</h1>
              <p className="text-purple-100">
                Manage emergency contacts and access permissions for critical situations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                <Heart className="h-3 w-3 mr-1" />
                {emergencyContacts.filter(c => c.status === 'active').length} Active
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Contacts
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="text-sm text-purple-100">Emergency Contacts</span>
              </div>
              <div className="text-2xl font-bold">{emergencyContacts.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm text-purple-100">Active Contacts</span>
              </div>
              <div className="text-2xl font-bold">{emergencyContacts.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-300" />
                <span className="text-sm text-purple-100">Critical Priority</span>
              </div>
              <div className="text-2xl font-bold">{emergencyContacts.filter(c => c.priority === 'critical').length}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-purple-100">Security Level</span>
              </div>
              <div className="text-2xl font-bold">High</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Emergency Contacts Synced!</h3>
                  <p className="text-green-700 text-sm">
                    Your emergency access settings have been updated across all systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Settings */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Settings className="h-5 w-5 text-purple-600" />
              Emergency Access Settings
            </CardTitle>
            <CardDescription>
              Configure how emergency access is activated and managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium text-black">Auto-activate Emergency Access</Label>
                    <p className="text-sm text-purple-600">Automatically activate emergency access in critical situations</p>
                  </div>
                  <Switch 
                    checked={settings.autoActivate} 
                    onCheckedChange={() => handleToggleChange('autoActivate')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium text-black">Require Verification</Label>
                    <p className="text-sm text-purple-600">Require additional verification before granting access</p>
                  </div>
                  <Switch 
                    checked={settings.requireVerification} 
                    onCheckedChange={() => handleToggleChange('requireVerification')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium text-black">Notify Emergency Contacts</Label>
                    <p className="text-sm text-purple-600">Send notifications when emergency access is activated</p>
                  </div>
                  <Switch 
                    checked={settings.notifyContacts} 
                    onCheckedChange={() => handleToggleChange('notifyContacts')}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-black">Activation Delay</Label>
                  <p className="text-sm text-purple-600 mb-2">Time before emergency access is activated</p>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => decrementTime('activationDelay')}
                      className="w-8 h-8 p-0 bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      value={settings.activationDelay} 
                      onChange={(e) => handleTimeChange('activationDelay', parseInt(e.target.value) || 1)}
                      className="w-20 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" 
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => incrementTime('activationDelay')}
                      className="w-8 h-8 p-0 bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200"
                    >
                      +
                    </Button>
                    <span className="text-sm text-purple-600">minutes</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium text-black">Maximum Access Duration</Label>
                  <p className="text-sm text-purple-600 mb-2">How long emergency access remains active</p>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => decrementTime('maxAccessDuration')}
                      className="w-8 h-8 p-0 bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      value={settings.maxAccessDuration} 
                      onChange={(e) => handleTimeChange('maxAccessDuration', parseInt(e.target.value) || 1)}
                      className="w-20 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" 
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => incrementTime('maxAccessDuration')}
                      className="w-8 h-8 p-0 bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200"
                    >
                      +
                    </Button>
                    <span className="text-sm text-purple-600">hours</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-black">Allow Full Medical Records Access</h4>
                <p className="text-sm text-purple-600">Grant complete access to all medical records during emergency</p>
              </div>
              <Switch 
                checked={settings.allowFullAccess} 
                onCheckedChange={() => handleToggleChange('allowFullAccess')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Heart className="h-5 w-5 text-purple-600" />
              Emergency Contacts
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {emergencyContacts.length} Contacts
              </Badge>
            </CardTitle>
            <CardDescription>
              People who can access your medical records in emergency situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-black">{contact.name}</h3>
                        {getPriorityBadge(contact.priority)}
                        {getStatusBadge(contact.status)}
                      </div>
                      <p className="text-sm text-black mb-2">{contact.relationship}</p>
                      <div className="flex items-center gap-4 text-sm text-purple-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last contact: {contact.lastContact}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                          <Shield className="h-3 w-3 mr-1" />
                          {contact.accessLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 transition-all duration-300">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600 hover:border-red-600 transition-all duration-300">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Emergency Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Heart className="h-4 w-4 mr-2" />
                Activate Emergency Access
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Bell className="h-4 w-4 mr-2" />
                Notify All Contacts
              </Button>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:scale-105 transition-all duration-300">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmergencyAccess;
