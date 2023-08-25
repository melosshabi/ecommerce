import React from 'react'
import Image from 'next/image'
import logo from '../images/ecommerce_.png'
import '../styles/navbar.css'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className='navbar'>
        <abbr title="Home">
            <Link href="/">
                <Image src={logo} alt="Logo" width={90} height={90}/>
            </Link>
        </abbr>
        <div className="nav-btns">
            <Link href="/api/auth/signin" className="auth-btns sign-in-btn">Sign In</Link>
            <Link href="/signup" className="auth-btns sign-up-btn">Sign Up</Link>
        </div>
    </nav>
  )
}
