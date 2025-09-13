import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 80002,
    },
  },
};

export default config;
