// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
 EncryptedNFT.sol

 Pattern:
  - Mint stores: ipfsCID (pointer to metadata/encrypted file) + wrapped AES key (for owner)
  - On transfer: contract emits KeyReencryptionNeeded(tokenId, from, to, version)
  - Hedera AI Agent (address with REENCRYPTOR_ROLE) listens and calls updateWrappedKey(tokenId, newWrappedKey)
  - Only owner/approved can read the encrypted CID / wrappedKey via getters (convenience)
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EncryptedNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REENCRYPTOR_ROLE = keccak256("REENCRYPTOR_ROLE");

    // token data
    struct EncryptedData {
        string ipfsCID;     // pointer to metadata JSON (which includes cipher CID, iv, etc.)
        bytes wrappedKey;   // AES key encrypted/wrapped for current owner (small bytes)
        uint256 version;    // increments on rewrap to avoid replay confusion
    }

    mapping(uint256 => EncryptedData) private _encryptedData;

    // events
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string ipfsCID);
    event KeyReencryptionNeeded(uint256 indexed tokenId, address indexed from, address indexed to, uint256 nextVersion);
    event WrappedKeyUpdated(uint256 indexed tokenId, address indexed updater, uint256 newVersion);

    constructor(string memory name_, string memory symbol_, address admin) ERC721(name_, symbol_) {
        // setup roles: admin gets DEFAULT_ADMIN_ROLE, MINTER_ROLE and REENCRYPTOR_ROLE initially
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(REENCRYPTOR_ROLE, admin);
    }

    /**
     * @notice Mint a new encrypted NFT.
     * @param to recipient address (owner)
     * @param ipfsCID pointer to metadata JSON (encrypted file pointer + hash + iv etc.)
     * @param wrappedKey AES key wrapped/encrypted for recipient (bytes)
     *
     * Requirements: caller must have MINTER_ROLE.
     */
    function mintEncrypted(
        address to,
        string calldata ipfsCID,
        bytes calldata wrappedKey
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tid = _tokenIdCounter.current();

        _safeMint(to, tid);

        _encryptedData[tid] = EncryptedData({
            ipfsCID: ipfsCID,
            wrappedKey: wrappedKey,
            version: 1
        });

        emit NFTMinted(tid, to, ipfsCID);
        return tid;
    }

    /**
     * @notice Owner/approved can fetch the IPFS CID (metadata pointer).
     */
    function getIPFSCID(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "EncryptedNFT: nonexistent token");
        address owner = ownerOf(tokenId);
        require(_isAllowed(owner, msg.sender), "EncryptedNFT: caller not owner nor approved");
        return _encryptedData[tokenId].ipfsCID;
    }

    /**
     * @notice Owner/approved can fetch the wrapped AES key for the caller to unwrap locally.
     */
    function getWrappedKey(uint256 tokenId) external view returns (bytes memory) {
        require(_exists(tokenId), "EncryptedNFT: nonexistent token");
        address owner = ownerOf(tokenId);
        require(_isAllowed(owner, msg.sender), "EncryptedNFT: caller not owner nor approved");
        return _encryptedData[tokenId].wrappedKey;
    }

    /**
     * @notice Called by an authorized re-encryptor (Hedera AI Agent) to set the new wrapped key
     * after a transfer. This is the mechanism the agent uses to provide the new owner their key.
     *
     * Requirements: caller must have REENCRYPTOR_ROLE.
     */
    function updateWrappedKey(uint256 tokenId, bytes calldata newWrappedKey) external onlyRole(REENCRYPTOR_ROLE) {
        require(_exists(tokenId), "EncryptedNFT: nonexistent token");

        EncryptedData storage d = _encryptedData[tokenId];
        d.wrappedKey = newWrappedKey;
        d.version += 1;

        emit WrappedKeyUpdated(tokenId, msg.sender, d.version);
    }

    /**
     * @dev Internal helper to check ownership or approval.
     */
    function _isAllowed(address owner, address caller) internal view returns (bool) {
        return (caller == owner || getApproved(tokenId) == caller || isApprovedForAll(owner, caller));
    }

    /**
     * @dev Emit KeyReencryptionNeeded when transfer occurs. We clear the wrappedKey on-chain (optional)
     * so relayer must set a new wrappedKey. Clearing reduces leftover sensitive payloads in storage.
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 /*batchSize*/) internal override {
        super._beforeTokenTransfer(from, to, tokenId, 1);

        // When not minting and not burning (i.e., actual owner -> owner transfer)
        if (from != address(0) && to != address(0)) {
            // optional: clear previous wrappedKey to force rewrap
            delete _encryptedData[tokenId].wrappedKey;

            // bump expected version so agent rewraps with that version
            _encryptedData[tokenId].version += 1;
            uint256 nextVersion = _encryptedData[tokenId].version;

            emit KeyReencryptionNeeded(tokenId, from, to, nextVersion);
        }
    }

    /**
     * @notice Admin functions to manage roles
     */
    function grantMinter(address account) external onlyRole(getRoleAdmin(MINTER_ROLE)) {
        grantRole(MINTER_ROLE, account);
    }

    function grantReencryptor(address account) external onlyRole(getRoleAdmin(REENCRYPTOR_ROLE)) {
        grantRole(REENCRYPTOR_ROLE, account);
    }

    /**
     * @notice Admin can update ipfsCID in exceptional cases (e.g. migration)
     */
    function adminUpdateIPFSCID(uint256 tokenId, string calldata newCID) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_exists(tokenId), "EncryptedNFT: nonexistent token");
        _encryptedData[tokenId].ipfsCID = newCID;
    }

    /**
     * @notice View current version of wrapped key for debugging / agent coordination
     */
    function getKeyVersion(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "EncryptedNFT: nonexistent token");
        return _encryptedData[tokenId].version;
    }
}
