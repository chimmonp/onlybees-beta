"use client"

// import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import seating from "../../../../public/seating.svg"

import CalendarBar from '../../components/CalendarBar'
import TicketInfo from '../../components/TicketInfo'

import { usePathname } from 'next/navigation'


import loadRazorpay from '@/lib/loadRazorpay';

//Context
import { useDurand } from "@/context/DurandContext"


const SeatingPage = (props) => {

    const [selectedSection, setSelectedSection] = useState(null)
    const [sections, setSections] = useState([])
    const [sectionData, setSectionData] = useState([])
    const [tickets, setTickets] = useState(1)
    const [matchDetails, setMatchDetails] = useState(0)
    const [dateIndex, setDateIndex] = useState(0)

    const { durandData, setData, appendData } = useDurand();

    const [ bookingData, setBookingData ] = useState({
        selectedSection: "",
        tickets: "",
        matchDetails: {},

    })

    const pathname = usePathname();
    const slugEnd = pathname.split('/').pop();

    useEffect(() => {
        const clickableSections = document.querySelectorAll('.clickable');
        let lastSelected = null;


        clickableSections.forEach((section) => {

            const sectionId = section.id;
            // console.log("sectionId : ", sectionId)
            const sectionData = sections.find((s) => {
                return s._id === sectionId
            });

            // {sectionData && dateIndex && console.log("Date Index: ", dateIndex)}
            // {sectionData && dateIndex && console.log("sectionData.availableQuantity[dateIndex].quantity: ", sectionData.availableQuantity[dateIndex].quantity)}

            if (sectionData && dateIndex !== '') {
                const quantity = sectionData.availableQuantity[dateIndex]?.quantity || 0;
                // console.log("Date Index: ", dateIndex);
                // console.log("Available Quantity: ", quantity);

                if (quantity > 0) {
                    section.addEventListener('click', (event) => {
                        // console.log(section.id)
                        if (lastSelected) {
                            lastSelected.setAttribute('fill', lastSelected.id.startsWith("lower") ? '#f90000' : '#003dff');
                        }
                        section.setAttribute('fill', 'black');
                        lastSelected = section;
                        setSelectedSection(section.id);
                    });
                }
                else {
                    // console.log("Quantity 0 of : ", section.id)
                }
            }
        });
    }, [sections]);

    // const loadScript = () => {
    //     loadRazorpay('https://checkout.razorpay.com/v1/checkout.js', () => {
    //         // console.log('Razorpay Checkout script loaded successfully.');
    //     });
    // };


    const allSections = async () => {
        try {
            // setLoading(true);
            const response = await fetch(`/api/durand-cup/allsections`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data)
            setSections(data.sections)


            // setLoading(false);
        } catch (error) {
            console.error('Error fetching all Sections:', error);
            // setLoading(false);
        }
    };

    const fetchSection = async () => {
        if (!selectedSection) {
            return
        }
        try {
            // setLoading(true);
            const response = await fetch(`/api/durand-cup/getsectiondata?sectionId=${selectedSection}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data)
            setSectionData(data.data)


            // setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // setLoading(false);
        }
    };


    const fetchMatch = async () => {
        try {
            // setLoading(true);
            const response = await fetch(`/api/durand-cup/getmatchdata?slug=${slugEnd}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data)
            // console.log(data)
            setMatchDetails(data.data)
            switch (slugEnd) {
                case 'aug-02':
                    setDateIndex(0);
                    break;
                case 'aug-05':
                    setDateIndex(1);
                    break;
                case 'aug-08':
                    setDateIndex(2);
                    break;
                case 'aug-10':
                    setDateIndex(3);
                    break;
                case 'aug-13':
                    setDateIndex(4);
                    break;
                case 'aug-17':
                    setDateIndex(5);
                    break;
                default:
                    setDateIndex(0);
            }

            // setLoading(false);
        } catch (error) {
            console.error('Error fetching Match:', error);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch()
    }, [pathname])

    useEffect(() => {
        fetchSection()
    }, [selectedSection])

    // useEffect(() => {
    //     console.log(sections);
    // }, [sections])

    //If user exists
    useEffect(() => {
        // loadScript();
        allSections();
    }, [])

    // useEffect(() => {
    //     console.log(matchDetails);
    // }, [matchDetails])

    return (
        <div className='flex lg:flex-row flex-col'>
            <CalendarBar />
            <div className='lg:w-[65svw] w-screen bg-[#D9D9D9] relative px-5'>
                <div className='absolute top-0 px-5 lg:w-[100%] w-[100svw] py-3 lg:left-0 right-[calc(50%-50svw)] text-center  bg-black text-white'>
                    <h1>{matchDetails.teamA} vs. {matchDetails.teamB}</h1>
                </div>
                <div className='pt-32 lg:px-10 '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1497.7 990.98">
                        <g id="STADIUM">
                            <g>
                                <rect x="422.04" y="258.89" width="645.7" height="419.74" fill="#1a8f45" stroke="#fdfffe" strokeMiterlimit="10" />
                                <circle cx="744.89" cy="468.65" r="55.12" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <rect x="422.04" y="343.15" width="100.34" height="248.94" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <rect x="966.64" y="343.15" width="101.11" height="248.94" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="744.89" y1="258.89" x2="744.89" y2="678.64" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <rect x="422.04" y="411.74" width="39.4" height="113.7" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <path d="M704.32,530.2c13.39-7.07,22.88-24.72,22.88-45.37s-9.49-38.3-22.88-45.37" transform="translate(-181.94 -16.23)" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <rect x="1027.91" y="412.34" width="39.83" height="113.11" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <path d="M1148.57,439.63c-13.39,7.07-22.88,24.72-22.88,45.37s9.49,38.3,22.88,45.37" transform="translate(-181.94 -16.23)" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="1080" y1="263.49" x2="1080" y2="675.57" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="1067.74" y1="491.91" x2="1080" y2="491.91" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="1067.74" y1="446.81" x2="1080" y2="446.81" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="409.53" y1="261.32" x2="409.53" y2="673.91" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="409.53" y1="445.96" x2="422.04" y2="445.96" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="409.53" y1="491.23" x2="422.04" y2="491.23" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <rect x="308.77" y="693.45" width="819.74" height="68.68" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="1004.94" y1="693.06" x2="1004.94" y2="762.13" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="327.96" y1="693.45" x2="327.96" y2="762.13" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                                <line x1="389.11" y1="693.45" x2="389.11" y2="762.13" fill="none" stroke="#fdfffe" strokeMiterlimit="10" />
                            </g>
                            <path d="M1250.54,269.51c-12.82-4.71-51.16-9.19-51.16-9.19s-418.21,1.53-496.08,0-97,8.68-97,8.68c-29.19,7.82-91.59,31-115.92,87.83-13.12,30.66-5.1,46.72-6.64,123.57.27.93-4.85,97.28,4.09,127,7.07,23.51,19.67,37.11,34.38,50.73,36.79,34,107,52.8,135.45,51.36h0c.48,0,.94-.05,1.39-.09" transform="translate(-181.94 -16.23)" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <path d="M544,613.85" transform="translate(-181.94 -16.23)" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <path d="M1411.75,486.2c-.82,98.32-60.2,180.08-161.39,214.54l.18-431.23C1350,303.21,1412.56,388.92,1411.75,486.2Z" transform="translate(-181.94 -16.23)" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <line x1="1068.42" y1="690.79" x2="1068.42" y2="251.33" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <path d="M659,710h527.83s36.08.09,63.49-9.28" transform="translate(-181.94 -16.23)" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <line x1="477.1" y1="693.79" x2="477.1" y2="693.15" fill="none" stroke="#000" strokeMiterlimit="10" />
                            <path d="M658.9,710l-1.26-.48" transform="translate(-181.94 -16.23)" fill="none" stroke="#000" strokeMiterlimit="10" />
                        </g>
                        <g id="UPPER_BOWL" data-name="UPPER BOWL">
                            {/* North West */}
                            <path d="M382.36,806.06l-46.59,46.6s95.36,89.11,167.36,108l26.3-60.26s-26.22-7.31-45.28-19.83l-10.3,20.94-9.36-5,11.32-20.26S418,843.72,382.36,806.06Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='upper-bowl-1' />
                            <path d="M505.51,961.94l25.7-60.09s60.43,27.58,155.92,26.72v23.49h12.25V928.57l101.28.52v65.7S597.34,1009.43,505.51,961.94Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='upper-bowl-2' />

                            {/* South West */}
                            <path d="M1054.62,929.09h8.85l-1.7,22.12h14V929.09s250.56,36.42,401.71-118.81l45.44,43.06s-122.3,175.49-468.25,141.28Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='upper-bowl-3' />

                            {/* South */}
                            <polygon points="1311.83 787.66 1331.4 762.55 1347.4 778.04 1355.23 768.68 1337.53 755.06 1359.83 727.83 1397.28 654.98 1421.28 575.49 1429.28 492.6 1425.7 458.81 1494.64 452.43 1497.7 491.75 1490.04 587.23 1462.47 681.19 1418.04 764.94 1361.87 836.43 1311.83 787.66" fill="#003dff" className='clickable' id='upper-bowl-4' />
                            <polygon points="1425.19 454.72 1450.98 452.43 1450.98 443.49 1425.19 446.3 1421.62 412.08 1398.13 331.66 1378.21 295.66 1439.74 262.21 1462.21 305.87 1488.77 396.51 1493.87 449.36 1425.19 454.72" fill="#003dff" className='clickable' id='upper-bowl-5' />

                            {/* South East */}
                            <polygon points="1376.34 291.75 1359.49 258.21 1334.98 227.4 1292.09 179.57 1280.51 170.55 1291.23 156.6 1282.89 150.13 1271.83 163.57 1248.51 143.49 1289.02 86.3 1337.87 127.15 1319.32 149.96 1338.21 163.57 1366.47 197.96 1387.57 181.45 1417.53 218.89 1437.79 259.4 1376.34 291.75" fill="#003dff" className='clickable' id='upper-bowl-6' />

                            {/* North */}
                            <polygon points="185.87 780.51 166.3 755.4 150.3 770.89 142.47 761.53 160.17 747.91 137.87 720.68 100.43 647.83 76.43 568.34 68.43 485.45 72 451.66 3.06 445.28 0 484.6 7.66 580.09 35.23 674.04 79.66 757.79 135.83 829.28 185.87 780.51" fill="#003dff" className='clickable' id='upper-bowl-7' />
                            <polygon points="72.51 447.57 46.72 445.28 46.72 436.34 72.51 439.15 76.08 404.94 99.57 324.51 119.49 288.51 57.96 255.06 35.49 298.72 8.94 389.36 3.83 442.21 72.51 447.57" fill="#003dff" className='clickable' id='upper-bowl-8' />
                            <polygon points="121.36 284.6 138.21 251.06 162.72 220.25 205.62 172.43 217.19 163.4 206.47 149.45 214.81 142.98 225.87 156.43 249.19 136.34 208.68 79.15 159.83 120 178.38 142.81 159.49 156.43 131.23 190.81 110.13 174.3 80.17 211.75 59.91 252.25 121.36 284.6" fill="#003dff" className='clickable' id='upper-bowl-9' />

                            {/* East */}
                            <rect x="436.94" y="7.32" width="186.55" height="64.34" fill="#7f7f7f" className='clickable' id='upper-bowl-10' />
                            <rect x="872.17" y="7.15" width="188.43" height="64.09" fill="#7f7f7f" className='clickable' id='upper-bowl-11' />
                            <polygon points="624.25 7.32 624.25 71.66 871.4 71.66 871.4 0 624.25 0.64 624.25 7.32" fill="#7f7f7f" className='clickable' id='upper-bowl-12' />
                        </g>
                        <g id="LOWER_BOWL" data-name="LOWER BOWL">
                            {/* North West */}
                            <path d="M385.68,804.49l44.6-43.23s56.17,52.76,99.4,70.46l14.3,5.45L518.11,894S435.38,857.94,385.68,804.49Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='lower-bowl-1' />
                            {/* West */}
                            <path d="M519.47,894l8.68-15.32s36,15.32,44.68,15.32l12.26-43.15s39.82,11.49,76.08,11.49,256.34,1.79,256.34,1.79v61.53H665.26S601.68,928.23,519.47,894Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='lower-bowl-2' />
                            <path d="M924.91,925.72c252.26,0,291.58,5.07,378.73-18.25s163.91-96.85,163.91-96.85L1424.49,765c-45.28,46.64-108.94,71.32-108.94,71.32l16.17,43.23c-5.19,2.56-44.76,16.17-44.76,16.17L1273,851.13c-32.93,10.21-82,11.87-82,11.87l-266.18.75Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='lower-bowl-3' />
                            {/* South */}
                            <path d="M1432.74,759.21l47.49,43.92s34.47-34.47,54.13-66.9,32.68-61.78,34-65.1,21.19-60.51,24.51-82,9.45-78.38,6.38-114.89l-66.64,3.32S1553,638.7,1432.74,759.21Z" transform="translate(-181.94 -16.23)" fill="#f90000" className='clickable' id='lower-bowl-4' />
                            <path d="M1532.57,468.15c.43,3.08,64.34-7.66,64.34-7.66s-7.65-76.6-41.36-140.94-85.78-120-129.19-150.12L1387.55,223s61.79,37.28,101.11,114.9C1488.66,337.94,1522.36,393.6,1532.57,468.15Z" transform="translate(-181.94 -16.23)" fill="#f90000" className='clickable' id='lower-bowl-5' />
                            {/* East */}
                            <path d="M490.19,138.62l29.28,54.47s66.72-40.86,174-38.13,247.83,2,247.83,2V89.94H656.66s-107.23,5.44-166.47,46.63l-1,1Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='lower-bowl-6' />
                            <path d="M947.89,89.94v66.38l257.54.68s68.42,2.72,134.8,36.77l30.64-57.54s-81.7-38.8-129.7-42.55S947.89,89.94,947.89,89.94Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" className='clickable' id='lower-bowl-7' />
                            {/* North */}
                            <path d="M426.22,756.79,378.73,800.7s-34.47-34.47-54.13-66.89-32.68-61.79-34-65.11-21.19-60.51-24.51-82-9.45-78.38-6.38-114.89l66.64,3.32S306,636.28,426.22,756.79Z" transform="translate(-181.94 -16.23)" fill="#f90000" className='clickable' id='lower-bowl-8' />
                            <path d="M326.39,465.72c-.43,3.08-64.34-7.66-64.34-7.66s7.66-76.59,41.36-140.93S389.19,197.13,432.6,167l38.81,53.62S409.62,257.89,370.3,335.51C370.3,335.51,336.6,391.17,326.39,465.72Z" transform="translate(-181.94 -16.23)" fill="#f90000" className='clickable' id='lower-bowl-9' />
                            {/* VIP */}
                            <polygon points="622.3 911.49 622.3 990.81 871.15 990.98 871.15 912.17 767.83 912.51 767.15 934.47 757.45 934.3 757.11 911.49 622.3 911.49" fill="#7f7f7f" />
                            <text x="746" y="960" fill="white" fontSize="30" fontFamily="Arial" textAnchor="middle" alignmentBaseline="middle">VIP</text>

                            <path d="M1043.38,1039Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" />
                            <path d="M1024,1030.53Z" transform="translate(-181.94 -16.23)" fill="#7f7f7f" />
                        </g>
                    </svg>
                    <p className='text-gray-500 mt-5 text-center'>Click to select seating</p>
                </div>
            </div>
            <TicketInfo tickets={tickets} setTickets={setTickets} sectionData={sectionData} matchDetails={matchDetails} />
        </div>
    )
}

export default SeatingPage