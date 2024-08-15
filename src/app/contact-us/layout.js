
export const metadata = {
    title: "Contact Us - Onlybees",
    description: "Get in touch with Onlybees. We're here to support your creative journey in music and art. Reach out to our team for inquiries, partnerships, or feedback.",
    canonical: '/contact',
    languages: {
        'en-US': '/en-US/contact',
    },
    openGraph: {
        images: "https://onlybees.in/BeesLogoBg.png",
        title: "Contact Us - Onlybees",
        description: "Connect with Onlybees to explore collaboration opportunities, ask questions, or share your ideas. We're excited to hear from you!",
        url: "https://onlybees.in/contact",
        type: "website",
    },
    twitter: {
        images: "https://onlybees.in/BeesLogoBg.png",
        card: "summary_large_image",
        site: "@OnlyBees",
        title: "Contact Us - Onlybees",
        description: "Reach out to Onlybees for any queries or collaborations. We're here to help you elevate your creative projects.",
    },
    organization: "Onlybees",
    audience: "Artists, Musicians, Event Organizers, Creative Enthusiasts, Potential Partners",
    socialMediaHashtags: ["#CreativeSupport", "#Music", "#Art", "#Onlybees", "#ContactUs"],
};


export default function ContactLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
