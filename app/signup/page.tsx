"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ButtonLoader from '../components/ButtonLoader'

export default function SignUp() {

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session.status === 'authenticated') router.push('/')
  },[session])

  const [formData, setFormData] = useState<signUpData>({
    username:'',
    email:'',
    password:''
  })
  const [authInProgress, setAuthInProgress] = useState<boolean>(false)
  const [error, setError] = useState<signUpError | undefined>(undefined)

  function handleChange(elementName:string, newValue:string){

    const inputs = document.querySelectorAll('.sign-up-inputs')
    inputs.forEach(input => {
      if(input.classList.contains('red-border')){
        input.classList.remove('red-border')
        setError(undefined)
      }
    })

    setFormData(prev => ({
      ...prev,
      [elementName]:newValue
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    setAuthInProgress(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/signup`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    })
    
    const data = await res.json()

    if(data.errorCode === "username-taken"){
      setAuthInProgress(false)
      setError({
        errorMessage:data.errorMessage as string,
        errorCode:data.errorCode
      })
      document.querySelector('.username-input')?.classList.add('red-border')
      return
    }else if(data.errorCode === "email-taken"){
      setAuthInProgress(false)
      setError({
        errorMessage:data.errorMessage,
        errorCode:data.errorCode
      })
      document.querySelector('.email-input')?.classList.add('red-border')
      return
    }else if(data.errorCode === 'incomplete-form'){
      setAuthInProgress(false)
      setError({
        errorMessage:data.errorMessage,
        errorCode:data.errorCode
      })
      return
    }

    await signIn('credentials', {
      username:formData.username,
      password:formData.password,
      redirect:true,
      callbackUrl:'/'
    })
  }

  return (
    <div className='mt-[10dvh]'>
        <form className="w-full flex flex-col items-center" onSubmit={e => handleSubmit(e)}>
        <h2 className='text-center pt-8 mb-8 text-[2em] font-medium'>Welcome!</h2>
         {/* Inputs container is the parent element of all the divs with the class of 'inputs-wrappers' */}
            <div className="flex flex-col items-center w-[100%] sm:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
              <div className='w-[80%] flex flex-col justify-center my-4'>
                <label className='ml-1 mb-2'>Username</label>
                <input className='border-black border-solid border-[1px] p-3 rounded-lg transition-all duration-100 focus:outline-none focus:shadow-orange focus:shadow-[0_0_5px]' name="username" required type="text" placeholder="Username" value={formData.username} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>

              <div className='w-[80%] flex flex-col justify-center my-4'>
                <label className='ml-1 mb-2'>Email</label>
                <input className='border-black border-solid border-[1px] p-3 rounded-lg transition-all duration-100 focus:outline-none focus:shadow-orange focus:shadow-[0_0_5px]' name="email" required type="email" placeholder="Email" value={formData.email} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>

              <div className='w-[80%] flex flex-col justify-center my-4'>
                <label className='ml-1 mb-2'>Password</label>
                <input className='border-black border-solid border-[1px] p-3 rounded-lg transition-all duration-100 focus:outline-none focus:shadow-orange focus:shadow-[0_0_5px]' name="password" required type="password" placeholder="Password" value={formData.password} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>
              {error?.errorCode && <p className='error'>{error.errorMessage}</p>}
            </div>            
          <button className='bg-orange text-white text-[1.3em] py-2 px-12 mt-8 rounded-lg transition-all duration-200 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:opacity-70' disabled={authInProgress}>{!authInProgress ? 'Sign Up' : <ButtonLoader/>}</button>
        </form>
    </div>
  )
}
