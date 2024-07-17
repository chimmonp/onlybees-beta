
import Navbar from '../components/Navbar';


//Context
import { DurandProvider } from '@/context/DurandContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: "Onlybees Sports",
  description: "Book tickets for Durand Cup 2024 on Onlybees",
  author: "Gaurav Joshi"
};

export default function RootLayout({ children }) {
  return (
    <div className='text-black bg-white'>
      <AuthProvider>
        <DurandProvider>
          <Navbar mode="light" />
          {children}
        </DurandProvider>
      </AuthProvider>
    </div>
  );
}
