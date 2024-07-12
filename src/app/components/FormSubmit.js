"use client"

import React, { useState } from 'react'

//Components

//Toaster
import { toast, Toaster } from "react-hot-toast";
import Loading from './Loading';


const FormSubmit = () => {


    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch('/api/clients/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Email submitted successfully!");
            } else {
                toast.error('Error submitting email. Please try again.');
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error submitting email:', error);
            toast.error('Error submitting email. Please try again.');
            setIsLoading(false)
        }
    };

    if(isLoading) return <Loading />


    return (
        <div className='mt-20 md:w-1/2 w-3/4 mx-auto'>  
            <Toaster toastOptions={{ duration: 4000 }} />
            <form action="submit" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email here'
                    className='bg-[#DADADA] w-full mt-3 rounded-full border border-black px-5 py-1'
                    required
                />
                <button type='submit' className='bg-black w-full text-white rounded-full mt-3 py-2 font-medium'>Submit</button>
                <p className='opacity-[54%] text-center mt-3 font-medium text-sm'>Want ONLYBEES on Your Creative Project?</p>
                <p className='opacity-[54%] text-center font-light text-sm'>Enter your email and we will get back to you!</p>
            </form>
        </div>
    )
}

export default FormSubmit;