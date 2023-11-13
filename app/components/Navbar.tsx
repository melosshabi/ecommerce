"use client"
import React from 'react'
import Image from 'next/image'
import logo from '../images/logo.png'
import userIcon from '../images/user.png'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import navbarCart from '../images/navbar-cart.png'
import '../styles/navbar.css'

export default function Navbar() {
  const session = useSession()
  console.log("Session:", session)
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
          <div className="nav-cart-btn-wrapper">
            {session.data?.user?.cart.length > 0 && <div className="cart-item-count">{session.data?.user?.cart.length}</div>}
            <Link href="/userProfile/cart" className="nav-menu-btn nav-cart-btn">
              <Image src={navbarCart} width={50} height={50} alt="Cart icon"/>
            </Link>
          </div>
          <button className='nav-menu-btn' onClick={toggleNavMenu}>
            <Image src={session.data.user?.image ? session.data.user?.image : userIcon} alt="User icon" width={50} height={50} style={{alignSelf:'center'}}/>
          </button>
          <div className="nav-menu">
            <ul>
              <li><Link onClick={toggleNavMenu} href="/userProfile/account" className='nav-menu-links'>My Profile</Link></li>
              <li><Link onClick={toggleNavMenu} href="/userProfile/cart" className='nav-menu-links'>Cart</Link></li>
              <li><Link onClick={toggleNavMenu} href="/userProfile/wishlist" className='nav-menu-links'>Wishlist</Link></li>
              <li><Link onClick={toggleNavMenu} href="/postProduct" className='nav-menu-links'>Sell</Link></li>
              <li><button onClick={() => signOut()} className='nav-menu-links'>Sign out</button></li>
            </ul>
          </div>
        </div>
        }
    </nav>
  )
}
