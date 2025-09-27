import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Shield, 
  Bell, 
  Wallet, 
  Eye, 
  Smartphone,
  Lock,
  Key,
  CheckCircle,
  Settings as SettingsIcon,
  Save,
  AlertTriangle,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Settings = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialization: user?.specialization || '',
    licenseNumber: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emergencyAlerts: true,
    appointmentReminders: true,
    labResults: true,
    medicationReminders: true,
    accessRequests: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareWithEmergency: true,
    allowResearch: false,
    dataRetention: '7years',
    auditTrail: true,
    anonymousAnalytics: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    deviceTrust: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Auto-enable editing when user starts typing
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', formData);
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      specialization: user?.specialization || '',
      licenseNumber: '',
    });
    setIsEditing(false);
  };

  const blockchainInfo = {
    walletAddress: '0x742d35Cc6688C02532898FcF434670a6EB91F6B8',
    network: 'Hedera EVM',
    recordsStored: 47,
    totalTransactions: 156,
    storageUsed: '2.3 GB',
    ipfsNodes: 15
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-purple-100">
                Manage your account, privacy, and security preferences
              </p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Privacy</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="blockchain" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Blockchain</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black">Profile Information</h2>
                  <div className="flex gap-2">
                    {isEditing && (
                      <Button 
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-400"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    <Button 
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      className={isEditing ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400"}
                    >
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-black">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={false}
                      placeholder="Enter your full name"
                      className="mt-2 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={false}
                      placeholder="Enter your email address"
                      className="mt-2 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-black">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={false}
                      placeholder="Enter your phone number"
                      className="mt-2 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400 transition-colors duration-200"
                    />
                  </div>
                  {user?.role === 'doctor' && (
                    <>
                      <div>
                        <Label htmlFor="specialization" className="text-black">Specialization</Label>
                        <Input
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          disabled={false}
                          placeholder="Enter your medical specialization"
                          className="mt-2 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400 transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber" className="text-black">Medical License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          disabled={false}
                          placeholder="Enter your medical license number"
                          className="mt-2 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400 transition-colors duration-200"
                        />
                      </div>
                    </>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-black">Account Status</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      <Shield className="w-3 h-3 mr-1" />
                      {user?.role === 'doctor' ? 'Licensed Physician' : 'Patient Account'}
                    </Badge>
                    {user?.role === 'doctor' && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Board Certified
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-black">Privacy & Data Control</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Emergency Access</h3>
                      <p className="text-sm text-purple-600">
                        Allow emergency medical personnel to access your critical health information
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareWithEmergency}
                      onCheckedChange={(checked) => handlePrivacyChange('shareWithEmergency', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Medical Research Participation</h3>
                      <p className="text-sm text-purple-600">
                        Anonymously contribute your health data to medical research studies
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowResearch}
                      onCheckedChange={(checked) => handlePrivacyChange('allowResearch', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Audit Trail</h3>
                      <p className="text-sm text-purple-600">
                        Maintain detailed logs of who accessed your records and when
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.auditTrail}
                      onCheckedChange={(checked) => handlePrivacyChange('auditTrail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Anonymous Analytics</h3>
                      <p className="text-sm text-purple-600">
                        Help improve MedVault with anonymous usage analytics
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.anonymousAnalytics}
                      onCheckedChange={(checked) => handlePrivacyChange('anonymousAnalytics', checked)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-medium mb-4 text-black">Data Retention</h3>
                  <p className="text-sm text-purple-600 mb-4">
                    Choose how long your medical data is retained on the blockchain
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      5 Years
                    </Button>
                    <Button variant="outline" className="justify-start bg-purple-600 text-white border-purple-600 hover:bg-purple-700">
                      7 Years (Recommended)
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      Indefinite
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-black">Security & Authentication</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Two-Factor Authentication</h3>
                      <p className="text-sm text-purple-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                  </div>


                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black">Trusted Devices</h3>
                      <p className="text-sm text-purple-600">
                        Remember trusted devices to reduce authentication frequency
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.deviceTrust}
                      onCheckedChange={(checked) => handleSecurityChange('deviceTrust', checked)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium text-black">Password & Authentication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Manage Devices
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Lock className="w-4 h-4 mr-2" />
                      Recovery Codes
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Account Security Notice</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Your account security is critical for protecting sensitive medical data. 
                        Ensure all security features are enabled and your recovery methods are up to date.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-black">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4 text-black">Communication Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">Email Notifications</h4>
                          <p className="text-sm text-purple-600">
                            Receive updates and alerts via email
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">SMS Notifications</h4>
                          <p className="text-sm text-purple-600">
                            Get urgent alerts via text message
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">Push Notifications</h4>
                          <p className="text-sm text-purple-600">
                            Browser and mobile app notifications
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4 text-black">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-red-700">Emergency Alerts</h4>
                          <p className="text-sm text-purple-600">
                            Critical medical alerts and emergency access notifications
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emergencyAlerts}
                          onCheckedChange={(checked) => handleNotificationChange('emergencyAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">Appointment Reminders</h4>
                          <p className="text-sm text-purple-600">
                            Upcoming appointments and scheduling changes
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.appointmentReminders}
                          onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">Lab Results</h4>
                          <p className="text-sm text-purple-600">
                            New lab results and medical reports
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.labResults}
                          onCheckedChange={(checked) => handleNotificationChange('labResults', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-black">Access Requests</h4>
                          <p className="text-sm text-purple-600">
                            Doctor permission requests and access notifications
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.accessRequests}
                          onCheckedChange={(checked) => handleNotificationChange('accessRequests', checked)}
                        />
                      </div>

                      {user?.role === 'patient' && (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-black">Medication Reminders</h4>
                            <p className="text-sm text-purple-600">
                              Daily medication and prescription refill reminders
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.medicationReminders}
                            onCheckedChange={(checked) => handleNotificationChange('medicationReminders', checked)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Blockchain Settings */}
          <TabsContent value="blockchain" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-black">Blockchain & Storage</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4 text-black">Wallet Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-purple-600">Wallet Address</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {blockchainInfo.walletAddress}
                          </code>
                          <Button variant="ghost" size="sm">
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-purple-600">Network</Label>
                        <p className="text-sm mt-1 text-black">{blockchainInfo.network}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 text-black">Storage Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Records Stored:</span>
                        <span className="text-sm font-medium">{blockchainInfo.recordsStored}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Total Transactions:</span>
                        <span className="text-sm font-medium">{blockchainInfo.totalTransactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">IPFS Storage:</span>
                        <span className="text-sm font-medium">{blockchainInfo.storageUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">IPFS Nodes:</span>
                        <span className="text-sm font-medium">{blockchainInfo.ipfsNodes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium text-black">Blockchain Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect External Wallet
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Data to IPFS
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <Globe className="w-4 h-4 mr-2" />
                      View on Block Explorer
                    </Button>
                    <Button variant="outline" className="justify-start bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Blockchain Security</h4>
                      <p className="text-sm text-purple-600 mt-1">
                        Your medical records are secured using Flow blockchain technology with cryptographic 
                        hashing and decentralized storage. All transactions are immutable and verifiable.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;