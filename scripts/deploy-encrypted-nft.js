const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying EncryptedNFT contract...');

  // Get the contract factory
  const EncryptedNFT = await ethers.getContractFactory('EncryptedNFT');

  // Deploy the contract
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const encryptedNFT = await EncryptedNFT.deploy(
    'Dr Hedera Encrypted Documents', // name
    'MVD', // symbol
    deployer.address // admin
  );

  await encryptedNFT.waitForDeployment();

  const contractAddress = await encryptedNFT.getAddress();
  console.log('✅ EncryptedNFT deployed to:', contractAddress);

  // Grant minter role to deployer
  console.log('🔑 Setting up roles...');
  await encryptedNFT.grantMinter(deployer.address);
  await encryptedNFT.grantReencryptor(deployer.address);
  console.log('✅ Roles configured');

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deploymentTime: new Date().toISOString(),
    contractName: 'EncryptedNFT',
    constructorArgs: {
      name: 'Dr Hedera Encrypted Documents',
      symbol: 'MVD',
      admin: deployer.address
    }
  };

  console.log('\n📋 Deployment Summary:');
  console.log('Contract Address:', contractAddress);
  console.log('Network:', deploymentInfo.network);
  console.log('Chain ID:', deploymentInfo.chainId);
  console.log('Deployer:', deployer.address);

  // Save to file for frontend integration
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(__dirname, '..', 'src', 'config', 'contracts.json');
  const configDir = path.dirname(configPath);
  
  // Ensure directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Read existing config or create new one
  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  // Update config with new deployment
  config.encryptedNFT = {
    address: contractAddress,
    abi: require('../artifacts/contracts/EncryptedNFT.sol/EncryptedNFT.json').abi,
    network: deploymentInfo.network,
    chainId: deploymentInfo.chainId,
    deployedAt: deploymentInfo.deploymentTime
  };

  // Write updated config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Contract config saved to:', configPath);

  console.log('\n🎉 Deployment completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update your frontend Web3Context with the new contract address');
  console.log('2. Configure your backend API with the contract address');
  console.log('3. Set up IPFS storage (Pinata, Infura, etc.)');
  console.log('4. Deploy the Hedera AI re-encryption agent');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
