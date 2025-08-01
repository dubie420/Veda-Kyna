require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    // add more networks as needed
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    scripts: "./scripts",
    artifacts: "./artifacts"
  }
};