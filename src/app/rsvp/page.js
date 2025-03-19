'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function RegistrationPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '' });
    const [phone, setPhone] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, phone };

        const res = await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            router.push('/event/success');
        } else {
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div>
                    <h1 className='text-center uppercase'>Blenders Pride fashion Tour</h1>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        RSVP
                    </h2>
                </div>
                <form className="mt-8" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Name Input */}
                        <div className='mb-10'>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="px-0 border-b border-white sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-black placeholder-gray-400 text-white"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mt-4">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Eg: onlybees@email.com"
                                className="px-0 border-b border-white sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-black placeholder-gray-400 text-white"
                                required
                            />
                            {/* <span className="text-[0.7rem]">
                <span className="text-[#08fb37]">Note</span> : You'll receive a copy of the registration details here
              </span> */}
                        </div>

                        {/* Phone Input */}
                        <div className='pt-10'>
                            <div className="">
                                {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-white">Phone :</label> */}
                                <PhoneInput
                                    country={"in"}
                                    value={phone}
                                    onChange={setPhone}
                                    inputStyle={{ color: "white", background: "none", border: "none", fontSize: "1rem" }}
                                    buttonStyle={{ background: "none", border: "none" }}
                                    dropdownStyle={{ color: "white", background: "black" }}
                                    required
                                />
                                <hr className="mt-1 border-white/60 border-b-[0.2px]" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='mt-20'>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#08fb37] hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#08fb37]"
                        >
                            Register
                        </button>
                    </div>
                </form>

                {/* Terms Section */}
                <div className="text-center text-xs text-gray-400 mt-5">
                    <p>
                        By registering you'll receive an account, and agree to our general{' '}
                        <a className="text-[#08fb37]" href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms of Use</a>,{' '}
                        <a className="text-[#08fb37]" href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and the{' '}
                        <a className="text-[#08fb37]" href="/registration-terms" target="_blank" rel="noopener noreferrer">Ticket Registration Terms</a>.
                        We process your personal data in accordance with our{' '}
                        <a className="text-[#08fb37]" href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}