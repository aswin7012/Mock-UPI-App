"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Center } from "@repo/ui/center";
import { getBalance, getRecentTransactions } from "../../lib/actions/dashboard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const [balance, setBalance] = useState({ amount: 0, locked: 0 });
    const [transactions, setTransactions] = useState<{ 
        time: Date; 
        amount: number; 
        status: string; 
        provider: string; 
    }[]>([]);
    
    
    const [loading, setLoading] = useState(true);
    const router = useRouter();  // ✅ Add router for navigation

    useEffect(() => {
        async function fetchData() {
            const balanceData = await getBalance();
            const transactionData = await getRecentTransactions();
    
            // Transform the transaction data to match the expected structure
            const formattedTransactions = transactionData.map(t => ({
                time: t.startTime, // Renaming startTime to time
                amount: t.amount,
                status: t.status,
                provider: t.provider
            }));
    
            setBalance(balanceData);
            setTransactions(formattedTransactions); // Set transformed data
            setLoading(false);
        }
        fetchData();
    }, []);
    

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Paytm Dashboard</h2>

            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card title="Available Balance">
                    <p className="text-2xl font-semibold">₹{balance.amount / 100}</p>
                </Card>
                <Card title="Locked Balance">
                    <p className="text-2xl font-semibold text-red-500">₹{balance.locked / 100}</p>
                </Card>
                <Card title="Recent Transactions">
                    <OnRampTransactions transactions={transactions} />
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 justify-center mb-6">
                <Button onClick={() => router.push("/p2p")}>Send Money</Button>  {/* ✅ Redirect to P2P Transfer */}
                <Button onClick={() => router.push("/transfer")}>Add Money</Button>      {/* ✅ Redirect to Add Money */}
                <Button onClick={() => router.push("/request")}>Request Money</Button> {/* ✅ Redirect to Request Money */}
            </div>

            {/* Spending Insights */}
            <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Spending Insights</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={transactions.slice(0, 5)}>
                        <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#4CAF50" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
