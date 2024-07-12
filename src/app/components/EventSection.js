"use client"

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link';


//Components
import HomeEvent from './HomeEvent';

const EventSection = ({ events, loading }) => {
    
    const scrollContainerRef = useRef(null);
    const scrollAnimationFrameRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        const smoothScroll = () => {
            if (scrollContainer) {
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 0.5; // Adjust this value for smoother scrolling speed
                }
            }
            scrollAnimationFrameRef.current = requestAnimationFrame(smoothScroll);
        };

        const startAutoScroll = () => {
            scrollAnimationFrameRef.current = requestAnimationFrame(smoothScroll);
        };

        const stopAutoScroll = () => {
            if (scrollAnimationFrameRef.current) {
                cancelAnimationFrame(scrollAnimationFrameRef.current);
            }
        };

        if (!loading) {
            startAutoScroll();

            scrollContainer.addEventListener('scroll', () => {
                if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                    scrollContainer.scrollLeft = 0;
                }
            });

            scrollContainer.addEventListener('mouseover', stopAutoScroll);
            scrollContainer.addEventListener('mouseout', startAutoScroll);

            return () => {
                stopAutoScroll();
                scrollContainer.removeEventListener('mouseover', stopAutoScroll);
                scrollContainer.removeEventListener('mouseout', startAutoScroll);
            };
        }
    }, [loading]);

    // if (loading) return <Loading />;


    return (
        <div className='pb-5'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-black font-semibold text-3xl lg:text-3xl my-5 mb-5 mx-auto font-coolvetica uppercase'>Events</h2>
            </div>
            <div ref={scrollContainerRef} className="events flex w-screen overflow-x-scroll overflow-y-clip pr-5" style={{ scrollbarWidth: 'none' }}>
                {events.map((event, index) => (
                    <div key={index} className="py-3 ml-10 md:ml-7 hover:scale-105 transform transition duration-100">
                        <HomeEvent
                            key={index}
                            eventItem={event}
                        />
                    </div>
                ))}
            </div>
            <div className='flex md:flex-row flex-col justify-between md:w-1/2 md:mx-auto mt-10 items-center mx-10'>
                <p className='font-medium text-center'>Here at OnlyBees, we want your experience to be as sweet as honey.</p>
                <Link href='/events' className='bg-black text-white mt-5 md:mt-0 px-4 py-1 text-sm rounded-full w-fit'>SEE MORE</Link>
            </div>
        </div>
    )
}

export default EventSection