// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/MedicalRecordVault.sol";

contract DeployMedicalRecordVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address patientIdentityContract = vm.envAddress("PATIENT_IDENTITY_CONTRACT");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MedicalRecordVault vault = new MedicalRecordVault(patientIdentityContract);
        
        console.log("MedicalRecordVault deployed at:", address(vault));
        console.log("PatientIdentity contract:", patientIdentityContract);
        
        vm.stopBroadcast();
    }
}
