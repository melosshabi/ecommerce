"use client"
import React, { useState } from 'react'
import UserInfo from '../components/UserInfo'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import checkmark from '../images/checkmark.svg'
import '../styles/userProfile.css'

export default function UserProfile() {

    const session = useSession()
    // This object will be used to determine which user related component to render
    const profileOptions = {
        accountInfo:'accountInfo',
        orders:'orders',
        wishlist:'wishlist',
        userProducts:'userProducts'
    }

    const [activeOption, setActiveOption] = useState<string>(profileOptions.accountInfo)

  return (
    <div className='profile-page'>
        <div className="profile-page-sidebar-details-wrapper">
            <div className="profile-page-sidebar">
                <ul>
                    <li onClick={() => setActiveOption(profileOptions.accountInfo)} className={`${activeOption === profileOptions.accountInfo && 'active-option'}`}>
                    <svg className="sidebar-icons user-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                        Account Information
                    </li>

                    <li onClick={() => setActiveOption(profileOptions.orders)} className={`${activeOption === profileOptions.orders && 'active-option'}`}>
                        <svg className="sidebar-icons orders-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                        </svg>
                        Orders
                    </li>

                    <li onClick={() => setActiveOption(profileOptions.wishlist)} className={`${activeOption === profileOptions.wishlist && 'active-option'}`}>
                        <svg className='sidebar-icons orders-icon' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                        Wishlist
                    </li>

                    <li onClick={() => setActiveOption(profileOptions.userProducts)} className={`${activeOption === profileOptions.userProducts && 'active-option'}`}>
                    <svg className="sidebar-icons box-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z"/></svg>
                        My Products
                    </li>
                </ul>
            </div>

            {/* Account Information */}
            {/* @ts-ignore */}
            {activeOption === profileOptions.accountInfo && session.data && <UserInfo userId={session.data?.user?.userId} username={session.data?.user?.name as string} email={session.data?.user?.email as string} profilePictureUrl={session.data.user?.pictureUrl as string} />}
        </div>
        <div className="account-updated-alert">
        <Image src={checkmark} className="checkmark-icon" alt="Green checkmark icon"/><p>Account Updated Sucessfully</p>
        </div>
    </div>
  )
}
