require("dotenv").config();
const { ethers } = require("ethers");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const providerService = require("./services/provider");
const walletService = require("./services/wallet");

const userLastRequest = new Map();

const bot = new TelegramBot(config.botToken, { polling: true });

const provider = providerService.getProvider();
const wallet = walletService.getWallet();

console.log("Faucet Bot Started...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to the Sprinkle Sepolia Faucet Bot!\n\n" +
      "Use the command:\n/faucet <your_sepolia_address>\n\nExample:\n/faucet 0x1234...abcd"
  );
});

bot.onText(/\/faucet (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const now = Date.now();
  const lastRequest = userLastRequest.get(chatId);

  if (lastRequest && now - lastRequest < 24 * 60 * 60 * 1000) {
    return bot.sendMessage(
      chatId,
      "⚠️ Please wait 24 hour before requesting again."
    );
  }
  const address = match[1].trim();

  const validAddress = await providerService.isValidAddress(address);

  if (!validAddress) {
    return bot.sendMessage(chatId, "⚠️ Invalid Ethereum address.");
  }

  userLastRequest.set(chatId, now);

  try {
    bot.sendMessage(
      chatId,
      `⏳ Sending ${config.faucetAmount} ETH to ${address}...`
    );

    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(config.faucetAmount),
    });

    bot.sendMessage(
      chatId,
      `✅ ${config.faucetAmount} SepoliaETH has been sent to your address. Transaction hash: ${tx.hash}`
    );
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "❌ Failed to send transaction. Please retry later."
    );
  }
});
