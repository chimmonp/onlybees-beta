"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Pay = () => {
    const router = useRouter();
    const [data, setData] = useState({});

    const handleFormData = (e) => {
        const dd = { ...data, [e.target.name]: e.target.value };
        setData(dd);
    };

    const makePayment = async (e) => {
        e.preventDefault();

        const transactionid = "Tr-" + uuidv4().toString(36).slice(-6);

        const payload = {
            merchantId: 'M227J0BC2IGYQ',
            merchantTransactionId: transactionid,
            merchantUserId: 'OB-' + uuidv4().toString(36).slice(-6),
            amount: 200,
            redirectUrl: `https://onlybees.in/`,
            redirectMode: "POST",
            callbackUrl: `https://onlybees.in/`,
            mobileNumber: '8415031939',
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        try {
            const response = await axios.post('/api/phonepe/pay', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log(response.data.data.data.instrumentResponse.redirectInfo.url)

            const redirectUrl = response.data.data.data.instrumentResponse.redirectInfo.url;
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Payment request error: ', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={makePayment}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                value="DemoTest"
                                onChange={(e) => handleFormData(e)}
                                type="name"
                                autoComplete="name"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="Mobile"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Mobile
                        </label>
                        <div className="mt-2">
                            <input
                                id="Mobile"
                                name="mobile"
                                value="999999999"
                                onChange={(e) => handleFormData(e)}
                                autoComplete="Mobile"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="Amount"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Amount
                        </label>
                        <div className="mt-2">
                            <input
                                id="Amount"
                                name="amount"
                                value="2"
                                autoComplete="Amount"
                                onChange={(e) => handleFormData(e)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="MUID"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            MUID
                        </label>
                        <div className="mt-2">
                            <input
                                id="MUID"
                                name="muid"
                                value="nuid-909090"
                                onChange={(e) => handleFormData(e)}
                                autoComplete="MUID"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Pay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Pay;
