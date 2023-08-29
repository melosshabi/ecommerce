import Image from 'next/image'
import zFlip from './images/z-flip.jpg'
import iphone from './images/iphone.jpg'
import './styles/app.css'
import getProducts from '@/lib/getProducts'

export default async function Home() {
  const productsPromise: Promise<Products[]> = getProducts()
  const products = await productsPromise
  console.log("Products", products)
  return (
    <main className='home'>
      <div className="image-slider">
        <Image src={zFlip} className='header-images' alt="Home image"/>
        {/* <Image src={iphone} className='header-images' alt="Home image"/> */}
      </div>

      <div className="products">
        {
          products.map((product, index) => (
            <div className="product" key={index}>
              <p>{product.productName}</p>
            </div>
          ))
        }
      </div>
    </main>
  )
}
