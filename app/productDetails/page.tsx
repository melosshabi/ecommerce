"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import addToWishlist from '@/lib/addToWishlist'
import removeFromWishlist from '@/lib/removeFromWishlist'
import '../styles/productPage.css'
import removeFromCart from '@/lib/removeFromCart'
import addToCart from '@/lib/addToCart'

export default function ProductDetails() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const productDocId = searchParams.get('_id')
  const [product, setProduct] = useState<Product | undefined>(undefined)
  // This variable holds the url of the large image that is displayed on the right side of the image sidebar
  const [activeImage, setActiveImage] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchProduct(){
      const res = await fetch(`http://localhost:3000/api/productDetails?multiple=false&_id=${productDocId}`)
      const product = await res.json()
      if(!product){
        router.push('/')
      }
      setProduct(product)
      setActiveImage(product.pictures[0])
    }
    fetchProduct()
  },[])
  
  function handleImageChange(index:number){
    const buttons = document.querySelectorAll('.product-image-btns')
    buttons.forEach(button => button.classList.remove('active-product-image-btn'))
    buttons[index].classList.add('active-product-image-btn')
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

  const fullscreenActions = {
    show:'show',
    close:'close'
  }
  function toggleFullscreenImage(action:string, url?:string){
    if(action === fullscreenActions.show && url){
      document.querySelector('.fullscreen-image')?.classList.add('active-fullscreen-image')
      setFullscreenImage(url)
      return
    }
    document.querySelector('.fullscreen-image')?.classList.remove('active-fullscreen-image')
    setFullscreenImage('')
  }

  const actions = {
    prev:'prev',
    next:'next'
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

  const session = useSession()
 
  return (
    <div className='product-page'>
      <div className="fullscreen-image">
        <button className="switch-fullscreen-image-btns close-fullscreen-image-btn" onClick={() => toggleFullscreenImage(fullscreenActions.close)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </button>
        <button className="switch-fullscreen-image-btns prev-img-btn" onClick={() => changeFullscreenImage(actions.prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </button>
        <Image src={fullscreenImage} width={800} height={800} alt="Fullscreen image of the product"/>
        <button className="switch-fullscreen-image-btns next-img-btn" onClick={() => changeFullscreenImage(actions.next)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </button>
      </div>
      <div className="product-details">
        {/* Images */}
          <div className="product-images-wrapper">
            <div className="images-sidebar">
              {product && 
                product.pictures.map((picture, index) => {
                  if(index === 0){
                    return(
                    <button onClick={() => handleImageChange(index)} className='product-image-btns active-product-image-btn' key={index}>
                      <Image className="product-images" src={picture as string} alt="Pictures of the product" width={100} height={100}/>
                    </button>
                    )
                  }
                    return (
                      <button onClick={() => handleImageChange(index)} className='product-image-btns' key={index}>
                      <Image className="product-images" src={picture as string} alt="Pictures of the product" width={100} height={100}/>
                    </button>
                    )
                  })
              }
            </div>

              <div className="large-image-wrapper" title="Click to view in fullscreen" onClick={() => toggleFullscreenImage(fullscreenActions.show, activeImage)}>
                <Image className='large-image' src={activeImage} width={400} height={400} alt="Larger image size of the product"/>
              </div>

          </div>
          {/* Product info */}
          <div className="product-info">
            <div>
              <h2 className='current-product-name'>{product?.productName}</h2>
              <p className="current-product-manufacturer">{product?.manufacturer}</p>
            </div>

              <div className="current-product-btns-price-wrapper">
                <div className="current-product-price-wrapper">
                  <p className="current-product-price">{product?.productPrice}€</p>
                  <p className="current-product-stock">In stock: {product?.quantity}</p>
                  <input type="number" className="amount-selector-input" placeholder='Quantity' value={userQuantity} onChange={e => handleQuantityChange(e)}/>
                  <p className="error">{error}</p>
                </div>
                <div className="current-product-btns-wrapper">

                  {!session.data?.user.cart.some((product:any) => product.productDocId === productDocId) ?
                  <button className="current-product-btns" disabled={error ? true : false} onClick={() => addToCart(session.data?.user.userId, productDocId as string, userQuantity, false)}>Add to cart
                    <svg className='current-product-icons cart-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button> :
                  
                  <button className="current-product-btns" onClick={() => removeFromCart(session.data.user.userId, productDocId as string)}>Remove from cart
                    <svg className='current-product-icons cart-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </button>
                  }

                  {!session.data?.user.wishlist.some((product:any) => product.productDocId === productDocId) ?
                    <button className="current-product-btns" onClick={() => addToWishlist(session?.data?.user?.userId as string, productDocId as string)}>Add to wishlist
                      <svg className="current-product-icons heart-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    :
                    <button className="current-product-btns" onClick={() => removeFromWishlist(session.data.user.userId, productDocId as string)}>Remove from wishlist
                      <svg className="current-product-icons heart-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    </button>
                    }
                </div>
              </div>

          </div>

      </div>
    </div>
  )
}
