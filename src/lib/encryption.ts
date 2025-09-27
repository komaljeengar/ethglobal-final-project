import CryptoJS from 'crypto-js';

// Simple encryption utilities for patient data
export class EncryptionUtils {
  private static readonly SECRET_KEY = 'medvault-encryption-key-2024'; // In production, use environment variables

  /**
   * Encrypt patient data
   */
  static encryptData(data: string, password?: string): string {
    const key = password || this.SECRET_KEY;
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  /**
   * Decrypt patient data
   */
  static decryptData(encryptedData: string, password?: string): string {
    const key = password || this.SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate a hash for public key
   */
  static generatePublicKeyHash(publicKey: string): string {
    return CryptoJS.SHA256(publicKey).toString();
  }

  /**
   * Generate a simple public/private key pair for demo purposes
   */
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const publicKey = CryptoJS.lib.WordArray.random(32).toString();
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    return { publicKey, privateKey };
  }

  /**
   * Create encrypted profile hash for IPFS
   */
  static createEncryptedProfileHash(profileData: any): string {
    const profileString = JSON.stringify(profileData);
    return this.encryptData(profileString);
  }

  /**
   * Decrypt profile hash from IPFS
   */
  static decryptProfileHash(encryptedHash: string): any {
    const decryptedString = this.decryptData(encryptedHash);
    return JSON.parse(decryptedString);
  }
}

// Mock IPFS integration - in production, use actual IPFS
export class MockIPFS {
  private static storage: Map<string, string> = new Map();

  /**
   * Upload data to IPFS (mock implementation)
   */
  static async uploadToIPFS(data: string): Promise<string> {
    // Generate a mock IPFS hash
    const hash = CryptoJS.SHA256(data).toString();
    this.storage.set(hash, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `Qm${hash.substring(0, 44)}`; // Mock IPFS hash format
  }

  /**
   * Download data from IPFS (mock implementation)
   */
  static async downloadFromIPFS(hash: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove Qm prefix if present
    const cleanHash = hash.startsWith('Qm') ? hash.substring(2) : hash;
    return this.storage.get(cleanHash) || '';
  }

  /**
   * Check if IPFS hash exists
   */
  static async exists(hash: string): Promise<boolean> {
    const cleanHash = hash.startsWith('Qm') ? hash.substring(2) : hash;
    return this.storage.has(cleanHash);
  }
}
