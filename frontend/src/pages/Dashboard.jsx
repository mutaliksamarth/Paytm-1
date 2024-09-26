import { useState, useEffect } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    const [userName, setUserName] = useState("");
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3002/api/v1/user/me", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setUserName(response.data.firstName);  // Fetch and set user's first name
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3002/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setBalance(parseFloat(response.data.balance).toFixed(2));  // Format balance to 2 decimal points
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchUserData();
        fetchBalance();
    }, []);

    return (
        <div className="relative h-screen w-full bg-slate-950 overflow-hidden">
            {/* Background overlay */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>

            {/* Dashboard box */}
            <div className="flex justify-center h-full">
                <div className="flex flex-col justify-center relative z-10">
                    <div className="rounded-lg bg-white w-[1000px] text-center p-6 h-[calc(100vh-4rem)] max-h-[900px] px-8 shadow-lg flex flex-col">
                        {/* Pass userName to Appbar for greeting */}
                        <Appbar userName={userName} />
                        <div className="mt-6 flex-shrink-0">
                            <Balance value={balance} />
                        </div>
                        <div className="mt-6 flex-grow overflow-hidden">
                            <div className="h-full overflow-y-auto pr-2">
                                <Users />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
