const providerService = require("../services/provider");

const { ethers } = require("ethers");

async function providerBasics() {
  console.log("===== Provider Basics =====\n");

  console.log("1. Verifying network connection...");
  const networkInfo = await providerService.verifyConnection();
  console.log(networkInfo);
  console.log("\n");

  console.log("2. Getting current block number...");
  const blockNumber = await providerService.getBlockNumber();
  console.log("Current Block:", blockNumber);
  console.log("\n");

  console.log("3. Getting current gas prices...");
  const feeData = await providerService.getFeeData();
  console.log("Gas Price:", feeData.formatted.gasPrice, "gwei");
  console.log("Max Fee Per Gas:", feeData.formatted.maxFeePerGas, "gwei");
  console.log(
    "Max Priority Fee Per Gas:",
    feeData.formatted.maxPriorityFeePerGas,
    "gwei"
  );
  console.log("\n");
}

providerBasics()
  .then(() => {
    console.log("\n Provider Basics example completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n Error:", error.message);
    process.exit(1);
  });
