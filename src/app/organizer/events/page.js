"use client";

import React from 'react'
import { useEffect, useState } from 'react';

//Components
import EventCard from "../../admin/components/EventCard"
import Loading from '@/app/components/Loading';
import EditModal from '../components/EditModal';


//React Toastify
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showErrorToast from '@/app/components/ErrorToast';
import showSuccessToast from '@/app/components/SuccessToast';

//Context
import { useOrganizer } from '@/context/OrganizerContext';


const EditEvent = () => {

    const [events, setEvents] = useState([]);
    const [editedEvent, setEditedEvent] = useState({})
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const { organizer } = useOrganizer();
    const [ organizerData, setOrganizerData ] = useState([])


    const fetchEvents = async () => {
        if(!organizer){
            return
        }
        try {
            setLoading(true);
            const response = await fetch(`/api/organizer/allevents?organizerId=${organizer.userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data)
            setEvents(data.events)
            
            //Organizer Info
            const response2 = await fetch(`/api/organizer/getinfo?organizerId=${organizer.userId}`);
            if (!response2.ok) {
                throw new Error('Failed to fetch data');
            }
            const data2 = await response2.json();
            // console.log(data2)
            setOrganizerData(data2.organizer)

            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    const editEvent = (event) => {
        setEditedEvent(event);
        setShowEditModal(true);
    }


    const handleSaveEvent = async (id, updatedEvent) => {
        setLoading(true);
        try {
            const response = await fetch('/api/events/editevent', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            const result = await response.json();
            if (result.success) {
                setEvents(events.map(event => event._id === updatedEvent.id ? result.data : event));
                setShowEditModal(false);
                alert('Event created successfully!');
                setLoading(false);
            } else {
                setLoading(false);
                showErrorToast("Some error occured!")
                console.error('Error updating event:', result.error);
            }
        } catch (error) {
            setLoading(false);
            showErrorToast("Some error occured!")
            console.error('Error updating event:', error);
        }
    };



    if (loading) return <Loading></Loading>;


    return (
        <>
            {showEditModal && <EditModal
                event={editedEvent}
                onSave={handleSaveEvent}
                onClose={() => { setShowEditModal(false) }}
            />}
            {!showEditModal && <div className="lg:mx-0 mb-5 pb-5 mt-10 md:w-full w-screen">
                <h2 className="mb-10 text-center p-2 lg:text-5xl text-3xl font-semibold">Edit Event</h2>
                <div className="events grid w-full mt-5 px-10" style={{ scrollbarWidth: 'none' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto">
                        {events.map((event, index) => (
                            <div key={index} className="">
                                <EventCard
                                    key={index}
                                    eventItem={event}

                                    edit={true}
                                    editEvent={editEvent}

                                    delete={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
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
        </>
    )
}

export default EditEvent