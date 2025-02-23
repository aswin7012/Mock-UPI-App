"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleTransfer = async () => {
        setLoading(true);
        setMessage("");

        if (!number || !amount) {
            setMessage("❌ Please fill all fields");
            setLoading(false);
            return;
        }

        if (Number(amount) <= 0) {
            setMessage("❌ Enter a valid amount");
            setLoading(false);
            return;
        }

        try {
            const result = await p2pTransfer(number, Number(amount) * 100);

            if (result.success) {
                setMessage("✅ Transfer successful!");
                setNumber(""); // Reset input fields
                setAmount("");
            } else {
                setMessage(`❌ ${result.message}`);
            }
        } catch (error) {
            setMessage("❌ Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="h-[90vh] flex justify-center">
            <Center>
                <Card title="Send">
                    <div className="min-w-72 pt-2">
                        <TextInput 
                            placeholder="Number" 
                            label="Number" 
                            value={number}
                            onChange={setNumber} 
                        />
                        <TextInput 
                            placeholder="Amount" 
                            label="Amount" 
                            value={amount}
                            onChange={setAmount} 
                        />
                        <div className="pt-4 flex flex-col items-center">
                            <Button 
                                onClick={handleTransfer} 
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send"}
                            </Button>
                            {message && <p className="mt-2 text-sm">{message}</p>}
                        </div>
                    </div>
                </Card>
            </Center>
        </div>
    );
}
