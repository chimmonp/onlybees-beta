'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import table from '../../../../public/table1.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import { motion } from 'framer-motion'; 
import { useInView } from 'react-intersection-observer'; 
import { useRouter } from 'next/navigation';

const ImageComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const router = useRouter(); 

  const handleDateChange = (date) => {
    console.log(date);
    setStartDate(date);
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  // Intersection observer hooks
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.2 });
  const { ref: imageRef, inView: imageInView } = useInView({ threshold: 0.2 });
  const { ref: priceNoteRef, inView: priceNoteInView } = useInView({ threshold: 0.2 });
  const { ref: formRef, inView: formInView } = useInView({ threshold: 0.2 });
  const { ref: selectTableRef, inView: selectTableInView } = useInView({ threshold: 0.2 });

  const handlenavigate = () => {
     router.push('/restaurant');
  }

  return (
    <div className='flex items-center flex-col px-4'>
      <div className='w-full max-w-5xl mt-[140px]'>
        {/* Sections Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={variants}
          className=' md:mb-0 mb-8'
        >
          <span className="relative inline-block">
          <button
           className="relative z-10 text-base sm:text-lg md:text-xl font-medium underline bg-transparent border-none p-0 cursor-not-allowed  focus:outline-none"
           disabled
          >
            BAR SECTION
           </button>

          </span>
          <button className="ml-4 text-base sm:text-lg md:text-xl font-medium" onClick={handlenavigate}>RESTAURANT SECTION</button>
        </motion.div>

        <div className='flex flex-col lg:flex-row'>
          {/* Image */}
          <motion.div
            ref={imageRef}
            initial="hidden"
            animate={imageInView ? 'visible' : 'hidden'}
            variants={variants}
            className='md:mt-10 md:w-[60%] w-full h-auto'
          >
            <Image
              src={table}
              alt="Table image"
              width={1700}
              height={1200}
              className='object-cover'
            />
          </motion.div>

          <div className='md:pl-2'>
            {/* Price and Note */}
            <motion.div
              ref={priceNoteRef}
              initial="hidden"
              animate={priceNoteInView ? 'visible' : 'hidden'}
              variants={variants}
              className='mt-8 md:mt-11 mx-4'
            >
              <h1 className='font-black text-2xl md:text-4xl'>INR 2000</h1>
              <p className='font-bold text-sm md:text-base tracking-wide mt-2 md:mt-4'>
                Note: A deduction of INR 2000 will be applied to the final bill.
              </p>
            </motion.div>

            {/* Select Date */}
            {/* <motion.div
              ref={formRef}
              initial="hidden"
              animate={formInView ? 'visible' : 'hidden'}
              variants={variants}
              className='flex flex-col mt-8 mx-4 md:mt-[40px]'
            > */}
                  <motion.div
              ref={priceNoteRef}
              initial="hidden"
              animate={priceNoteInView ? 'visible' : 'hidden'}
              variants={variants}
              className='mt-8 md:mt-11 mx-4'
            >
              <span className='font-bold text-sm md:text-base'>Select Date</span>
              <div className='flex flex-col md:flex-row mt-4 md:mt-2'>
                <div className="flex flex-col items-center justify-center md:mt-0 w-full md:w-auto">
                  <div className="shadow-lg w-full md:w-[300px]">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => handleDateChange(date)}
                      inline
                      className="react-datepicker__calendar"
                      calendarClassName="react-datepicker__calendar"
                      wrapperClassName="w-full"
                      style={{ fontSize: '0.75rem' }} 
                    />
                  </div>
                </div>
              </div>
              </motion.div>
            {/* </motion.div> */}

            {/* Select Table */}
            <motion.div
              ref={selectTableRef}
              initial="hidden"
              animate={selectTableInView ? 'visible' : 'hidden'}
              variants={variants}
              className='flex flex-col mt-8 mx-4 md:mt-[40px]'
            >
              <span className='font-bold text-lg md:text-base'>Select Table</span>
              <select className="bg-gray-300 rounded-full p-4 mt-1 w-[100%] text-center outline-none">
                <option value="">A1</option>
                <option value="">A2</option>
                <option value="">A3</option>
                <option value="">B1</option>
                <option value="">B2</option>
                <option value="">B3</option>
                <option value="">C1</option>
                <option value="">C2</option>
                <option value="">C3</option>
                <option value="">C4</option>
                <option value="">C5</option>
                <option value="">D1</option>
              </select>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        {/* <motion.div
          initial="hidden"
          animate={formInView ? 'visible' : 'hidden'}
          variants={variants}
          className="mt-11 md:block hidden mb-20"
        > */}
          <div className="border-t border-black border-[1px] mt-11"></div>
        {/* </motion.div> */}

        {/* Form and Terms */}
        <motion.div
          ref={formRef}
          initial="hidden"
          animate={formInView ? 'visible' : 'hidden'}
          variants={variants}
          className='flex flex-col md:flex-row justify-between mt-11 px-4'
        >
          {/* Form Fields */}
          <form className='flex flex-col w-full md:w-[500px] mb-6 md:mb-0'>
            <div className='mb-4'>
              <label htmlFor="email" className='block text-sm font-medium'>Email</label>
              <input
                type="text"
                id="email"
                className="border-b border-black rounded-0 mt-0 py-1 w-full outline-none text-sm"
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="phone" className='block text-sm font-medium'>Phone number</label>
              <input
                type="text"
                id="phone"
                className="border-b border-black rounded-0 mt-0 py-1 w-full outline-none text-sm"
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="name" className='block text-sm font-medium'>Full Name</label>
              <input
                type="text"
                id="name"
                className="border-b border-black rounded-0 mt-0 py-1 w-full outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white p-3 rounded-full mt-4 w-full md:w-auto"
            >
              Reserve Now
            </button>
          </form>

          {/* Terms and Conditions */}
          <div className='flex flex-col md:flex-wrap w-full md:w-[400px] mt-4 md:mt-0'>
            <span className="text-sm md:text-left">
              By purchasing, you’ll receive an account and agree
              to our general <span className="text-green-500">Terms of Use, Privacy Policy,
                and the Ticket Purchase Terms.</span> We process your personal
              data in accordance with our <span className="text-green-500">Privacy Policy.</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ImageComponent;
