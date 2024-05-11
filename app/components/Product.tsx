import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CartWishListButtons from './CartWishlistButtons'

interface HomePageProduct extends Product {
    // _doc: any
    index:number,
}
export default function Product({productData}: {productData:HomePageProduct}) {
    // const product = productData._doc
    console.log(productData)
  return (
    <div className="product" key={productData.index}>
            <Link href={`productDetails/?_id=${productData._id}`} style={{textDecoration:'none'}} className='product-link'>
              <div className="product-image-wrapper">
                <Image className='home-product-image' src={productData.pictures[0] as string} width={300} height={300} alt="Main image of a product"/>
              </div>
              <p className='product-name'>{productData.productName}</p>
              <p className='product-price'>{productData.productPrice}€</p>
            </Link>
            <CartWishListButtons productId={productData._id}/>
    </div>
  )
}
