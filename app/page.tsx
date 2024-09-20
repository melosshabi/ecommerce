import getProducts from '@/lib/getProducts'
import ImageSlider from './components/ImageSlider'
import Product from './components/Product'
import React from 'react'

export const revalidate = 10

export default async function Home() {
  const productsPromise: Promise<Product[]> = getProducts()
  const products = await productsPromise
  return (
    <main className="min-h-[100dvh] flex flex-col items-center bg-lightGray font-work-sans">
      
      <ImageSlider/>

      <div className="w-full grid grid-cols-[48%_48%] justify-around sm:grid-cols-[32%_32%_32%] justify-items-center lg:grid-cols-[33%_33%_33%] xl:grid-cols-[23%_23%_23%_23%] 2xl:grid-cols-[20%_20%_20%_20%]">
        {
          products.map((product, index) => (
            <React.Fragment key={index}>
              {/* @ts-ignore */}
              <Product productData={{...product._doc, index}}/>
            </React.Fragment>
          ))
        }
      </div>
    </main>
  )
}
