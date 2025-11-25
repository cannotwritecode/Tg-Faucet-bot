require("dotenv").config();

const config = {
  botToken: process.env.BOT_TOKEN,
  rpcUrl: process.env.SEPOLIA_RPC_URL,
  privateKey: process.env.WALLET_PRIVATE_KEY,
  faucetAmount: process.env.FAUCET_AMOUNT || "0.01",
  minBalanceAlert: process.env.MIN_BALANCE_ALERT || "0.1",
  chainId: 11155111, // Sepolia chain ID
  networkName: "sepolia",
  gasLimit: 21000,
  maxPriorityFeePerGas: "2", //in gwei
  cooldownPeriod: 24 * 60 * 60 * 1000, // 24 hours in ms
};

function validateConfig() {
  const errors = [];

  if (!config.rpcUrl) {
    errors.push("RPC URL is not set in .env file");
  }
  if (!config.privateKey) {
    errors.push("Private key is not set in .env file");
  }
  if (config.privateKey && !config.privateKey.startsWith("0x")) {
    errors.push("WALLET_PRIVATE_KEY must start with 0x");
  }
  if (config.privateKey && config.privateKey.length !== 66) {
    errors.push("WALLET_PRIVATE_KEY must be 66 characters (including 0x)");
  }

  if (errors.length > 0) {
    console.error("Configuration errors:");
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error("Invalid configuration");
  }
}

validateConfig();

export default config;
