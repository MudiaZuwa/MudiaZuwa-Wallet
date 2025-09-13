import { ethers, parseUnits } from "ethers";
import FixedRatePaymasterABI from "../abis/FixedRatePaymaster.json";
import { getRpcProvider } from "./ether.js";

export const PAYMASTER_ADDRESS = import.meta.env.VITE_PAYMASTER_ADDRESS;

let paymasterContract;

export const initPaymasterContract = async (provider) => {
  const rpcProvider = provider || (await getRpcProvider());
  paymasterContract = new ethers.Contract(
    PAYMASTER_ADDRESS,
    FixedRatePaymasterABI.abi,
    rpcProvider
  );
};

export const sendTokenWithPaymaster = async (
  smartAccount,
  tokenContract,
  to,
  amount
) => {
  if (!smartAccount || !tokenContract) return;

  const tokenAmount = parseUnits(amount, 18);
  const accountAddress = await smartAccount.getAddress();

  // Build ERC20 transfer data
  const tokenTransferData = tokenContract.interface.encodeFunctionData(
    "transfer",
    [to, tokenAmount]
  );

  const userOp = {
    sender: accountAddress,
    callData: tokenTransferData,
    callGasLimit: 100000,
    verificationGasLimit: 100000,
    preVerificationGas: 21000,
    maxFeePerGas: parseUnits("50", "gwei"),
    maxPriorityFeePerGas: parseUnits("1", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: "0x",
  };

  // Send via Smart Account
  const txHash = await smartAccount.sendUserOperation(userOp);
  console.log("UserOperation sent:", txHash);
  return txHash;
};
