"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "../../lib/actions/getTransactions";
import { Table } from "@repo/ui/table";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<{ [key: string]: string | number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await getTransactions();

            if (result.success && result.transactions) {  // ✅ Added safety check
                setTransactions(
                    result.transactions.map((tx) => ({
                        Recipient: `${tx.toUser.name} (${tx.toUser.number})`,
                        Amount: `₹${(tx.amount / 100).toFixed(2)}`,
                        Date: new Date(tx.timestamp).toLocaleString(),
                    }))
                );
            } else {
                setError(result.message || "Failed to fetch transactions");
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Transactions</h2>
    
            {loading ? (
                <p className="text-gray-600 text-center">Loading transactions...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <Table columns={["Recipient", "Amount", "Date"]} data={transactions} />
                </div>
            )}
        </div>
    );
}