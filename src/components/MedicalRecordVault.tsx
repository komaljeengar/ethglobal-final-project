import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Unlock,
  Database,
  Key,
  Loader2
} from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';

// Record categories matching the smart contract enum
const RECORD_CATEGORIES = [
  { value: 0, label: 'General' },
  { value: 1, label: 'Lab Results' },
  { value: 2, label: 'Imaging' },
  { value: 3, label: 'Prescriptions' },
  { value: 4, label: 'Allergies' },
  { value: 5, label: 'Surgeries' },
  { value: 6, label: 'Immunizations' },
  { value: 7, label: 'Mental Health' },
  { value: 8, label: 'Emergency' }
];

// Access levels matching the smart contract enum
const ACCESS_LEVELS = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Read Basic' },
  { value: 2, label: 'Read Detailed' },
  { value: 3, label: 'Read Full' },
  { value: 4, label: 'Write Append' }
];

interface MedicalRecord {
  recordId: number;
  patient: string;
  ipfsHash: string;
  metadataHash: string;
  category: number;
  createdAt: number;
  lastAccessed: number;
  isEmergencyAccessible: boolean;
  createdBy: string;
  isActive: boolean;
}

interface AccessPermission {
  grantedTo: string;
  patient: string;
  category: number;
  level: number;
  grantedAt: number;
  expiresAt: number;
  isActive: boolean;
  purpose: string;
}

