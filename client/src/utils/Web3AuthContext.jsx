import { createContext, useContext, useEffect, useState } from "react";
import { parseUnits, formatUnits } from "ethers";
import { initWeb3Auth } from "../configs/web3auth";
import {
  getRpcProvider,
  getTokenContract,
  getWeb3AuthSigner,
} from "../utils/ether";
import { PAYMASTER_ADDRESS, sendTokenWithPaymaster } from "../utils/paymaster";

export const Web3AuthContext = createContext();

export const Web3AuthContextProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = await initWeb3Auth();
        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    const web3Signer = await getWeb3AuthSigner(web3authProvider);
    setSigner(web3Signer);

    const address = await web3Signer.getAddress();
    setUserAddress(address);

    await checkBalance(web3Signer, address);
  };

  const checkBalance = async (customSigner, customAddress) => {
    const activeSigner = customSigner || signer;
    const activeAddress = customAddress || userAddress;

    if (!activeSigner || !activeAddress) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const provider = await getRpcProvider();
      const token = getTokenContract(provider);

      const rawBalance = await token.balanceOf(activeAddress);
      setBalance(formatUnits(rawBalance, 18));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const sendTokens = async (to, amount) => {
    if (!signer) {
      console.error("Wallet not connected");
      return;
    }

    if (!to || !amount) {
      console.error("Recipient address or amount missing");
      return;
    }

    try {
      const tokenContract = getTokenContract(provider);

      const amountToApprove = parseUnits(amount, 18);
      // await tokenContract
      //   .connect(signer)
      //   .approve(PAYMASTER_ADDRESS, amountToApprove);

      // Send transaction via Paymaster
      const txHash = await sendTokenWithPaymaster(
        signer,
        tokenContract,
        to,
        amount
      );
      // console.log("Transaction Hash:", txHash);
      return txHash;
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const value = {
    web3auth,
    provider,
    connectWallet,
    checkBalance,
    balance,
    sendTokens,
    userAddress,
    signer,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3AuthContext = () => useContext(Web3AuthContext);
