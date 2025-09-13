import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";

export const getWeb3AuthSigner = async (provider) => {
  const ethersProvider = new BrowserProvider(provider);
  return ethersProvider.getSigner();
};

export const getSigner = async (rpcUrl) => {
  const URL = rpcUrl || import.meta.env.VITE_RPC_URL;
  const provider = new JsonRpcProvider(URL);
  const signer = provider.getSigner();
  return signer;
};

export const getRpcProvider = () => {
  const rpcUrl = import.meta.env.VITE_RPC_URL;
  const provider = new JsonRpcProvider(rpcUrl);
  return provider;
};

const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;
const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)", 
];


export const getTokenContract = (signerOrProvider) => {
  return new Contract(tokenAddress, tokenABI, signerOrProvider);
};
