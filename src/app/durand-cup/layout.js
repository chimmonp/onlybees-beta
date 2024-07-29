
import DurandNavbar from './components/DurandNavbar';
import DurandFooter from './components/DurandFooter';


//Context
import { DurandProvider } from '@/context/DurandContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: "Onlybees Sports",
  description: "Get your tickets for the prestigious Durand Cup 2024 on Onlybees. Experience the thrill of live football matches and be a part of the oldest football tournament in Asia. Book now for the best seats and exclusive offers!",
  author: "Gaurav Joshi"
};

export default function RootLayout({ children }) {
  return (
    <div className='text-black bg-white'>
      <AuthProvider>
        <DurandProvider>
          <DurandNavbar mode="light" />
          {children}
          <DurandFooter />
        </DurandProvider>
      </AuthProvider>
    </div>
  );
}
