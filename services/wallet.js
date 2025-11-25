const { ethers } = require("ethers");
const config = require("../config/config");
const providerService = require("./provider");

class WalletService {
  constructor() {
    this.wallet = null;
    this.initialize();
  }

  initialize() {
    try {
      const provider = providerService.getProvider();
      if (!provider) {
        console.warn("Wallet skipped: No Provider");
        return;
      }
      if (!config.privateKey) {
        console.warn("Wallet skipped: No Private Key");
        return;
      }
      this.wallet = new ethers.Wallet(config.privateKey, provider);

      console.log("Wallet Initialized");
      console.log("Wallet Address:", this.wallet.address);
    } catch (error) {
      console.error("Failed to initialize wallet:", error);
      // throw error; // Don't crash
    }
  }

  getAddress() {
    return this.wallet.address;
  }
  async getBalance() {
    const balanceWei = await this.wallet.provider.getBalance(
      this.wallet.address
    );

    return {
      wei: balanceWei.toString(),
      eth: ethers.formatEther(balanceWei),
      bigint: balanceWei,
    };
  }

  async hasEnoughBalance(address, requiredAmountInEth) {
    const balanceWei = await this.getBalance(address);
    const requiredWei = ethers.parseEther(requiredAmountInEth);
    return balanceWei.bigint >= requiredWei;
  }

  async getNonce() {
    return await this.wallet.getNonce();
  }
  async signMessage(message) {
    return await this.wallet.signMessage(message);
  }

  verifyMessage(message, signature) {
    return ethers.verifyMessage(message, signature);
  }

  getWallet() {
    return this.wallet;
  }
}

module.exports = new WalletService();