const MedicalRecordVault: React.FC = () => {
  const { account, isConnected, medicalRecordVaultContract, signer } = useWeb3();
  const { user } = useAuth();
  
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Form states
  const [newRecordIpfsHash, setNewRecordIpfsHash] = useState('');
  const [newRecordMetadataHash, setNewRecordMetadataHash] = useState('');
  const [newRecordCategory, setNewRecordCategory] = useState<number>(0);
  const [isEmergencyAccessible, setIsEmergencyAccessible] = useState(false);
  
  // Permission form states
  const [grantDoctorAddress, setGrantDoctorAddress] = useState('');
  const [grantCategory, setGrantCategory] = useState<number>(0);
  const [grantLevel, setGrantLevel] = useState<number>(1);
  const [grantDuration, setGrantDuration] = useState(86400); // 1 day in seconds
  const [grantPurpose, setGrantPurpose] = useState('');

  // Load patient records
  const loadPatientRecords = async () => {
    if (!medicalRecordVaultContract || !account) return;
    
    setIsLoading(true);
    try {
      const recordIds = await medicalRecordVaultContract.getPatientRecords(account);
      const recordsData = await Promise.all(
        recordIds.map(async (id: number) => {
          const record = await medicalRecordVaultContract.medicalRecords(id);
          return {
            recordId: Number(record.recordId),
            patient: record.patient,
            ipfsHash: record.ipfsHash,
            metadataHash: record.metadataHash,
            category: Number(record.category),
            createdAt: Number(record.createdAt),
            lastAccessed: Number(record.lastAccessed),
            isEmergencyAccessible: record.isEmergencyAccessible,
            createdBy: record.createdBy,
            isActive: record.isActive
          };
        })
      );
      setRecords(recordsData);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new medical record
  const createMedicalRecord = async () => {
    if (!medicalRecordVaultContract || !signer || !newRecordIpfsHash || !newRecordMetadataHash) return;
    
    setIsLoading(true);
    try {
      const tx = await medicalRecordVaultContract.connect(signer).createMedicalRecord(
        newRecordIpfsHash,
        newRecordMetadataHash,
        newRecordCategory,
        isEmergencyAccessible
      );
      await tx.wait();
      
      // Reset form
      setNewRecordIpfsHash('');
      setNewRecordMetadataHash('');
      setNewRecordCategory(0);
      setIsEmergencyAccessible(false);
      
      // Reload records
      await loadPatientRecords();
    } catch (error) {
      console.error('Failed to create record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Grant access permission
  const grantAccess = async () => {
    if (!medicalRecordVaultContract || !signer || !grantDoctorAddress || !grantPurpose) return;
    
    setIsLoading(true);
    try {
      const tx = await medicalRecordVaultContract.connect(signer).grantAccess(
        grantDoctorAddress,
        grantCategory,
        grantLevel,
        grantDuration,
        grantPurpose
      );
      await tx.wait();
      
      // Reset form
      setGrantDoctorAddress('');
      setGrantCategory(0);
      setGrantLevel(1);
      setGrantDuration(86400);
      setGrantPurpose('');
    } catch (error) {
      console.error('Failed to grant access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Access medical record
  const accessMedicalRecord = async (recordId: number) => {
    if (!medicalRecordVaultContract || !signer) return;
    
    try {
      const [ipfsHash, metadataHash] = await medicalRecordVaultContract.connect(signer).accessMedicalRecord(
        recordId,
        '' // IP address for audit trail
      );
      
      console.log('Accessed record:', { recordId, ipfsHash, metadataHash });
      // Here you would typically decrypt and display the content
    } catch (error) {
      console.error('Failed to access record:', error);
    }
  };

  // Load records on component mount
  useEffect(() => {
    if (isConnected && account && medicalRecordVaultContract) {
      loadPatientRecords();
    }
  }, [isConnected, account, medicalRecordVaultContract]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.ipfsHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.metadataHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: number) => {
    const categoryObj = RECORD_CATEGORIES.find(c => c.value === category);
    return categoryObj ? categoryObj.label : 'Unknown';
  };

  const getCategoryColor = (category: number) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-red-50 text-red-700 border-red-200',
      'bg-yellow-50 text-yellow-700 border-yellow-200',
      'bg-pink-50 text-pink-700 border-pink-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-gray-50 text-gray-700 border-gray-200'
    ];
    return colors[category] || colors[0];
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Wallet Not Connected</h3>
          <p className="text-gray-600 mb-4">
            Please connect your MetaMask wallet to access medical records.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!medicalRecordVaultContract) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Contract Not Deployed</h3>
          <p className="text-gray-600 mb-4">
            MedicalRecordVault contract is not deployed yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Medical Record Vault</h1>
            <p className="text-purple-100">
              Secure, blockchain-based medical record management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <Database className="h-3 w-3 mr-1" />
              {records.length} Records
            </Badge>
            <Button
              onClick={loadPatientRecords}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
            <Input
              placeholder="Search records..."
              className="pl-10 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory?.toString() || ''} onValueChange={(value) => setSelectedCategory(value ? Number(value) : null)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {RECORD_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value.toString()}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Create New Record */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Plus className="h-5 w-5 text-purple-600" />
            Create New Medical Record
          </CardTitle>
          <CardDescription>
            Add a new encrypted medical record to the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ipfsHash" className="text-sm font-medium text-gray-700">
                IPFS Hash (Encrypted Data)
              </Label>
              <Input
                id="ipfsHash"
                value={newRecordIpfsHash}
                onChange={(e) => setNewRecordIpfsHash(e.target.value)}
                placeholder="Qm..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="metadataHash" className="text-sm font-medium text-gray-700">
                Metadata Hash
              </Label>
              <Input
                id="metadataHash"
                value={newRecordMetadataHash}
                onChange={(e) => setNewRecordMetadataHash(e.target.value)}
                placeholder="Qm..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select value={newRecordCategory.toString()} onValueChange={(value) => setNewRecordCategory(Number(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value.toString()}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="emergencyAccessible"
                checked={isEmergencyAccessible}
                onChange={(e) => setIsEmergencyAccessible(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="emergencyAccessible" className="text-sm font-medium text-gray-700">
                Emergency Accessible
              </Label>
            </div>
          </div>

          <Button
            onClick={createMedicalRecord}
            disabled={!newRecordIpfsHash || !newRecordMetadataHash || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Record...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Medical Record
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Grant Access Permission */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <UserPlus className="h-5 w-5 text-purple-600" />
            Grant Access Permission
          </CardTitle>
          <CardDescription>
            Grant access to a doctor for specific medical record categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorAddress" className="text-sm font-medium text-gray-700">
                Doctor Address
              </Label>
              <Input
                id="doctorAddress"
                value={grantDoctorAddress}
                onChange={(e) => setGrantDoctorAddress(e.target.value)}
                placeholder="0x..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                Purpose
              </Label>
              <Input
                id="purpose"
                value={grantPurpose}
                onChange={(e) => setGrantPurpose(e.target.value)}
                placeholder="Consultation, emergency, etc."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="grantCategory" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select value={grantCategory.toString()} onValueChange={(value) => setGrantCategory(Number(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value.toString()}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grantLevel" className="text-sm font-medium text-gray-700">
                Access Level
              </Label>
              <Select value={grantLevel.toString()} onValueChange={(value) => setGrantLevel(Number(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.slice(1).map((level) => (
                    <SelectItem key={level.value} value={level.value.toString()}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (seconds)
              </Label>
              <Input
                id="duration"
                type="number"
                value={grantDuration}
                onChange={(e) => setGrantDuration(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={grantAccess}
            disabled={!grantDoctorAddress || !grantPurpose || isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Granting Access...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Grant Access
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Medical Records List */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <FileText className="h-5 w-5 text-purple-600" />
            Your Medical Records
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {filteredRecords.length} Records
            </Badge>
          </CardTitle>
          <CardDescription>
            Your encrypted medical records stored on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No medical records found</p>
              <p className="text-sm text-gray-500">
                Create your first medical record to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.recordId} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">Record #{record.recordId}</h3>
                        <Badge className={getCategoryColor(record.category)}>
                          {getCategoryLabel(record.category)}
                        </Badge>
                        {record.isEmergencyAccessible && (
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            Emergency
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Database className="h-4 w-4" />
                          IPFS: {record.ipfsHash.substring(0, 20)}...
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Created: {formatTimestamp(record.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Key className="h-4 w-4" />
                          Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => accessMedicalRecord(record.recordId)}
                      className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Access
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordVault;
