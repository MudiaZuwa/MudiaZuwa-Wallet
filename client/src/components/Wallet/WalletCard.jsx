import { useState } from "react";
import { useWeb3AuthContext } from "../../context/Web3AuthContext";
import TransferModal from "./TransferModal";
import WalletInfoModal from "./WalletInfoModal";

const WalletCard = () => {
  const { userAddress, balance } = useWeb3AuthContext();
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative mb-6 p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-700">
      {/* Truncated Address at top-left */}
      <p className="absolute top-4 left-4 text-gray-400 text-sm font-mono">
        {truncateAddress(userAddress)}
      </p>

      {/* Balance */}
      <div className="flex items-center justify-center mb-6 mt-8">
        <span className="text-4xl font-bold text-green-400">
          {balance || "0"}
        </span>
        <span className="ml-2 text-2xl font-semibold text-gray-300">MZ</span>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setTransferModalOpen(true)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
        <button
          onClick={() => setReceiveModalOpen(true)}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Receive
        </button>
      </div>
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />
      <WalletInfoModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
      />
    </div>
  );
};

export default WalletCard;
