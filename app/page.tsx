import getProducts from '@/lib/getProducts'
import ImageSlider from './components/ImageSlider'
import Product from './components/Product'
import './styles/app.css'
import React from 'react'

export const revalidate = 10

export default async function Home() {
  const productsPromise: Promise<Product[]> = getProducts()
  const products = await productsPromise
  return (
    <main className='home'>
      
      <ImageSlider/>

      <div className="products">
        {
          products.map((product, index) => (
            <React.Fragment>
              {/* @ts-ignore */}
              <Product productData={{...product._doc, index}}/>
            </React.Fragment>
          ))
        }
      </div>
    </main>
  )
}
