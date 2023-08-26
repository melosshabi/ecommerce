"use client"
import React from 'react'
import Image from 'next/image'
import logo from '../images/logo.png'
import userIcon from '../images/user.png'
import '../styles/navbar.css'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const session = useSession()
  console.log("Session", session)

  function toggleNavMenu() {
    document.querySelector('.nav-menu')?.classList.toggle('active-nav-menu')
  }
  return (
    <nav className='navbar'>
        <abbr title="Home">
            <Link href="/">
                <Image src={logo} alt="Logo" width={90} height={90}/>
            </Link>
        </abbr>
        {!session.data ? 
        <div className="nav-btns">
            <Link href="/api/auth/signin" className="auth-btns sign-in-btn">Sign In</Link>
            <Link href="/signup" className="auth-btns sign-up-btn">Sign Up</Link>
        </div>
        :
        <div className="nav-menu-wrapper">
          <button className='nav-menu-btn' onClick={toggleNavMenu}>
            <Image src={userIcon} alt="User icon" width={50} height={50} style={{alignSelf:'center'}}/>
          </button>
          <div className="nav-menu">
            <ul>
              <li><Link href="" className='nav-menu-links'>My Profile</Link></li>
              <li><Link href="" className='nav-menu-links'>Cart</Link></li>
              <li><Link href="" className='nav-menu-links'>Wishlist</Link></li>
              <li><button onClick={() => signOut()} className='nav-menu-links'>Sign out</button></li>
            </ul>
          </div>
        </div>
        }
    </nav>
  )
}
