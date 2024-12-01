"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import {addToCart, removeFromCart, addToWishlist, removeFromWishlist, placeOrder} from '@/lib/lib'
import checkmark from '../images/order-page-checkmark.png'
import ProductReviews from '../components/ProductReviews'

export default function ProductDetails() {
  
  const searchParams = useSearchParams()
  const productDocId = searchParams.get("_id")
  const router = useRouter()
  const session = useSession()
  const [product, setProduct] = useState<CartProduct | undefined>(undefined)
  const [localStorageCart, setLocalStorageCart] = useState<LocalCartObject[]>([])
  const [localStorageWishlist, setLocalStorageWishlist] = useState<LocalWishlistObject[]>([])
  // This variable holds the url of the large image that is displayed on the right side of the image sidebar
  const [activeImage, setActiveImage] = useState<string>("")
  // This state is used to determine whether authenticated users have this product on their wishlist or cart
  const [isProductInLists, setIsProductInLists] = useState({
    cart:false,
    wishlist:false
  })
  const [error, setError] = useState<string>("")
  const [showSpinner, setShowSpinner] = useState(true)
  async function checkUserLists(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/checkUserLists?_id=${productDocId}`)
    const data = await res.json()
    setIsProductInLists({...data.productExists})
  }
  useEffect(() => {
    const controller = new AbortController();
    async function fetchProduct(){
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${productDocId}`, {signal:controller.signal})
      if(res.status === 504){
        alert("There was a problem with the server. Code 504")
        router.push('/')
      }
      const productData = await res.json()
      if(!productData){
        router.push('/')
      }
      setProduct(productData)
      setActiveImage(productData.pictures[0])
      setShowSpinner(false)
    }
    
    fetchProduct()
    checkUserLists()
    return () => controller.abort()
  },[])
  useEffect(() => {
    if (session.status === 'unauthenticated'){
      setLocalStorageCart(JSON.parse(localStorage.getItem('localCart') as string))
      setLocalStorageWishlist(JSON.parse(localStorage.getItem('localWishList') as string))
    }
  }, [session])
  
  function handleImageChange(index:number){
    const buttons = document.querySelectorAll('.product-image-btns')
    buttons.forEach(button => button.classList.remove('bg-gray'))
    buttons[index].classList.add('bg-gray')
    setActiveImage(product?.pictures[index] as string)
  }
  // The quantity chosen by the user
  const [userQuantity, setUserQuantity] = useState<number>(1)

  function handleQuantityChange(e:ChangeEvent<HTMLInputElement>){
    if(parseInt(e.target.value) > product?.quantity!){
      setError(`Please select a maximum amount of ${product?.quantity}`)
      setUserQuantity(parseInt(e.target.value))
      return
    }
    if(error) setError('')
    setUserQuantity(parseInt(e.target.value))
  }

  const [fullscreenImage, setFullscreenImage] = useState<string>("")

  enum fullscreenActions {
    show = 'show',
    close = 'close',
  }
  function toggleFullscreenImage(action:string, url?:string){
    const fullscreenImgDiv = document.querySelector('.fullscreen-image') as HTMLDivElement
    if(action === fullscreenActions.show && url){
      fullscreenImgDiv.classList.remove('hidden')
      fullscreenImgDiv.classList.add('flex')
      const html = document.querySelector('html') as HTMLElement
      html.scrollTo(0, 0)
      html.style.overflow = "hidden"
      setFullscreenImage(url)
      return
    }
    const html = document.querySelector('html') as HTMLElement
    html.style.overflowY = "scroll"
    fullscreenImgDiv.classList.remove('flex')
    fullscreenImgDiv.classList.add('hidden')
    setFullscreenImage('')
  }

  enum actions {
    prev = 'prev',
    next = 'next'
  }

  function changeFullscreenImage(action:string){
    if(action === actions.next){
      let currentActiveIndex = product?.pictures.indexOf(fullscreenImage)
      if(currentActiveIndex! + 1 === product?.pictures.length){
        setFullscreenImage(product.pictures[0] as string)
        return
      }
      setFullscreenImage(product?.pictures[currentActiveIndex! + 1] as string)
    }else if(action === actions.prev){
      let currentActiveIndex = product?.pictures.indexOf(fullscreenImage)
      if(currentActiveIndex! - 1 === -1){
        setFullscreenImage(product?.pictures[product.pictures.length - 1] as string)
        return
      }
      setFullscreenImage(product?.pictures[currentActiveIndex! - 1] as string)
    }
  } 

  return (
    <div className='product-page bg-white flex justify-center items-center flex-col w-[100dvw] min-h-[100dvh] max-h-fit'>
      {/* Loading spinner */}
      { showSpinner && <div className="spinner-wrapper w-[100dvw] h-[100dvh] fixed z-[2] bg-[#000000f2] top-0 flex items-center justify-center">
        <svg className="spinner w-[15dvw] h-[15dvh]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
      </div>}

      <div className="fullscreen-image absolute w-[100dvw] h-[90dvh] top-[10dvh] bg-white hidden items-center justify-between overflow-hidden">
        {/* X button */}
        <button className="bg-none border-none cursor-pointer p-3 rounded-md transition-all duration-300 hover:bg-gray absolute top-0 right-4" onClick={() => toggleFullscreenImage(fullscreenActions.close)}>
          <svg className='w-[50px] h-[50px]' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </button>
        {/* Prev img button */}
        <button className="bg-none border-none cursor-pointer p-1 rounded-md transition-all duration-300 hover:bg-gray sm:p-3" onClick={() => changeFullscreenImage(actions.prev)}>
        <svg className="w-[50px] h-[50px] rotate-180" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </button>
        <Image src={fullscreenImage as string} width={800} height={800} className='w-54' alt="Fullscreen image of the product"/>
        {/* Next img button */}
        <button className="bg-none border-none cursor-pointer p-1 rounded-md transition-all duration-300 hover:bg-gray sm:p-3" onClick={() => changeFullscreenImage(actions.next)}>
        <svg className='w-[50px] h-[50px]' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow-[0_0_5px_black] w-full min-h-fit h-fit mt-[10dvh] rounded-lg p-5 flex flex-col items-center xl:flex-row xl:w-[90dvw] xl:mt-[12dvh] widescreen:justify-around">
        {/* Images */}
        {/* Wrapper */}
          <div className="w-full h-fit flex-col-reverse flex items-center justify-between mb-6 lg:w-fit">
            {/* Sidebar */}
            <div className="w-fit h-fit flex flex-row rounded-lg lg:justify-center lg:w-[90%] lg:ml-12">
              {product && 
                product.pictures.map((picture, index) => {
                  if(index === 0){
                    return(
                    <button onClick={() => handleImageChange(index)} className='product-image-btns bg-gray border-none border-b-[1px] rounded-lg p-1 cursor-pointer transition-all duration-300 hover:bg-gray' key={index}>
                      <Image className="rounded-lg" src={picture as string | ""} alt="Pictures of the product" width={100} height={100}/>
                    </button>
                    )
                  }
                    return (
                      <button onClick={() => handleImageChange(index)} className='product-image-btns bg-none border-none border-b-[1px] rounded-lg p-1 cursor-pointer transition-all duration-300 hover:bg-gray' key={index}>
                      <Image className="rounded-lg" src={picture as string | ""} alt="Pictures of the product" width={100} height={100}/>
                    </button>
                    )
                  })
              }
            </div>

              <div className="ml-[5dvw] bg-white p-5 cursor-pointer" title="Click to view in fullscreen" onClick={() => toggleFullscreenImage(fullscreenActions.show, activeImage)}>
                <Image className='large-image rounded-lg' src={activeImage as string | ""} width={400} height={400} alt="Larger image size of the product"/>
              </div>

          </div>
          {/* Product info */}
          <div className="product-info w-[50%] h-[60%] ml-[5%] flex flex-col justify-between items-center text-center">
            <div>
              <h2 className="text-[1.55em] w-[90dvw] font-semibold">{product?.productName}</h2>
              <p className="my-1 text-[1.25em] py-3">{product?.manufacturer}</p>
            </div>

              <div className="current-product-btns-price-wrapper">
                <div className="current-product-price-wrapper">
                  <p className="current-product-price my-1 text-[1.25em] py-3">{product?.productPrice}€</p>
                  <p className="current-product-stock my-1 text-[1.25em] py-3">In stock: {product?.quantity}</p>
                  <input type="number" className="text-[1em] border-t-0 border-l-0 border-r-0 border-b-[1px] border-gray py-1 focus:border-orange transition-[border] duration-300" style={{outline:'none'}} placeholder='Quantity' value={userQuantity} onChange={e => handleQuantityChange(e)}/>
                  <p className="my-1 text-[.9em] py-4 text-red-600">{error}</p>
                </div>
                <div className="flex flex-col justify-center sm:flex-row sm:w-[95dvw] md:justify-center xl:w-fit 2xl:mt-[10dvh]">
                  {/* Add to cart and remove from cart code for unauthenticated users */}
                  {
                    session.status === "unauthenticated" && !(localStorageCart && localStorageCart.some((localStorageProduct:any) => localStorageProduct.productDocId === productDocId)) ?
                    <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" disabled={error ? true : false} onClick={async () => {
                        const res = await addToCart(false, productDocId as string, userQuantity, false)
                        if(res){
                          setLocalStorageCart(JSON.parse(localStorage.getItem('localCart') as string))
                        }
                      }}>Add to cart
                    <svg className='w-5 h-5 fill-white mx-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button> 
                    : session.status === 'unauthenticated' && localStorageCart.some((localStorageProduct:any) => localStorageProduct.productDocId === productDocId) ?
                  <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                      const res = await removeFromCart(undefined, productDocId as string)
                      if(res){
                          setLocalStorageCart(JSON.parse(localStorage.getItem('localCart') as string))
                      }
                    }}>Remove from cart
                    <svg className='w-5 h-5 fill-white mx-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button>
                  :
                  <></>
                  }

                  {/* Add to cart and remove from cart code for authenticated users */}
                  {session.status !== "unauthenticated" && !isProductInLists.cart ?
                  <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" disabled={error ? true : false} onClick={async () => {
                      const res = await addToCart(true, productDocId as string, userQuantity, false)
                      if(res){
                          setShowSpinner(true)
                          session.update()
                          await checkUserLists()
                          setTimeout(() => setShowSpinner(false), 100)
                      } 
                    }}>Add to cart
                    <svg className='w-5 h-5 fill-white mx-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button> : session.status === "authenticated" &&
                  
                  <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                      const res = await removeFromCart(session?.data?.user.userDocId, productDocId as string)
                      if(res){
                        setShowSpinner(true)
                          session.update()
                          await checkUserLists()
                          setTimeout(() => setShowSpinner(false), 100)
                      } 
                      
                    }}>Remove from cart
                    <svg className='w-5 h-5 fill-white mx-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button>
                  }

                  {/* Add to  and remove from wishlist code for unauthenticated users */}
                  {session.status === "unauthenticated" && !(localStorageWishlist && localStorageWishlist.some((product:any) => product.productDocId === productDocId)) ?
                    <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                        const res = await addToWishlist(false, productDocId as string, false)
                        if(res){
                          setLocalStorageWishlist(JSON.parse(localStorage.getItem('localWishList') as string))
                        }
                      }}>Add to wishlist
                      <svg className="w-5 h-5 fill-white mx-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    : session.status === "unauthenticated" && localStorageWishlist && localStorageWishlist.some((product:any) => product.productDocId === productDocId) ? 
                    <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                        const res = await removeFromWishlist(undefined, productDocId as string)
                        if(res){
                          setLocalStorageWishlist(JSON.parse(localStorage.getItem('localWishList') as string))
                        }
                      }}>Remove from wishlist
                      <svg className="w-5 h-5 fill-white mx-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    :
                    <></>
                    }

                  {/* Add to  and remove from wishlist code for authenticated users */}
                  {session.status !== "unauthenticated" && !isProductInLists.wishlist ?
                    <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex items-center justify-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                        const res = await addToWishlist(true, productDocId as string, false)
                        if(res){
                          setShowSpinner(true)
                          session.update()
                          await checkUserLists()
                          setTimeout(() => setShowSpinner(false), 100)
                        }
                      }}>Add to wishlist
                      <svg className="w-5 h-5 fill-white mx-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    : session.status !== "unauthenticated" &&
                    <button className="text-[1em] mx-1 text-center cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex justify-center items-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]" onClick={async () => {
                        const res = await removeFromWishlist(session?.data?.user.userDocId as string, productDocId as string)
                        if(res){
                          setShowSpinner(true)
                          session.update()
                          await checkUserLists()
                          setTimeout(() => setShowSpinner(false), 100)
                        }
                      }}>Remove from wishlist
                      <svg className="w-5 h-5 fill-white mx-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    }
                    <button className="text-[1em] mx-1 cursor-pointer bg-orange text-white border-none rounded-lg p-3 my-1 flex justify-center items-center transition-all duration-300 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange 2xl:text-[1.25em]"
                      onClick={async () => {
                        if(product){
                          const stripePaymentUrl = await placeOrder([{...product, desiredQuantity:userQuantity}])
                          router.push(stripePaymentUrl)
                        }
                      }}
                    >
                      Order Now
                      <Image className="w-5 h-5 fill-white mx-2" src={checkmark} width={64} height={64} alt="Checkmark"/>
                    </button>
                </div>
              </div>
          </div>
      </div>
      <ProductReviews productId={productDocId as string}/>
    </div>
  )
}