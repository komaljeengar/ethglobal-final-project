// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {EncryptedNFT} from "../src/EncryptedNFT.sol";

contract DeployEncryptedNFT is Script {
    string constant NAME = "MedVault Encrypted Documents";
    string constant SYMBOL = "MVD";
    
    function setUp() public {}

    function run() public {
        console.log("Deploying EncryptedNFT contract...");
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployerAddress);
        console.log("Account balance:", deployerAddress.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        EncryptedNFT encryptedNFT = new EncryptedNFT(
            NAME,
            SYMBOL,
            deployerAddress // admin
        );
        
        console.log(" EncryptedNFT deployed to:", address(encryptedNFT));
        
        // Grant roles to deployer
        console.log(" Setting up roles...");
        encryptedNFT.grantMinter(deployerAddress);
        encryptedNFT.grantReencryptor(deployerAddress);
        console.log(" Roles configured");
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n Deployment Summary:");
        console.log("Contract Address:", address(encryptedNFT));
        console.log("Network:", getNetworkName());
        console.log("Chain ID:", block.chainid);
        console.log("Deployer:", deployerAddress);
        
        console.log("\n Deployment completed successfully!");
        console.log("\nNext steps:");
        console.log("1. Update your frontend Web3Context with the new contract address");
        console.log("2. Configure your backend API with the contract address");
        console.log("3. Set up IPFS storage (Pinata, Infura, etc.)");
        console.log("4. Deploy the Hedera AI re-encryption agent");
        
        // Log the contract address for easy copying
        console.log("\n=== IMPORTANT ===");
        console.log("Contract Address:", address(encryptedNFT));
        console.log("Copy this address to update your frontend configuration");
    }
    
    function getNetworkName() internal view returns (string memory) {
        uint256 chainId = block.chainid;
        
        if (chainId == 1) return "mainnet";
        if (chainId == 11155111) return "sepolia";
        if (chainId == 5) return "goerli";
        if (chainId == 137) return "polygon";
        if (chainId == 80001) return "mumbai";
        if (chainId == 56) return "bsc";
        if (chainId == 97) return "bsc-testnet";
        if (chainId == 43114) return "avalanche";
        if (chainId == 43113) return "fuji";
        if (chainId == 250) return "fantom";
        if (chainId == 4002) return "fantom-testnet";
        if (chainId == 42161) return "arbitrum";
        if (chainId == 421613) return "arbitrum-goerli";
        if (chainId == 10) return "optimism";
        if (chainId == 420) return "optimism-goerli";
        if (chainId == 31337) return "localhost";
        
        return "unknown";
    }
}