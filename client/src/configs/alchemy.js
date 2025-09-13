import { createSmartAccountClient } from "@alchemy/aa-core";

export const initSmartAccount = async (signer) => {
  const smartAccount = await createSmartAccountClient({
    signer,
    chain: {
      id: 80002, // Mumbai
      rpcUrl: import.meta.env.VITE_ALCHEMY_RPC_URL,
    },
    entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    bundlerUrl: import.meta.env.VITE_ALCHEMY_BUNDLER_URL, 
  });

  return smartAccount;
};
