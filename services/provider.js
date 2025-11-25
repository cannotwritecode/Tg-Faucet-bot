const { ethers } = require("ethers");
const config = require("../config/config");

class ProviderService {
  constructor() {
    this.provider = null;
    this.initialize();
  }

  initialize() {
    try {
      if (!config.rpcUrl) {
        console.warn("Provider skipped: No RPC URL");
        return;
      }
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      console.log("Provider Initialized");
    } catch (error) {
      console.error("Failed to initialize provider:", error);
      // throw error; // Don't crash
    }
  }

  async verifyConnection() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      return {
        connected: true,
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber: blockNumber.toString(),
      };
    } catch (error) {
      console.error("Connection verification failed:", error.message);
      return {
        connected: false,
        error: error.message,
      };
    }
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }
  async isValidAddress(address) {
    return ethers.isAddress(address);
  }

  async getFeeData() {
    const feeData = await this.provider.getFeeData();

    return {
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,

      formatted: {
        gasPrice: feeData.gasPrice
          ? ethers.formatUnits(feeData.gasPrice, "gwei")
          : null,
        maxFeePerGas: feeData.maxFeePerGas
          ? ethers.formatUnits(feeData.maxFeePerGas, "gwei")
          : null,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
          ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei")
          : null,
      },
    };
  }

  async estimateGas(toAddress, fromWallet, amountInEth) {
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amountInEth.toString()),
    };

    // provider estimates gas usuage for this transaction
    const gasEstimate = await provider.estimateGas(tx);

    return gasEstimate;
  }

  async getTransactionCount(address) {
    return await this.provider.getTransactionCount(address);
  }

  async waitForTransaction(txHash, confirmations = 1) {
    return await this.provider.waitForTransaction(txHash, confirmations);
  }

  getProvider() {
    return this.provider;
  }
}

module.exports = new ProviderService();
