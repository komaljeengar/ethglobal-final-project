import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  FileText,
  Key,
  Database
} from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';
import { SmartContractService, PatientProfileData, VerificationLevel } from '@/lib/smartContract';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const BlockchainRegistration: React.FC = () => {
  const { account, contract, signer, isConnected } = useWeb3();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>(VerificationLevel.UNVERIFIED);
  const [smartContractService, setSmartContractService] = useState<SmartContractService | null>(null);

  // Form data
  const [formData, setFormData] = useState<PatientProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    medicalHistory: [],
    allergies: [],
    emergencyContacts: []
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newEmergencyContact, setNewEmergencyContact] = useState<EmergencyContact>({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });

  // Initialize smart contract service
  useEffect(() => {
    if (contract && signer) {
      setSmartContractService(new SmartContractService(contract, signer));
    }
  }, [contract, signer]);

  // Check if patient is already registered
  useEffect(() => {
    if (smartContractService && account) {
      checkRegistrationStatus();
    }
  }, [smartContractService, account]);

  const checkRegistrationStatus = async () => {
    if (!smartContractService || !account) return;

    try {
      const registered = await smartContractService.isPatientRegistered(account);
      setIsRegistered(registered);

      if (registered) {
        const profile = await smartContractService.getPatientProfile(account);
        if (profile) {
          setPatientId(profile.patientId);
          setVerificationLevel(await smartContractService.getVerificationLevel(account));
        }
      }
    } catch (error) {
      console.error('Failed to check registration status:', error);
    }
  };

  const handleInputChange = (field: keyof PatientProfileData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addMedicalHistory = () => {
    if (newMedicalHistory.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalHistory.trim()]
      }));
      setNewMedicalHistory('');
    }
  };

  const removeMedicalHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const addEmergencyContact = () => {
    if (newEmergencyContact.name.trim()) {
      setFormData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { ...newEmergencyContact }]
      }));
      setNewEmergencyContact({ name: '', relationship: '', phone: '', email: '' });
    }
  };

  const removeEmergencyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const handleRegister = async () => {
    if (!smartContractService) return;

    setIsLoading(true);
    try {
      const result = await smartContractService.registerPatient(formData);
      setPatientId(result.patientId);
      setIsRegistered(true);
      
      // Show success message
      alert(`Patient registered successfully! Patient ID: ${result.patientId}`);
    } catch (error) {
      console.error('Failed to register patient:', error);
      alert('Failed to register patient. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationLevelText = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.UNVERIFIED:
        return 'Unverified';
      case VerificationLevel.BASIC:
        return 'Basic Verification';
      case VerificationLevel.ENHANCED:
        return 'Enhanced Verification';
      case VerificationLevel.MEDICAL_GRADE:
        return 'Medical Grade';
      default:
        return 'Unknown';
    }
  };

  const getVerificationLevelColor = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.UNVERIFIED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case VerificationLevel.BASIC:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case VerificationLevel.ENHANCED:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case VerificationLevel.MEDICAL_GRADE:
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Wallet Not Connected</h3>
          <p className="text-gray-600 mb-4">
            Please connect your MetaMask wallet to register your patient identity on the blockchain.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isRegistered) {
    return (
      <Card className="bg-gradient-to-br from-green-50 via-white to-blue-50 border-green-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Patient Identity Registered
            <Badge className={getVerificationLevelColor(verificationLevel)}>
              {getVerificationLevelText(verificationLevel)}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your patient identity is registered on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-600">Patient ID</span>
                </div>
                <p className="font-semibold text-black">#{patientId}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-600">Verification</span>
                </div>
                <p className="font-semibold text-black">{getVerificationLevelText(verificationLevel)}</p>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Blockchain Address</span>
              </div>
              <p className="text-sm text-blue-700 font-mono">{account}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Shield className="h-5 w-5 text-purple-600" />
          Register Patient Identity
        </CardTitle>
        <CardDescription>
          Register your patient identity on the blockchain for secure medical data management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your address"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Medical History
            </h3>
            
            <div className="space-y-2">
              {formData.medicalHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <span className="flex-1 text-sm">{item}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMedicalHistory(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newMedicalHistory}
                onChange={(e) => setNewMedicalHistory(e.target.value)}
                placeholder="Add medical history item"
              />
              <Button onClick={addMedicalHistory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Allergies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              Allergies
            </h3>
            
            <div className="space-y-2">
              {formData.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <span className="flex-1 text-sm">{allergy}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAllergy(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
              />
              <Button onClick={addAllergy} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              Emergency Contacts
            </h3>
            
            <div className="space-y-3">
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{contact.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmergencyContact(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>{contact.relationship}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-sm mb-3">Add Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={newEmergencyContact.name}
                  onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Relationship"
                  value={newEmergencyContact.relationship}
                  onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                />
                <Input
                  placeholder="Phone"
                  value={newEmergencyContact.phone}
                  onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Email"
                  value={newEmergencyContact.email}
                  onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <Button onClick={addEmergencyContact} className="mt-3" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          <Separator />

          {/* Register Button */}
          <div className="text-center">
            <Button
              onClick={handleRegister}
              disabled={isLoading || !formData.name || !formData.email}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering on Blockchain...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Register Patient Identity
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainRegistration;
