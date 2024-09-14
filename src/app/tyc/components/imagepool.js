'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import table from '../../../../public/barpool.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";

// Import user context for authentication and user state management
import { useAuth } from '@/context/AuthContext';

const ImageComponent = () => {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableEndTimes, setAvailableEndTimes] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const router = useRouter();

  // Use the user context to access user data and authentication methods
  const { user, login } = useAuth();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  // Intersection observer hooks with `triggerOnce: true`
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: imageRef, inView: imageInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: priceNoteRef, inView: priceNoteInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: tableRef, inView: tableInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: startTimeRef, inView: startTimeInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: endTimeRef, inView: endTimeInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: dateRef, inView: dateInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: dividerRef, inView: dividerInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: formRef, inView: formInView } = useInView({ threshold: 0.2, triggerOnce: true });

  const handleNavigate = () => {
    router.push('/tyc/bar');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailPattern.test(value));
      setEmail(value);
    } else if (name === 'name') {
      setName(value);
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    const selectedTime = parseInt(e.target.value, 10);
    setStartTime(selectedTime);

    // Calculate available end times
    let newEndTimes = [];
    if (selectedTime === 23) {
      // If start time is 11:00 PM, show end time options up to 1:00 AM
      newEndTimes = [0, 1]; // 12:00 AM and 1:00 AM
    } else if (selectedTime === 0) {
      // If start time is 12:00 AM, show end time option 1:00 AM
      newEndTimes = [1]; // 1:00 AM
    } else {
      const maxEndTime = Math.min(selectedTime + 3, 23);
      for (let i = selectedTime + 1; i <= maxEndTime; i++) {
        newEndTimes.push(i);
      }
    }

    setAvailableEndTimes(newEndTimes);
  };
  const handleEndTimeChange = (e) => {
    setEndTime(parseInt(e.target.value, 10));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+$/;
    return emailPattern.test(email);
  };

  const createNewUser = async () => {
    try {
      const res = await fetch('/api/auth/registeruser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname: name, lastname: "TYC", email, phone }),
      });

      const data = await res.json();
      if (data.success) {
        // After creating the user, log them in
        login(data.user, true);
        return true;
      } else {
        alert('Error creating user!');
        return false;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  const userExists = async () => {
    try {
      const res = await fetch(`/api/auth/finduser?phone=${phone}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        return { status: data.success, user: data.user };
      } else {
        return { status: false, user: null };
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { status: false, user: null };
    }
  };

  const makePayment = async () => {
    const transactionId = "Tr-" + uuidv4().toString(36).slice(-6);

    const orderPayload = {
      transactionId: transactionId,
      userId: user?.userData?._id || '6671a4ac0e924ab6086fbd22',  // Replace 'dummy_user_id' with actual user ID if needed
      status: 'PENDING',
      amount: 2000,  // Example amount, replace with actual amount
      currency: 'INR',
      notes: `Reservation for table ${selectedTable} Restaurant TYC`,
      name: name,
      phone: phone,
      email: email,
      selectedTable: selectedTable,
      section: '64f6e5e0473b2f4b99f7a563',
      date: date.toISOString(),
      startTime: startTime,
      endTime: endTime,
    };

    try {
      // Save transaction to the database
      const orderResponse = await axios.post('/api/reservations/save-order', orderPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (orderResponse.data.success) {
        const payload = {
          merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
          merchantTransactionId: transactionId,
          merchantUserId: 'OB-' + uuidv4().toString(36).slice(-6),
          amount: orderPayload.amount * 100,
          redirectUrl: `https://onlybees.in/api/reservations/status/${transactionId}`,
          redirectMode: "POST",
          callbackUrl: `https://onlybees.in/api/reservations/status/${transactionId}`,
          mobileNumber: phone,
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        };

        const response = await axios.post('/api/phonepe/pay', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const redirectUrl = response.data.data.data.instrumentResponse.redirectInfo.url;
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Payment request error: ', error.response ? error.response.data : error.message);
    }
  };

  const handleCheckout = async () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      setIsEmailValid(false);
      return;
    } else {
      setEmailError('');
      setIsEmailValid(true);
    }

    const userCheck = await userExists();
    if (userCheck.status) {
      // User exists, proceed with payment
      makePayment();
    } else {
      // User does not exist, create new user
      const userCreated = await createNewUser();
      if (userCreated) {
        makePayment();
      }
    }
  };

  return (
    <div className='flex items-center flex-col px-4 md:w-1/2 mx-auto'>
      <div className='w-full max-w-5xl mt-10'>
        {/* Sections Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={variants}
          className='mb-10'
        >
          <span className="relative inline-block">
            <button className="relative z-10 text-base sm:text-lg md:text-xl font-medium" onClick={handleNavigate}>BAR SECTION</button>
          </span>
          <button className="ml-4 text-base sm:text-lg md:text-xl font-medium underline cursor-none">RESTAURANT SECTION</button>
        </motion.div>

        {/* Image */}
        <motion.div
          ref={imageRef}
          initial="hidden"
          animate={imageInView ? 'visible' : 'hidden'}
          variants={variants}
        >
          <Image
            src={table}
            alt="Table image"
            width={1700}
            height={1200}
            className='mt-4 w-full h-auto max-w-[100%] max-h-[1000px] sm:max-h-[600px] md:max-h-[900px]'
          />
        </motion.div>

        {/* Price and Note */}
        <motion.div
          ref={priceNoteRef}
          initial="hidden"
          animate={priceNoteInView ? 'visible' : 'hidden'}
          variants={variants}
          className='mt-8 md:mt-11 mx-4 '
        >
          <h1 className='font-black text-2xl md:text-4xl'>INR 2000</h1>
          <p className='font-bold text-sm md:text-base tracking-wide mt-2 md:mt-4'>
            Note: A deduction of INR 2000 will be applied to the final bill.
          </p>
        </motion.div>

        {/* Select Table */}
        <motion.div
          ref={tableRef}
          initial="hidden"
          animate={tableInView ? 'visible' : 'hidden'}
          variants={variants}
          className='flex flex-col mt-8 mx-4 md:mt-[40px]'
        >
          <span className='font-bold text-lg md:text-base'>Select Table</span>
          <select
            className="bg-gray-300 rounded-full p-4 mt-1 w-[50%] outline-none"
            value={selectedTable}
            onChange={handleTableChange}
          >
            <option value="">Select a Table</option>
            <option value="R1">R1</option>
            <option value="R2">R2</option>
            <option value="R3">R3</option>
            <option value="R4">R4</option>
            <option value="R5">R5</option>
            <option value="R6">R6</option>
            <option value="R7">R7</option>
            <option value="R8">R8</option>
            <option value="R9">R9</option>
            <option value="R10">R10</option>
            <option value="R14">R14</option>
            <option value="R15">R15</option>
          </select>
        </motion.div>

        {/* Select Start Time */}
        <motion.div
          ref={startTimeRef}
          initial="hidden"
          animate={startTimeInView ? 'visible' : 'hidden'}
          variants={variants}
          className='flex flex-col mt-8 mx-4 md:mt-[40px]'
        >
          <span className='font-bold text-lg md:text-base'>Start Time</span>
          <select
            className="bg-gray-300 rounded-full p-4 mt-1 w-[50%] outline-none"
            value={startTime}
            onChange={handleStartTimeChange}
          >
            <option value="">Select Start Time</option>
            <option value={13}>1:00 PM</option>
            <option value={14}>2:00 PM</option>
            <option value={15}>3:00 PM</option>
            <option value={16}>4:00 PM</option>
            <option value={17}>5:00 PM</option>
            <option value={18}>6:00 PM</option>
            <option value={19}>7:00 PM</option>
            <option value={20}>8:00 PM</option>
            <option value={21}>9:00 PM</option>
            <option value={22}>10:00 PM</option>
            <option value={23}>11:00 PM</option>
            <option value={0}>12:00 AM</option>
          </select>
        </motion.div>

        {/* Select End Time */}
        <motion.div
          ref={endTimeRef}
          initial="hidden"
          animate={endTimeInView ? 'visible' : 'hidden'}
          variants={variants}
          className='flex flex-col mt-8 mx-4 md:mt-[40px]'
        >
          <span className='font-bold text-lg md:text-base'>End Time</span>
          <select
            className="bg-gray-300 rounded-full p-4 mt-1 w-[50%] outline-none"
            value={endTime}
            onChange={handleEndTimeChange}
            disabled={!startTime}
          >
            <option value="">Select End Time</option>
            {availableEndTimes.map(time => (
              <option key={time} value={time}>
                {time === 0 ? '12:00 AM' : `${time % 12 || 12}:00 ${time < 12 || time === 24 ? 'AM' : 'PM'}`}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Select Date */}
        <motion.div
          ref={dateRef}
          initial="hidden"
          animate={dateInView ? 'visible' : 'hidden'}
          variants={variants}
          className='flex flex-col mt-8 mx-4 md:mt-[40px]'
        >
          <span className='font-bold text-sm md:text-base'>Select Date</span>
          <div className='flex flex-col md:flex-row mt-4 md:mt-10'>
            <div className="flex flex-col items-center justify-center mt-4 md:mt-0 md:ml-[190px] w-full md:w-auto">
              <div className="shadow-lg w-full md:w-[300px]">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  inline
                  className="react-datepicker__calendar"
                  calendarClassName="react-datepicker__calendar"
                  wrapperClassName="w-full"
                  style={{ fontSize: '0.75rem' }} // Adjust calendar font size for smaller screens
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          ref={dividerRef}
          initial="hidden"
          animate={dividerInView ? 'visible' : 'hidden'}
          variants={variants}
          className="mt-11"
        >
          <div className="border-t border-black border-[1px]"></div>
        </motion.div>

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
              <label htmlFor="name" className='block text-sm font-medium'>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border-b border-black py-3 w-full outline-none text-sm"
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="email" className='block text-sm font-medium'>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`border-b border-black py-3 w-full outline-none text-sm ${isEmailValid ? 'border-black' : 'border-red-500'}`}
                value={email}
                onChange={handleChange}
              />
              {emailError && <p className='text-red-500 text-sm'>{emailError}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor="phone" className='block text-sm font-medium'>Phone</label>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={setPhone}
                inputStyle={{ "color": "black", "background": "none", "borderTop": "none", "borderLeft": "none", "borderRight": "none", "borderRadius": "0px", "borderBottom": "1px solid black", "width": "100%", "fontSize": "1rem" }}
                buttonStyle={{ "background": "none", "border": "none" }}
                dropdownStyle={{ "color": "black", "background": "white" }}
                required
              />
            </div>
            <button
              type="button"
              className="bg-black text-white p-3 rounded-full mt-4 w-full md:w-auto"
              onClick={handleCheckout}
            >
              Reserve Now
            </button>
          </form>

          {/* Terms and Conditions */}
          <div className='flex flex-col md:flex-wrap w-full md:w-[400px] mt-4 md:mt-3 md:ml-10'>
            <span className="text-sm text-left md:text-left">
              By purchasing, you&apos;ll receive an account and agree
              to our general <strong className="text-green-500">Terms of Use, Privacy Policy,
                and the Purchase Terms.</strong> We process your personal
              data in accordance with our <strong className="text-green-500">Privacy Policy.</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ImageComponent;
