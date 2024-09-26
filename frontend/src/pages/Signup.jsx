import axios from 'axios'
import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"



export const Signup = () => {
    const[firstName,setFirstName] = useState("");
    const[lastName,setlastName] = useState("");
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");

    return (
        <div className="relative h-screen w-full bg-slate-950">
            {/* Background overlay */}
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>

            {/* Signup form */}
            <div className="flex justify-center h-full">
                <div className="flex flex-col justify-center relative z-10">
                    <div className="rounded-lg bg-slate-200 text-center p-2 h-max px-4">
                        <Heading label={"Sign up"} />
                        <SubHeading label={"Enter your information to create an account"} />
                        <InputBox onChange={(e)=>{
                            setFirstName(e.target.value);
                        }} placeholder="John" label={"First Name"} />
                        <InputBox onChange={(e)=>{
                            setlastName(e.target.value);
                        }} placeholder="Doe" label={"Last Name"} />
                        <InputBox onChange={(e)=>{
                            setUsername(e.target.value);
                        }} placeholder="example@gmail.com" label={"Email"} />
                        <InputBox onChange={(e)=>{
                            setPassword(e.target.value);
                        }} placeholder="123456" label={"Password"} />
                        <div className="pt-4">
                            <Button onClick={async ()=>{
                              const response = await axios.post("http://localhost:3002/api/v1/user/signup",{
                                username,
                                firstName,
                                lastName,
                                password,
                              });
                              localStorage.setItem("token",response.data.token)  
                            }} label={"Sign up"} />
                        </div>
                        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                    </div>
                </div>
            </div>
        </div>
    )
}
