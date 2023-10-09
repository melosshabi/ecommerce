"use client"
import Image from 'next/image'
import zFlip from '../images/z-flip.jpg'
import iphone from '../images/iphone15.jpg'
import appleWatch from '../images/apple-watch.jpg'
import { useEffect } from 'react'
import '../styles/imageSlider.css'

export default function ImageSlider(){

    useEffect(() => {
        const headerImages = document.querySelectorAll('.header-images')
        let counter = 0

        var interval = setInterval(() => {
            if(counter < headerImages.length){
                headerImages[counter].classList.remove('active-header-image')
                counter++
                if(counter === headerImages.length) counter = 0
                headerImages[counter].classList.add('active-header-image')
            }
        }, 9850)
        
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="image-slider">
        <Image src={zFlip} className='header-images active-header-image' alt="Samsung Galaxy Z Flip 5"/>
        <Image src={iphone} className='header-images' alt="iPhone"/>    
        <Image src={appleWatch} className='header-images' alt="Apple Watch"/>    
        {/* The div below lets the user know how long until the next image is shown */}
        <div className="time-indicator"></div>
        </div>
    )

}