/**
 * Medical Document Encryption Service
 * Handles AES-256-GCM encryption for medical files
 */
export class MedicalEncryptionService {
    
    /**
     * Generate a new AES-256-GCM key for document encryption
     * @returns {Promise<CryptoKey>} Generated AES key
     */
    static async generateAESKey() {
        return await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256, // 256-bit key
            },
            true, // extractable
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Generate a secure random IV (Initialization Vector)
     * @returns {Uint8Array} 96-bit IV for AES-GCM
     */
    static generateIV() {
        return crypto.getRandomValues(new Uint8Array(12)); // 96 bits for GCM
    }

    /**
     * Encrypt a file using AES-256-GCM
     * @param {File|ArrayBuffer} file - File to encrypt
     * @param {CryptoKey} aesKey - AES key for encryption
     * @param {Uint8Array} iv - Initialization vector
     * @returns {Promise<{encryptedData: ArrayBuffer, authTag: Uint8Array}>}
     */
    static async encryptFile(file: File | ArrayBuffer, aesKey: CryptoKey, iv: Uint8Array) {
        try {
            // Convert File to ArrayBuffer if needed
            const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;
            
            // Encrypt using AES-GCM
            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                    tagLength: 128, // 128-bit authentication tag
                },
                aesKey,
                fileBuffer
            );

