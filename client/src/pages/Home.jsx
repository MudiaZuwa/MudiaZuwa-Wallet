import { useWeb3AuthContext } from "../context/Web3AuthContext";
import WalletCard from "../components/Wallet/WalletCard";
import ConnectButton from "../components/Wallet/ConnectButton";
import TransactionsList from "../components/Wallet/TransactionsList";

const Home = () => {
  const { userAddress } = useWeb3AuthContext();

  return (
    <div className="w-full max-w-lg">
      {!userAddress ? (
        <ConnectButton />
      ) : (
        <>
          <WalletCard />
          <TransactionsList />
        </>
      )}
    </div>
  );
};

export default Home;
