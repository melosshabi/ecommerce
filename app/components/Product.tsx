import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CartWishListButtons from './CartWishlistButtons'

interface HomePageProduct extends Product {
    // _doc: any
    index:number,
}
export default function Product({productData}: {productData:HomePageProduct}) {
  return (
    // Product
    <div className="w-full bg-white p-4 my-3 rounded-lg shadow-[0_0_5px_black] flex flex-col items-center justify-between cursor-pointer transition-all duration-300 text-center hover:shadow-[0_0_20px_black]
                    sm:w-[95%] lg:w-[90%] 2xl:w-[80%]
                  " key={productData.index}>
            <Link href={`/productDetails/?_id=${productData._id}`} className='product-link flex justify-center items-center flex-col hover:underline'>
              <div className="product-image-wrapper">
                <Image className='w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]' src={productData.pictures[0] as string} width={300} height={300} alt="Main image of a product"/>
              </div>
              <p className='mt-1 md-1'>{productData.productName}</p>
              <p className='mt-1 md-1'>{productData.productPrice}€</p>
            </Link>
            <CartWishListButtons productId={productData._id.toString()}/>
    </div>
  )
}
