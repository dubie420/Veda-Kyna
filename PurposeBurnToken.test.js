const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PurposeBurnToken", function () {
  it("Redirects 2% of transfer to vault", async function () {
    const [owner, vault, alice, bob] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("PurposeBurnToken");
    const token = await Token.deploy(vault.address, "PurposeBurnToken", "PURBURN", ethers.utils.parseEther("1000"));

    await token.transfer(alice.address, ethers.utils.parseEther("100"));
    await token.connect(alice).transfer(bob.address, ethers.utils.parseEther("50"));

    expect(await token.balanceOf(vault.address)).to.be.closeTo(
      ethers.utils.parseEther("1"), // 2% of 50
      ethers.utils.parseEther("0.01")
    );
  });
});