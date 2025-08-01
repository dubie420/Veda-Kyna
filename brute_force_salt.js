// Node.js script to find a salt that makes CREATE2 deployment address start with 0x0000...

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load factory and bytecode details
const deploymentsPath = path.join(__dirname, "..", "deployments", "addresses.json");
const deployments = JSON.parse(fs.readFileSync(deploymentsPath));
const factoryAddress = deployments.factory;
const purposeVault = deployments.purposeVault;

// Copied from RebirthVaultFactory
function computeCreate2Address(factory, saltHex, bytecode) {
  return (
    "0x" +
    ethers.utils
      .keccak256(
        ethers.utils.solidityPack(
          ["bytes1", "address", "bytes32", "bytes32"],
          ["0xff", factory, saltHex, ethers.utils.keccak256(bytecode)]
        )
      )
      .slice(-40)
  ).toLowerCase();
}

async function main() {
  const hre = require("hardhat");
  const Vault = await hre.ethers.getContractFactory("RebirthVault");
  const bytecode = Vault.bytecode + hre.ethers.utils.defaultAbiCoder
    .encode(["address"], [purposeVault])
    .slice(2);

  let prefix = "0x0000";
  let i = 0;
  let found = false;

  while (!found && i < 1e8) {
    const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(i), 32);
    const addr = computeCreate2Address(factoryAddress, salt, bytecode);

    if (addr.startsWith(prefix)) {
      console.log(`Found salt: ${salt}`);
      console.log(`Address: ${addr}`);
      found = true;
      // Optionally save
      fs.writeFileSync(path.join(__dirname, "vanity_salt.json"), JSON.stringify({ salt, addr }, null, 2));
      break;
    }
    if (i % 100000 === 0) process.stdout.write(".");
    i++;
  }
  if (!found) console.log("\nNo vanity address found in range");
}

main().catch(console.error);