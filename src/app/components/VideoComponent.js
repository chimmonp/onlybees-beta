// components/VideoComponent.js
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import beesCircle from '../../../public/bees-circle.png';


const VideoComponent = () => {

    const [videoKey, setVideoKey] = useState(Date.now());
    const [loading, setLoading] = useState(true);

    const handleVideoLoaded = () => {
        setTimeout(() => {
            setLoading(false);
        }, 1200); // Delay for 1 second
    };

    useEffect(() => {
        setVideoKey(Date.now());
    }, []);

    return (
        <div className="video-container px-10 md:w-[60vh] min-h-[50svh] md:h-auto h-full lg:ml-28 flex items-center justify-center">
            {loading && (
                <div className="flex items-center justify-center bg-white bg-opacity-50">
                    <div className="animate-spin">
                        <Image src={beesCircle} alt="Loading..." width={100} height={100} />
                    </div>
                </div>
            )}
            <video
                key={videoKey}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={handleVideoLoaded}
                className={`video ${loading ? 'hidden' : ''}`}
                priority="true"
            >
                <source src="./hero.mp4" type="video/mp4" />
                Your browser does not support the videos.
            </video>
        </div>
    );
};

export default VideoComponent;
