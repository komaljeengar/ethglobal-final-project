// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {PatientIdentity} from "contracts/PatientIdentity.sol";

contract DeployPatientIdentity is Script {
    PatientIdentity public patientIdentity;

    function setUp() public {}

    function run() public {
        // Get the deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying PatientIdentity contract...");
        console.log("Deployer address:", vm.addr(deployerPrivateKey));

        // Deploy the contract
        patientIdentity = new PatientIdentity();

        console.log("PatientIdentity deployed to:", address(patientIdentity));
        console.log("Contract owner:", patientIdentity.owner());

        // Verify deployment by checking initial state
        uint256 totalPatients = patientIdentity.getTotalPatients();
        console.log("Total patients (should be 0):", totalPatients);

        vm.stopBroadcast();

        // Log important information
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Hedera Testnet");
        console.log("Chain ID: 296");
        console.log("Contract Address:", address(patientIdentity));
        console.log("Explorer URL: https://hashscan.io/testnet/contract/%s", address(patientIdentity));
        console.log("\n=== IMPORTANT ===");
        console.log("Update the CONTRACT_ADDRESS in src/contexts/Web3Context.tsx to:");
        console.log('"%s"', address(patientIdentity));
        console.log("================\n");
    }
}