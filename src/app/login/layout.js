//Components
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";



export const metadata = {
  title: "Log in to Onlybees Events",
  description: "Developed by Gaurav Joshi",
};

export default function LoginLayout({ children }) {
  return (
    <>
        <Navbar mode="dark"/>
        {children}
        <Footer mode="dark"/>
    </>
  );
}
