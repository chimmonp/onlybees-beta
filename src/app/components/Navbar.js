"use client"
// import "./Navbar.css";
import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa';

//Toast
import { toast, Toaster } from "react-hot-toast";

// MUI icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Material UI dropwdown
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//Assets
import dark from "../../../public/OnlyBees_dark.svg";
import light from "../../../public/OnlyBees_light.svg";

// Context
import { useAuth } from '@/context/AuthContext';
import LogoutConfirmation from "./LogoutConfirmation";



const DropdownMenu = (props) => {

    const { user } = useAuth();

    //Material UI dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        props.setIsOpen(false)
    };


    return (
        <div className="lg:ml-0 ml-8 md:mt-0 mt-1">
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div className="hidden md:block">
                    <AccountCircleIcon size={40} sx={{ color: `${props.mode == "dark" ? "white" : "black"}` }} />
                </div>
                <span className={`md:hidden normal-case font-semibold lg:text-base text-lg ${props.mode == "dark" ? "text-white" : "text-black"}`}>Account</span>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <div className="px-4 py-2">
                    <span className="text-xl font-semibold text-black">Hi! {user.userData.firstname}</span>
                </div>
                <hr className="mb-1 border-black mx-2" />
                <Link href="/dashboard" className="text-[#555555]"> <MenuItem onClick={handleClose}>Dashboard</MenuItem> </Link>
                <Link href="/dashboard/my-tickets" className="text-[#555555]"> <MenuItem onClick={handleClose}>My Tickets</MenuItem> </Link>
                <hr className="mb-1 border-black mx-2 my-2" />
                <span
                    onClick={() => {
                        props.handleSetLogoutModal();
                        handleClose();
                    }}
                    className="m-0 p-0"
                >
                    <MenuItem className="px-2"><span className=" mx-auto font-bold text-xs bg-black text-white px-4 py-1 mt-4 rounded-full">LOGOUT</span></MenuItem>
                </span>
            </Menu>
        </div>
    );
}





const Navbar = (props) => {


    //Context state user
    const { user, login, logout } = useAuth();
    const [logoutModal, setLogoutModal] = useState(false);

    //To verify user jwt token using cookies
    const verifyUser = async () => {
        // if (sessionStorage.getItem('isChecked')) {
        //     return;
        // }
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                login(data.user, true);
                setLoading(false);
            }
            sessionStorage.setItem('isChecked', 'true');
        } catch (error) {
            return
        }
    };

    const handleSetLogoutModal = () => {
        setLogoutModal(true);
    }

    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (pathname !== '/dashboard' && pathname !== '/dashboard/my-tickets'){
            if (!user.userData) {
                verifyUser();
            }
        }
    }, [])

    // useEffect(() => {
    //     console.log(user);
    // }, [user])

    const handleLogout = async () => {
        setLogoutModal(false);
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                logout();
                sessionStorage.removeItem('isChecked');
                toast.success("Logged out user!")
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to logout user!")
        }
    }


    return (
        <nav className={`${props.mode == "dark" ? "bg-black text-white border-white" : "bg-none border-black text-black"} nav border-b border-solid md:mx-10 py-5 mx-5 md:pr-2`}>
            {logoutModal && <LogoutConfirmation
                title="Logout Account"
                message="Are you sure you want to logout? Click confirm to logout"
                handleCancel={() => {
                    setLogoutModal(false);
                }}
                handleConfirm={handleLogout}
            />}
            <Toaster toastOptions={{ duration: 4000 }} />
            <div className="flex justify-between items-center">
                <Link href="/" passHref>
                    <Image
                        src={(props.mode == "dark") ? light : dark}
                        width={150}
                        height="auto"
                        alt="OnlyBees logo"
                    />
                </Link>
                <div className="md:hidden" onClick={toggleMenu}>
                    {!isOpen && <FaBars className="text-2xl" />}
                </div>
                <div className={`md:flex z-50 flex-col md:flex-row items-center md:gap-3 fixed md:static top-0 right-0 h-full md:h-auto ${props.mode == "dark" ? "bg-black text-white" : "bg-[#D9D9D9] text-black"} md:bg-transparent transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-[70vw] md:w-auto`}>
                    <div className="flex justify-end w-full md:hidden p-4">
                        <FaTimes className="text-2xl cursor-pointer" onClick={toggleMenu} />
                    </div>
                    <Link href="/events" className={`md:text-sm block md:px-4 py-3 ml-10 md:ml-0 md:py-0 hover:font-medium ${pathname === '/events' ? 'underline underline-offset-8' : ''}`}>Browse events</Link>
                    <Link href="/about" className={`md:text-sm block md:px-4 py-3 ml-10 md:ml-0 md:py-0 hover:font-medium ${pathname === '/about' ? 'underline underline-offset-8' : ''}`}>About</Link>
                    <Link href="/shop" className={`md:text-sm block md:px-4 py-3 ml-10 md:ml-0 md:py-0 hover:font-medium ${pathname === '/shop' ? 'underline underline-offset-8' : ''}`}>Shop</Link>
                    <Link href="/artist" className={`md:text-sm block md:px-4 py-3 ml-10 md:ml-0 md:py-0 hover:font-medium ${pathname === '/artist' ? 'underline underline-offset-8' : ''}`}>Artist</Link>
                    <Link href="/blog" className={`md:text-sm block md:px-4 lg:pr-5 py-3 ml-10 md:ml-0 md:py-0 hover:font-medium ${pathname === '/blog' ? 'underline underline-offset-8' : ''}`}>Blog</Link>
                    {user.userData && <DropdownMenu mode={props.mode} handleSetLogoutModal={handleSetLogoutModal} setIsOpen={setIsOpen} />}
                    <div className="text-center mt-20 lg:mt-0">
                        {!user.userData && <Link href="/login" className={`md:text-xs ${props.mode == "dark" ? "bg-white text-black" : "bg-black text-white"} lg:px-8 px-12 py-2 rounded-full`} >Login</Link>}
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar;


