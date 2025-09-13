import express from "express";
import { ethers, Interface, parseUnits } from "ethers";
import dotenv from "dotenv";
import { createSmartAccountClient } from "@biconomy/account";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAddress = process.env.TOKEN_ADDRESS;
const erc20Abi = [
  "function transfer(address to, uint256 amount) returns (bool)",
];
const erc20Interface = new Interface(erc20Abi);

const initSmartAccount = async () => {
  return await createSmartAccountClient({
    signer,
    chainId: 80002, // Polygon Amoy
    bundlerUrl: process.env.BICONOMY_BUNDLER_URL,
    paymasterUrl: process.env.BICONOMY_PAYMASTER_URL,
  });
};

app.post(`/telegram/${process.env.BOT_TOKEN}`, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.text) return res.sendStatus(200);

  const address = message.text.trim();

  if (!ethers.isAddress(address)) {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: "Invalid address. Please send a valid wallet address.",
      }
    );
    return res.sendStatus(200);
  }

  try {
    const smartAccount = await initSmartAccount();

    const data = erc20Interface.encodeFunctionData("transfer", [
      address,
      parseUnits("10", 18),
    ]);

    const userOpResponse = await smartAccount.sendTransaction(
      { to: tokenAddress, data, value: "0" },
      {
        paymasterServiceData: {
          mode: "SPONSORED",
          token: tokenAddress,
        },
      }
    );

    const { receipt, success } = await userOpResponse.wait();
    console.log("Receipt:", receipt);

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: success
          ? `✅ Sent 10 tokens to ${address}\nTx: https://amoy.polygonscan.com/tx/${receipt.transactionHash}`
          : "❌ Transaction failed",
      }
    );
  } catch (err) {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: `❌ Error: ${err.message}`,
      }
    );
  }

  res.sendStatus(200);
});

app.listen(3000, () =>
  console.log("🚀 Faucet running with Biconomy paymaster")
);

export default app;
