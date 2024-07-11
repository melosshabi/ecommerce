"use client"
import React, { useEffect, useState } from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'
import CartWishlistButtons from '../components/CartWishlistButtons'
import '../styles/searchResults.css'

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
        <div className="search-results-page">
            <h2>Search results for: {query}</h2>
            <div className="search-results">
                {searchedProducts.map((product,index) => {
                    return (
                        <div className='searched-product' key={index}>
                        <Link href={`${process.env.NEXT_PUBLIC_URL}/productDetails?_id=${product._id}`}>
                            <div className='searched-product-img-wrapper'>
                                <img className='searched-product-img' src={product.pictures[0]}/>
                            </div>
                            <div className='searched-product-details'>
                                <h3>{product.productName}</h3>
                                <h4>{product.manufacturer}</h4>
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
