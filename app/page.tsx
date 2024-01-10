import Image from 'next/image'
import getProducts from '@/lib/getProducts'
import Link from 'next/link'
import ImageSlider from './components/ImageSlider'
import './styles/app.css'

export default async function Home() {
  const productsPromise: Promise<Product[]> = getProducts()
  const products = await productsPromise
  return (
    <main className='home'>
      
      <ImageSlider/>

      <div className="products">
        {
          products.map((product, index) => (
            <div className="product" key={index}>
            <Link href={`productDetails/?_id=${product._id}`} style={{textDecoration:'none'}} className='product-link'>
              <div className="product-image-wrapper">
                <Image className='home-product-image' src={product.pictures[0] as string} width={300} height={300} alt="Main image of a product"/>
              </div>
              <p className='product-name'>{product.productName}</p>
              <p className='product-price'>{product.productPrice}€</p>
            </Link>
            </div>
          ))
        }
      </div>
    </main>
  )
}
