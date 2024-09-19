"use client"
import Image from 'next/image'
import zFlip from '../images/z-flip.jpg'
import iphone from '../images/iphone15.jpg'
import appleWatch from '../images/apple-watch.jpg'
import { useEffect } from 'react'
// import '../styles/imageSlider.css'

export default function ImageSlider(){

    useEffect(() => {
        const headerImages = document.querySelectorAll('.header-images')
        let counter = 0

        let interval = setInterval(() => {
            if(counter < headerImages.length){
                headerImages[counter].classList.remove('opacity-1')
                headerImages[counter].classList.add('opacity-0')
                counter++
                if(counter === headerImages.length) counter = 0
                headerImages[counter].classList.add('opacity-1')
                headerImages[counter].classList.remove('opacity-0')
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-[120dvw] h-[20dvh] mt-[10dvh] mb-[2dvh] relative">
            <Image src={zFlip} className='header-images w-full h-full shadow-[0_0_5px_black] absolute top-0 left-0 opacity-1 transition-all duration-300' alt="Samsung Galaxy Z Flip 5"/>
            <Image src={iphone} className='header-images w-full h-full shadow-[0_0_5px_black] absolute top-0 left-0 opacity-0 transition-all duration-300' alt="iPhone"/>    
            <Image src={appleWatch} className='header-images header-images w-full h-full shadow-[0_0_5px_black] absolute top-0 left-0 opacity-0 transition-all duration-300' alt="Apple Watch"/>    
            {/* The div below lets the user know how long until the next image is shown */}
            <div className="h-1 w-0 absolute bottom-0 animate-indicator bg-gradient-to-r from-transparent to-orange"></div>
        </div>
    )
}