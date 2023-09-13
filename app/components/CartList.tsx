import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import parseMonth from '@/lib/parseMonth'
import plus from '../images/plus.svg'
import minus from '../images/minus.svg'

export default function CartList({productsArray} : CartListProps) {

  // The array that holds the product IDs that are in the user's cart
  const productDocIDs = useRef<string[]>([])
  productDocIDs.current = productsArray.map(product => product.productDocId)
  // The array that will hold the products data fetched from the database
  const [cartItems, setCartItems] = useState<Array<CartProducts>>([])
  
  useEffect(() =>{

    const controller = new AbortController()

    async function fetchProduct(docId:string, dateAddedToCart:string, desiredQuantity:number){ 
      try{
        const res = await fetch(`http://localhost:3000/api/productDetails?_id=${docId}`, {signal:controller.signal})
        const data = await res.json()
        setCartItems(prev => [...prev, {...data, desiredQuantity, dateAddedToCart: new Date(dateAddedToCart)}])
      }catch(err:any){
        console.log(err)
        if(err.name === "AbortError") console.log("fetch request aborted")
      }
    }

    for(let i = 0; i < productsArray.length; i++){
      fetchProduct(productsArray[i].productDocId, productsArray[i].dateAdded, productsArray[i].desiredQuantity)
    }
    return () => controller.abort()
  }, [])

  return (
    <div className='cart-list'>
      {
       cartItems.map((item, index) =>  {

        const dateAddedToCart = new Date(item.dateAddedToCart)
        const year = dateAddedToCart.getFullYear()
        const month = parseMonth(dateAddedToCart.getMonth())
        const day = dateAddedToCart.getDate()
        const hours = dateAddedToCart.getHours()
        const minutes = dateAddedToCart.getMinutes()

        return (
            <div className="cart-item" key={index}>
              <div className="cart-item-image-wrapper">
              <Image className="cart-item-image" src={item.pictures[0] as string} width={200} height={200} alt="Cart item image"/>
            </div>

            <div className='cart-item-details-wrapper'>
              <a href={`/productDetails?_id=${item._id}`} className="cart-item-details">
                <p>{item.productName}</p>
                <p>{item.brandName}</p>
                <p>{item.productPrice}€</p>
              </a>

              <div className="quantity-wrapper">
                <button className='quantity-btns'>
                  <Image className='quantity-icons' src={plus} width={50} height={50} alt="Plus icon"/>
                </button>
                <input type="number" className='quantity-input' value={item.desiredQuantity} />
                <button className='quantity-btns'>
                  <Image className='quantity-icons' src={minus} width={50} height={50} alt="Minus icon"/>
                </button>
              </div>
              <span className='date-added-to-cart'>{`${day} ${month} ${year} ${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`}</span>
            </div>

            </div>
          )}
        )
      }
    </div>
  )
}
