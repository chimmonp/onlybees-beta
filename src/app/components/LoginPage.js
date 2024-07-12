"use client"
import { useState, useEffect } from "react";

//Context
import { useAuth } from '@/context/AuthContext';


import { BsFillShieldLockFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

import { useRouter } from 'next/navigation';

//Assets
import logo from "../../../public/OnlyBees_light.svg"

import Image from "next/image";

const LoginPage = () => {

    useEffect( ()=> {
        sessionStorage.setItem('isChecked', 'false');
    }, [])

    const router = useRouter();

    const { user, login } = useAuth();

    const [otp, setOtp] = useState("");
    const [ph, setPh] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null)

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response) => {
                onSignup();
            },
            "expired-callback": () => { },
        })
    }, [auth])



    const onSignup = async () => {
        setLoading(true);
        const formatPh = "+" + ph;
        try {
            const confirmation = await signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
            setConfirmationResult(confirmation);
            setLoading(false);
            setShowOTP(true);
            toast.success("OTP sent successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const onOTPVerify = async () => {
        setLoading(true);
        confirmationResult
            .confirm(otp)
            .then(async () => {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ph }),
                });

                if (res.ok && res.registered) {
                    setLoading(false);
                    login(ph, true)
                    router.push('/dashboard')
                }
                else if(res.ok && !res.registered){
                    setLoading(false);
                    login(ph, false)
                    router.push('/signup')
                }
                else {
                    setLoading(false);
                    setShowOTP(false)
                    setPh(null);
                    setConfirmationResult(null);
                    toast.error("Login failed!");
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log("Entered Error!")
                if (err.code === 'auth/invalid-verification-code') {
                    toast.error("Invalid OTP!")
                } else {
                    console.error("Unexpected error during OTP confirmation:", err);
                    toast.error("An unexpected error occurred. Please try again.");
                }
            });
    }

    if(user.phone){
        router.push("/signup")
    }

    return (
        <section className="bg-black flex items-center justify-center h-[90svh]">
            <div className="w-[80svw] flex justify-center">
                <Toaster toastOptions={{ duration: 4000 }} />
                <div id="recaptcha-container"></div>
                {user.phone ? (
                    <h2 className="text-center text-white font-medium text-2xl">
                        Login Success!
                    </h2>
                ) : (
                    <div className="w-[80svw] flex flex-col gap-4 rounded-lg">
                        <h1 className="-mt-20 text-center leading-normal text-white font-medium text-3xl">
                            Welcome to
                        </h1>
                        <Image
                            src={logo}
                            priority
                            width={300}
                            height="auto"
                            alt="Onlybees logo"
                            className="mb-1 mx-auto"
                        />
                        <p className="text-center font-light mb-28">Discover the best nights out in your city with us. Explore events all in one place.</p>

                        {showOTP ? (
                            <div className="md:w-[30svw] w-full mx-auto text-center">
                                <div className="bg-white text-[#00FF38] w-fit mx-auto rounded-full">
                                    <BsFillShieldLockFill size={30} />
                                </div>
                                <label
                                    htmlFor="otp"
                                    className="font-bold text-xl text-white text-center"
                                >
                                    Enter your OTP
                                </label>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    OTPLength={6}
                                    otpType="number"
                                    disabled={false}
                                    autoFocus
                                    style={{ "margin": "0 auto", "padding": "0", "justifyContent": "between", "alignItems": "center" }}
                                    inputStyles={{ "background": "none", "borderBottom": "solid 1px white", "margin": "1.2rem auto" }}
                                    className="opt-container text-white"
                                ></OtpInput>
                                <button
                                    onClick={onOTPVerify}
                                    className="bg-[#00FF38] w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                                >
                                    {loading && (
                                        <CgSpinner size={20} className="mt-1 animate-spin" />
                                    )}
                                    <span className="text-black">Verify OTP</span>
                                </button>
                            </div>
                        ) : (
                            <div className="md:w-[20svw] mx-auto">
                                <PhoneInput country={"in"}
                                    value={ph}
                                    onChange={setPh}
                                    inputStyle={{ "color": "white", "background": "none", "border": "none", "fontSize": "1.6rem" }}
                                    buttonStyle={{ "background": "none", "border": "none" }}
                                    dropdownStyle={{ "color": "white", "background": "black" }}
                                    autoFocus
                                />
                                <hr className="mt-1" />
                                <button
                                    onClick={onSignup}
                                    className="mt-5 bg-[#00FF38] w-full flex gap-1 items-center justify-center py-2.5 text-black rounded"
                                >
                                    {loading && (
                                        <CgSpinner size={20} className="mt-1 animate-spin" />
                                    )}
                                    <span>Send code via SMS</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LoginPage;
