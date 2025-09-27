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
    worldIdBackup: true,
    sessionTimeout: 30,
    deviceTrust: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    setIsEditing(false);
  };

  const blockchainInfo = {
    walletAddress: '0x742d35Cc6688C02532898FcF434670a6EB91F6B8',
    network: 'Flow Mainnet',
    recordsStored: 47,
    totalTransactions: 156,
    storageUsed: '2.3 GB',
    ipfsNodes: 15
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, privacy, and security preferences
            </p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  {user?.role === 'doctor' && (
                    <>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">Medical License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Status</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      World ID Verified
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Shield className="w-3 h-3 mr-1" />
                      {user?.role === 'doctor' ? 'Licensed Physician' : 'Patient Account'}
                    </Badge>
                    {user?.role === 'doctor' && (
                      <Badge className="bg-accent/10 text-accent border-accent/20">
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
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Privacy & Data Control</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">Emergency Access</h3>
                      <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-medium">Medical Research Participation</h3>
                      <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-medium">Audit Trail</h3>
                      <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-medium">Anonymous Analytics</h3>
                      <p className="text-sm text-muted-foreground">
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
                  <h3 className="font-medium mb-4">Data Retention</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose how long your medical data is retained on the blockchain
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      5 Years
                    </Button>
                    <Button variant="outline" className="justify-start bg-primary/5 border-primary">
                      7 Years (Recommended)
                    </Button>
                    <Button variant="outline" className="justify-start">
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
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Security & Authentication</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
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
                      <h3 className="font-medium">World ID Backup Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable backup biometric authentication methods
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.worldIdBackup}
                      onCheckedChange={(checked) => handleSecurityChange('worldIdBackup', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">Trusted Devices</h3>
                      <p className="text-sm text-muted-foreground">
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
                  <h3 className="font-medium">Password & Authentication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Re-scan Biometrics
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Manage Devices
                    </Button>
                    <Button variant="outline" className="justify-start">
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
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Communication Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
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
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-muted-foreground">
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
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-muted-foreground">
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
                    <h3 className="font-medium mb-4">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-red-700">Emergency Alerts</h4>
                          <p className="text-sm text-muted-foreground">
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
                          <h4 className="font-medium">Appointment Reminders</h4>
                          <p className="text-sm text-muted-foreground">
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
                          <h4 className="font-medium">Lab Results</h4>
                          <p className="text-sm text-muted-foreground">
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
                          <h4 className="font-medium">Access Requests</h4>
                          <p className="text-sm text-muted-foreground">
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
                            <h4 className="font-medium">Medication Reminders</h4>
                            <p className="text-sm text-muted-foreground">
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
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Blockchain & Storage</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Wallet Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Wallet Address</Label>
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
                        <Label className="text-sm text-muted-foreground">Network</Label>
                        <p className="text-sm mt-1">{blockchainInfo.network}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Storage Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Records Stored:</span>
                        <span className="text-sm font-medium">{blockchainInfo.recordsStored}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Transactions:</span>
                        <span className="text-sm font-medium">{blockchainInfo.totalTransactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">IPFS Storage:</span>
                        <span className="text-sm font-medium">{blockchainInfo.storageUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">IPFS Nodes:</span>
                        <span className="text-sm font-medium">{blockchainInfo.ipfsNodes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium">Blockchain Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect External Wallet
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Data to IPFS
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      View on Block Explorer
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Blockchain Security</h4>
                      <p className="text-sm text-muted-foreground mt-1">
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