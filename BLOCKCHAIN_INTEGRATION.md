# Blockchain Integration Guide

This document explains the blockchain integration features implemented in the Dr Hedera application.

## Overview

The application now includes comprehensive blockchain integration using the PatientIdentity smart contract, providing:

- **Self-sovereign patient identities** on the blockchain
- **Encrypted medical data storage** using IPFS
- **Blockchain-based access control** for medical records
- **MetaMask wallet integration** for secure transactions
- **Multi-level identity verification** system

## Features Implemented

### 1. Web3 Integration
- **MetaMask wallet connection** with automatic detection
- **Smart contract interaction** using ethers.js
- **Transaction status tracking** and error handling
- **Network switching** support

### 2. Patient Identity Management
- **Blockchain registration** with encrypted profile data
- **Public key management** for encryption
- **Emergency contact storage** on IPFS
- **Identity verification levels** (Unverified, Basic, Enhanced, Medical Grade)

### 3. Access Control System
- **Authorized verifiers** management
- **Permission-based access** to medical records
- **Blockchain-based permissions** that can't be tampered with
- **Real-time permission updates**

### 4. Data Security
- **Client-side encryption** of sensitive data
- **IPFS integration** for decentralized storage
- **Public key cryptography** for secure data sharing
- **Encrypted emergency contacts**

## Smart Contract Features

### PatientIdentity Contract
The smart contract provides the following functionality:

```solidity
// Core functions
function registerPatient(string memory _encryptedProfileHash, bytes32 _publicKeyHash, string memory _emergencyContactHash)
function updatePatientProfile(string memory _encryptedProfileHash, bytes32 _publicKeyHash)
function updateEmergencyContact(string memory _emergencyContactHash)

// Verification system
function verifyPatient(address _patientAddress, VerificationLevel _level)
function setVerifierAuthorization(address _verifier, bool _authorized)

// Access control
function getPatientProfile(address _patientAddress) returns (PatientProfile)
function getVerificationLevel(address _patientAddress) returns (VerificationLevel)
function getPatientStatus(address _patientAddress) returns (bool, bool)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install ethers @metamask/detect-provider crypto-js
```

### 2. Deploy Smart Contract
```bash
# Install Hardhat (if not already installed)
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Deploy the contract
npx hardhat run scripts/deploy.js --network <network>
```

### 3. Update Contract Address
After deployment, update the `CONTRACT_ADDRESS` in `src/contexts/Web3Context.tsx`:

```typescript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 4. Configure Network
Ensure your MetaMask is connected to the correct network (Ethereum mainnet, testnet, or local development network).

## Usage Guide

### For Patients

1. **Connect Wallet**: Click "Connect MetaMask" to link your wallet
2. **Register Identity**: Fill out the patient registration form with your medical information
3. **Manage Permissions**: Grant or revoke access to healthcare providers
4. **View Status**: Check your verification level and blockchain status

### For Healthcare Providers

1. **Request Access**: Healthcare providers can request access to patient records
2. **Verify Patients**: Authorized verifiers can verify patient identities
3. **Access Records**: View patient records based on granted permissions

## Security Features

### Data Encryption
- All sensitive data is encrypted client-side before storage
- Public key cryptography ensures only authorized parties can decrypt data
- Emergency contacts are separately encrypted and stored

### Access Control
- Blockchain-based permissions that cannot be tampered with
- Time-based access expiration
- Granular permission levels (Full Access, Limited Access, Lab Results Only)

### Identity Verification
- Multi-level verification system
- KYC integration for enhanced security
- Verifier authorization system

## Technical Implementation

### Frontend Components
- `Web3Context`: Manages Web3 connection and smart contract interaction
- `WalletConnection`: Handles MetaMask wallet connection
- `BlockchainRegistration`: Patient identity registration form
- `BlockchainPermissions`: Access control management

### Smart Contract Service
- `SmartContractService`: High-level interface for smart contract interactions
- `EncryptionUtils`: Client-side encryption utilities
- `MockIPFS`: Mock IPFS implementation for development

### Data Flow
1. User connects MetaMask wallet
2. Patient fills registration form with medical data
3. Data is encrypted client-side
4. Encrypted data is uploaded to IPFS
5. IPFS hash is stored on blockchain
6. Access permissions are managed through smart contract

## Development Notes

### Mock IPFS
The current implementation uses a mock IPFS service for development. In production, replace with actual IPFS integration:

```typescript
// Replace MockIPFS with actual IPFS client
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
```

### Gas Optimization
- Consider implementing gas estimation for better UX
- Add transaction status notifications
- Implement retry mechanisms for failed transactions

### Error Handling
- Comprehensive error handling for Web3 operations
- User-friendly error messages
- Fallback mechanisms for network issues

## Testing

### Local Development
1. Start local blockchain (Hardhat, Ganache)
2. Deploy contract to local network
3. Update contract address in frontend
4. Test all functionality with local wallet

### Testnet Deployment
1. Deploy to Ethereum testnet (Goerli, Sepolia)
2. Get testnet ETH from faucets
3. Test with testnet MetaMask wallet

## Production Considerations

### Security
- Use environment variables for sensitive configuration
- Implement proper key management
- Add audit logging for all blockchain operations

### Performance
- Implement caching for frequently accessed data
- Optimize smart contract gas usage
- Consider layer 2 solutions for cost reduction

### Scalability
- Implement pagination for large datasets
- Consider IPFS pinning services
- Plan for increased transaction volume

## Troubleshooting

### Common Issues

1. **MetaMask not detected**
   - Ensure MetaMask is installed and unlocked
   - Check if the site is added to trusted sites

2. **Transaction failed**
   - Check gas fees and network congestion
   - Ensure sufficient ETH balance
   - Verify contract address is correct

3. **IPFS upload failed**
   - Check IPFS node connectivity
   - Verify file size limits
   - Check network configuration

### Debug Mode
Enable debug logging by setting `DEBUG=true` in environment variables.

## Support

For technical support or questions about the blockchain integration:
- Check the console for error messages
- Verify MetaMask connection status
- Ensure contract is deployed and address is correct
- Check network connectivity and gas fees
