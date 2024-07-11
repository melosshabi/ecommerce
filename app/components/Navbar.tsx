"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../images/logo.png'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import navbarCart from '../images/navbar-cart.png'
import updateCartListOrWishlist from '@/lib/updateUserCartOrWishlist'
import '../styles/navbar.css'

enum listToUpdateEnum {
  cartList,
  wishlist
}
export default function Navbar() {
  const session = useSession()
  console.log(session)
  useEffect(() => {
    localStorage.removeItem('stripeSessionId')
    const localWishList = JSON.parse(localStorage.getItem('localWishList') as string)
    const localCart = JSON.parse(localStorage.getItem('localCart') as string)
    if(session.status === 'authenticated' && localWishList){
      const mergedWishlists = [...session.data.user.wishlist, ...localWishList]
      let filteredMergedWishlists = mergedWishlists.filter(function(this:Set<string>, {productDocId}) {
        return !this.has(productDocId) && this.add(productDocId)
      }, new Set<string>())
      session.data.user.wishlist = filteredMergedWishlists
      localStorage.removeItem('localWishList')
      // The function below is used to update the wishlist on the database to include the wishlist stored on localStorage
      if(filteredMergedWishlists) updateCartListOrWishlist(session.data.user.userDocId, filteredMergedWishlists, listToUpdateEnum.wishlist)
    }
    if(session.status === 'authenticated' && localCart){
      const mergedCarLists = [...session.data.user.cart, ...localCart]
      let filteredMergedCartLists = mergedCarLists.filter(function(this:Set<string>, {productDocId}) {
        return !this.has(productDocId) && this.add(productDocId)
      }, new Set<string>())
      session.data.user.cart = filteredMergedCartLists
      localStorage.removeItem('localCart')
      // The function below is used to update the cart list on the database to include the cart list stored on localStorage
      if(filteredMergedCartLists) updateCartListOrWishlist(session.data.user.userDocId, filteredMergedCartLists, listToUpdateEnum.cartList)
    }
  },[session])
  function toggleNavMenu() {
    const navMenu = document.querySelector('.nav-menu') as HTMLDivElement
    if(session.status === 'authenticated') navMenu.classList.toggle('active-nav-menu')
    else if(session.status === "unauthenticated") navMenu.classList.toggle('active-unauth-nav-menu')
    
  }

  const router = useRouter()
  const [serachInputVal, setInputSearchVal] = useState<string>("")
  function handleSearch(e?:React.KeyboardEvent<HTMLInputElement>){
    if(!serachInputVal) return
    // This if statement gets executed if the user presses the enter key on computers
    if(e && e.key === "Enter"){
      router.push(`/search?query=${serachInputVal}`) 
    }
    // This line gets executed on the submit event which happends on mobile devices
    if(!e){
      router.push(`/search?query=${serachInputVal}`)
    }
  }
  function toggleSidebar(){
    document.querySelector('.mobile-sidebar')?.classList.toggle('active-nav-mobile-sidebar')
    document.querySelector('.black-div')?.classList.toggle('active-black-div')
  }
  const localCart: CartObject[] = JSON.parse(localStorage.getItem('localCart') as string)
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
          onKeyUp={e => handleSearch(e)}
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
        
        <div className="nav-menu-wrapper">
          <div className="nav-cart-btn-wrapper">
            {session.status === "authenticated" && session.data?.user?.cart.length > 0 && <div className="cart-item-count">{session.data?.user?.cart.length}</div>}
            {session.status === "unauthenticated" && (localCart && localCart.length) > 0 && <div className="cart-item-count">{localCart.length}</div>}
            <Link href="/userProfile/cart" className="nav-menu-btn nav-cart-btn">
              <Image className='nav-images cart-icon' src={navbarCart} width={50} height={50} alt="Cart icon"/>
              {/* <svg className='cart-icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> */}
                {/* <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> */}
              {/* </svg> */}

            </Link>
          </div>
          <button className='nav-menu-btn' onClick={toggleNavMenu}>
              {/* <Image src={session.data.user?.image ? session.data.user?.image : userIcon} alt="User icon" width={50} height={50} style={{alignSelf:'center'}}/> */}
              <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
          </button>
          <div className={`nav-menu ${session.status === 'unauthenticated' && 'unauth-nav-menu'}`}>
            <ul>
              {session.status === "authenticated" && <li><Link onClick={toggleNavMenu} href="/userProfile/account" className='nav-menu-links'>My Profile</Link></li>}
              <li><Link onClick={toggleNavMenu} href="/userProfile/cart" className='nav-menu-links'>Cart</Link></li>
              <li><Link onClick={toggleNavMenu} href="/userProfile/wishlist" className='nav-menu-links'>Wishlist</Link></li>
              {session.status === "authenticated" && <li><Link onClick={toggleNavMenu} href="/postProduct" className='nav-menu-links'>Sell</Link></li>}
              {session.status === "authenticated" && <li><button onClick={() => signOut()} className='nav-menu-links'>Sign out</button></li>}
              {session.status === "unauthenticated" && <li><Link className='nav-menu-links' onClick={toggleNavMenu} href="/api/auth/signin">Sign in</Link></li>}
              {session.status === "unauthenticated" && <li><Link className='nav-menu-links' onClick={toggleNavMenu} href="/signup">Sign up</Link></li>}
            </ul>
          </div>
        </div>

        <button className="nav-hamburger-btn" onClick={() => toggleSidebar()}>
          <div className="burger-lines burger-line1"></div>
          <div className="burger-lines burger-line2"></div>
          <div className="burger-lines burger-line3"></div>
        </button>
        <div className="mobile-sidebar" style={session.status === 'unauthenticated' ? {justifyContent:'space-between'} : {}}>
          <button className="close-mobile-sidebar-btn" onClick={() => toggleSidebar()}>
          <svg className='sidebar-x-icon' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
          </button>
          
            <ul className="mobile-sidebar-links">
              {session.status === 'authenticated' && <li><Link href="/userProfile/account" className='nav-menu-links'>My Profile</Link></li>}
              <li><Link href="/userProfile/cart" className='nav-menu-links'>Cart</Link></li>
              <li><Link href="/userProfile/wishlist" className='nav-menu-links'>Wishlist</Link></li>
              {session.status === 'authenticated' && <li><Link href="/postProduct" className='nav-menu-links'>Sell</Link></li>}
              {session.status === 'authenticated' && <li><button onClick={() => signOut()} className='nav-menu-links'>Sign out</button></li>}
            </ul>
            {
              session.status === 'unauthenticated' &&
              <ul className="mobile-sidebar-links mobile-sidebar-auth-btns-wrapper">
                <li><Link href="/api/auth/signin" className='auth-btns sign-in-btn'>Sign In</Link></li>
                <li><Link href="/signup" className='auth-btns sign-in-btn'>Sign Up</Link></li>
              </ul>
            }
        </div>

        {/* Black div is the black div that appears when the user clicks on the hamburger button */}
        <div className="black-div"></div>
    </nav>
  )
}
