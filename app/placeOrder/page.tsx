"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import '../styles/placeOrder.css'
import { useSession } from 'next-auth/react'

export default function PlaceOrder() {

    const session = useSession()
    const router = useRouter()

    useEffect(() => {
      if(session.status === 'unauthenticated'){
        router.push('/')
      }
    }, [session])
    const searchParams = useSearchParams()
    const productDocId = searchParams.get('_id')
    const chosenQuantity = searchParams.get('desiredQuantity')
    const [product, setProduct] = useState<Product | undefined>()

    useEffect(() => {
        (async function fetchProductDetails(){
            const res = await fetch(`http://localhost:3000/api/productDetails?_id=${productDocId}`)
            const data = await res.json()
            if(!data){
                router.push('/')
            }
            setProduct(data)
        }())
    }, [])
    
    const [cardNumber, setCardNumber] = useState<string>("")
    const [expirityMonth, setExpirityMonth] = useState<string>("")
    const [expirityYear, setExpirityYear] = useState<string>("")
    const [cvv, setCvv] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [billingAddress, setBillingAddress] = useState<string>("")
    const [billingAddress2, setBillingAddress2] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")

    async function placeOrder(e:FormEvent<HTMLFormElement>){
      e.preventDefault()
      const res = await fetch('http://localhost:3000/api/placeOrder', {
        method:"POST",
        body:JSON.stringify({
          productDocId,
          desiredQuantity:chosenQuantity,
          cardNumber,
          expirityMonth,
          expirityYear,
          cvv,
          firstName,
          lastName,
          billingAddress,
          billingAddress2,
          phoneNumber,
          city,
          zipCode
        })
      })
      console.log(await res.json())
    }

  return (
    <div className="order-page">
      <h2>Order form for: {product?.productName}</h2>
      <div className='product-payment-form-wrapper'>
        
        <div className="product-wrapper">
          <div className="product-image-wrapper">
            <Image width={200} height={200} src={product?.pictures[0] as string} alt="The product the user wants to buy"/>
          </div>

          <div className="product-details-wrapper">
            <p>Product: {product?.productName}</p>
            {product?.brandName && <p>Brand: {product?.brandName}</p>}
            <p>Price: {product?.productPrice}€</p>
            <p>Quantity: {chosenQuantity}</p>
            <p>Total: {product?.productPrice as number * parseInt(chosenQuantity as string)}€</p>
          </div>
        </div>

        <form className="payment-form" onSubmit={e => placeOrder(e)}>
          <h3>Payment and Billing</h3>

          {/* Payment Information */}
          <div className="payment-info">
            <div className='card-number'>
              <input className="card-number-input" type="text" placeholder="Card Number" required value={cardNumber} onChange={e => setCardNumber(e.target.value)}/>
            </div>

            <div className='other-card-info'>
              {/* The month in which the card expires */}
              <select className='select-inputs' onChange={e => setExpirityMonth(e.target.value)} required>
                <option value="palceholder">Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>

              {/* The year in which the card expires */}
              <select className='select-inputs' onChange={e => setExpirityYear(e.target.value)} required>
                <option value="palceholder">Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
                <option value="2031">2031</option>
                <option value="2032">2032</option>
                <option value="2033">2033</option>
                <option value="2034">2034</option>
              </select>

              {/* CVV */}
              <input min={111} max={999} className="cvv-input" type="number" placeholder='CVV' value={cvv} onChange={e => setCvv(e.target.value)} required/>
            </div>
          </div>

          {/* Billing Information */}
          <div className="billing-info">
              <div className="billing-info-left">
                <input type="text" placeholder='First Name' required value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="text" placeholder='Last Name' required value={lastName} onChange={e => setLastName(e.target.value)}/>
                <input type="text" placeholder='Billing Address' required value={billingAddress} onChange={e => setBillingAddress(e.target.value)}/>
                <input type="text" placeholder='Billing Address 2' value={billingAddress2} onChange={e => setBillingAddress2(e.target.value)}/>
                <input type="text" placeholder='Phone Number' required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
              </div>
              <div className="billing-info-right">
                <input type="text" placeholder='City' value={city} onChange={e => setCity(e.target.value)} />
                <input type="text" placeholder='Zip Code' value={zipCode} onChange={e => setZipCode(e.target.value)}/>
              </div>
          </div>
          <button className="submit-order-btn">Place Order</button>
        </form>
      </div>
    </div>
  )
}