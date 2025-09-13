import { useEffect, useState } from "react";
import { useWeb3AuthContext } from "../../context/Web3AuthContext";
import { formatUnits } from "ethers";

const TransactionsList = () => {
  const { transactions } = useWeb3AuthContext();
  const [loading, setLoading] = useState(false);

  const formatValue = (value) => {
    try {
      return parseFloat(formatUnits(value, 18)).toFixed(4);
    } catch {
      return value;
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-400">
        Loading transactions...
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">Transactions</h2>
      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-700"
          >
            <div className="mb-2 sm:mb-0">
              <p className="text-gray-400 font-mono text-xs sm:text-sm break-all">
                {truncateAddress(tx.from)} → {truncateAddress(tx.to)}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </p>
            </div>

            <div
              className={`font-semibold text-sm sm:text-base text-right sm:text-left self-end sm:self-auto ${
                tx.type === "credit" ? "text-green-400" : "text-red-400"
              }`}
            >
              {tx.type === "credit" ? "+" : "-"}
              {formatValue(tx.value)} MZ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsList;
