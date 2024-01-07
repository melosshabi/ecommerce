"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import checkmark from '../images/checkmark.svg'
import Image from 'next/image'
import '../styles/postProduct.css'
import { useRouter } from 'next/navigation'

export default function PostProduct() {

    const router = useRouter()
    const session = useSession()
    const [noBrand, setNobrand] = useState<boolean>(false)
    const [productData, setProductData] = useState<ProductData>({
        productName:'',
        brandName:'',
        noBrand,
        manufacturer:'',
        price:0,
        quantity:0
    })
    
    const [pictures, setPictures] = useState<FileList | null>(null)
    const [uploadInProgress, setUploadInProgress] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    function openImagePicker(){
        // @ts-ignore
        document.querySelector('.pictures-input')?.click()
    }

    function handleInputChange(e:ChangeEvent<HTMLInputElement>){
        setError('')
        setProductData(prev => ({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    function handleFileInputChange(e:ChangeEvent<HTMLInputElement>){
        if(e.target.files?.length && e.target.files?.length > 3){
            alert("Please select 3 pictures at most")
            return
        }
        setPictures(e.target.files)
    }

    async function submitProduct(e:FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(!pictures) {
            alert("Please select at least 1 picture")
            return
        }
        setUploadInProgress(true)
        const formData = new FormData()
        // @ts-ignore
        formData.set('userDocId', session.data?.user?.userDocId)
        // @ts-ignore
        formData.set('userId', session.data?.user?.userId)
        formData.set('productName', productData.productName)
        formData.set('brandName', productData.brandName ? productData.brandName : '')
        formData.set('noBrand', noBrand.toString())
        formData.set('manufacturer', productData.manufacturer)
        formData.set('price', productData.price.toString())
        formData.set('quantity', productData.quantity.toString())
        formData.set('picture1', pictures[0])
        formData.set('picture2', pictures[1])
        formData.set('picture3', pictures[2])

        const req = await fetch(`${process.env.reqUrl}}api/newProduct`, {
            method:"POST",
            body:formData
        })
        const res = await req.json()
        if(res.errorCode === 'incomplete-form'){
            setError(res.errorMessage)
            setUploadInProgress(false)
        }
        console.log(res)
        if(res.messageCode === 'product-created'){
            document.querySelector('.product-created-alert')?.classList.add('active-alert')
            setTimeout(() => router.push('/'), 4500)
        }
    }

  return (
    <div className='post-product-page'>
        <div className="product-form-wrapper">
            <form className='product-form' onSubmit={submitProduct}>

                <div className="inputs-wrappers">
                    <label>Product Name <span className='stars'>*</span></label>
                    <input required type="text" name="productName" value={productData.productName} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="inputs-wrappers">
                    <label>Brand Name <span className='stars'>*</span></label>
                    <input required={!noBrand} className="brand-input" type="text" name="brandName" disabled={noBrand} value={productData.brandName} onChange={e => handleInputChange(e)}/>
                    <div className='brand-checkbox'><input type="checkbox" name="noBrand" onChange={e => setNobrand(e.target.checked)} /><span>This product does not have a brand name</span></div>
                </div>

                <div className="inputs-wrappers">
                    <label>Manufacturer <span className='stars'>*</span></label>
                    <input required type="text" name="manufacturer" value={productData.manufacturer} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="inputs-wrappers">
                    <label>Price €<span className='stars'>*</span></label>
                    <input required type="number" name="price" value={productData.price} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="inputs-wrappers">
                    <label>Quantity<span className='stars'>*</span></label>
                    <input required type="number" name="quantity" value={productData.quantity} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="inputs-wrappers">
                    <label className='pictures-label'>Pictures<span className='pictures-count'>(1-3)</span><span className='stars'>*</span></label>
                    <input required type="file" multiple className='pictures-input' accept='image/*' onChange={e => handleFileInputChange(e)}/>
                    <label className='label-of-file-input' onClick={openImagePicker}>Browse</label>
                    <span>{pictures?.length === undefined ? '0 Pictures Selected' : pictures.length === 1 ? '1 Picture Selected': `${pictures.length} Pictures Selected`}</span>
                </div>
                {error && <span className='error'>{error}</span>}
                <button className="submit-product-btn" disabled={uploadInProgress}>{uploadInProgress ? "Submitting" : "Submit Product"}</button>
            </form>
        </div>
        <div className="product-created-alert">
        <Image src={checkmark} className="checkmark-icon" alt="Green checkmark icon"/><p>Product was posted successfully</p>
        </div>
    </div>
  )
}
