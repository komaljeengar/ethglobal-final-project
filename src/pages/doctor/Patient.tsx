import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Patient = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefreshed, setShowRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    doctor: user?.name || "Dr. Emily Rodriguez",
  });

  // Mock patient data
  const patient = {
    id: patientId || "1",
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    dateOfBirth: "1979-03-15",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Main St, City, State 12345",
    emergencyContact: "John Johnson (Spouse) - +1 (555) 987-6543",
    primaryCare: "Dr. Emily Rodriguez",
    insurance: "Blue Cross Blue Shield",
    lastVisit: "2024-01-20",
    nextAppointment: "2024-02-15",
    height: "5'6\"",
    bmi: "24.2",
    riskLevel: "low",
    status: "stable",
    allergies: ["Penicillin", "Shellfish"],
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
  };

  const medicalRecords = [
    {
      id: "1",
      title: "Blood Test Results",
      date: "2024-01-20",
      type: "Lab Results",
      status: "normal",
      doctor: "Dr. Emily Rodriguez",
      description: "Complete blood count, lipid panel, and metabolic panel",
      value: "$150",
      notes: "All values within normal range. Continue current medication.",
    },
    {
      id: "2",
      title: "Cardiology Consultation",
      date: "2024-01-18",
      type: "Consultation",
      status: "review",
      doctor: "Dr. Michael Chen",
      description: "Cardiovascular examination and EKG interpretation",
      value: "$300",
      notes: "EKG shows normal sinus rhythm. Blood pressure well controlled.",
    },
    {
      id: "3",
      title: "Prescription Update",
      date: "2024-01-15",
      type: "Medication",
      status: "active",
      doctor: "Dr. Emily Rodriguez",
      description: "Updated medication regimen for hypertension management",
      value: "$85",
      notes: "Increased Lisinopril dosage. Monitor blood pressure weekly.",
    },
  ];

  const vitalSigns = {
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    weight: 150,
    height: "5'6\"",
    bmi: 24.2,
    lastUpdated: "2024-01-20",
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowRefreshed(true);
    setTimeout(() => setShowRefreshed(false), 3000);
  };

  const handleAddRecord = () => {
    // Add the new record to the medicalRecords array (in a real app, this would be an API call)
    console.log("Adding new record:", newRecord);

    // Reset form
    setNewRecord({
      title: "",
      type: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      doctor: user?.name || "Dr. Emily Rodriguez",
    });

    // Close modal
    setIsAddRecordOpen(false);

    // Show success message (could integrate with existing showRefreshed)
    setShowRefreshed(true);
    setTimeout(() => setShowRefreshed(false), 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      review: {
        variant: "secondary" as const,
        icon: Eye,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      active: {
        variant: "default" as const,
        icon: Activity,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.normal;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1 ${config.bgColor} ${config.borderColor} border`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 text-white rounded-xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/doctor/patients")}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Patient Profile</h1>
              <p className="text-purple-100">
                Comprehensive view of patient medical information
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {showRefreshed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Patient Data Updated!
                  </h3>
                  <p className="text-green-700 text-sm">
                    Patient information has been synchronized with the latest
                    data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <User className="h-5 w-5 text-purple-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">
                    {patient.name}
                  </h3>
                  <p className="text-purple-600">
                    {patient.age} years old • {patient.gender}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-1 bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {patient.status.charAt(0).toUpperCase() +
                      patient.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-black">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-black">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-black">{patient.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-black">
                    DOB: {patient.dateOfBirth}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-black">Emergency Contact</h4>
                <p className="text-sm text-purple-600">
                  {patient.emergencyContact}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-black">Primary Care</h4>
                <p className="text-sm text-purple-600">{patient.primaryCare}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-black">Insurance</h4>
                <p className="text-sm text-purple-600">{patient.insurance}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Heart className="h-5 w-5 text-purple-600" />
                Vital Signs
              </CardTitle>
              <CardDescription className="text-purple-600">
                Last updated: {vitalSigns.lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {vitalSigns.bloodPressure}
                  </div>
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {vitalSigns.heartRate}
                  </div>
                  <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {vitalSigns.temperature}°F
                  </div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {vitalSigns.weight} lbs
                  </div>
                  <div className="text-sm text-gray-600">Weight</div>
                </div>
              </div>

              <Separator />

              {/* <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Height</span>
                  <span className="font-medium">{vitalSigns.height}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>BMI</span>
                  <span className="font-medium">{vitalSigns.bmi}</span>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Medical Summary */}
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Stethoscope className="h-5 w-5 text-purple-600" />
                Medical Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-black">
                  Current Conditions
                </h4>
                <div className="space-y-1">
                  {patient.conditions.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="mr-1 bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-black">
                  Current Medications
                </h4>
                <div className="space-y-1">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="text-sm text-purple-600">
                      {medication}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-black">Known Allergies</h4>
                <div className="space-y-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="mr-1 mb-1 bg-red-50 text-red-700 border-red-200 font-medium"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Last Visit</span>
                  <span className="font-semibold text-purple-700">
                    {patient.lastVisit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Next Appointment
                  </span>
                  <span className="font-semibold text-purple-700">
                    {patient.nextAppointment}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Height</span>
                  <span className="font-semibold text-purple-700">
                    {patient.height}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">BMI</span>
                  <span className="font-semibold text-purple-700">
                    {patient.bmi}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <FileText className="h-5 w-5 text-purple-600" />
              Medical Records
            </CardTitle>
            <CardDescription className="text-purple-600">
              Complete medical history and test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
                <Input
                  placeholder="Search medical records..."
                  className="pl-10 text-black placeholder-purple-400 bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Dialog
                  open={isAddRecordOpen}
                  onOpenChange={setIsAddRecordOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-white border-purple-200">
                    <DialogHeader>
                      <DialogTitle className="text-purple-900 text-xl font-semibold">
                        Add New Medical Record
                      </DialogTitle>
                      <DialogDescription className="text-purple-600">
                        Add a new medical record for {patient.name}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-purple-900 font-medium"
                        >
                          Record Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g., Blood Test Results, X-Ray Report"
                          value={newRecord.title}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              title: e.target.value,
                            })
                          }
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="type"
                          className="text-purple-900 font-medium"
                        >
                          Record Type
                        </Label>
                        <Select
                          value={newRecord.type}
                          onValueChange={(value) =>
                            setNewRecord({ ...newRecord, type: value })
                          }
                        >
                          <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-200">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-purple-200">
                            <SelectItem value="Lab Results">
                              Lab Results
                            </SelectItem>
                            <SelectItem value="Imaging">Imaging</SelectItem>
                            <SelectItem value="Consultation">
                              Consultation
                            </SelectItem>
                            <SelectItem value="Medication">
                              Medication
                            </SelectItem>
                            <SelectItem value="Procedure">Procedure</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="date"
                          className="text-purple-900 font-medium"
                        >
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newRecord.date}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, date: e.target.value })
                          }
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-purple-900 font-medium"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter detailed description of the record..."
                          value={newRecord.description}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              description: e.target.value,
                            })
                          }
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-200 min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="doctor"
                          className="text-purple-900 font-medium"
                        >
                          Doctor
                        </Label>
                        <Input
                          id="doctor"
                          placeholder="Doctor name"
                          value={newRecord.doctor}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              doctor: e.target.value,
                            })
                          }
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddRecordOpen(false)}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddRecord}
                        disabled={!newRecord.title || !newRecord.type}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Add Record
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border border-purple-200 rounded-lg hover:bg-purple-50 bg-gradient-to-r from-purple-50 via-white to-indigo-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-black">
                          {record.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {record.type}
                        </Badge>
                        {/* {getStatusBadge(record.status)} */}
                      </div>
                      <p className="text-sm text-purple-600 mb-2">
                        {record.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-purple-500 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {record.doctor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-black">
                            ${record.value}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-purple-600 italic">
                        {record.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400"
                    >
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
