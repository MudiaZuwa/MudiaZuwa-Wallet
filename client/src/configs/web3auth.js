import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

let web3auth;

export const initWeb3Auth = async () => {
  const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT;

  const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
      uxMode: "popup",
      whiteLabel: {
        name: "My Polygon dApp",
      },
    },
  });

  web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: "sapphire_devnet",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13882", 
      rpcTarget: "https://rpc-amoy.polygon.technology",
    },
    adapters: [openloginAdapter],
  });

  await web3auth.init();

  return web3auth;
};

export const connectWeb3Auth = async () => {
  if (!web3auth) throw new Error("Web3Auth not initialized");
  const provider = await web3auth.connect();
  return provider;
};
