import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Smart Contract ABI - PatientIdentity contract
const PATIENT_IDENTITY_ABI = [
  // Events
  "event PatientRegistered(address indexed patientAddress, uint256 indexed patientId, uint256 timestamp)",
  "event PatientProfileUpdated(address indexed patientAddress, uint256 indexed patientId, uint256 timestamp)",
  "event PatientVerified(address indexed patientAddress, uint8 level, address indexed verifier)",
  "event VerifierAuthorized(address indexed verifier, bool authorized)",
  "event EmergencyContactUpdated(address indexed patientAddress, uint256 timestamp)",
  
  // Functions
  "function registerPatient(string memory _encryptedProfileHash, bytes32 _publicKeyHash, string memory _emergencyContactHash) external",
  "function updatePatientProfile(string memory _encryptedProfileHash, bytes32 _publicKeyHash) external",
  "function updateEmergencyContact(string memory _emergencyContactHash) external",
  "function verifyPatient(address _patientAddress, uint8 _level) external",
  "function setVerifierAuthorization(address _verifier, bool _authorized) external",
  "function deactivatePatient() external",
  "function reactivatePatient() external",
  "function getPatientProfile(address _patientAddress) external view returns (tuple(uint256 patientId, address patientAddress, string encryptedProfileHash, bytes32 publicKeyHash, uint256 createdAt, uint256 lastUpdated, bool isActive, bool isVerified, string emergencyContactHash))",
  "function getPatientAddress(uint256 _patientId) external view returns (address)",
  "function getVerificationLevel(address _patientAddress) external view returns (uint8)",
  "function getPatientStatus(address _patientAddress) external view returns (bool, bool)",
  "function getTotalPatients() external view returns (uint256)",
  "function getPatientPublicKeyHash(address _patientAddress) external view returns (bytes32)",
  "function isRegisteredPatient(address _patient) external view returns (bool)",
  "function authorizedVerifiers(address _verifier) external view returns (bool)",
  
  // View functions for mappings
  "function patientProfiles(address) external view returns (tuple(uint256 patientId, address patientAddress, string encryptedProfileHash, bytes32 publicKeyHash, uint256 createdAt, uint256 lastUpdated, bool isActive, bool isVerified, string emergencyContactHash))",
  "function patientIdToAddress(uint256) external view returns (address)",
  "function verificationLevels(address) external view returns (uint8)"
];

// Smart Contract ABI - EncryptedNFT contract
const ENCRYPTED_NFT_ABI = [
  // Events
  "event NFTMinted(uint256 indexed tokenId, address indexed owner, string ipfsCID)",
  "event KeyReencryptionNeeded(uint256 indexed tokenId, address indexed from, address indexed to, uint256 nextVersion)",
  "event WrappedKeyUpdated(uint256 indexed tokenId, address indexed updater, uint256 newVersion)",
  
  // Functions
  "function mintEncrypted(address to, string calldata ipfsCID, bytes calldata wrappedKey) external returns (uint256)",
  "function getIPFSCID(uint256 tokenId) external view returns (string memory)",
  "function getWrappedKey(uint256 tokenId) external view returns (bytes memory)",
  "function updateWrappedKey(uint256 tokenId, bytes calldata newWrappedKey) external",
  "function getKeyVersion(uint256 tokenId) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function totalSupply() external view returns (uint256)",
  "function grantMinter(address account) external",
  "function grantReencryptor(address account) external",
  "function adminUpdateIPFSCID(uint256 tokenId, string calldata newCID) external"
];

// Smart Contract ABI - MedicalRecordVault contract
const MEDICAL_RECORD_VAULT_ABI = [
  // Events
  "event MedicalRecordCreated(uint256 indexed recordId, address indexed patient, address indexed creator, uint8 category, uint256 timestamp)",
  "event AccessPermissionGranted(address indexed patient, address indexed grantedTo, uint8 category, uint8 level, uint256 expiresAt)",
  "event AccessPermissionRevoked(address indexed patient, address indexed revokedFrom, uint8 category)",
  "event MedicalRecordAccessed(uint256 indexed recordId, address indexed accessor, address indexed patient, uint256 timestamp)",
  "event EmergencyAccess(address indexed patient, address indexed emergencyProvider, uint256 timestamp)",
  "event RecordUpdated(uint256 indexed recordId, address indexed patient, uint256 timestamp)",
  
  // Functions
  "function createMedicalRecord(string memory _ipfsHash, string memory _metadataHash, uint8 _category, bool _isEmergencyAccessible) external",
  "function grantAccess(address _doctor, uint8 _category, uint8 _level, uint256 _duration, string memory _purpose) external",
  "function revokeAccess(address _doctor, uint8 _category) external",
  "function accessMedicalRecord(uint256 _recordId, string memory _ipAddress) external returns (string memory, string memory)",
  "function emergencyAccess(address _patient, uint8 _category) external returns (uint256[] memory)",
  "function updateMedicalRecord(uint256 _recordId, string memory _newIpfsHash, string memory _newMetadataHash) external",
  "function setEmergencyProvider(address _provider, bool _authorized) external",
  "function getPatientRecords(address _patient) external view returns (uint256[] memory)",
  "function getAccessPermission(address _patient, address _doctor, uint8 _category) external view returns (tuple(address grantedTo, address patient, uint8 category, uint8 level, uint256 grantedAt, uint256 expiresAt, bool isActive, string purpose))",
  "function getPatientAccessLogs(address _patient) external view returns (uint256[] memory)",
  "function checkAccess(address _patient, address _doctor, uint8 _category) external view returns (bool, uint8, uint256)",
  "function getTotalRecords() external view returns (uint256)",
  "function medicalRecords(uint256) external view returns (tuple(uint256 recordId, address patient, string ipfsHash, string metadataHash, uint8 category, uint256 createdAt, uint256 lastAccessed, bool isEmergencyAccessible, address createdBy, bool isActive))",
  "function accessLogs(uint256) external view returns (tuple(uint256 logId, address accessor, address patient, uint256 recordId, uint256 accessedAt, string accessType, string ipAddress))",
  "function emergencyAccessProviders(address) external view returns (bool)"
];

