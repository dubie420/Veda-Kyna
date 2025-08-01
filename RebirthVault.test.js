const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RebirthVault", function () {
  it("Forwards ETH to purposeVault", async function () {
    const [owner, vaultDest, user] = await ethers.getSigners();
    const RebirthVault = await ethers.getContractFactory("RebirthVault");
    const vault = await RebirthVault.deploy(vaultDest.address);

    await user.sendTransaction({ to: vault.address, value: ethers.utils.parseEther("1") });
    expect(await ethers.provider.getBalance(vault.address)).to.equal(0);
  });
});