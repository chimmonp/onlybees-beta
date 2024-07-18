"use client"

import React, { useEffect, useState } from 'react';
import Loading from '@/app/components/Loading';
import { useOrganizer } from '@/context/OrganizerContext';

import { toast, Toaster } from "react-hot-toast";

const OrganizerProfile = () => {
    const [loading, setLoading] = useState(false);
    const { organizer } = useOrganizer(null);
    const [organizerData, setOrganizerData] = useState({});
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
    });
    const [isChanged, setIsChanged] = useState(false);

    const fetchOrganizerInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/organizer/getinfo?organizerId=${organizer.userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setOrganizerData(data.organizer);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching organizer info:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizerInfo();
    }, []);

    useEffect(() => {
        setForm({
            name: organizerData.name || '',
            email: organizerData.email || '',
            phone: organizerData.phone || '',
            city: organizerData.city || '',
            password: '',
        });
    }, [organizerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setIsChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedForm = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                city: form.city,
                password: form.password || undefined, // Pass undefined if password field is empty
            };

            const response = await fetch('/api/organizer/updateinfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedForm),
            });

            if (!response.ok) {
                toast.error("Failed to update data")
                // throw new Error('Failed to update data');
            }

            const data = await response.json();
            // setOrganizerData(data.organizer);
            fetchOrganizerInfo();
            setIsChanged(false);
            setLoading(false);
            toast.success("Successfully Updated!")
        } catch (error) {
            // console.error('Error updating organizer info:', error);
            setLoading(false);
            toast.error("Error updating organizer info!")
        }
    };

    if (loading) return <Loading />;

    return (
        <div className='px-10 pb-10 md:w-[80svw] w-screen'>
            <Toaster toastOptions={{ duration: 4000 }} />
            <h1 className='font-coolvetica text-2xl'>DASHBOARD</h1>
            <p className='text-3xl'>{organizerData.name}</p>
            <div className='mt-10'>
                <form onSubmit={handleSubmit}>
                    <div className='grid lg:grid-cols-2 grid-cols-1 md:gap-10 gap-5'>
                        <div className='flex flex-col'>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={handleChange}
                                className='bg-[#D9D9D9] text-black rounded-md px-4 py-2'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                className='bg-[#D9D9D9] text-black rounded-md px-4 py-2'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className='bg-[#D9D9D9] text-black rounded-md px-4 py-2'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={form.city}
                                onChange={handleChange}
                                className='bg-[#D9D9D9] text-black rounded-md px-4 py-2'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="password">Reset Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={form.password}
                                onChange={handleChange}
                                className='bg-[#D9D9D9] text-black rounded-md px-4 py-2'
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`${isChanged ? "bg-[#00FF38]" : "bg-[#115a21]" } mt-10 px-10 py-1 rounded-lg text-black`}
                        disabled={!isChanged}
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrganizerProfile;
