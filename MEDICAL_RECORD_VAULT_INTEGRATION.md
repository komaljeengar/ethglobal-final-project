# MedicalRecordVault Integration

This document describes the integration of the MedicalRecordVault smart contract with the frontend application.

## Overview

The MedicalRecordVault is a comprehensive smart contract that manages encrypted medical records on the blockchain with fine-grained access control and audit trails. It integrates with the existing PatientIdentity contract to ensure only registered patients can create and manage records.

## Smart Contract Features

### Core Functionality
- **Medical Record Management**: Create, update, and access encrypted medical records
- **Access Control**: Granular permission system with different access levels
- **Emergency Access**: Special access for emergency providers
- **Audit Trail**: Complete logging of all record access and modifications
- **Category-based Organization**: Records organized by medical categories

### Record Categories
- General (0)
- Lab Results (1)
- Imaging (2)
- Prescriptions (3)
- Allergies (4)
- Surgeries (5)
- Immunizations (6)
- Mental Health (7)
- Emergency (8)

### Access Levels
- None (0)
- Read Basic (1) - Basic info only
- Read Detailed (2) - Detailed medical info
- Read Full (3) - Complete access including sensitive data
- Write Append (4) - Can add new records

## Frontend Integration

### Components Added

#### 1. MedicalRecordVault.tsx
A comprehensive React component that provides:
- Medical record creation interface
- Access permission management
- Record viewing and access
- Search and filtering capabilities
- Integration with Web3 wallet

#### 2. Web3Context Updates
- Added MedicalRecordVault contract ABI
- Integrated contract instance in Web3Provider
- Added contract address configuration

### Pages Updated

#### 1. Patient Records Page (`/patient/records`)
- Integrated MedicalRecordVault component
- Maintains existing EncryptedDocumentUpload functionality
- Provides unified medical record management interface

#### 2. Patient Permissions Page (`/patient/permissions`)
- Added MedicalRecordVault component for permission management
- Maintains existing BlockchainPermissions functionality
- Comprehensive access control interface

## Smart Contract Deployment

### Deployment Scripts

#### 1. Solidity Script (`script/DeployMedicalRecordVault.s.sol`)
```solidity
contract DeployMedicalRecordVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address patientIdentityContract = vm.envAddress("PATIENT_IDENTITY_CONTRACT");
        
        vm.startBroadcast(deployerPrivateKey);
        MedicalRecordVault vault = new MedicalRecordVault(patientIdentityContract);
        console.log("MedicalRecordVault deployed at:", address(vault));
        vm.stopBroadcast();
    }
}
```

#### 2. JavaScript Script (`scripts/deploy-medical-record-vault.js`)
- Automated deployment with Hardhat
- Contract verification
- ABI generation and storage
- Frontend configuration updates

### Deployment Instructions

1. **Set Environment Variables**:
   ```bash
   export PRIVATE_KEY="your_private_key"
   export PATIENT_IDENTITY_CONTRACT="0x08023259e316c86364F01E97aAB69339Cf9C02ac"
   ```

2. **Deploy with Foundry**:
   ```bash
   forge script script/DeployMedicalRecordVault.s.sol --rpc-url $RPC_URL --broadcast --verify
   ```

3. **Deploy with Hardhat**:
   ```bash
   npx hardhat run scripts/deploy-medical-record-vault.js --network <network>
   ```

4. **Update Frontend Configuration**:
   - Update `MEDICAL_RECORD_VAULT_CONTRACT_ADDRESS` in `Web3Context.tsx`
   - The deployment script automatically generates the ABI file

## Usage Examples

### Creating a Medical Record

```typescript
const createMedicalRecord = async () => {
  if (!medicalRecordVaultContract || !signer) return;
  
  const tx = await medicalRecordVaultContract.connect(signer).createMedicalRecord(
    "QmYourIPFSHash", // Encrypted medical data IPFS hash
    "QmYourMetadataHash", // Encrypted metadata IPFS hash
    1, // Lab Results category
    true // Emergency accessible
  );
  await tx.wait();
};
```

### Granting Access Permission

```typescript
const grantAccess = async () => {
  if (!medicalRecordVaultContract || !signer) return;
  
  const tx = await medicalRecordVaultContract.connect(signer).grantAccess(
    "0xDoctorAddress", // Doctor's wallet address
    1, // Lab Results category
    2, // Read Detailed access level
    86400, // 1 day duration in seconds
    "Consultation" // Purpose
  );
  await tx.wait();
};
```

### Accessing Medical Records

```typescript
const accessMedicalRecord = async (recordId: number) => {
  if (!medicalRecordVaultContract || !signer) return;
  
  const [ipfsHash, metadataHash] = await medicalRecordVaultContract
    .connect(signer)
    .accessMedicalRecord(recordId, ""); // IP address for audit trail
  
  // Decrypt and display content using the hashes
};
```

## Security Features

### Access Control
- Only registered patients can create records
- Granular permission system with expiration
- Emergency access for authorized providers
- Complete audit trail of all access

### Data Protection
- All medical data encrypted before IPFS storage
- Metadata separately encrypted
- No sensitive data stored on-chain
- Patient-controlled access permissions

### Audit Trail
- Every record access logged
- Timestamp and accessor information
- IP address tracking (optional)
- Immutable blockchain records

## Integration Benefits

1. **Decentralized Storage**: Medical records stored on IPFS with blockchain access control
2. **Patient Control**: Patients have complete control over their data access
3. **Interoperability**: Standardized interface for healthcare providers
4. **Compliance**: Audit trail supports healthcare compliance requirements
5. **Emergency Access**: Authorized emergency providers can access critical records
6. **Privacy**: End-to-end encryption with patient-controlled keys

## Future Enhancements

1. **Key Management**: Integration with advanced key management systems
2. **Consent Management**: More sophisticated consent tracking
3. **Data Sharing**: Automated data sharing between providers
4. **Analytics**: Privacy-preserving analytics on medical data
5. **Mobile Integration**: Mobile app for emergency access

## Troubleshooting

### Common Issues

1. **Contract Not Deployed**: Ensure contract address is correctly set in Web3Context
2. **Permission Denied**: Verify patient is registered in PatientIdentity contract
3. **Access Denied**: Check if access permission is granted and not expired
4. **Transaction Failed**: Ensure sufficient gas and correct network

### Debug Steps

1. Check contract deployment status
2. Verify patient registration
3. Confirm access permissions
4. Check network connectivity
5. Verify wallet connection

## Support

For technical support or questions about the MedicalRecordVault integration, please refer to the project documentation or contact the development team.