// Contract addresses - you'll need to deploy the contracts and update these
const PATIENT_IDENTITY_CONTRACT_ADDRESS = "0x08023259e316c86364F01E97aAB69339Cf9C02ac"; // Update with deployed contract address
const ENCRYPTED_NFT_CONTRACT_ADDRESS = "0xb64747AE9eE6910Afd8630B74895ee84f7D5E3d6"; // Update with deployed contract address
const MEDICAL_RECORD_VAULT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update with deployed contract address

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  patientIdentityContract: ethers.Contract | null;
  encryptedNFTContract: ethers.Contract | null;
  medicalRecordVaultContract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  getBalance: () => Promise<string>;
  getNetwork: () => Promise<ethers.Network | null>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [patientIdentityContract, setPatientIdentityContract] = useState<ethers.Contract | null>(null);
  const [encryptedNFTContract, setEncryptedNFTContract] = useState<ethers.Contract | null>(null);
  const [medicalRecordVaultContract, setMedicalRecordVaultContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Web3 connection
  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (ethereumProvider) {
        const web3Provider = new ethers.BrowserProvider(ethereumProvider);
        setProvider(web3Provider);
        
        // Check if already connected
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await web3Provider.getSigner();
          setSigner(signer);
          setAccount(accounts[0].address);
          setIsConnected(true);
          
          // Initialize contracts
          initializeContracts(web3Provider, accounts[0].address);
        }
        
        // Listen for account changes
        ethereumProvider.on('accountsChanged', handleAccountsChanged);
        ethereumProvider.on('chainChanged', handleChainChanged);
        ethereumProvider.on('disconnect', handleDisconnect);
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
    }
  };

  const initializeContracts = (web3Provider: ethers.BrowserProvider, accountAddress: string) => {
    if (PATIENT_IDENTITY_CONTRACT_ADDRESS == "0x08023259e316c86364F01E97aAB69339Cf9C02ac") {
      const patientContract = new ethers.Contract(
        PATIENT_IDENTITY_CONTRACT_ADDRESS,
        PATIENT_IDENTITY_ABI,
        web3Provider
      );
      setPatientIdentityContract(patientContract);
    }

    if (ENCRYPTED_NFT_CONTRACT_ADDRESS == "0xb64747AE9eE6910Afd8630B74895ee84f7D5E3d6") {
      const nftContract = new ethers.Contract(
        ENCRYPTED_NFT_CONTRACT_ADDRESS,
        ENCRYPTED_NFT_ABI,
        web3Provider
      );
      setEncryptedNFTContract(nftContract);
    }

    if (MEDICAL_RECORD_VAULT_CONTRACT_ADDRESS != "0x0000000000000000000000000000000000000000") {
      const vaultContract = new ethers.Contract(
        MEDICAL_RECORD_VAULT_CONTRACT_ADDRESS,
        MEDICAL_RECORD_VAULT_ABI,
        web3Provider
      );
      setMedicalRecordVaultContract(vaultContract);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      const ethereumProvider = await detectEthereumProvider();
      if (!ethereumProvider) {
        throw new Error('MetaMask not detected');
      }

      const web3Provider = new ethers.BrowserProvider(ethereumProvider);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Initialize contracts
        initializeContracts(web3Provider, accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setPatientIdentityContract(null);
    setEncryptedNFTContract(null);
    setMedicalRecordVaultContract(null);
    setIsConnected(false);
  };

  const switchNetwork = async (chainId: string) => {
    try {
      if (provider) {
        await provider.send('wallet_switchEthereumChain', [{ chainId }]);
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  };

  const getBalance = async (): Promise<string> => {
    if (provider && account) {
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    }
    return '0';
  };

  const getNetwork = async (): Promise<ethers.Network | null> => {
    if (provider) {
      return await provider.getNetwork();
    }
    return null;
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      if (provider) {
        provider.getSigner().then(setSigner);
      }
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Reload the page to ensure proper network handling
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        patientIdentityContract,
        encryptedNFTContract,
        medicalRecordVaultContract,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        getBalance,
        getNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};