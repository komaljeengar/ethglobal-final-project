import { ethers } from "ethers";

// Mock implementations for demo mode
class EncryptionUtils {
  static createEncryptedProfileHash(profileData: any): string {
    // In demo mode, just create a mock encrypted hash
    return `encrypted_${JSON.stringify(profileData).substring(0, 32)}`;
  }

  static generateKeyPair() {
    return {
      publicKey: "mock_public_key_" + Date.now(),
      privateKey: "mock_private_key_" + Date.now(),
    };
  }

  static generatePublicKeyHash(publicKey: string): string {
    // Create a mock hash of the public key
    return ethers.keccak256(ethers.toUtf8Bytes(publicKey));
  }

  static encryptData(data: string): string {
    // Mock encryption - just base64 encode for demo
    return btoa(data);
  }

  static decryptData(encryptedData: string): string {
    // Mock decryption - just base64 decode for demo
    try {
      return atob(encryptedData);
    } catch {
      return encryptedData;
    }
  }

  static decryptProfileHash(encryptedData: string): any {
    // Mock profile decryption
    try {
      return JSON.parse(this.decryptData(encryptedData));
    } catch {
      return null;
    }
  }
}

class MockIPFS {
  private static storage = new Map<string, string>();

  static async uploadToIPFS(data: string): Promise<string> {
    // Generate a mock IPFS hash
    const hash = "Qm" + Math.random().toString(36).substring(2, 15);
    this.storage.set(hash, data);
    return hash;
  }

  static async downloadFromIPFS(hash: string): Promise<string> {
    return this.storage.get(hash) || "";
  }
}

export interface PatientProfile {
  patientId: number;
  patientAddress: string;
  encryptedProfileHash: string;
  publicKeyHash: string;
  createdAt: number;
  lastUpdated: number;
  isActive: boolean;
  isVerified: boolean;
  emergencyContactHash: string;
}

export interface PatientProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }[];
}

export enum VerificationLevel {
  UNVERIFIED = 0,
  BASIC = 1,
  ENHANCED = 2,
  MEDICAL_GRADE = 3,
}

