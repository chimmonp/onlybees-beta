import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

//Context
import { DurandProvider } from '@/context/DurandContext';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: "Onlybees Sports",
  description: "Book tickets for Durand Cup 2024 on Onlybees",
  author: "Gaurav Joshi"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <DurandProvider>
          <body className={inter.className}>{children}</body>
        </DurandProvider>
      </AuthProvider>
    </html>
  );
}
