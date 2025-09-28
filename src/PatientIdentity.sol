// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

/**
 * @title PatientIdentity
 * @dev Manages self-sovereign patient identities on 0G blockchain
 * @notice This contract handles patient registration, identity verification, and profile management
 */
contract PatientIdentity is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counter for unique patient IDs
    Counters.Counter private _patientIdCounter;

    // Patient identity structure
    struct PatientProfile {
        uint256 patientId;
        address patientAddress;
        string encryptedProfileHash; // IPFS hash of encrypted personal data
        bytes32 publicKeyHash; // Hash of patient's public key for encryption
        uint256 createdAt;
        uint256 lastUpdated;
        bool isActive;
        bool isVerified; // KYC verification status
        string emergencyContactHash; // IPFS hash of encrypted emergency contact info
    }

    // Identity verification levels
    enum VerificationLevel {
        UNVERIFIED,
        BASIC,
        ENHANCED,
        MEDICAL_GRADE
    }

    // Mapping from patient address to patient profile
    mapping(address => PatientProfile) public patientProfiles;
    
    // Mapping from patient ID to patient address (reverse lookup)
    mapping(uint256 => address) public patientIdToAddress;
    
    // Mapping from patient address to verification level
    mapping(address => VerificationLevel) public verificationLevels;
    
    // Authorized verifiers (KYC providers, medical institutions)
    mapping(address => bool) public authorizedVerifiers;
    
    // Patient existence check
    mapping(address => bool) public isRegisteredPatient;

    // Events
    event PatientRegistered(
        address indexed patientAddress,
        uint256 indexed patientId,
        uint256 timestamp
    );
    
    event PatientProfileUpdated(
        address indexed patientAddress,
        uint256 indexed patientId,
        uint256 timestamp
    );
    
    event PatientVerified(
        address indexed patientAddress,
        VerificationLevel level,
        address indexed verifier
    );
    
    event VerifierAuthorized(
        address indexed verifier,
        bool authorized
    );
    
    event EmergencyContactUpdated(
        address indexed patientAddress,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyRegisteredPatient() {
        require(isRegisteredPatient[msg.sender], "Patient not registered");
        _;
    }
    
    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        _;
    }
    
    modifier patientExists(address _patient) {
        require(isRegisteredPatient[_patient], "Patient does not exist");
        _;
    }

    constructor() {
        // Initialize counter to start from 1
        _patientIdCounter.increment();
    }

    /**
     * @dev Register a new patient identity
     * @param _encryptedProfileHash IPFS hash of encrypted personal data
     * @param _publicKeyHash Hash of patient's public key for encryption
     * @param _emergencyContactHash IPFS hash of encrypted emergency contact info
     */
    function registerPatient(
        string memory _encryptedProfileHash,
        bytes32 _publicKeyHash,
        string memory _emergencyContactHash
    ) external nonReentrant {
        require(!isRegisteredPatient[msg.sender], "Patient already registered");
        require(bytes(_encryptedProfileHash).length > 0, "Profile hash required");
        require(_publicKeyHash != bytes32(0), "Public key hash required");

        uint256 newPatientId = _patientIdCounter.current();
        _patientIdCounter.increment();

        PatientProfile memory newProfile = PatientProfile({
            patientId: newPatientId,
            patientAddress: msg.sender,
            encryptedProfileHash: _encryptedProfileHash,
            publicKeyHash: _publicKeyHash,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            isActive: true,
            isVerified: false,
            emergencyContactHash: _emergencyContactHash
        });

        patientProfiles[msg.sender] = newProfile;
        patientIdToAddress[newPatientId] = msg.sender;
        isRegisteredPatient[msg.sender] = true;
        verificationLevels[msg.sender] = VerificationLevel.UNVERIFIED;

        emit PatientRegistered(msg.sender, newPatientId, block.timestamp);
    }

    /**
     * @dev Update patient profile information
     * @param _encryptedProfileHash New IPFS hash of encrypted personal data
     * @param _publicKeyHash New hash of patient's public key
     */
    function updatePatientProfile(
        string memory _encryptedProfileHash,
        bytes32 _publicKeyHash
    ) external onlyRegisteredPatient nonReentrant {
        require(bytes(_encryptedProfileHash).length > 0, "Profile hash required");
        require(_publicKeyHash != bytes32(0), "Public key hash required");

        PatientProfile storage profile = patientProfiles[msg.sender];
        profile.encryptedProfileHash = _encryptedProfileHash;
        profile.publicKeyHash = _publicKeyHash;
        profile.lastUpdated = block.timestamp;

        emit PatientProfileUpdated(msg.sender, profile.patientId, block.timestamp);
    }

    /**
     * @dev Update emergency contact information
     * @param _emergencyContactHash New IPFS hash of encrypted emergency contact info
     */
    function updateEmergencyContact(
        string memory _emergencyContactHash
    ) external onlyRegisteredPatient {
        PatientProfile storage profile = patientProfiles[msg.sender];
        profile.emergencyContactHash = _emergencyContactHash;
        profile.lastUpdated = block.timestamp;

        emit EmergencyContactUpdated(msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a patient's identity (KYC)
     * @param _patientAddress Address of the patient to verify
     * @param _level Verification level to assign
     */
    function verifyPatient(
        address _patientAddress,
        VerificationLevel _level
    ) external onlyAuthorizedVerifier patientExists(_patientAddress) {
        require(_level != VerificationLevel.UNVERIFIED, "Invalid verification level");
        
        verificationLevels[_patientAddress] = _level;
        patientProfiles[_patientAddress].isVerified = true;
        patientProfiles[_patientAddress].lastUpdated = block.timestamp;

        emit PatientVerified(_patientAddress, _level, msg.sender);
    }

    /**
     * @dev Authorize or deauthorize a verifier
     * @param _verifier Address of the verifier
     * @param _authorized Authorization status
     */
    function setVerifierAuthorization(
        address _verifier,
        bool _authorized
    ) external onlyOwner {
        require(_verifier != address(0), "Invalid verifier address");
        authorizedVerifiers[_verifier] = _authorized;
        
        emit VerifierAuthorized(_verifier, _authorized);
    }

    /**
     * @dev Deactivate patient account (soft delete)
     */
    function deactivatePatient() external onlyRegisteredPatient {
        patientProfiles[msg.sender].isActive = false;
        patientProfiles[msg.sender].lastUpdated = block.timestamp;
    }

    /**
     * @dev Reactivate patient account
     */
    function reactivatePatient() external onlyRegisteredPatient {
        patientProfiles[msg.sender].isActive = true;
        patientProfiles[msg.sender].lastUpdated = block.timestamp;
    }

    // View functions
    
    /**
     * @dev Get patient profile by address
     * @param _patientAddress Patient's address
     * @return PatientProfile struct
     */
    function getPatientProfile(
        address _patientAddress
    ) external view patientExists(_patientAddress) returns (PatientProfile memory) {
        return patientProfiles[_patientAddress];
    }

    /**
     * @dev Get patient address by ID
     * @param _patientId Patient ID
     * @return Patient's address
     */
    function getPatientAddress(uint256 _patientId) external view returns (address) {
        address patientAddr = patientIdToAddress[_patientId];
        require(patientAddr != address(0), "Patient ID not found");
        return patientAddr;
    }

    /**
     * @dev Get patient verification level
     * @param _patientAddress Patient's address
     * @return VerificationLevel
     */
    function getVerificationLevel(
        address _patientAddress
    ) external view patientExists(_patientAddress) returns (VerificationLevel) {
        return verificationLevels[_patientAddress];
    }

    /**
     * @dev Check if patient is active and verified
     * @param _patientAddress Patient's address
     * @return isActive, isVerified
     */
    function getPatientStatus(
        address _patientAddress
    ) external view patientExists(_patientAddress) returns (bool, bool) {
        PatientProfile memory profile = patientProfiles[_patientAddress];
        return (profile.isActive, profile.isVerified);
    }

    /**
     * @dev Get total number of registered patients
     * @return Total patient count
     */
    function getTotalPatients() external view returns (uint256) {
        return _patientIdCounter.current() - 1;
    }

    /**
     * @dev Get patient's public key hash for encryption
     * @param _patientAddress Patient's address
     * @return Public key hash
     */
    function getPatientPublicKeyHash(
        address _patientAddress
    ) external view patientExists(_patientAddress) returns (bytes32) {
        return patientProfiles[_patientAddress].publicKeyHash;
    }
}
