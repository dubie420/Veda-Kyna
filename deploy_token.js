const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Load vault address
  const deploymentsPath = path.join(__dirname, "..", "deployments", "addresses.json");
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath));
  const vault = deployments.vault;

  // Deploy token
  const Token = await ethers.getContractFactory("PurposeBurnToken");
  const totalSupply = ethers.utils.parseEther("1000000");
  const token = await Token.deploy(
    vault,
    "Purpose Burn Token",
    "PURBURN",
    totalSupply
  );
  await token.deployed();
  console.log(`Token deployed at: ${token.address}`);

  // Save token address
  deployments.token = token.address;
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Updated addresses in ${deploymentsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});