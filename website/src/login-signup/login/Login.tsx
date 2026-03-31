import { Link } from "react-router-dom";
import React, { useState } from "react";
import loginbg from "../../assest/login/loginbg.svg";
import briksy from "../../assest/logo/briksy.svg";
import headphone from "../../assest/login/headphone.svg";
import google from "../../assest/login/google.svg";
import apple from "../../assest/login/apple.svg";


const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const handlechange = (e) => {
        setForm({
            ...form,
            [e.target.value]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div
            className="h-screen  w-screen flex flex-col items-center"
            style={{
                backgroundImage: `url(${loginbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full p-6">
                <div className="flex justify-between items-center w-full">
                    <img src={briksy} alt="" />
                    <Link to="/contact">
                        <img src={headphone} alt="" />
                    </Link>
                </div>
            </div>
            <div className="h-full w-full flex justify-center items-center ">
                <div className=" w-[30%]  rounded-3xl bg-white">
                    <div className=" bg-[#EEECE099] rounded-3xl flex p-3 m-2  flex-col items-center space-y-8">
                        <div className="flex flex-col items-center  pt-6 space-y-3  justify-center  ">
                            <h1 className="text-5xl font-medium tracking-tighter">
                                Welcome Back
                            </h1>
                            <p className="text-base font-medium tracking-tight">
                                Access your dashboard, enquiries, and AI tools.
                            </p>
                        </div>
                        <div className="h-full  w-full">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col px-2 space-y-2">
                                    <label className="font-bold"> Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={form.email}
                                        onChange={handlechange}
                                        className="w-full p-2 bg-white rounded-lg text-sm font-medium"
                                    />
                                </div>
                                <div className="flex flex-col px-2 space-y-2">
                                    <label className="font-bold"> Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handlechange}
                                        className="w-full p-2 bg-white rounded-lg  text-sm font-medium"
                                    />
                                </div>{" "}
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex justify-end text-sm">
                                        <Link
                                            to="/forgot"
                                            className="text-[#2C3F24]  font-medium hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <button className="w-full bg-[#2C3F24] text-white py-3 rounded-lg font-semibold">
                                        SIGN IN
                                    </button>
                                    <div className="text-start font-medium text-sm">
                                        <span className="text-gray-600">
                                            Don’t have an account?{" "}
                                        </span>
                                        <Link
                                            to="/register"
                                            className="text-[#2C3F24] font-medium hover:underline"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bg-[#EEECE099] flex gap-3 p-4 m-2 rounded-3xl">

                        <div className="flex-1 bg-white rounded-xl flex items-center justify-center py-4 cursor-pointer hover:shadow-md transition">
                            <img src={google} alt="google" className="w-8 h-8" />
                        </div>

                        <div className="flex-1 bg-white rounded-xl flex items-center justify-center py-4 cursor-pointer hover:shadow-md transition">
                            <img src={apple} alt="apple" className="w-8 h-8" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
