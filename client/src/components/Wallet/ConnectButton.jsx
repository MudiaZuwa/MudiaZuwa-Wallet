import { useState } from "react";
import toast from "react-hot-toast";
import { useWeb3AuthContext } from "../../context/Web3AuthContext";

const ConnectButton = () => {
  const { connectWallet } = useWeb3AuthContext();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
      toast.success("Wallet connected!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default ConnectButton;
