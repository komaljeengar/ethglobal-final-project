import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  FileText, 
  Heart,
  Stethoscope,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Share,
  Plus,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Bell,
  Shield,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Settings,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Patient = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock patient data
  const patient = {
    id: patientId || '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    dateOfBirth: '1979-03-15',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'John Johnson (Spouse) - +1 (555) 987-6543',
    primaryCare: 'Dr. Emily Rodriguez',
    insurance: 'Blue Cross Blue Shield',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-15',
    riskLevel: 'low',
    status: 'stable',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    conditions: ['Hypertension', 'Type 2 Diabetes']
  };

  const medicalRecords = [
    {
      id: '1',
      title: 'Blood Test Results',
      date: '2024-01-20',
      type: 'Lab Results',
      status: 'normal',
      doctor: 'Dr. Emily Rodriguez',
      description: 'Complete blood count, lipid panel, and metabolic panel',
      value: '$150',
      notes: 'All values within normal range. Continue current medication.'
    },
    {
      id: '2',
      title: 'Cardiology Consultation',
      date: '2024-01-18',
      type: 'Consultation',
      status: 'review',
      doctor: 'Dr. Michael Chen',
      description: 'Cardiovascular examination and EKG interpretation',
      value: '$300',
      notes: 'EKG shows normal sinus rhythm. Blood pressure well controlled.'
    },
    {
      id: '3',
      title: 'Prescription Update',
      date: '2024-01-15',
      type: 'Medication',
      status: 'active',
      doctor: 'Dr. Emily Rodriguez',
      description: 'Updated medication regimen for hypertension management',
      value: '$85',
      notes: 'Increased Lisinopril dosage. Monitor blood pressure weekly.'
    }
  ];

  const vitalSigns = {
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    weight: 150,
    height: '5\'6"',
    bmi: 24.2,
    lastUpdated: '2024-01-20'
  };

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
      active: { variant: "default" as const, icon: Activity, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.normal;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/doctor/patients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
            <p className="text-gray-600">Comprehensive view of patient medical information</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Patient Data Updated!</h3>
                  <p className="text-green-700 text-sm">
                    Patient information has been synchronized with the latest data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{patient.name}</h3>
                  <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
                  <Badge variant="outline" className="mt-1">
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{patient.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">DOB: {patient.dateOfBirth}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Emergency Contact</h4>
                <p className="text-sm text-gray-600">{patient.emergencyContact}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Primary Care</h4>
                <p className="text-sm text-gray-600">{patient.primaryCare}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Insurance</h4>
                <p className="text-sm text-gray-600">{patient.insurance}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Vital Signs
              </CardTitle>
              <CardDescription>
                Last updated: {vitalSigns.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{vitalSigns.bloodPressure}</div>
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vitalSigns.heartRate}</div>
                  <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{vitalSigns.temperature}°F</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{vitalSigns.weight} lbs</div>
                  <div className="text-sm text-gray-600">Weight</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Height</span>
                  <span className="font-medium">{vitalSigns.height}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>BMI</span>
                  <span className="font-medium">{vitalSigns.bmi}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                Medical Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Conditions</h4>
                <div className="space-y-1">
                  {patient.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Current Medications</h4>
                <div className="space-y-1">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {medication}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Known Allergies</h4>
                <div className="space-y-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="mr-1">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last Visit</span>
                  <span className="font-medium">{patient.lastVisit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Appointment</span>
                  <span className="font-medium">{patient.nextAppointment}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Medical Records
            </CardTitle>
            <CardDescription>
              Complete medical history and test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medical records..."
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{record.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {record.type}
                        </Badge>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {record.doctor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">${record.value}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 italic">{record.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patient;
