const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. Deploy Factory
  const Factory = await ethers.getContractFactory("RebirthVaultFactory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log(`Factory deployed at: ${factory.address}`);

  // 2. Deploy Vault with CREATE2
  // User should set these
  const purposeVault = "0x000000000000000000000000000000000000dEaD";
  const salt = ethers.utils.formatBytes32String("vanity_salt");

  const tx = await factory.deploy(purposeVault, salt);
  await tx.wait();

  const vaultAddress = await factory.computeAddress(purposeVault, salt);
  console.log(`Vault deployed at: ${vaultAddress}`);

  // Save addresses
  const deployment = {
    factory: factory.address,
    vault: vaultAddress,
    purposeVault,
    salt
  };
  const deploymentsPath = path.join(__dirname, "..", "deployments", "addresses.json");
  fs.mkdirSync(path.dirname(deploymentsPath), { recursive: true });
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployment, null, 2));
  console.log(`Saved addresses to ${deploymentsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});