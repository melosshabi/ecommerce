import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function CartList({productsArray} : CartListProps) {

  const [productsData, setProductsData] = useState<Array<Product>>([])
  useEffect(() =>{
    async function fetchProduct(id:string){
      const res = await fetch(`http://localhost:3000/api/productDetails?_id=${id}`)
      const data = await res.json()
      setProductsData(prev => [...prev, {...data}])
    }
    for(let i = 0; i < productsArray.length; i++){
      fetchProduct(productsArray[i].productDocId)
    }
    return () => fetchProduct('')
  }, [])

  return (
    <div className='cart-list'>
      {
        productsData.map((product:Product, index:number) => (
          <div className="cart-item" key={index}>
            <div className="cart-item-image">
              <Image src={product.pictures[0] as string} width={30} height={30} alt="Cart item image"/>
            </div>
            <p>{product.productName}</p>
          </div>
        ))
      }
    </div>
  )
}
