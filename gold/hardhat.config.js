/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "testnet",
  networks: {
    hardhat: {},
    testnet: {
      url: "https://rpc.test.btcs.network/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1115,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
