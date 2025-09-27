# 🔐 Encrypted NFT Medical Records Implementation Guide

This guide explains how to implement the complete encrypted NFT system for medical document storage using AES-256-GCM encryption and Hedera blockchain.

## 📋 Overview

The system provides:
- **Client-side AES-256-GCM encryption** for medical documents
- **RSA-OAEP key wrapping** for secure key distribution
- **IPFS storage** for encrypted files and metadata
- **NFT-based ownership** with blockchain verification
- **Automatic key re-encryption** on NFT transfers
- **Hedera AI Agent** for seamless key management

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Hedera)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IPFS Storage  │    │   Redis Cache   │    │   Smart        │
│   (Pinata)      │    │   (Key Store)   │    │   Contracts    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Implementation Steps

### 1. **Smart Contract Deployment**

Deploy the EncryptedNFT contract to Hedera testnet:

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Deploy contract
npx hardhat run scripts/deploy-encrypted-nft.js --network hedera_testnet
```

### 2. **Backend API Setup**

Create a Node.js backend with the following services:

```bash
# Create backend directory
mkdir medvault-backend
cd medvault-backend

# Initialize project
npm init -y

# Install dependencies
npm install express multer web3 crypto @pinata/sdk redis cors helmet morgan
npm install --save-dev nodemon

# Copy the backend implementation from the provided code
```

### 3. **Frontend Integration**

The frontend components are already integrated:

- ✅ `MedicalEncryptionService` - Client-side encryption
- ✅ `EncryptedDocumentUpload` - Upload component
- ✅ `Web3Context` - Blockchain integration
- ✅ `BackendAPI` - API communication

### 4. **IPFS Configuration**

Set up IPFS storage with Pinata:

1. Create account at [Pinata](https://pinata.cloud)
2. Get API keys
3. Configure environment variables

### 5. **Environment Setup**

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Update the following variables:
- Contract addresses (after deployment)
- Pinata API keys
- Hedera RPC URL
- Private keys for minting/re-encryption

## 🔧 Configuration

### Smart Contract Addresses

Update `src/contexts/Web3Context.tsx`:

```typescript
const PATIENT_IDENTITY_CONTRACT_ADDRESS = "0x..."; // Your deployed address
const ENCRYPTED_NFT_CONTRACT_ADDRESS = "0x..."; // Your deployed address
```

### Backend API URL

Update `src/lib/backendAPI.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

## 🔐 Security Features

### Client-Side Encryption
- **AES-256-GCM** for file encryption
- **RSA-OAEP** for key wrapping
- **WebCrypto API** for secure key generation
- **Local key storage** (upgrade to secure storage in production)

### Blockchain Security
- **NFT ownership** verification
- **Access control** via smart contracts
- **Event-driven** key re-encryption
- **Version tracking** for key updates

### IPFS Security
- **Encrypted files** only stored on IPFS
- **Metadata separation** from encrypted content
- **CID-based** content addressing
- **Gateway access** control

## 📊 Data Flow

### Upload Process
1. **User selects file** → Frontend
2. **Generate AES key** → Client-side
3. **Encrypt file** → AES-256-GCM
4. **Upload to IPFS** → Pinata
5. **Wrap AES key** → RSA-OAEP
6. **Mint NFT** → Smart contract
7. **Store metadata** → IPFS

### Download Process
1. **Get NFT data** → Smart contract
2. **Fetch metadata** → IPFS
3. **Fetch encrypted file** → IPFS
4. **Unwrap AES key** → RSA-OAEP
5. **Decrypt file** → AES-256-GCM
6. **Download file** → Client

### Transfer Process
1. **Transfer NFT** → Smart contract
2. **Emit event** → KeyReencryptionNeeded
3. **AI Agent detects** → Event listener
4. **Re-encrypt key** → New owner's public key
5. **Update contract** → New wrapped key

## 🛠️ Development Setup

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Development
```bash
# Install dependencies
npm install

# Start backend server
npm run dev
```

