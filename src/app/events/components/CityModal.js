import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';


//Assets
import close from "../../../../public/close_round_light.svg"



const CityModal = ({ isOpen, onClose, cities, onSelectCity }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center">
            <div className="bg-white text-black rounded-lg shadow-lg lg:max-h-[50svh] max-h-[70svh]">
                <div className='flex flex-row justify-between'>
                    <div></div>
                    <Image
                        src={close}
                        height={40}
                        width="auto"
                        alt="close button"
                        className="cursor-pointer text-right p-2 hover:scale-125"
                        onClick={onClose}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Find a city"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    ref={inputRef}
                    className="focus:outline-none mx-2 px-3 py-1"
                />
                {/* <a className=" px-4 py-2 cursor-pointer rounded" onClick={onClose}>Close</a> */}
                <hr className='mx-2 border-b-1 mb-2' />
                <ul className="list-inside list-none">
                    <li className="py-2 px-5 cursor-pointer hover:bg-[#eeeeee]" onClick={() => onSelectCity(null)}>
                        All
                    </li>
                    {filteredCities.map((city, index) => (
                        <li key={index} className="py-2 px-5 cursor-pointer hover:bg-[#eeeeee]" onClick={() => onSelectCity(city)}>
                            {city}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CityModal;
