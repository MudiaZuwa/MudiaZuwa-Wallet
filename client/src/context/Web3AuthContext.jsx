import { createContext, useContext, useEffect, useState } from "react";
import { initWeb3Auth } from "../configs/web3auth";
import { formatUnits } from "ethers";
import {
  getRpcProvider,
  getSigner,
  getTokenContract,
  getWeb3AuthSigner,
} from "../utils/ether";
import { initSmartAccount, sendGaslessToken } from "../configs/biconomy";

export const Web3AuthContext = createContext();

export const Web3AuthContextProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [smartAccount, setSmartAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = await initWeb3Auth();
        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          await connectWallet();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!userAddress) return;

    const provider = getRpcProvider();
    
    let lastUpdate = 0;
    const handleNewBlock = async (blockNumber) => {
      const now = Date.now();
      if (now - lastUpdate > 15000) {
        lastUpdate = now;
        await checkBalance();
        await getERC20Transactions();
      }
    };

    provider.on("block", handleNewBlock);

    return () => {
      provider.removeListener("block", handleNewBlock);
    };
  }, [userAddress]);

  const connectWallet = async () => {
    if (!web3auth || provider || userAddress) return;

    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      const signer = await getWeb3AuthSigner(web3authProvider);
      const smartAccountInstance = await initSmartAccount(signer);
      const address = await smartAccountInstance.getAddress();

      setUserAddress(address);
      setSmartAccount(smartAccountInstance);
      await checkBalance(smartAccountInstance, address);
      await getERC20Transactions(address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      throw err;
    }
  };

  const checkBalance = async (customAccount, customAddress) => {
    const activeAccount = customAccount || smartAccount;
    const activeAddress = customAddress || userAddress;

    if (!activeAccount || !activeAddress) {
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
    if (!smartAccount) {
      const error = new Error("Smart Account not initialized");
      console.error(error.message);
      throw error;
    }

    if (!to || !amount) {
      const error = new Error("Recipient address or amount missing");
      console.error(error.message);
      throw error;
    }

    try {
      const txHash = await sendGaslessToken(smartAccount, to, amount);
      await getERC20Transactions();
      return txHash;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  };

  const getERC20Transactions = async (walletAddress) => {
    const activeAddress = walletAddress || userAddress;
    if (!activeAddress) {
      console.error("Wallet address is required");
      setTransactions([]);
      return;
    }

    try {
      const provider = await getRpcProvider();
      const token = getTokenContract(provider);

      const latestBlock = await provider.getBlockNumber();
      const fromBlock = latestBlock - 5000;

      // Incoming
      const incomingEvents = await token.queryFilter(
        token.filters.Transfer(null, activeAddress),
        fromBlock,
        latestBlock
      );

      // Outgoing
      const outgoingEvents = await token.queryFilter(
        token.filters.Transfer(activeAddress, null),
        fromBlock,
        latestBlock
      );

      const formatEvents = async (events, type) => {
        return Promise.all(
          events.map(async (tx) => {
            const block = await provider.getBlock(tx.blockNumber);
            return {
              from: tx.args.from,
              to: tx.args.to,
              value: formatUnits(tx.args.value, 18),
              type,
              hash: tx.transactionHash,
              blockNumber: tx.blockNumber,
              timestamp: block.timestamp,
            };
          })
        );
      };

      const incoming = await formatEvents(incomingEvents, "credit");
      const outgoing = await formatEvents(outgoingEvents, "debit");

      const allTxs = [...incoming, ...outgoing].sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setTransactions(allTxs);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
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
    transactions,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3AuthContext = () => {
  return useContext(Web3AuthContext);
};