### Smart Contract Development
```bash
# Install Hardhat
npm install --save-dev hardhat

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network hedera_testnet
```

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
npm run test

# Backend tests
npm run test:backend

# Smart contract tests
npx hardhat test
```

### Integration Tests
1. **Upload document** → Verify encryption
2. **Download document** → Verify decryption
3. **Transfer NFT** → Verify key re-encryption
4. **Access control** → Verify permissions

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### Backend Deployment
```bash
# Build Docker image
docker build -t medvault-backend .

# Deploy to cloud provider
docker run -d -p 3001:3001 medvault-backend
```

### Smart Contract Deployment
```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network hedera_mainnet
```

## 📈 Monitoring

### Health Checks
- **API health** → `/api/health`
- **Contract connectivity** → Web3 provider
- **IPFS connectivity** → Pinata API
- **Redis connectivity** → Cache status

### Metrics
- **Total NFTs minted** → Contract events
- **Re-encryption events** → Agent processing
- **Storage usage** → IPFS statistics
- **Performance metrics** → Response times

## 🔧 Troubleshooting

### Common Issues

1. **MetaMask not detected**
   - Install MetaMask extension
   - Check network configuration

2. **IPFS upload fails**
   - Verify Pinata API keys
   - Check network connectivity
   - Validate file size limits

3. **Smart contract errors**
   - Verify contract addresses
   - Check network configuration
   - Validate gas limits

4. **Encryption/Decryption fails**
   - Check key storage
   - Verify algorithm compatibility
   - Validate file format

### Debug Mode

Enable debug logging:

```typescript
// Frontend
localStorage.setItem('debug', 'true');

// Backend
DEBUG=medvault:* npm run dev
```

## 📚 API Reference

### Frontend API

```typescript
// Upload encrypted document
MedicalEncryptionService.uploadEncryptedDocument(file, patientAddress, documentType)

// Download and decrypt document
MedicalEncryptionService.downloadAndDecryptDocument(tokenId, privateKey)

// Generate key pair
MedicalEncryptionService.generateAndStoreKeyPair(patientAddress)
```

### Backend API

```typescript
// Upload to IPFS
POST /api/ipfs/upload

// Mint NFT
POST /api/nft/mint-encrypted

// Get NFT data
GET /api/nft/:tokenId/data

// Get patient NFTs
GET /api/patients/:address/nfts
```

### Smart Contract API

```solidity
// Mint encrypted NFT
function mintEncrypted(address to, string calldata ipfsCID, bytes calldata wrappedKey)

// Get NFT data
function getIPFSCID(uint256 tokenId) external view returns (string)
function getWrappedKey(uint256 tokenId) external view returns (bytes)

// Update wrapped key (AI Agent)
function updateWrappedKey(uint256 tokenId, bytes calldata newWrappedKey)
```

## 🔒 Security Best Practices

1. **Use HTTPS** for all API calls
2. **Validate inputs** on both frontend and backend
3. **Implement rate limiting** for API endpoints
4. **Use secure key storage** in production
5. **Regular security audits** of smart contracts
6. **Monitor for suspicious activity**
7. **Implement backup and recovery** procedures

## 📞 Support

For issues and questions:
- **GitHub Issues** → Create issue in repository
- **Documentation** → Check this guide
- **Community** → Join Discord/Telegram
- **Professional Support** → Contact development team

---

## 🎉 Success!

You now have a complete encrypted NFT system for medical document storage! The system provides:

- ✅ **End-to-end encryption** for medical documents
- ✅ **Blockchain-based ownership** verification
- ✅ **Automatic key management** via AI agent
- ✅ **IPFS storage** for encrypted files
- ✅ **Secure key wrapping** with RSA-OAEP
- ✅ **NFT transfer** with key re-encryption
- ✅ **Production-ready** security features

Your medical records are now protected with military-grade encryption and stored on the blockchain! 🔐✨
