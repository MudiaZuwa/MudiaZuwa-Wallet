import { createSmartAccountClient } from "@biconomy/account";
import { Interface, parseUnits } from "ethers";
import { PAYMASTER_ADDRESS } from "../utils/paymaster";

const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;
const erc20Abi = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

export const initSmartAccount = async (signer) => {
  return await createSmartAccountClient({
    signer,
    chainId: 80002,
    bundlerUrl: import.meta.env.VITE_BICONOMY_BUNDLER_URL,
    paymasterUrl: import.meta.env.VITE_BICONOMY_PAYMASTER_URL,
  });
};

export const sendGaslessToken = async (smartAccount, recipient, amount) => {
  if (!smartAccount) throw new Error("Smart Account not initialized");
  if (!recipient || !amount) throw new Error("Recipient or amount missing");

  const erc20Interface = new Interface(erc20Abi);
  const data = erc20Interface.encodeFunctionData("transfer", [
    recipient,
    parseUnits(amount.toString(), 18),
  ]);

  const userOpResponse = await smartAccount.sendTransaction(
    {
      to: tokenAddress,
      data,
      value: "0",
    },
    {
      paymasterServiceData: {
        mode: "SPONSORED",
        token: tokenAddress,
        paymaster: PAYMASTER_ADDRESS, 
      },
    }
  );

  const { receipt, success } = await userOpResponse.wait();

  // console.log("Gasless Tx Hash:", receipt.transactionHash, "Success:", success);
  return receipt.transactionHash;
};
