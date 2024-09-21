"use client"
import React, { useEffect, useState } from 'react'
import {useSearchParams} from 'next/navigation'
import Link from 'next/link'
import CartWishlistButtons from '../components/CartWishlistButtons'

export default function Search() {
    const params = useSearchParams()
    const query = params.get('query')
    const [searchedProducts, setSearchedProducts] = useState<Product[]>([])
    
    async function search(userQuery:string){
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/searchProducts?userQuery=${userQuery}`)
        const data = await res.json()
        setSearchedProducts(() => [...data.products])
    }
    useEffect(() => {
        search(query as string)
    }, [params])
    return (
        <div className="w-full h-fit mt-[10dvh] pb-1">
            <h2 className="my-5 pt-5 ml-4 font-medium text-xl">Search results for: {query}</h2>
            <div className="grid grid-cols-2 sm:justify-items-center md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {searchedProducts.map((product,index) => {
                    return (
                        <div className='w-[95%] ml-1 mb-5 bg-white shadow-[0_0_5px_black] rounded-lg p-1 text-center flex flex-col justify-between sm:w-3/4' key={index}>
                            <Link className="hover:underline" href={`${process.env.NEXT_PUBLIC_URL}/productDetails?_id=${product._id}`}>
                                <div>
                                    <img className='rounded-lg' src={product.pictures[0]}/>
                                </div>
                                <div className='searched-product-details'>
                                    <h3>{product.productName}</h3>
                                    <p>${product.productPrice}</p>
                                </div>
                            </Link>
                            <CartWishlistButtons productId={product._id}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
