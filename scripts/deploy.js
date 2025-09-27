const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PatientIdentity contract...");

  // Get the contract factory
  const PatientIdentity = await ethers.getContractFactory("PatientIdentity");

  // Deploy the contract
  const patientIdentity = await PatientIdentity.deploy();

  // Wait for deployment to complete
  await patientIdentity.waitForDeployment();

  const contractAddress = await patientIdentity.getAddress();
  
  console.log("PatientIdentity deployed to:", contractAddress);
  console.log("Contract owner:", await patientIdentity.owner());
  
  // Update the contract address in the frontend
  console.log("\n=== IMPORTANT ===");
  console.log("Update the CONTRACT_ADDRESS in src/contexts/Web3Context.tsx to:");
  console.log(`"${contractAddress}"`);
  console.log("================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
