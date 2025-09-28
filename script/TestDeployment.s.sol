// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {PatientIdentity} from "../src/PatientIdentity.sol";

contract TestDeployment is Script {
    function run() public {
        // Contract address from deployment
        address contractAddress = 0x1234567890123456789012345678901234567890; // Replace with actual address
        
        PatientIdentity patientIdentity = PatientIdentity(contractAddress);
        
        console.log("Testing deployed contract at:", contractAddress);
        console.log("Owner:", patientIdentity.owner());
        console.log("Total patients:", patientIdentity.getTotalPatients());
        
        // Test registration (this will actually register you!)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        address deployer = vm.addr(deployerPrivateKey);
        
        if (!patientIdentity.isRegisteredPatient(deployer)) {
            console.log("Registering test patient...");
            patientIdentity.registerPatient(
                "QmTestProfileHash123",
                keccak256("test_public_key"),
                "QmTestEmergencyHash456"
            );
            console.log("Registration successful!");
        } else {
            console.log("Patient already registered");
        }
        
        vm.stopBroadcast();
        
        console.log("Final total patients:", patientIdentity.getTotalPatients());
    }
}