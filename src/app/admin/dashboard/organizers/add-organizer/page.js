'use client'
import { useState } from 'react';

//React Toastify
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showErrorToast from '@/app/components/ErrorToast';
import showSuccessToast from '@/app/components/SuccessToast';

//Components
import Loading from '@/app/components/Loading';
import Link from 'next/link';

export default function AddOrganizer() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email || !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.phone || !/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Valid phone number is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }
    
        setErrors({});
        try {
            const res = await fetch('/api/admin/addorganizer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await res.json();
            if (res.ok && data.success) {
                setLoading(false);
                setMessage('Organizer created successfully!');
            } else {
                setLoading(false);
                const errorMessage = data.error || data.message || 'Error creating organizer';
                setMessage(errorMessage);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            setMessage('Server error. Please try again.');
        }
    };

    return (
        <div className={`bg-black relative text-white min-h-screen flex justify-center items-center p-4`}>
            {loading && <Loading />}
            {message!=='' && <div className='absolute flex justify-center bg-black bg-opacity-20 backdrop-blur-sm items-center top-0 left-0 h-screen w-screen'>
                <div className='bg-white relative text-black py-10 px-10 rounded-md'>
                    <p>{message}</p>
                    <Link href='/admin/dashboard/organizers' className='absolute top-2 right-4 text-lg text-red-500'>x</Link>
                </div>
            </div>}
            <form
                onSubmit={handleSubmit}
                className="bg-[#1b1b1b] p-8 rounded-lg shadow-lg max-w-md w-full"
            >
                <h1 className="text-center text-2xl font-bold mb-6">Add Organizer</h1>
                {['name', 'email', 'phone', 'city', 'password'].map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="w-full py-1 border-b border-white bg-[#1b1b1b] text-white outline-none ring-none"
                        />
                        {errors[field] && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors[field]}
                            </p>
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full py-3 bg-[#00FF38] text-black font-bold rounded hover:bg-green-300 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
