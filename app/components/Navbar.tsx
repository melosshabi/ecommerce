"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import logo from '../images/logo.png'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import navbarCart from '../images/navbar-cart.png'
import '../styles/navbar.css'

export default function Navbar() {
  const session = useSession()
  // console.log("Session:", session)
  function toggleNavMenu() {
    document.querySelector('.nav-menu')?.classList.toggle('active-nav-menu')
  }

  const router = useRouter()
  const [serachInputVal, setInputSearchVal] = useState<string>("")
  function handleSearch(e?:React.KeyboardEvent<HTMLInputElement>){
    if(!serachInputVal) return
    router.push(`/search?query=${serachInputVal}`)
  }
  return (
    <nav className='navbar'>
        <abbr title="Home">
            <Link href="/">
                <Image src={logo} alt="Logo" width={90} height={90}/>
            </Link>
        </abbr>
        {/* Searchbar */}
        <div className="search-wrapper">
          <input 
          value={serachInputVal}
          onChange={e => setInputSearchVal(e.target.value)}
          onSubmit={() => handleSearch()}
          className='searchbar' 
          type="text" 
          placeholder='Search' 
          />
          <button className="submit-search" onClick={() => handleSearch()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='magnifying-glass'>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

        </div>

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
              <Image className='nav-images cart-icon' src={navbarCart} width={50} height={50} alt="Cart icon"/>
              {/* <svg className='cart-icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> */}
                {/* <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> */}
              {/* </svg> */}

            </Link>
          </div>
          <button className='nav-menu-btn profile-btn' onClick={toggleNavMenu}>
              {/* <Image src={session.data.user?.image ? session.data.user?.image : userIcon} alt="User icon" width={50} height={50} style={{alignSelf:'center'}}/> */}
              <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>


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
