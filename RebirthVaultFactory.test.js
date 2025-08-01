const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RebirthVaultFactory", function () {
  it("Deploys vault with CREATE2 and computes address", async function () {
    const [owner, dest] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("RebirthVaultFactory");
    const factory = await Factory.deploy();

    const salt = ethers.utils.formatBytes32String("test");
    await factory.deploy(dest.address, salt);
    const addr = await factory.computeAddress(dest.address, salt);

    expect(await ethers.provider.getCode(addr)).to.not.equal("0x");
  });
});