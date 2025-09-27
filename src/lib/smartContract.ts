import { ethers } from 'ethers';
import { EncryptionUtils, MockIPFS } from './encryption';

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
  MEDICAL_GRADE = 3
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
  async registerPatient(profileData: PatientProfileData): Promise<{ txHash: string; patientId: number }> {
    try {
      // Encrypt profile data
      const encryptedProfileHash = EncryptionUtils.createEncryptedProfileHash(profileData);
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedProfileHash);
      
      // Generate public key hash
      const { publicKey } = EncryptionUtils.generateKeyPair();
      const publicKeyHash = EncryptionUtils.generatePublicKeyHash(publicKey);
      
      // Encrypt emergency contacts
      const emergencyContactHash = await MockIPFS.uploadToIPFS(
        EncryptionUtils.encryptData(JSON.stringify(profileData.emergencyContacts))
      );

      // Call smart contract
      const tx = await this.contract.registerPatient(
        ipfsHash,
        publicKeyHash,
        emergencyContactHash
      );

      const receipt = await tx.wait();
      
      // Get patient ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'PatientRegistered';
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
    } catch (error) {
      console.error('Failed to register patient:', error);
      throw error;
    }
  }

  /**
   * Update patient profile
   */
  async updatePatientProfile(profileData: PatientProfileData): Promise<string> {
    try {
      const encryptedProfileHash = EncryptionUtils.createEncryptedProfileHash(profileData);
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedProfileHash);
      
      const { publicKey } = EncryptionUtils.generateKeyPair();
      const publicKeyHash = EncryptionUtils.generatePublicKeyHash(publicKey);

      const tx = await this.contract.updatePatientProfile(ipfsHash, publicKeyHash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to update patient profile:', error);
      throw error;
    }
  }

  /**
   * Update emergency contacts
   */
  async updateEmergencyContact(emergencyContacts: any[]): Promise<string> {
    try {
      const encryptedContacts = EncryptionUtils.encryptData(JSON.stringify(emergencyContacts));
      const ipfsHash = await MockIPFS.uploadToIPFS(encryptedContacts);

      const tx = await this.contract.updateEmergencyContact(ipfsHash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to update emergency contacts:', error);
      throw error;
    }
  }

  /**
   * Get patient profile from blockchain
   */
  async getPatientProfile(patientAddress: string): Promise<PatientProfile | null> {
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
        emergencyContactHash: profile[8]
      };
    } catch (error) {
      console.error('Failed to get patient profile:', error);
      return null;
    }
  }

  /**
   * Get decrypted patient profile data
   */
  async getDecryptedPatientProfile(patientAddress: string): Promise<PatientProfileData | null> {
    try {
      const profile = await this.getPatientProfile(patientAddress);
      if (!profile) return null;

      // Download and decrypt profile data from IPFS
      const encryptedData = await MockIPFS.downloadFromIPFS(profile.encryptedProfileHash);
      const decryptedData = EncryptionUtils.decryptProfileHash(encryptedData);
      
      return decryptedData;
    } catch (error) {
      console.error('Failed to get decrypted patient profile:', error);
      return null;
    }
  }

  /**
   * Get patient verification level
   */
  async getVerificationLevel(patientAddress: string): Promise<VerificationLevel> {
    try {
      const level = await this.contract.getVerificationLevel(patientAddress);
      return Number(level) as VerificationLevel;
    } catch (error) {
      console.error('Failed to get verification level:', error);
      return VerificationLevel.UNVERIFIED;
    }
  }

  /**
   * Get patient status (active, verified)
   */
  async getPatientStatus(patientAddress: string): Promise<{ isActive: boolean; isVerified: boolean }> {
    try {
      const [isActive, isVerified] = await this.contract.getPatientStatus(patientAddress);
      return { isActive, isVerified };
    } catch (error) {
      console.error('Failed to get patient status:', error);
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
      console.error('Failed to check patient registration:', error);
      return false;
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
      console.error('Failed to deactivate patient:', error);
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
      console.error('Failed to reactivate patient:', error);
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
      console.error('Failed to get total patients:', error);
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

      const encryptedData = await MockIPFS.downloadFromIPFS(profile.emergencyContactHash);
      const decryptedData = EncryptionUtils.decryptData(encryptedData);
      
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to get emergency contacts:', error);
      return [];
    }
  }
}
