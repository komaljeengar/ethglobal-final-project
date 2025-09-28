import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

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
  "function verificationLevels(address) external view returns (uint8)",
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
  "function adminUpdateIPFSCID(uint256 tokenId, string calldata newCID) external",
];

// Contract addresses - using environment variables with fallbacks for demo
const PATIENT_IDENTITY_CONTRACT_ADDRESS =
  import.meta.env.VITE_PATIENT_IDENTITY_CONTRACT_ADDRESS ||
  "0x1234567890123456789012345678901234567890"; // Demo address
const ENCRYPTED_NFT_CONTRACT_ADDRESS =
  import.meta.env.VITE_ENCRYPTED_NFT_CONTRACT_ADDRESS ||
  "0x0987654321098765432109876543210987654321"; // Demo address

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  patientIdentityContract: ethers.Contract | null;
  encryptedNFTContract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
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
    throw new Error("useWeb3 must be used within a Web3Provider");
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
  const [error, setError] = useState<string | null>(null);
  const [patientIdentityContract, setPatientIdentityContract] =
    useState<ethers.Contract | null>(null);
  const [encryptedNFTContract, setEncryptedNFTContract] =
    useState<ethers.Contract | null>(null);
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
        ethereumProvider.on("accountsChanged", handleAccountsChanged);
        ethereumProvider.on("chainChanged", handleChainChanged);
        ethereumProvider.on("disconnect", handleDisconnect);
      }
    } catch (error) {
      console.warn("Web3 initialization failed (continuing without blockchain features):", error);
      setError("Web3 features unavailable");
    }
  };

  const initializeContracts = (
    web3Provider: ethers.BrowserProvider,
    accountAddress: string
  ) => {
    try {
      const patientContract = new ethers.Contract(
        PATIENT_IDENTITY_CONTRACT_ADDRESS,
        PATIENT_IDENTITY_ABI,
        web3Provider
      );
      setPatientIdentityContract(patientContract);

      const nftContract = new ethers.Contract(
        ENCRYPTED_NFT_CONTRACT_ADDRESS,
        ENCRYPTED_NFT_ABI,
        web3Provider
      );
      setEncryptedNFTContract(nftContract);
    } catch (error) {
      console.warn(
        "Contract initialization failed (this is expected in demo mode):",
        error
      );
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      const ethereumProvider = await detectEthereumProvider();
      if (!ethereumProvider) {
        throw new Error("MetaMask not detected");
      }

      const web3Provider = new ethers.BrowserProvider(ethereumProvider);
      const accounts = await web3Provider.send("eth_requestAccounts", []);

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
      console.error("Failed to connect wallet:", error);
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
    setIsConnected(false);
  };

  const switchNetwork = async (chainId: string) => {
    try {
      if (provider) {
        await provider.send("wallet_switchEthereumChain", [{ chainId }]);
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
      throw error;
    }
  };

  const getBalance = async (): Promise<string> => {
    if (provider && account) {
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    }
    return "0";
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
        isConnected,
        isConnecting,
        error,
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
