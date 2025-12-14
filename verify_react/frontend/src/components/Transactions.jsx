import React, { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gapstudio/transactions");
        setTransactions(res.data.transactions || []);
      } catch (error) {
        console.error("Erreur lors du chargement des transactions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-400">Chargement des transactions...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">💰 Historique des Transactions Pi</h1>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">Aucune transaction enregistrée pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-xl bg-gray-800">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left">ID Transaction</th>
                <th className="p-3 text-left">Utilisateur</th>
                <th className="p-3 text-left">Montant (Pi)</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-gray-700 hover:bg-gray-700/30 transition">
                  <td className="p-3">{tx._id}</td>
                  <td className="p-3">{tx.username || "Anonyme"}</td>
                  <td className="p-3">{tx.amount || "0.00"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        tx.status === "success"
                          ? "bg-green-600/30 text-green-300"
                          : tx.status === "pending"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-red-600/30 text-red-300"
                      }`}
                    >
                      {tx.status || "Inconnu"}
                    </span>
                  </td>
                  <td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;