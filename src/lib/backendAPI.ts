/**
 * Backend API Service for Encrypted NFT Medical Records
 * This file contains the API calls that would connect to your backend server
 */

// API Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface NFTMintRequest {
  patientAddress: string;
  metadataCID: string;
  wrappedKey: number[];
  documentType: string;
}

interface NFTMintResponse {
  tokenId: number;
  transactionHash: string;
  blockNumber: number;
  metadataCID: string;
  gasUsed: number;
}

interface NFTData {
  tokenId: number;
  ipfsCID: string;
  wrappedKey: number[];
  keyVersion: number;
  owner: string;
  metadata?: any;
}

interface PatientNFTs {
  nfts: Array<{
    tokenId: number;
    owner: string;
    mintedAt: string;
    transactionHash: string;
    metadata: {
      originalFileName: string;
      fileSize: number;
      documentType: string;
      uploadDate: string;
    };
  }>;
  total: number;
  limit: number;
  offset: number;
}

class BackendAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Upload file to IPFS
   */
  static async uploadToIPFS(file: File | Blob, fileName: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    const response = await fetch(`${API_BASE_URL}/api/ipfs/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.ipfsHash;
  }

  /**
   * Upload JSON metadata to IPFS
   */
  static async uploadMetadataToIPFS(metadata: any, fileName: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/ipfs/upload-json`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ metadata, filename: fileName }),
    });

    if (!response.ok) {
      throw new Error(`Metadata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.ipfsHash;
  }

  /**
   * Mint encrypted NFT
   */
  static async mintEncryptedNFT(data: NFTMintRequest): Promise<NFTMintResponse> {
    const response = await fetch(`${API_BASE_URL}/api/nft/mint-encrypted`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`NFT minting failed: ${error.error || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get NFT data (IPFS CID and wrapped key)
   */
  static async getNFTData(tokenId: number): Promise<NFTData> {
    const response = await fetch(`${API_BASE_URL}/api/nft/${tokenId}/data`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get NFT data: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get patient's NFT list
   */
  static async getPatientNFTs(patientAddress: string, limit = 50, offset = 0): Promise<PatientNFTs> {
    const response = await fetch(
      `${API_BASE_URL}/api/patients/${patientAddress}/nfts?limit=${limit}&offset=${offset}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get patient NFTs: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Store patient's public key
   */
  static async storePatientPublicKey(patientAddress: string, publicKey: number[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/patients/store-public-key`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ patientAddress, publicKey }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store public key: ${response.statusText}`);
    }
  }

  /**
   * Get patient's public key
   */
  static async getPatientPublicKey(patientAddress: string): Promise<number[]> {
    const response = await fetch(`${API_BASE_URL}/api/patients/${patientAddress}/publickey`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get public key: ${response.statusText}`);
    }

    const result = await response.json();
    return result.publicKey;
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get system metrics
   */
  static async getMetrics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/metrics`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get metrics: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Start re-encryption agent
   */
  static async startReencryptionAgent(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/agent/start`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to start agent: ${response.statusText}`);
    }
  }

  /**
   * Stop re-encryption agent
   */
  static async stopReencryptionAgent(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/agent/stop`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to stop agent: ${response.statusText}`);
    }
  }
}

export default BackendAPI;
