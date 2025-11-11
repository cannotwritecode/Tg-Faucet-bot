const walletService = require("../services/wallet");
const { ethers } = require("ethers");

async function walletOperations() {
  console.log("===== Wallet Operations =====\n");

  console.log("1. Wallet Information");
  const address = walletService.getAddress();
  console.log("Address:", address);
  console.log("Checksum Address:", ethers.getAddress(address));
  console.log("\n");

  console.log("2. Wallet Balance");
  const balance = await walletService.getBalance();
  console.log("Balance:", balance.eth, "ETH");
  console.log("Balance (wei):", balance.wei);
}

walletOperations().then(() => {
  console.log("\n Wallet Operations example completed!");
  process.exit(0);
});
