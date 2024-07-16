const HDWalletProvider = require("@truffle/hdwallet-provider")
const keys = require("./keys.json");
const { timeoutBlocks } = require("@truffle/contract/lib/contract/properties");

module.exports = {

  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(keys.MNEMONIC, `https://sepolia.infura.io/v3/${keys.INFURA_PROJECT_ID}`, 2),
      network_id: 11155111, // Sepolia's id
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 20000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      skipDryRun: true,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200
    },

  },

  compilers: {
    solc: {
      version: "0.8.4",      // Fetch exact version from solc-bin (default: truffle's version)

    }
  },

};
