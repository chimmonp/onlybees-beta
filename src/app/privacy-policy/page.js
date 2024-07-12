import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import Link from 'next/link'


//Components


const PrivacyPolicy = () => {
    return (
        <div className='home-page bg-white text-black min-h-[100svh]'>
            <Navbar mode="light" />
            <div className='pt-10 pb-20 px-10 terms'>
                <h1 className='text-3xl font-coolvetica'>PRIVACY POLICY</h1>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Introduction</h2>
                <p>OnlyBees (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <em>onlybees.in</em> or use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Personal Data</h2>
                <p>Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Derivative Data</h2>
                <p>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Financial Data</h2>
                <p>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                <ul class="list-disc pl-4">
                    <li>Create and manage your account.</li>
                    <li>Process your transactions and send you related information.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    <li>Send you promotional information, such as newsletters.</li>
                    <li>Request feedback and contact you about your use of the Site.</li>
                    <li>Resolve disputes and troubleshoot problems.</li>
                    <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                    <li>Improve our products and services.</li>
                </ul>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Disclosure of Your Information</h2>
                <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                <h3 className='text-md mt-4 mb-1 font-medium'>By Law or to Protect Rights</h3>
                <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>
                <h3 className='text-md mt-4 mb-1 font-medium'>Third-Party Service Providers</h3>
                <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>
                <h3 className='text-md mt-4 mb-1 font-medium'>Business Transfers</h3>
                <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Security of Your Information</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Policy for Children</h2>
                <p>We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on our site. You are advised to review this Privacy Policy periodically for any changes.</p>
                <h2 className='text-xl mt-5 mb-2 font-medium'>Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p className='mt-7'>Onlybees</p>
                <p>KL & SON Complex</p>
                <p>Jowai, Meghalaya, 793150</p>
                <a className='underline' href='mailto:info@onlybees.in'>info@onlybees.in</a>
                <p>+91 8787740538</p>
            </div>
            <Footer mode="light" />
        </div>
    )
}

export default PrivacyPolicy