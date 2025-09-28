// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IPatientIdentity {
    function isRegisteredPatient(address _patient) external view returns (bool);
    function getPatientStatus(address _patient) external view returns (bool isActive, bool isVerified);
    function getPatientPublicKeyHash(address _patient) external view returns (bytes32);
}

/**
 * @title MedicalRecordVault
 * @dev Controls access to encrypted medical data stored on IPFS
 * @notice This contract manages medical records, access permissions, and audit trails
 */
contract MedicalRecordVault is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counter for unique record IDs
    Counters.Counter private _recordIdCounter;

    // Reference to PatientIdentity contract
    IPatientIdentity public patientIdentityContract;

    // Medical record categories
    enum RecordCategory {
        GENERAL,
        LAB_RESULTS,
        IMAGING,
        PRESCRIPTIONS,
        ALLERGIES,
        SURGERIES,
        IMMUNIZATIONS,
        MENTAL_HEALTH,
        EMERGENCY
    }

    // Access permission levels
    enum AccessLevel {
        NONE,
        READ_BASIC,      // Basic info only
        READ_DETAILED,   // Detailed medical info
        READ_FULL,       // Complete access including sensitive data
        WRITE_APPEND     // Can add new records
    }

    // Medical record structure
    struct MedicalRecord {
        uint256 recordId;
        address patient;
        string ipfsHash;           // Encrypted medical data on IPFS
        string metadataHash;       // Encrypted metadata (title, date, etc.)
        RecordCategory category;
        uint256 createdAt;
        uint256 lastAccessed;
        bool isEmergencyAccessible;
        address createdBy;         // Doctor or patient who created the record
        bool isActive;
    }

    // Access permission structure
    struct AccessPermission {
        address grantedTo;         // Doctor address
        address patient;
        RecordCategory category;   // Category of records accessible
        AccessLevel level;
        uint256 grantedAt;
        uint256 expiresAt;
        bool isActive;
        string purpose;            // Reason for access (consultation, emergency, etc.)
    }

    // Access log for audit trail
    struct AccessLog {
        uint256 logId;
        address accessor;          // Who accessed the data
        address patient;
        uint256 recordId;
        uint256 accessedAt;
        string accessType;         // "READ", "WRITE", "SHARE"
        string ipAddress;          // Optional: for additional audit trail
    }

    // Mappings
    mapping(uint256 => MedicalRecord) public medicalRecords;
    mapping(address => uint256[]) public patientRecords; // Patient -> Record IDs
    mapping(address => mapping(address => mapping(RecordCategory => AccessPermission))) public accessPermissions;
    mapping(uint256 => AccessLog) public accessLogs;
    mapping(address => uint256[]) public patientAccessLogs; // Patient -> Log IDs

    // Emergency access addresses (hospitals, emergency services)
    mapping(address => bool) public emergencyAccessProviders;
    
    // Record counters
    Counters.Counter private _accessLogCounter;

    // Events
    event MedicalRecordCreated(
        uint256 indexed recordId,
        address indexed patient,
        address indexed creator,
        RecordCategory category,
        uint256 timestamp
    );

    event AccessPermissionGranted(
        address indexed patient,
        address indexed grantedTo,
        RecordCategory category,
        AccessLevel level,
        uint256 expiresAt
    );

    event AccessPermissionRevoked(
        address indexed patient,
        address indexed revokedFrom,
        RecordCategory category
    );

    event MedicalRecordAccessed(
        uint256 indexed recordId,
        address indexed accessor,
        address indexed patient,
        uint256 timestamp
    );

    event EmergencyAccess(
        address indexed patient,
        address indexed emergencyProvider,
        uint256 timestamp
    );

    event RecordUpdated(
        uint256 indexed recordId,
        address indexed patient,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyRegisteredPatient() {
        require(patientIdentityContract.isRegisteredPatient(msg.sender), "Patient not registered");
        (bool isActive,) = patientIdentityContract.getPatientStatus(msg.sender);
        require(isActive, "Patient account inactive");
        _;
    }

    modifier onlyRecordOwner(uint256 _recordId) {
        require(medicalRecords[_recordId].patient == msg.sender, "Not record owner");
        _;
    }

    modifier recordExists(uint256 _recordId) {
        require(medicalRecords[_recordId].recordId != 0, "Record does not exist");
        _;
    }

    modifier onlyEmergencyProvider() {
        require(emergencyAccessProviders[msg.sender], "Not authorized emergency provider");
        _;
    }

    constructor(address _patientIdentityContract) {
        require(_patientIdentityContract != address(0), "Invalid patient identity contract");
        patientIdentityContract = IPatientIdentity(_patientIdentityContract);
        _recordIdCounter.increment(); // Start from 1
        _accessLogCounter.increment(); // Start from 1
    }

    /**
     * @dev Create a new medical record
     * @param _ipfsHash IPFS hash of encrypted medical data
     * @param _metadataHash IPFS hash of encrypted metadata
     * @param _category Category of the medical record
     * @param _isEmergencyAccessible Whether emergency services can access this record
     */
    function createMedicalRecord(
        string memory _ipfsHash,
        string memory _metadataHash,
        RecordCategory _category,
        bool _isEmergencyAccessible
    ) external onlyRegisteredPatient nonReentrant {
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(_metadataHash).length > 0, "Metadata hash required");

        uint256 newRecordId = _recordIdCounter.current();
        _recordIdCounter.increment();

        MedicalRecord memory newRecord = MedicalRecord({
            recordId: newRecordId,
            patient: msg.sender,
            ipfsHash: _ipfsHash,
            metadataHash: _metadataHash,
            category: _category,
            createdAt: block.timestamp,
            lastAccessed: block.timestamp,
            isEmergencyAccessible: _isEmergencyAccessible,
            createdBy: msg.sender,
            isActive: true
        });

        medicalRecords[newRecordId] = newRecord;
        patientRecords[msg.sender].push(newRecordId);

        _logAccess(newRecordId, msg.sender, "CREATE", "");

        emit MedicalRecordCreated(newRecordId, msg.sender, msg.sender, _category, block.timestamp);
    }

    /**
     * @dev Grant access permission to a doctor for specific category of records
     * @param _doctor Address of the doctor
     * @param _category Category of records to grant access to
     * @param _level Access level to grant
     * @param _duration Duration of access in seconds
     * @param _purpose Reason for granting access
     */
    function grantAccess(
        address _doctor,
        RecordCategory _category,
        AccessLevel _level,
        uint256 _duration,
        string memory _purpose
    ) external onlyRegisteredPatient {
        require(_doctor != address(0), "Invalid doctor address");
        require(_level != AccessLevel.NONE, "Invalid access level");
        require(_duration > 0, "Invalid duration");
        require(bytes(_purpose).length > 0, "Purpose required");

        uint256 expiryTime = block.timestamp + _duration;

        AccessPermission memory permission = AccessPermission({
            grantedTo: _doctor,
            patient: msg.sender,
            category: _category,
            level: _level,
            grantedAt: block.timestamp,
            expiresAt: expiryTime,
            isActive: true,
            purpose: _purpose
        });

        accessPermissions[msg.sender][_doctor][_category] = permission;

        emit AccessPermissionGranted(msg.sender, _doctor, _category, _level, expiryTime);
    }

    /**
     * @dev Revoke access permission from a doctor
     * @param _doctor Address of the doctor
     * @param _category Category to revoke access from
     */
    function revokeAccess(
        address _doctor,
        RecordCategory _category
    ) external onlyRegisteredPatient {
        AccessPermission storage permission = accessPermissions[msg.sender][_doctor][_category];
        require(permission.isActive, "No active permission found");

        permission.isActive = false;

        emit AccessPermissionRevoked(msg.sender, _doctor, _category);
    }

    /**
     * @dev Access a medical record (for authorized users)
     * @param _recordId ID of the record to access
     * @param _ipAddress Optional IP address for audit trail
     */
    function accessMedicalRecord(
        uint256 _recordId,
        string memory _ipAddress
    ) external recordExists(_recordId) returns (string memory, string memory) {
        MedicalRecord storage record = medicalRecords[_recordId];
        require(record.isActive, "Record is inactive");

        // Check if accessor is the patient owner
        if (msg.sender == record.patient) {
            record.lastAccessed = block.timestamp;
            _logAccess(_recordId, msg.sender, "READ", _ipAddress);
            emit MedicalRecordAccessed(_recordId, msg.sender, record.patient, block.timestamp);
            return (record.ipfsHash, record.metadataHash);
        }

        // Check if accessor has permission
        AccessPermission memory permission = accessPermissions[record.patient][msg.sender][record.category];
        require(permission.isActive, "No access permission");
        require(block.timestamp <= permission.expiresAt, "Permission expired");
        require(permission.level >= AccessLevel.READ_BASIC, "Insufficient access level");

        record.lastAccessed = block.timestamp;
        _logAccess(_recordId, msg.sender, "READ", _ipAddress);
        emit MedicalRecordAccessed(_recordId, msg.sender, record.patient, block.timestamp);

        // Return data based on access level
        if (permission.level == AccessLevel.READ_BASIC) {
            return (record.metadataHash, ""); // Only metadata for basic access
        } else {
            return (record.ipfsHash, record.metadataHash); // Full access
        }
    }

    /**
     * @dev Emergency access to patient records
     * @param _patient Patient address
     * @param _category Category of records needed
     */
    function emergencyAccess(
        address _patient,
        RecordCategory _category
    ) external onlyEmergencyProvider returns (uint256[] memory) {
        require(patientIdentityContract.isRegisteredPatient(_patient), "Patient not registered");

        uint256[] memory patientRecordIds = patientRecords[_patient];
        uint256[] memory emergencyRecords = new uint256[](patientRecordIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < patientRecordIds.length; i++) {
            uint256 recordId = patientRecordIds[i];
            MedicalRecord memory record = medicalRecords[recordId];
            
            if (record.isEmergencyAccessible && 
                (record.category == _category || _category == RecordCategory.EMERGENCY)) {
                emergencyRecords[count] = recordId;
                count++;
                _logAccess(recordId, msg.sender, "EMERGENCY_READ", "");
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = emergencyRecords[i];
        }

        emit EmergencyAccess(_patient, msg.sender, block.timestamp);
        return result;
    }

    /**
     * @dev Update medical record IPFS hash (for corrections/additions)
     * @param _recordId ID of the record to update
     * @param _newIpfsHash New IPFS hash
     * @param _newMetadataHash New metadata hash
     */
    function updateMedicalRecord(
        uint256 _recordId,
        string memory _newIpfsHash,
        string memory _newMetadataHash
    ) external onlyRecordOwner(_recordId) recordExists(_recordId) {
        require(bytes(_newIpfsHash).length > 0, "IPFS hash required");

        MedicalRecord storage record = medicalRecords[_recordId];
        record.ipfsHash = _newIpfsHash;
        record.metadataHash = _newMetadataHash;
        record.lastAccessed = block.timestamp;

        _logAccess(_recordId, msg.sender, "UPDATE", "");
        emit RecordUpdated(_recordId, msg.sender, block.timestamp);
    }

    /**
     * @dev Set emergency access provider authorization
     * @param _provider Address of emergency provider
     * @param _authorized Authorization status
     */
    function setEmergencyProvider(
        address _provider,
        bool _authorized
    ) external onlyOwner {
        require(_provider != address(0), "Invalid provider address");
        emergencyAccessProviders[_provider] = _authorized;
    }

    /**
     * @dev Internal function to log access
     */
    function _logAccess(
        uint256 _recordId,
        address _accessor,
        string memory _accessType,
        string memory _ipAddress
    ) internal {
        uint256 newLogId = _accessLogCounter.current();
        _accessLogCounter.increment();

        MedicalRecord memory record = medicalRecords[_recordId];
        
        AccessLog memory log = AccessLog({
            logId: newLogId,
            accessor: _accessor,
            patient: record.patient,
            recordId: _recordId,
            accessedAt: block.timestamp,
            accessType: _accessType,
            ipAddress: _ipAddress
        });

        accessLogs[newLogId] = log;
        patientAccessLogs[record.patient].push(newLogId);
    }

    // View functions

    /**
     * @dev Get patient's medical records
     * @param _patient Patient address
     * @return Array of record IDs
     */
    function getPatientRecords(address _patient) external view returns (uint256[] memory) {
        return patientRecords[_patient];
    }

    /**
     * @dev Get access permission details
     * @param _patient Patient address
     * @param _doctor Doctor address
     * @param _category Record category
     * @return AccessPermission struct
     */
    function getAccessPermission(
        address _patient,
        address _doctor,
        RecordCategory _category
    ) external view returns (AccessPermission memory) {
        return accessPermissions[_patient][_doctor][_category];
    }

    /**
     * @dev Get patient's access logs
     * @param _patient Patient address
     * @return Array of access log IDs
     */
    function getPatientAccessLogs(address _patient) external view returns (uint256[] memory) {
        return patientAccessLogs[_patient];
    }

    /**
     * @dev Check if doctor has valid access to patient's records
     * @param _patient Patient address
     * @param _doctor Doctor address
     * @param _category Record category
     * @return hasAccess, accessLevel, expiresAt
     */
    function checkAccess(
        address _patient,
        address _doctor,
        RecordCategory _category
    ) external view returns (bool, AccessLevel, uint256) {
        AccessPermission memory permission = accessPermissions[_patient][_doctor][_category];
        
        bool hasAccess = permission.isActive && block.timestamp <= permission.expiresAt;
        return (hasAccess, permission.level, permission.expiresAt);
    }

    /**
     * @dev Get total number of medical records
     * @return Total record count
     */
    function getTotalRecords() external view returns (uint256) {
        return _recordIdCounter.current() - 1;
    }
}
