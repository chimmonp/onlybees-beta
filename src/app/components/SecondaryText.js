import React from 'react';

const SecondaryText = () => {
    return (
        <div className='mx-10 -mb-10'>
            <div className="overflow-hidden relative">
                <video className="w-full md:h-[40vh] h-[20vh] object-cover" autoPlay muted loop playsInline>
                    <source src="/bg_video.mp4" type="video/mp4" />
                    Your browser does not support videos.
                </video>
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-60 p-4 rounded w-full h-full">
                    <div>
                    <h2 className="text-white md:text-5xl text-xl text-center font-coolvetica">
                        ONLYBEES, WE WANT YOUR<br />EXPERIENCE TO BE AS SWEET<br />AS HONEY!
                    </h2>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default SecondaryText;
