"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../images/logo.png'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import navbarCart from '../images/navbar-cart.png'
// import updateCartListOrWishlist from '@/lib/updateUserCartOrWishlist'

// enum listToUpdateEnum {
//   cartList,
//   wishlist
// }
export default function Navbar() {
  const session = useSession()
  console.log(session)
  const path = usePathname()
  useEffect(() => {
    if(path !== "/thank-you") localStorage.removeItem('stripeSessionId')
    // const localWishList = JSON.parse(localStorage.getItem('localWishList') as string)
    // const localCart = JSON.parse(localStorage.getItem('localCart') as string)
    // if(session.status === 'authenticated' && localWishList){
    //   const mergedWishlists = [...session.data.user.wishlist, ...localWishList]
    //   let filteredMergedWishlists = mergedWishlists.filter(function(this:Set<string>, {productDocId}) {
    //     return !this.has(productDocId) && this.add(productDocId)
    //   }, new Set<string>())
    //   session.data.user.wishlist = filteredMergedWishlists
    //   localStorage.removeItem('localWishList')
    //   // The function below is used to update the wishlist on the database to include the wishlist stored on localStorage
    //   if(filteredMergedWishlists) updateCartListOrWishlist(session.data.user.userDocId, filteredMergedWishlists, listToUpdateEnum.wishlist)
    // }
    // if(session.status === 'authenticated' && localCart){
    //   const mergedCarLists = [...session.data.user.cart, ...localCart]
    //   let filteredMergedCartLists = mergedCarLists.filter(function(this:Set<string>, {productDocId}) {
    //     return !this.has(productDocId) && this.add(productDocId)
    //   }, new Set<string>())
    //   session.data.user.cart = filteredMergedCartLists
    //   localStorage.removeItem('localCart')
    //   // The function below is used to update the cart list on the database to include the cart list stored on localStorage
    //   if(filteredMergedCartLists) updateCartListOrWishlist(session.data.user.userDocId, filteredMergedCartLists, listToUpdateEnum.cartList)
    // }
  },[session])
  function toggleNavMenu() {
    const navMenu = document.querySelector('.nav-menu') as HTMLDivElement
    navMenu.classList.toggle("max-h-0")
    navMenu.classList.toggle("max-h-[30dvh]")
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
    document.querySelector('.mobile-sidebar')?.classList.toggle('right-0')
    document.querySelector('.mobile-sidebar')?.classList.toggle('-right-[70dvw]')
    document.querySelector('.black-div')?.classList.toggle('hidden')
  }
  let localCart: CartObject[] = []
  if (typeof window !== 'undefined') localCart = JSON.parse(localStorage.getItem('localCart') as string)
  return (
    <nav className='fixed top-0 left-0 w-[100dvw] h-[10dvh] shadow-[0_0_5px_black] bg-white flex justify-between items-center z-[2]'>
        <abbr title="Home">
            <Link href="/">
                <Image src={logo} alt="Logo" width={90} height={90} className='w-16 h-16 md:w-20 md:h-20'/>
            </Link>
        </abbr>
        {/* Searchbar */}
        <div className="w-[50%] self-center flex items-center justify-between border-[1px] border-gray rounded-[20px] pl-4 transition-all duration-[250] focus-within:border-[1px] focus-within:border-orange md:w-[40%] md:ml-11 xl:w-[30%] 2xl:ml-[10%]">
          <input 
          value={serachInputVal}
          onChange={e => setInputSearchVal(e.target.value)}
          onSubmit={() => handleSearch()}
          onKeyUp={e => handleSearch(e)}
          className='w-[90%] border-none focus:outline-none' 
          type="text" 
          placeholder='Search'
          />
          <button className="border-none bg-none py-1 px-2 rounded-full cursor-pointer transition-all duration-[250] hover:bg-lighterGray" onClick={() => handleSearch()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='w-5 h-5 cursor-pointer'>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

        </div>
        
        <div className="w-fit relative hidden md:flex items-center md:mr-1 2xl:mr-5">
          <div className="relative">
            {session.status === "authenticated" && session.data?.user?.cartCount> 0 && <div className="w-6 h-6 bg-orange rounded-[50px] absolute -top-2 -right-3 z-[1] text-white flex justify-center items-center">{session.data?.user?.cartCount}</div>}
            {session.status === "unauthenticated" && (localCart && localCart.length) > 0 && <div className="w-6 h-6 bg-orange rounded-[50px] absolute -top-2 -right-3 z-[1] text-white flex justify-center items-center">{localCart.length}</div>}
            <Link href="/userProfile/cart" className="h-fit rounded-none bg-none p-0 mt-10">
              <Image className='nav-images max-w-10 max-h-10 inline-block' src={navbarCart} width={50} height={50} alt="Cart icon"/>
            </Link>
          </div>
          <button className='w-14 h-[50px] ml-8 mr-6 bg-none border-none cursor-pointer rounded-full p-4 flex items-center justify-center overflow-hidden transition-all duration[250ms]' onClick={toggleNavMenu}>
              <svg className="min-w-12 min-h-12 hover:drop-shadow-[0_0_2px_black]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
          </button>
          <div className="nav-menu max-h-0 w-[15dvw] absolute left-[22%] top-[8dvh] bg-white shadow-[0_0_5px_black] rounded-lg overflow-hidden grid grid-rows-1 transition-all duration-300 lg:w-[11dvw] lg:left-[21%] xl:left-[29%] xl:w-[8dvw] 2xl:w-[7dvw] 2xl:left-[27%] widescreen:left-[24%] widescreen:w-[6dvw]">
            <ul>
              {session.status === "authenticated" && <li><Link onClick={toggleNavMenu} href="/userProfile/account" className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray'>My Profile</Link></li>}
              <li><Link onClick={toggleNavMenu} href="/userProfile/cart" className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray'>Cart</Link></li>
              <li><Link onClick={toggleNavMenu} href="/userProfile/wishlist" className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray'>Wishlist</Link></li>
              {session.status === "authenticated" && <li><Link onClick={toggleNavMenu} href="/postProduct" className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray'>Sell</Link></li>}
              {session.status === "authenticated" && <li><button onClick={() => signOut({callbackUrl:process.env.NEXT_PUBLIC_URL})} className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray'>Sign out</button></li>}
              {session.status === "unauthenticated" && <li><Link className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray' onClick={toggleNavMenu} href="/api/auth/signin">Sign in</Link></li>}
              {session.status === "unauthenticated" && <li><Link className='block w-full text-base font-normal no-underline text-center cursor-pointer bg-none border-none py-3 shadow-[0_0_1px_black] transition-all duration-[250ms] hover:bg-lighterGray' onClick={toggleNavMenu} href="/signup">Sign up</Link></li>}
            </ul>
          </div>
        </div>

        {/* Hamburger btn */}
        <button className="w-8 h-5 flex flex-col justify-between items-end mr-3 bg-none border-none cursor-pointer transition-all duration-[250ms] md:hidden" onClick={() => toggleSidebar()}>
          <div className="w-full h-[3px] bg-black"></div>
          <div className="w-3/4 h-[3px] bg-black"></div>
          <div className="w-2/4 h-[3px] bg-black"></div>
        </button>
        <div className="mobile-sidebar w-[70dvw] h-[100dvh] bg-white shadow-[0_0_5px_black] absolute -right-[70dvw] top-0 z-[4] flex flex-col items-start transition-all duration-[250ms] sm:w-[50dvw]">
          <button className="bg-none border-none p-3" onClick={() => toggleSidebar()}>
            <svg className='w-10 h-10 rotate-45' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
          </button>
          {/* Mobile sidebar links */}
            <ul className="w-full list-none m-auto">
              {session.status === 'authenticated' && <li><Link onClick={() => toggleSidebar()} href="/userProfile/account" className='nav-menu-links block w-full text-[1em] font-normal no-underline text-center cursor-pointer bg-none border-t border-black py-[10px] shadow[0_0_1px_black] transition-all duration[250ms] hover:bg-lighterGray'>My Profile</Link></li>}
              <li><Link onClick={() => toggleSidebar()} href="/userProfile/cart" className='nav-menu-links block w-full text-[1em] font-normal no-underline text-center cursor-pointer bg-none py-[10px] border-t shadow[0_0_1px_black] transition-all duration[250ms] hover:bg-lighterGray'>Cart</Link></li>
              <li><Link onClick={() => toggleSidebar()} href="/userProfile/wishlist" className='nav-menu-links block w-full text-[1em] font-normal no-underline text-center cursor-pointer bg-none border-y border-black py-[10px] shadow[0_0_1px_black] transition-all duration[250ms] hover:bg-lighterGray'>Wishlist</Link></li>
              {session.status === 'authenticated' && <li><Link onClick={() => toggleSidebar()} href="/postProduct" className='nav-menu-links block w-full text-[1em] font-normal no-underline text-center cursor-pointer bg-none py-[10px] shadow[0_0_1px_black] transition-all duration[250ms] hover:bg-lighterGray'>Sell</Link></li>}
              {session.status === 'authenticated' && <li><button onClick={() => signOut({callbackUrl:process.env.NEXT_PUBLIC_URL})} className='nav-menu-links block w-full text-[1em] font-normal no-underline text-center cursor-pointer bg-none border-y border-black py-[10px] shadow[0_0_1px_black] transition-all duration[250ms] hover:bg-lighterGray'>Sign out</button></li>}
            </ul>
            {
              session.status === 'unauthenticated' &&
              <ul className="w-full flex justify-around mb-5">
                <li><Link onClick={() => toggleSidebar()} href="/api/auth/signin" className='py-2 px-4 rounded-[20px] text-[1.1rem] cursor-pointer bg-orange text-white no-underline transition-all duration[250ms] hover:bg-white hover:text-black'>Sign In</Link></li>
                <li><Link onClick={() => toggleSidebar()} href="/signup" className='py-2 px-4 rounded-[20px] text-[1.1rem] cursor-pointer bg-orange text-white no-underline transition-all duration[250ms] hover:bg-white hover:text-black'>Sign Up</Link></li>
              </ul>
            }
        </div>

        {/* Black div is the black div that appears when the user clicks on the hamburger button */}
        <div className="black-div w-[100dvw] h-[100dvh] bg-black opacity-80 fixed top-0 left-0 z-[3] hidden"></div>
    </nav>
  )
}