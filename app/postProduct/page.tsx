"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import checkmark from '../images/checkmark.svg'
import Image from 'next/image'
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

        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/newProduct`, {
            method:"POST",
            body:formData
        })
        const res = await req.json()
        if(res.errorCode === 'incomplete-form'){
            setError(res.errorMessage)
            setUploadInProgress(false)
        }
        if(res.messageCode === 'product-created'){
            document.querySelector('.product-created-alert')?.classList.remove('right-[-100%]')
            document.querySelector('.product-created-alert')?.classList.add('right-[10%]')
            setTimeout(() => router.push('/'), 3000)
        }
    }
return (
    <div className='mt-[10dvh] pt-4 px-2 pb-2 relative'>
        <div>
            <form className='flex flex-col items-center' onSubmit={submitProduct}>
                <h2 className='text-medium text-4xl my-10'>Start Selling</h2>
                <div className="my-6 flex flex-col w-[95%] sm:items-center md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <label>Product Name <span className='text-red-600'>*</span></label>
                    <input className="border-b border-gray w-[80%] transition-all duration-100 focus:border-orange" style={{outline:'none'}} required type="text" name="productName" value={productData.productName} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="my-6 flex flex-col w-[95%] sm:items-center md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <label className={`${noBrand && 'opacity-50'}`}>Brand Name <span className='text-red-600'>*</span></label>
                    <input className="border-b border-gray w-[80%] transition-all duration-100 focus:border-orange disabled:cursor-not-allowed disabled:opacity-50" style={{outline:'none'}} required={!noBrand} type="text" name="brandName" disabled={noBrand} value={productData.brandName} onChange={e => handleInputChange(e)}/>
                    <div className='my-4'><input className='mr-1' type="checkbox" name="noBrand" onChange={e => setNobrand(e.target.checked)} /><span>This product does not have a brand name</span></div>
                </div>

                <div className="my-6 flex flex-col w-[95%] sm:items-center md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <label>Manufacturer <span className='text-red-600'>*</span></label>
                    <input className="border-b border-gray w-[80%] transition-all duration-100 focus:border-orange" style={{outline:'none'}} required type="text" name="manufacturer" value={productData.manufacturer} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="my-6 flex flex-col w-[95%] sm:items-center md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <label>Price €<span className='text-red-600'>*</span></label>
                    <input className="border-b border-gray w-[80%] transition-all duration-100 focus:border-orange" style={{outline:'none'}} required type="number" name="price" value={productData.price} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="my-6 flex flex-col w-[95%] sm:items-center md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    <label>Quantity<span className='text-red-600'>*</span></label>
                    <input className="border-b border-gray w-[80%] transition-all duration-100 focus:border-orange" style={{outline:'none'}} required type="number" name="quantity" value={productData.quantity} onChange={e => handleInputChange(e)}/>
                </div>

                <div className="my-6 flex flex-col w-[95%] items-start sm:items-center">
                    <label>Pictures<span className='ml-1'>(1-3)</span><span className='text-red-600'>*</span></label>
                    <input required type="file" multiple className='pictures-input hidden' accept='image/*' onChange={e => handleFileInputChange(e)}/>
                    <button className='bg-orange text-white py-1 px-4 my-5 rounded-lg transition-all duration-200 hover:bg-darkerOrange' onClick={openImagePicker}>Browse</button>
                    <span>{pictures?.length === undefined ? '0 Pictures Selected' : pictures.length === 1 ? '1 Picture Selected': `${pictures.length} Pictures Selected`}</span>
                </div>
                {error && <span className='text-red-600 text-[.9em]'>{error}</span>}
                <button className="bg-orange text-white text-[1.2em] px-8 py-3 mt-5 rounded-lg transition-all duration-200 hover:bg-darkerOrange disabled:hover:bg-orange disabled:cursor-not-allowed" disabled={uploadInProgress}>{uploadInProgress ? "Submitting" : "Submit Product"}</button>
            </form>
        </div>
        <div className="product-created-alert absolute bottom-2 right-[-100%] bg-white shadow-[0_0_5px_black] flex rounded-lg items-center p-2 transition-all duration-300">
        <Image src={checkmark} className="w-12 mr-2" alt="Green checkmark icon"/><p>Product was posted successfully</p>
        </div>
    </div>
  )
}
