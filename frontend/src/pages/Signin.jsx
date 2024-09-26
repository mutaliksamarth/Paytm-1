import axios from 'axios'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignin = async () => {
        try {
            const response = await axios.post("http://localhost:3002/api/v1/user/signin", {
                username,
                password,
            });
            localStorage.setItem("token", response.data.token)
            // Redirect to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Signin failed:", error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div className="relative h-screen w-full bg-slate-950">
            {/* Background overlay */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>

            {/* Signin form */}
            <div className="flex justify-center h-full">
                <div className="flex flex-col justify-center relative z-10">
                    <div className="rounded-lg bg-slate-200 text-center p-2 h-max px-4">
                        <Heading label={"Sign in"} />
                        <SubHeading label={"Enter your credentials to access your account"} />
                        <InputBox onChange={(e) => {
                            setUsername(e.target.value);
                        }} placeholder="example@gmail.com" label={"Email"} />
                        <InputBox onChange={(e) => {
                            setPassword(e.target.value);
                        }} placeholder="123456" label={"Password"} type="password" />
                        <div className="pt-4">
                            <Button onClick={handleSignin} label={"Sign in"} />
                        </div>
                        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                    </div>
                </div>
            </div>
        </div>
    )
}