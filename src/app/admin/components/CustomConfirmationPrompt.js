"use client";
import { useState } from 'react';

const CustomConfirmationPrompt = ({ message, onConfirm, onCancel }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        onConfirm(inputValue);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#1b1b1b] bg-opacity-50 z-50 text-white">
            <div className="bg-black p-6 rounded-lg shadow-md">
                <p className="text-lg">{message}</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full bg-[#3a3a3a] rounded-md px-3 py-2 mt-2 focus:outline-none "
                />
                <div className="mt-4 flex justify-end">
                    <button onClick={handleCancel} className="bg-[#3a3a3a] hover:bg-gray-900 px-4 py-2 rounded-md mr-2">Cancel</button>
                    <button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmationPrompt;
