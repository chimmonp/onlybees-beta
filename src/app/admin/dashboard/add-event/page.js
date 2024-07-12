'use client';

import Loading from '@/app/components/Loading';
import { useState } from 'react';
import Image from 'next/image';


//React Toastify
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showErrorToast from '@/app/components/ErrorToast';
import showSuccessToast from '@/app/components/SuccessToast';


export default function AddEvent() {

    const [form, setForm] = useState({
        organizer: '',
        title: '',
        about: '',
        venue: '',
        city: '',
        date: '',
        time: '',
        image: '',
        // quantity: 0,
        ticketPhases: [],
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prevForm) => ({ ...prevForm, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    //To handle sale phases
    const handleTicketPhaseChange = (index, e) => {
        const { name, value } = e.target;
        setForm((prevForm) => {
            const ticketPhases = [...prevForm.ticketPhases];
            ticketPhases[index][name] = value;
            return { ...prevForm, ticketPhases };
        });
    };

    //To add sale phases
    const addTicketPhase = () => {
        setForm((prevForm) => ({
            ...prevForm,
            ticketPhases: [...prevForm.ticketPhases, { phaseName: '', quantity: 0, info: '', coverCharge: 0, price: 0 }]
        }));
    };

    //To remove sale phases
    const removeTicketPhase = (index) => {
        setForm((prevForm) => {
            const ticketPhases = prevForm.ticketPhases.filter((_, i) => i !== index);
            return { ...prevForm, ticketPhases };
        });
    };


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await fetch('/api/events/addevent/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                setLoading(false);
                showSuccessToast('Event created successfully!');
            } else {
                setLoading(false);
                showErrorToast('Error creating event');
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            showErrorToast('Error creating event');
        }
    };


    return (
        <div className="lg:mx-0 mx-5 py-5">
            {loading && <Loading />}
            <h2 className="my-10 lg:ml-16 ml-5 text-5xl font-medium">Add Event</h2>
            <form
                className="w-full mx-auto p-5 lg:px-16"
                onSubmit={handleSubmit}
            >
                <div className='flex lg:flex-row flex-col lg:gap-12'>
                    <div className='flex flex-col w-full'>
                        <label className="mb-1 font-bold" htmlFor="organizer">Event Organizer</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="text"
                            name="organizer"
                            value={form.organizer}
                            onChange={handleChange}
                            placeholder="Organizer"
                            required
                        />

                        <label className="mb-1 font-bold" htmlFor="title">Event Title</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Event Title"
                            required
                        />

                        <label className="mb-1 font-bold" htmlFor="about">About</label>
                        <textarea
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            name="about"
                            value={form.about}
                            onChange={handleChange}
                            placeholder="About"
                            rows={5}
                            required
                        ></textarea>

                        <label className="mb-1 font-bold" htmlFor="venue">Venue</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="text"
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            placeholder="Venue"
                            required
                        />

                        <label className="mb-1 font-bold" htmlFor="city">City</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                            required
                        />

                        <label className="mb-1 font-bold" htmlFor="date">Date</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />

                        <label className="mb-1 font-bold" htmlFor="date">Time (Eg: 9 PM)</label>
                        <input
                            className="mb-4 p-2 border bg-[#1b1b1b] border-black rounded"
                            type="text"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            required
                        />

                    </div>
                    <div className='flex flex-col w-4/3'>

                        <label className="mt-5 mb-1 font-bold" htmlFor="image">Event Flyer</label>
                        <Image
                            src={(form.image !== '') ? form.image : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg'}
                            loading="lazy"
                            width={300}
                            height={300}
                            // sizes="100vw"
                            // className=" w-full object-cover"
                            alt="Event Flyer"
                            style={{ "boxShadow": "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", "borderRadius": "8px" }}
                        />
                        <input
                            className="my-4 text-[#00FF38]"
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            required
                        />

                    </div>
                </div>
                <label className="mb-1 font-bold" htmlFor="ticketPhases">Tickets</label>
                {form.ticketPhases.map((ticketPhase, index) => (
                    <div key={index} className="mb-1 p-5 md:px-10 px-1 border bg-[#111111] border-black rounded w-full">
                        <div className='flex flex-col lg:flex-row gap-3'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="phaseName" className='ml-1 mb-1 text-sm'>Sale Phase</label>
                                <input
                                    className="mb-2 p-2 border bg-[#1b1b1b] border-black rounded"
                                    type="text"
                                    name="phaseName"
                                    value={ticketPhase.phaseName}
                                    onChange={(e) => handleTicketPhaseChange(index, e)}
                                    placeholder="Sale Phase Name"
                                    required
                                />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="quantity" className='ml-1 mb-1 text-sm'>Quantity</label>
                                <input
                                    className="mb-2 p-2 border bg-[#1b1b1b] border-black rounded"
                                    type="number"
                                    name="quantity"
                                    value={ticketPhase.quantity}
                                    min="0"
                                    onChange={(e) => handleTicketPhaseChange(index, e)}
                                    placeholder="Quantity"
                                    required
                                />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="price" className='ml-1 mb-1 text-sm'>Price</label>
                                <input
                                    className="mb-2 p-2 border bg-[#1b1b1b] border-black rounded"
                                    type="number"
                                    name="price"
                                    value={ticketPhase.price}
                                    min="0"
                                    onChange={(e) => handleTicketPhaseChange(index, e)}
                                    placeholder="Price"
                                    required
                                />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="coverCharge" className='ml-1 mb-1 text-sm'>Cover Charge</label>
                                <input
                                    className="mb-2 p-2 border bg-[#1b1b1b] border-black rounded"
                                    type="number"
                                    name="coverCharge"
                                    value={ticketPhase.coverCharge}
                                    min="0"
                                    onChange={(e) => handleTicketPhaseChange(index, e)}
                                    placeholder="Cover Charge"
                                />
                            </div>
                        </div>    
                        <div className='flex flex-col'>
                            <label htmlFor="info" className='ml-1 mb-1 text-sm'>Info</label>
                            <textarea
                                className="mb-2 p-2 border bg-[#1b1b1b] border-black rounded"
                                type="text"
                                name="info"
                                value={ticketPhase.info}
                                onChange={(e) => handleTicketPhaseChange(index, e)}
                                placeholder="Ticket Info"
                            />
                        </div>
                        <button type="button" onClick={() => removeTicketPhase(index)} className="text-red-500">Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addTicketPhase} className="w-44 px-2 bg-slate-800 hover:bg-white hover:text-black text-white font-medium rounded">Add Ticket Phase</button>
                <div className=''>
                    <button
                        className="mt-20 p-2 px-12 bg-[#00FF38] text-black font-medium rounded cursor-pointer"
                        type="submit"
                    >
                        Add Event
                    </button>
                </div>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}