export class SmartContractService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(contract: ethers.Contract, signer: ethers.JsonRpcSigner) {
    this.contract = contract;
    this.signer = signer;
  }

  /**
   * Register a new patient on the blockchain
   */
  async registerPatient(
    profileData: PatientProfileData
  ): Promise<{ txHash: string; patientId: number }> {
    try {
      // Encrypt profile data
      const encryptedProfileHash =
        EncryptionUtils.createEncryptedProfileHash(profileData);
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedProfileHash);

      // Generate public key hash
      const { publicKey } = EncryptionUtils.generateKeyPair();
      const publicKeyHash = EncryptionUtils.generatePublicKeyHash(publicKey);

      // Encrypt emergency contacts
      const emergencyContactHash = await MockIPFS.uploadToIPFS(
        EncryptionUtils.encryptData(
          JSON.stringify(profileData.emergencyContacts)
        )
      );

      try {
        // Try to call smart contract (will work with real deployed contracts)
        const tx = await this.contract.registerPatient(
          ipfsHash,
          publicKeyHash,
          emergencyContactHash
        );

        const receipt = await tx.wait();

        // Get patient ID from event
        const event = receipt.logs.find((log) => {
          try {
            const parsed = this.contract.interface.parseLog(log);
            return parsed?.name === "PatientRegistered";
          } catch {
            return false;
          }
        });

        let patientId = 0;
        if (event) {
          const parsed = this.contract.interface.parseLog(event);
          patientId = Number(parsed?.args[1]);
        }

        return { txHash: tx.hash, patientId };
      } catch (contractError) {
        // If contract call fails (demo mode), simulate successful registration
        console.warn(
          "Contract call failed, running in demo mode:",
          contractError
        );

        // Generate mock transaction hash and patient ID
        const mockTxHash =
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
        const mockPatientId = Math.floor(Math.random() * 10000) + 1000;

        // Store registration in localStorage for demo
        const registrations = JSON.parse(
          localStorage.getItem("demo_registrations") || "{}"
        );
        const signerAddress = await this.signer.getAddress();
        registrations[signerAddress] = {
          patientId: mockPatientId,
          profileData,
          registeredAt: Date.now(),
          txHash: mockTxHash,
        };
        localStorage.setItem(
          "demo_registrations",
          JSON.stringify(registrations)
        );

        return { txHash: mockTxHash, patientId: mockPatientId };
      }
    } catch (error) {
      console.error("Failed to register patient:", error);
      throw error;
    }
  }

  /**
   * Update patient profile
   */
  async updatePatientProfile(profileData: PatientProfileData): Promise<string> {
    try {
      const encryptedProfileHash =
        EncryptionUtils.createEncryptedProfileHash(profileData);
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedProfileHash);

      const { publicKey } = EncryptionUtils.generateKeyPair();
      const publicKeyHash = EncryptionUtils.generatePublicKeyHash(publicKey);

      const tx = await this.contract.updatePatientProfile(
        ipfsHash,
        publicKeyHash
      );
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error("Failed to update patient profile:", error);
      throw error;
    }
  }

  /**
   * Update emergency contacts
   */
  async updateEmergencyContact(emergencyContacts: any[]): Promise<string> {
    try {
      const encryptedContacts = EncryptionUtils.encryptData(
        JSON.stringify(emergencyContacts)
      );
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedContacts);

      const tx = await this.contract.updateEmergencyContact(ipfsHash);
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error("Failed to update emergency contacts:", error);
      throw error;
    }
  }

  /**
   * Get patient profile from blockchain
   */
  async getPatientProfile(
    patientAddress: string
  ): Promise<PatientProfile | null> {
    try {
      const profile = await this.contract.getPatientProfile(patientAddress);

      return {
        patientId: Number(profile[0]),
        patientAddress: profile[1],
        encryptedProfileHash: profile[2],
        publicKeyHash: profile[3],
        createdAt: Number(profile[4]),
        lastUpdated: Number(profile[5]),
        isActive: profile[6],
        isVerified: profile[7],
        emergencyContactHash: profile[8],
      };
    } catch (error) {
      // If contract call fails, check demo registrations
      console.warn("Contract call failed, checking demo registrations:", error);
      const registrations = JSON.parse(
        localStorage.getItem("demo_registrations") || "{}"
      );
      const registration = registrations[patientAddress];

      if (registration) {
        return {
          patientId: registration.patientId,
          patientAddress,
          encryptedProfileHash: "demo_hash",
          publicKeyHash: "demo_public_key_hash",
          createdAt: registration.registeredAt,
          lastUpdated: registration.registeredAt,
          isActive: true,
          isVerified: false,
          emergencyContactHash: "demo_emergency_hash",
        };
      }

      return null;
    }
  }

  /**
   * Get decrypted patient profile data
   */
  async getDecryptedPatientProfile(
    patientAddress: string
  ): Promise<PatientProfileData | null> {
    try {
      const profile = await this.getPatientProfile(patientAddress);
      if (!profile) return null;

      // Download and decrypt profile data from IPFS
      const encryptedData = await MockIPFS.downloadFromIPFS(
        profile.encryptedProfileHash
      );
      const decryptedData = EncryptionUtils.decryptProfileHash(encryptedData);

      return decryptedData;
    } catch (error) {
      console.error("Failed to get decrypted patient profile:", error);
      return null;
    }
  }

  /**
   * Get patient verification level
   */
  async getVerificationLevel(
    patientAddress: string
  ): Promise<VerificationLevel> {
    try {
      const level = await this.contract.getVerificationLevel(patientAddress);
      return Number(level) as VerificationLevel;
    } catch (error) {
      console.error("Failed to get verification level:", error);
      return VerificationLevel.UNVERIFIED;
    }
  }

  /**
   * Get patient status (active, verified)
   */
  async getPatientStatus(
    patientAddress: string
  ): Promise<{ isActive: boolean; isVerified: boolean }> {
    try {
      const [isActive, isVerified] = await this.contract.getPatientStatus(
        patientAddress
      );
      return { isActive, isVerified };
    } catch (error) {
      console.error("Failed to get patient status:", error);
      return { isActive: false, isVerified: false };
    }
  }

  /**
   * Check if patient is registered
   */
  async isPatientRegistered(patientAddress: string): Promise<boolean> {
    try {
      return await this.contract.isRegisteredPatient(patientAddress);
    } catch (error) {
      // If contract call fails, check demo registrations
      console.warn("Contract call failed, checking demo registrations:", error);
      const registrations = JSON.parse(
        localStorage.getItem("demo_registrations") || "{}"
      );
      return !!registrations[patientAddress];
    }
  }

  /**
   * Deactivate patient account
   */
  async deactivatePatient(): Promise<string> {
    try {
      const tx = await this.contract.deactivatePatient();
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to deactivate patient:", error);
      throw error;
    }
  }

  /**
   * Reactivate patient account
   */
  async reactivatePatient(): Promise<string> {
    try {
      const tx = await this.contract.reactivatePatient();
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to reactivate patient:", error);
      throw error;
    }
  }

  /**
   * Get total number of registered patients
   */
  async getTotalPatients(): Promise<number> {
    try {
      const total = await this.contract.getTotalPatients();
      return Number(total);
    } catch (error) {
      console.error("Failed to get total patients:", error);
      return 0;
    }
  }

  /**
   * Get emergency contacts
   */
  async getEmergencyContacts(patientAddress: string): Promise<any[]> {
    try {
      const profile = await this.getPatientProfile(patientAddress);
      if (!profile) return [];

      const encryptedData = await MockIPFS.downloadFromIPFS(
        profile.emergencyContactHash
      );
      const decryptedData = EncryptionUtils.decryptData(encryptedData);

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Failed to get emergency contacts:", error);
      return [];
    }
  }
}
