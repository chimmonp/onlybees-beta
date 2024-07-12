import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

//Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

//Assets
import about_media_1 from "../../../public/about_media_1.png"
import about_media_2 from "../../../public/about_media_2.png"
import about_media_3 from "../../../public/about_media_3.png"

//Team photos
import balvo from "../../../public/people/balvo.png"
import terry from "../../../public/people/terry.png"
import nida from "../../../public/people/nida.png"
import josh from "../../../public/people/josh.png"
import chimmon from "../../../public/people/chimmon.png"
import gaurav from "../../../public/people/gaurav.png"
import dipankar from "../../../public/people/dipankar.png"
import knack from "../../../public/people/knack.png"
import ben from "../../../public/people/ben.png"
import peter from "../../../public/people/peter.png"

const About = () => {
    return (
        <div className='bg-white text-black overflow-x-hidden'>
            <Navbar mode="light" />
            <div className='md:w-1/2 md:mx-auto mx-10 py-20'>
                <div className="h-fit overflow-y-hidden">
                    <h1 className='font-coolvetica md:text-7xl text-4xl font-thin animate-riseUp'>THIS IS ONLYBEES</h1>
                </div>
                <h3 className='font-coolvetica font-thin md:text-lg text-justify uppercase text-[#8B8A8A]'>This is how we picture it. A swarm of bees building a hive to share an ecosystem. There is something intriguing about the "dance language" of bees. And our team is dedicated to communicate and build a creative ecosystem in the most effective and impactful way.</h3>
                <Image
                    src={about_media_1}
                    height="0"
                    width="0"
                    className='mx-auto md:w-1/2 w-full'
                    alt='Art by Peter Warjri'
                />
                <p className='text-center text-sm font-bold'>DESIGNED BY PETER WARJRI</p>

                {/* Who we are */}
                <h2 className='mt-10 font-coolvetica text-3xl font-thin uppercase'>Who are we, what we do, and why we do it</h2>
                <p className='text-justify'><br />Imagine a swarm of bees, tirelessly building a hive, creating an ecosystem. Just like the &quot;dance language&quot; of bees, our team is dedicated to communicating and crafting a creative ecosystem with maximum impact and efficiency. At Onlybees, we are a hive of branding and design strategists, designers, developers, consultants, architects, and tech enthusiasts&mdash;MAD scientists ready to amplify your creative vision to a global audience.<br /><br />Our mission is clear: Building Effective Engagement Strategies (BEES). We are dedicated to fostering creativity, streamlining production, and delivering an authentic representation of music and art.<br /><br />Join us in the hive and let&lsquo;s build together!</p>

                {/* Our Approach */}
                <h2 className='mt-10 text-3xl font-coolvetica font-thin'>OUR APPROACH</h2>
                <div className='mt-3 flex md:flex-row flex-col gap-4 justify-center items-center'>
                    <Image
                        src={about_media_2}
                        height="0"
                        width="0"
                        className='md:w-1/2 w-full'
                        alt='Art by Peter Warjri'
                    />
                    <Image
                        src={about_media_3}
                        height="0"
                        width="0"
                        className='md:w-1/2 w-full'
                        alt='Art by Peter Warjri'
                    />
                </div>
                <p className='mt-4 text-justify'>Our approach has been refined through years of experience. We&apos;ve used it successfully to build brand after brand. It&apos;s all about real conversations between human beings, complete with honest opinions, unhindered excitement, and creativity that&apos;s only possible when you wholeheartedly trust your partners, because you know they truly have the best interest of your brand at heart.</p>

                {/* Our Services */}
                <h2 className='mt-10 text-3xl font-coolvetica font-thin'>OUR SERVICES</h2>
                <div className='mt-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12'>
                    {<h3 className='font-bold uppercase leading-none text-lg'>Brand Strategy Building</h3>}
                    {<h3 className='font-bold uppercase leading-none text-lg'>Web Design & Development</h3>}
                    {<h3 className='font-bold uppercase leading-none text-lg'>Social Media Strategy</h3>}
                    {<h3 className='font-bold uppercase leading-none text-lg'>Business Systems & Development</h3>}
                    {<h3 className='font-bold uppercase leading-none text-lg'>Artist Curation & Management</h3>}
                    {<h3 className='font-bold uppercase leading-none text-lg'>Digital Designs</h3>}
                    <h3 className='font-bold uppercase leading-none text-lg'>Event Management</h3>
                    {<h3 className='font-bold uppercase leading-none text-lg'>Video Production</h3>}
                </div>

                {/* Our Services */}
                <h2 className='mt-20 text-3xl font-coolvetica font-thin text-center'>OUR TEAM</h2>
                <div className='mt-5 md:w-[100svw] md:px-20 md:-ml-[25svw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5'>
                    <Link href="https://www.linkedin.com/in/balajied-sungoh/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={balvo}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Balajied"
                        />
                    </Link>
					<Link href="https://www.linkedin.com/in/chimmon/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={chimmon}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Chimmon"
                        />
                    </Link>
                    <Link href="https://www.linkedin.com/in/nidaphi-hynniewta-0851181a0/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={nida}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Nida"
                        />
                    </Link>
					<Link href="https://www.linkedin.com/in/peter-warjri-15b303224/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={peter}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Peter"
                        />
                    </Link>
                    <Image
                        src={josh}
                        width='0'
                        height='0'
                        className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                        alt="Josh"
                    />
                    
                    <Link href="https://www.linkedin.com/in/gauravjos02/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={gaurav}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Gaurav"
                        />
                    </Link>
                    <Link href="https://www.linkedin.com/in/dipankar-d-diengdoh-907682249/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={dipankar}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Dipankar"
                        />
                    </Link>
                    <Link href="https://www.linkedin.com/in/duncan-kharmalki-b6784a125/" target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={knack}
                            width='0'
                            height='0'
                            className='mt-2 w-full hover:scale-110 transition duration-500 cursor-pointer'
                            alt="Knack"
                        />
                    </Link>
					
					<Link href="https://www.linkedin.com/in/benjamin-vendrame-mawrie-27213a317/" target='_blank' rel='noreferrer noopener'>
						<Image
							src={ben}
							width='0'
							height='0'
							className='mt-2 w-[90%] hover:scale-110 transition duration-500 cursor-pointer'
							alt="Ben"
						/>
					</Link>

                    
                </div>
            </div>
            <Footer mode="light" />
        </div>
    )
}

export default About

