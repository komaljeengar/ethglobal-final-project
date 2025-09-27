import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Eye,
  Trash2,
  Key,
  Database,
} from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAuth } from "@/contexts/AuthContext";
import { MedicalEncryptionService } from "@/lib/medicalEncryption";

interface DocumentMetadata {
  tokenId?: number;
  originalFileName: string;
  fileSize: number;
  fileType: string;
  documentType: string;
  uploadDate: string;
  encryptedFileCID: string;
  metadataCID: string;
}

const EncryptedDocumentUpload: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("MEDICAL_RECORD");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [userDocuments, setUserDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const documentTypes = [
    { value: "MEDICAL_RECORD", label: "Medical Record" },
    { value: "LAB_RESULT", label: "Lab Result" },
    { value: "IMAGING", label: "Imaging (X-Ray, MRI, CT)" },
    { value: "PRESCRIPTION", label: "Prescription" },
    { value: "INSURANCE", label: "Insurance Document" },
    { value: "VACCINATION", label: "Vaccination Record" },
    { value: "ALLERGY", label: "Allergy Information" },
    { value: "EMERGENCY", label: "Emergency Contact" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !account) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const result = await MedicalEncryptionService.uploadEncryptedDocument(
        selectedFile,
        account,
        documentType
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadResult(result);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh documents list
        await loadUserDocuments();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const loadUserDocuments = async () => {
    if (!account) return;

    setIsLoadingDocuments(true);
    try {
      const { default: BackendAPI } = await import("@/lib/backendAPI");
      const data = await BackendAPI.getPatientNFTs(account);
      setUserDocuments(data.nfts || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const downloadDocument = async (tokenId: number) => {
    try {
      const privateKey = await MedicalEncryptionService.getPrivateKey(account!);
      const result = await MedicalEncryptionService.downloadAndDecryptDocument(
        tokenId,
        privateKey
      );

      if (result.success) {
        // Create download link
        const url = URL.createObjectURL(result.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.originalFileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert(`Download failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      MEDICAL_RECORD: "bg-blue-50 text-blue-700 border-blue-200",
      LAB_RESULT: "bg-green-50 text-green-700 border-green-200",
      IMAGING: "bg-purple-50 text-purple-700 border-purple-200",
      PRESCRIPTION: "bg-orange-50 text-orange-700 border-orange-200",
      INSURANCE: "bg-yellow-50 text-yellow-700 border-yellow-200",
      VACCINATION: "bg-red-50 text-red-700 border-red-200",
      ALLERGY: "bg-pink-50 text-pink-700 border-pink-200",
      EMERGENCY: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[type] || colors["MEDICAL_RECORD"];
  };

  // Load documents on component mount
  React.useEffect(() => {
    if (isConnected && account) {
      loadUserDocuments();
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600 mb-4">
            Please connect your MetaMask wallet to upload encrypted medical
            documents.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Shield className="h-5 w-5 text-purple-600" />
            Upload Encrypted Medical Document
          </CardTitle>
          <CardDescription>
            Securely upload and encrypt your medical documents using AES-256-GCM
            encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Selection */}
          <div>
            <Label
              htmlFor="fileInput"
              className="text-sm font-medium text-gray-700"
            >
              Select Medical Document
            </Label>
            <Input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              onChange={handleFileSelect}
              className="mt-1 text-black bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            {selectedFile && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedFile.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Document Type Selection */}
          <div>
            <Label
              htmlFor="documentType"
              className="text-sm font-medium text-gray-700"
            >
              Document Type
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="mt-1 text-black bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-200">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="bg-purple-50 border-purple-200">
                {documentTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-black hover:bg-purple-100 focus:bg-purple-100"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                <span className="text-sm text-gray-600">
                  Encrypting and uploading...
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Encrypting & Uploading...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Upload Encrypted Document
              </>
            )}
          </Button>

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`p-4 rounded-lg border ${
                uploadResult.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {uploadResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <h4
                    className={`font-semibold ${
                      uploadResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {uploadResult.success
                      ? "Upload Successful!"
                      : "Upload Failed"}
                  </h4>
                  {uploadResult.success ? (
                    <p className="text-sm text-green-700">
                      Document encrypted and NFT minted with Token ID:{" "}
                      {uploadResult.tokenId}
                    </p>
                  ) : (
                    <p className="text-sm text-red-700">{uploadResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Documents List */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Database className="h-5 w-5 text-purple-600" />
            Your Encrypted Documents
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {userDocuments.length} Documents
            </Badge>
          </CardTitle>
          <CardDescription>
            Your encrypted medical documents stored on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDocuments ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : userDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No encrypted documents found</p>
              <p className="text-sm text-gray-500">
                Upload your first medical document to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {doc.originalFileName}
                        </h3>
                        <Badge
                          className={getDocumentTypeColor(doc.documentType)}
                        >
                          {doc.documentType.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Database className="h-4 w-4" />
                          Token ID: {doc.tokenId}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {formatFileSize(doc.fileSize)}
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
                      onClick={() => downloadDocument(doc.tokenId!)}
                      className="bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
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

export default EncryptedDocumentUpload;
