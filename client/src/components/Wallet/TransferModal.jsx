import { useState } from "react";
import toast from "react-hot-toast";
import { useWeb3AuthContext } from "../../context/Web3AuthContext";

const TransferModal = ({ isOpen, onClose }) => {
  const { sendTokens, checkBalance } = useWeb3AuthContext();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) {
      return toast.error("Enter recipient and amount");
    }

    setLoading(true);
    try {
      const txtHash = await sendTokens(recipient, amount);
      await checkBalance();
      toast.success("Tokens sent successfully!");
      setRecipient("");
      setAmount("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-gray-900 text-gray-300 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-green-400">
          Send Tokens
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Tokens"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
