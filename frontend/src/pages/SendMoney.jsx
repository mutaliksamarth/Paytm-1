import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPostTransferOptions, setShowPostTransferOptions] = useState(false);

    const handleTransfer = () => {
        if (amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setError(""); // Clear previous error message

        axios.post("http://localhost:3002/api/v1/account/transfer", {
            to: id,
            amount
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setSuccess(`Transfer of Rs ${amount} to ${name} was successful!`);
            setAmount(0); // Reset amount input
            setShowPostTransferOptions(true);
        })
        .catch(error => {
            setError("Error occurred during transfer. Please try again.");
            console.error(error);
        });
    };

    const handleResend = () => {
        setSuccess("");
        setShowPostTransferOptions(false);
    };

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="flex justify-center h-screen bg-slate-950">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
                        {success && <div className="text-green-500 text-sm text-center mt-2">{success}</div>}
                        {!showPostTransferOptions ? (
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none"
                                        htmlFor="amount"
                                    >
                                        Amount (in Rs)
                                    </label>
                                    <input
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                                        id="amount"
                                        placeholder="Enter amount"
                                        value={amount}
                                    />
                                </div>
                                <button 
                                    onClick={handleTransfer} 
                                    className="justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-green-600 text-white hover:bg-green-500 transition-colors"
                                >
                                    Initiate Transfer
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-4">
                                <button 
                                    onClick={handleResend} 
                                    className="justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                                >
                                    Send Money Again
                                </button>
                                <button 
                                    onClick={handleGoBack} 
                                    className="justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};