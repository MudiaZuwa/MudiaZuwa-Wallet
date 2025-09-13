import { useState } from "react";
import { useWeb3AuthContext } from "../../context/Web3AuthContext";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

const WalletInfoModal = ({ isOpen, onClose }) => {
  const { userAddress } = useWeb3AuthContext();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !userAddress) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 text-gray-300 rounded-lg shadow-lg w-full max-w-sm p-6 border border-gray-700 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-green-400 mb-4">
          Wallet Address
        </h2>

        {/* QR Code */}
        <div className="mb-4">
          <QRCodeCanvas
            value={userAddress}
            size={150}
            bgColor="#1F2937"
            fgColor="#10B981"
          />
        </div>

        {/* Address with Copy */}
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded w-full justify-between">
          <span className="font-mono text-sm">
            {truncateAddress(userAddress)}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-200 transition"
            title="Copy address"
          >
            📋
          </button>
        </div>

        {copied && (
          <p className="text-green-400 text-sm mt-2">Copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};

export default WalletInfoModal;
