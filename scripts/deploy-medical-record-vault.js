const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MedicalRecordVault = await ethers.getContractFactory("MedicalRecordVault");
  
  // Get the PatientIdentity contract address from environment or use a default
  const patientIdentityAddress = process.env.PATIENT_IDENTITY_CONTRACT || "0x08023259e316c86364F01E97aAB69339Cf9C02ac";
  
  console.log("Deploying MedicalRecordVault...");
  console.log("PatientIdentity contract address:", patientIdentityAddress);
  
  // Deploy the contract
  const vault = await MedicalRecordVault.deploy(patientIdentityAddress);
  
  // Wait for deployment to complete
  await vault.waitForDeployment();
  
  const vaultAddress = await vault.getAddress();
  
  console.log("MedicalRecordVault deployed to:", vaultAddress);
  console.log("Transaction hash:", vault.deploymentTransaction().hash);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const patientIdentityContract = await vault.patientIdentityContract();
  console.log("PatientIdentity contract verified:", patientIdentityContract);
  
  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: vaultAddress,
    patientIdentityContract: patientIdentityAddress,
    deployedAt: new Date().toISOString(),
    network: await ethers.provider.getNetwork()
  };
  
  fs.writeFileSync(
    './src/abi/MedicalRecordVault.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to src/abi/MedicalRecordVault.json");
  console.log("Update the MEDICAL_RECORD_VAULT_CONTRACT_ADDRESS in Web3Context.tsx with:", vaultAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
