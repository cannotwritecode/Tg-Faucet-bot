const { ethers } = require("ethers");
const config = require("../config/config.js");
const providerService = require("../services/provider.js");
const walletService = require("../services/wallet.js");

const userLastRequest = new Map();

const provider = providerService.getProvider();
const wallet = walletService.getWallet();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot is running");
  }

  const update = req.body;

  try {
    if (!update.message) {
      return res.status(200).send("ok");
    }

    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text || "";

    // /start
    if (text.startsWith("/start")) {
      await sendMessage(
        chatId,
        "👋 Welcome to the Sprinkle Sepolia Faucet Bot!\n\nUse:\n/faucet <your_sepolia_address>\nExample:\n/faucet 0x1234...abcd"
      );
      return res.status(200).send("ok");
    }

    // /faucet <address>
    if (text.startsWith("/faucet")) {
      const parts = text.split(" ");
      if (parts.length < 2) {
        await sendMessage(chatId, "⚠️ Please provide an ETH address.");
        return res.status(200).send("ok");
      }

      const address = parts[1].trim();

      const now = Date.now();
      const lastRequest = userLastRequest.get(chatId);

      if (lastRequest && now - lastRequest < 24 * 60 * 60 * 1000) {
        await sendMessage(
          chatId,
          "⚠️ You need to wait 24 hours before your next faucet request."
        );
        return res.status(200).send("ok");
      }

      const validAddress = await providerService.isValidAddress(address);
      if (!validAddress) {
        await sendMessage(chatId, "⚠️ Invalid Ethereum address.");
        return res.status(200).send("ok");
      }

      userLastRequest.set(chatId, now);

      await sendMessage(
        chatId,
        `⏳ Sending ${config.faucetAmount} ETH to ${address}...`
      );

      try {
        const tx = await wallet.sendTransaction({
          to: address,
          value: ethers.parseEther(config.faucetAmount),
        });

        await sendMessage(
          chatId,
          `✅ Sent ${config.faucetAmount} SepoliaETH.\nHash: ${tx.hash}`
        );
      } catch (err) {
        console.log(err);
        await sendMessage(chatId, "❌ Failed to send transaction.");
      }

      return res.status(200).send("ok");
    }

    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    res.status(200).send("ok");
  }
}

/* ---------- Helper function on Vercel ---------- */

async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  });
}
