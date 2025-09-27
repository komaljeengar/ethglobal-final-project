import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  Key,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Settings,
} from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { SmartContractService, VerificationLevel } from "@/lib/smartContract";

interface Verifier {
  address: string;
  name: string;
  specialization: string;
  isAuthorized: boolean;
  lastVerified: number;
}

const BlockchainPermissions: React.FC = () => {
  const { account, contract, signer, isConnected } = useWeb3();
  const [smartContractService, setSmartContractService] =
    useState<SmartContractService | null>(null);
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newVerifierAddress, setNewVerifierAddress] = useState("");
  const [newVerifierName, setNewVerifierName] = useState("");
  const [newVerifierSpecialization, setNewVerifierSpecialization] =
    useState("");

  // Initialize smart contract service
  useEffect(() => {
    if (contract && signer) {
      setSmartContractService(new SmartContractService(contract, signer));
    }
  }, [contract, signer]);

  // Load verifiers when connected
  useEffect(() => {
    if (smartContractService && account) {
      loadVerifiers();
    }
  }, [smartContractService, account]);

  const loadVerifiers = async () => {
    if (!smartContractService) return;

    setIsLoading(true);
    try {
      // Mock verifiers for demo - in production, load from smart contract
      const mockVerifiers: Verifier[] = [
        {
          address: "0x1234567890123456789012345678901234567890",
          name: "Dr. Emily Rodriguez",
          specialization: "Cardiologist",
          isAuthorized: true,
          lastVerified: Date.now() - 86400000, // 1 day ago
        },
        {
          address: "0x2345678901234567890123456789012345678901",
          name: "Dr. Michael Chen",
          specialization: "Primary Care",
          isAuthorized: true,
          lastVerified: Date.now() - 172800000, // 2 days ago
        },
        {
          address: "0x3456789012345678901234567890123456789012",
          name: "Dr. Sarah Williams",
          specialization: "Endocrinologist",
          isAuthorized: false,
          lastVerified: Date.now() - 259200000, // 3 days ago
        },
      ];
      setVerifiers(mockVerifiers);
    } catch (error) {
      console.error("Failed to load verifiers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVerifier = async () => {
    if (!smartContractService || !newVerifierAddress.trim()) return;

    setIsLoading(true);
    try {
      // In production, call smart contract to authorize verifier
      // await smartContractService.setVerifierAuthorization(newVerifierAddress, true);

      const newVerifier: Verifier = {
        address: newVerifierAddress,
        name: newVerifierName || "Unknown",
        specialization: newVerifierSpecialization || "General",
        isAuthorized: true,
        lastVerified: Date.now(),
      };

      setVerifiers((prev) => [...prev, newVerifier]);
      setNewVerifierAddress("");
      setNewVerifierName("");
      setNewVerifierSpecialization("");
    } catch (error) {
      console.error("Failed to add verifier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerifierAuthorization = async (
    verifierAddress: string,
    isAuthorized: boolean
  ) => {
    if (!smartContractService) return;

    setIsLoading(true);
    try {
      // In production, call smart contract to toggle authorization
      // await smartContractService.setVerifierAuthorization(verifierAddress, !isAuthorized);

      setVerifiers((prev) =>
        prev.map((v) =>
          v.address === verifierAddress
            ? { ...v, isAuthorized: !isAuthorized, lastVerified: Date.now() }
            : v
        )
      );
    } catch (error) {
      console.error("Failed to toggle verifier authorization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeVerifier = async (verifierAddress: string) => {
    if (!smartContractService) return;

    setIsLoading(true);
    try {
      // In production, call smart contract to remove authorization
      // await smartContractService.setVerifierAuthorization(verifierAddress, false);

      setVerifiers((prev) => prev.filter((v) => v.address !== verifierAddress));
    } catch (error) {
      console.error("Failed to remove verifier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (isAuthorized: boolean, lastVerified: number) => {
    const daysSinceVerified = Math.floor(
      (Date.now() - lastVerified) / 86400000
    );

    if (isAuthorized) {
      if (daysSinceVerified < 7) {
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      } else if (daysSinceVerified < 30) {
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      }
    } else {
      return (
        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-gray-600 mb-4">
            Please connect your MetaMask wallet to manage blockchain
            permissions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Shield className="h-5 w-5 text-purple-600" />
          Blockchain Permissions
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {verifiers.length} Verifiers
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage authorized verifiers who can access your medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Verifier */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-black text-sm mb-3">
              Add New Verifier
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Wallet Address"
                value={newVerifierAddress}
                onChange={(e) => setNewVerifierAddress(e.target.value)}
                className="text-black placeholder-gray-400 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-200"
              />
              <Input
                placeholder="Name"
                value={newVerifierName}
                onChange={(e) => setNewVerifierName(e.target.value)}
                className="text-black placeholder-gray-400 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-200"
              />
              <Input
                placeholder="Specialization"
                value={newVerifierSpecialization}
                onChange={(e) => setNewVerifierSpecialization(e.target.value)}
                className="text-black placeholder-gray-400 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-200"
              />
            </div>
            <Button
              onClick={addVerifier}
              disabled={isLoading || !newVerifierAddress.trim()}
              className="mt-3"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Verifier
            </Button>
          </div>

          <Separator />

          {/* Verifiers List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Authorized Verifiers</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={loadVerifiers}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {verifiers.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No verifiers found</p>
                <p className="text-sm text-gray-500">
                  Add verifiers to grant them access to your medical records
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {verifiers.map((verifier, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-black">
                            {verifier.name}
                          </h3>
                          {getStatusBadge(
                            verifier.isAuthorized,
                            verifier.lastVerified
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-mono text-xs">
                            {verifier.address}
                          </p>
                          <p>{verifier.specialization}</p>
                          <p className="text-xs text-gray-500">
                            Last verified:{" "}
                            {new Date(
                              verifier.lastVerified
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleVerifierAuthorization(
                            verifier.address,
                            verifier.isAuthorized
                          )
                        }
                        className={
                          verifier.isAuthorized
                            ? "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
                            : "bg-green-600 text-white border-green-600 hover:bg-white hover:text-green-600"
                        }
                      >
                        {verifier.isAuthorized ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Revoke
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Authorize
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeVerifier(verifier.address)}
                        className="bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain Status */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Blockchain Status
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Connected Wallet</p>
                <p className="font-mono text-xs text-blue-600">{account}</p>
              </div>
              <div>
                <p className="text-blue-700">Active Verifiers</p>
                <p className="font-semibold text-blue-900">
                  {verifiers.filter((v) => v.isAuthorized).length} /{" "}
                  {verifiers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainPermissions;