            return {
                encryptedData,
                iv: Array.from(iv), // Convert to regular array for JSON serialization
                size: fileBuffer.byteLength
            };
        } catch (error) {
            console.error('File encryption failed:', error);
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt a file using AES-256-GCM
     * @param {ArrayBuffer} encryptedData - Encrypted file data
     * @param {CryptoKey} aesKey - AES key for decryption
     * @param {Uint8Array|Array} iv - Initialization vector
     * @returns {Promise<ArrayBuffer>} Decrypted file data
     */
    static async decryptFile(encryptedData: ArrayBuffer, aesKey: CryptoKey, iv: Uint8Array | number[]) {
        try {
            // Ensure IV is Uint8Array
            const ivArray = iv instanceof Uint8Array ? iv : new Uint8Array(iv);
            
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: ivArray,
                    tagLength: 128,
                },
                aesKey,
                encryptedData
            );

            return decryptedData;
        } catch (error) {
            console.error('File decryption failed:', error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Export AES key as raw bytes for wrapping
     * @param {CryptoKey} aesKey - AES key to export
     * @returns {Promise<ArrayBuffer>} Raw key bytes
     */
    static async exportAESKey(aesKey: CryptoKey) {
        return await crypto.subtle.exportKey("raw", aesKey);
    }

    /**
     * Import AES key from raw bytes
     * @param {ArrayBuffer} keyData - Raw key bytes
     * @returns {Promise<CryptoKey>} Imported AES key
     */
    static async importAESKey(keyData: ArrayBuffer) {
        return await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Generate RSA key pair for key wrapping
     * @returns {Promise<CryptoKeyPair>} RSA key pair
     */
    static async generateRSAKeyPair() {
        return await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // extractable
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Wrap AES key with RSA public key
     * @param {CryptoKey} aesKey - AES key to wrap
     * @param {CryptoKey} rsaPublicKey - RSA public key for wrapping
     * @returns {Promise<ArrayBuffer>} Wrapped key
     */
    static async wrapKey(aesKey: CryptoKey, rsaPublicKey: CryptoKey) {
        return await crypto.subtle.wrapKey(
            "raw", // format of the key to be wrapped
            aesKey, // key to be wrapped
            rsaPublicKey, // wrapping key
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            }
        );
    }

    /**
     * Unwrap AES key with RSA private key
     * @param {ArrayBuffer} wrappedKey - Wrapped AES key
     * @param {CryptoKey} rsaPrivateKey - RSA private key for unwrapping
     * @returns {Promise<CryptoKey>} Unwrapped AES key
     */
    static async unwrapKey(wrappedKey: ArrayBuffer, rsaPrivateKey: CryptoKey) {
        return await crypto.subtle.unwrapKey(
            "raw", // format of the key to be unwrapped
            wrappedKey, // wrapped key
            rsaPrivateKey, // unwrapping key
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            { name: "AES-GCM" }, // algorithm of the unwrapped key
            true, // extractable
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Complete file upload with encryption
     * @param {File} file - File to upload
     * @param {string} patientAddress - Patient's address
     * @param {string} documentType - Type of medical document
     * @returns {Promise<Object>} Upload result with NFT token ID
     */
    static async uploadEncryptedDocument(file: File, patientAddress: string, documentType: string = "MEDICAL_RECORD") {
        try {
            console.log(`Encrypting ${file.name} for patient ${patientAddress}`);
            
            // 1. Generate AES key and IV
            const aesKey = await this.generateAESKey();
            const iv = this.generateIV();
            
            // 2. Encrypt the file
            const { encryptedData, iv: ivArray, size } = await this.encryptFile(file, aesKey, iv);
            
            // 3. Upload encrypted file to IPFS
            const encryptedFileCID = await this.uploadToIPFS(encryptedData, `encrypted_${file.name}`);
            
            // 4. Get patient's public key for key wrapping
            const patientPublicKey = await this.getPatientPublicKey(patientAddress);
            
            // 5. Wrap AES key with patient's public key
            const wrappedKey = await this.wrapKey(aesKey, patientPublicKey);
            
            // 6. Create metadata
            const metadata = {
                originalFileName: file.name,
                fileSize: size,
                fileType: file.type,
                documentType: documentType,
                encryptedFileCID: encryptedFileCID,
                iv: ivArray,
                uploadDate: new Date().toISOString(),
                patientAddress: patientAddress,
                encryptionAlgorithm: "AES-256-GCM",
                keyWrappingAlgorithm: "RSA-OAEP"
            };
            
            // 7. Upload metadata to IPFS
            const metadataCID = await this.uploadToIPFS(JSON.stringify(metadata), `metadata_${file.name}.json`);
            
            // 8. Call backend to mint NFT
            const result = await this.mintEncryptedNFT({
                patientAddress,
                metadataCID,
                wrappedKey: Array.from(new Uint8Array(wrappedKey)), // Convert to array for JSON
                documentType
            });
            
            console.log(`Document encrypted and NFT minted with token ID: ${result.tokenId}`);
            
            return {
                success: true,
                tokenId: result.tokenId,
                encryptedFileCID,
                metadataCID,
                metadata
            };
            
        } catch (error) {
            console.error('Document upload failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Download and decrypt a document
     * @param {number} tokenId - NFT token ID
     * @param {CryptoKey} privateKey - Patient's private key for unwrapping
     * @returns {Promise<{file: Blob, metadata: Object}>}
     */
    static async downloadAndDecryptDocument(tokenId: number, privateKey: CryptoKey) {
        try {
            // 1. Get NFT data from contract
            const { ipfsCID, wrappedKey } = await this.getNFTData(tokenId);
            
            // 2. Fetch metadata from IPFS
            const metadata = await this.fetchFromIPFS(ipfsCID);
            
            // 3. Fetch encrypted file from IPFS
            const encryptedData = await this.fetchFromIPFS(metadata.encryptedFileCID);
            
            // 4. Unwrap AES key
            const wrappedKeyBuffer = new Uint8Array(wrappedKey).buffer;
            const aesKey = await this.unwrapKey(wrappedKeyBuffer, privateKey);
            
            // 5. Decrypt file
            const iv = new Uint8Array(metadata.iv);
            const decryptedData = await this.decryptFile(encryptedData, aesKey, iv);
            
            // 6. Create blob for download
            const file = new Blob([decryptedData], { type: metadata.fileType });
            
            return {
                success: true,
                file,
                metadata,
                originalFileName: metadata.originalFileName
            };
            
        } catch (error) {
            console.error('Document download failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =============================================================================
    // HELPER METHODS (IPFS, API CALLS, etc.)
    // =============================================================================

    /**
     * Upload data to IPFS using Pinata or similar service
     * @param {ArrayBuffer|string} data - Data to upload
     * @param {string} fileName - File name
     * @returns {Promise<string>} IPFS CID
     */
    static async uploadToIPFS(data: ArrayBuffer | string, fileName: string) {
        // Import BackendAPI dynamically to avoid circular dependencies
        const { default: BackendAPI } = await import('./backendAPI');
        
        if (typeof data === 'string') {
            // Text data (metadata)
            const blob = new Blob([data], { type: 'application/json' });
            return await BackendAPI.uploadToIPFS(blob, fileName);
        } else {
            // Binary data (encrypted file)
            const blob = new Blob([data], { type: 'application/octet-stream' });
            return await BackendAPI.uploadToIPFS(blob, fileName);
        }
    }

    /**
     * Fetch data from IPFS
     * @param {string} cid - IPFS CID
     * @returns {Promise<any>} Retrieved data
     */
    static async fetchFromIPFS(cid: string) {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        
        if (!response.ok) {
            throw new Error(`IPFS fetch failed: ${response.statusText}`);
        }

        // Try to parse as JSON first, fallback to ArrayBuffer
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.arrayBuffer();
        }
    }

    /**
     * Get patient's public key for encryption
     * @param {string} patientAddress - Patient's wallet address
     * @returns {Promise<CryptoKey>} Patient's public key
     */
    static async getPatientPublicKey(patientAddress: string) {
        const { default: BackendAPI } = await import('./backendAPI');
        const publicKey = await BackendAPI.getPatientPublicKey(patientAddress);
        
        // Import the public key
        const publicKeyBuffer = new Uint8Array(publicKey).buffer;
        return await crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            false,
            ["encrypt"]
        );
    }

    /**
     * Call backend API to mint encrypted NFT
     * @param {Object} nftData - NFT minting data
     * @returns {Promise<Object>} Minting result
     */
    static async mintEncryptedNFT(nftData: any) {
        const { default: BackendAPI } = await import('./backendAPI');
        return await BackendAPI.mintEncryptedNFT(nftData);
    }

    /**
     * Get NFT data from smart contract
     * @param {number} tokenId - NFT token ID
     * @returns {Promise<{ipfsCID: string, wrappedKey: Uint8Array}>}
     */
    static async getNFTData(tokenId: number) {
        const { default: BackendAPI } = await import('./backendAPI');
        return await BackendAPI.getNFTData(tokenId);
    }

    // =============================================================================
    // KEY MANAGEMENT UTILITIES
    // =============================================================================

    /**
     * Store private key securely (browser keychain/secure storage)
     * @param {CryptoKey} privateKey - Private key to store
     * @param {string} keyId - Unique identifier for the key
     */
    static async storePrivateKey(privateKey: CryptoKey, keyId: string) {
        const exported = await crypto.subtle.exportKey("pkcs8", privateKey);
        const keyData = Array.from(new Uint8Array(exported));
        
        // In production, use secure storage like browser keychain
        // For demo, using localStorage with warning
        console.warn('Private key stored in localStorage - use secure storage in production!');
        localStorage.setItem(`privateKey_${keyId}`, JSON.stringify(keyData));
    }

    /**
     * Retrieve private key from secure storage
     * @param {string} keyId - Key identifier
     * @returns {Promise<CryptoKey>} Retrieved private key
     */
    static async getPrivateKey(keyId: string) {
        const keyDataStr = localStorage.getItem(`privateKey_${keyId}`);
        if (!keyDataStr) {
            throw new Error('Private key not found');
        }

        const keyData = JSON.parse(keyDataStr);
        const keyBuffer = new Uint8Array(keyData).buffer;

        return await crypto.subtle.importKey(
            "pkcs8",
            keyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            false,
            ["decrypt"]
        );
    }

    /**
     * Generate and store new key pair for patient
     * @param {string} patientAddress - Patient's address
     * @returns {Promise<{publicKey: CryptoKey, privateKey: CryptoKey}>}
     */
    static async generateAndStoreKeyPair(patientAddress: string) {
        const keyPair = await this.generateRSAKeyPair();
        
        // Store private key securely
        await this.storePrivateKey(keyPair.privateKey, patientAddress);
        
        // Export and send public key to backend for storage
        const publicKeyData = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKeyArray = Array.from(new Uint8Array(publicKeyData));
        
        const { default: BackendAPI } = await import('./backendAPI');
        await BackendAPI.storePatientPublicKey(patientAddress, publicKeyArray);

        return keyPair;
    }
}
