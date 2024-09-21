"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import ButtonLoader from '@/app/components/ButtonLoader'

export default function SignIn() {

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session.status === 'authenticated') router.push('/')
  },[session])
  const [formData, setFormData] = useState({
    username:'',
    password:''
  })
  const [authInProgress, setAuthInProgress] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  function handleChange(elementName:string, newValue:string){
    setFormData(prev => ({
      ...prev,
      [elementName]:newValue
    }))
    if(error === 'Username not found'){
      document.querySelector('.sign-in-username-input')?.classList.remove('border-red-600')
      document.querySelector('.sign-in-username-input')?.classList.add('border-black')
      setError('')
    }else{
      document.querySelector('.sign-in-password-input')?.classList.remove('border-red-600')
      document.querySelector('.sign-in-password-input')?.classList.add('border-black')
      setError('')
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    setAuthInProgress(true)

    signIn('credentials', {
      username:formData.username,
      password:formData.password,
      redirect:false,
      callbackUrl:'/'
    }).then(res => {
      if(res?.error === 'username-not-found'){
        setError('Username not found')
        setAuthInProgress(false)
        document.querySelector('.sign-in-username-input')?.classList.add('border-red-600')
        document.querySelector('.sign-in-username-input')?.classList.remove('border-black')
      }else if(res?.error === "CredentialsSignin"){
        setError("Incorrect Password")
        setAuthInProgress(false)
        document.querySelector('.sign-in-password-input')?.classList.add('border-red-600')
        document.querySelector('.sign-in-password-input')?.classList.remove('border-black')
      }
    })
  }

  return (
    <div className='mt-[10dvh]'>
          <form className="w-full flex flex-col items-center" onSubmit={e => handleSubmit(e)}>
            <h2 className='my-4 pt-4 text-center text-[2em] font-medium'>Welcome Back!</h2>
              <div className="py-5 flex flex-col items-center w-[80%]">
                <div className='flex flex-col my-6 sm:w-[60%] xl:w-[40%]'>
                  <label className='mb-2'>Username</label>
                  <input className='sign-in-username-input p-2 border-solid border-black border-[1px] rounded-md transition-all duration-100 focus:outline-none focus:shadow-orange focus:shadow-[0_0_5px]' required name="username" type="text" placeholder="Username" value={formData.username} onChange={e => handleChange(e.target.name, e.target.value)}/>
                </div>

                <div className='flex flex-col my-6 sm:w-[60%] xl:w-[40%]'>
                  <label className='mb-2'>Password</label>
                  <input className='sign-in-password-input p-2 border-solid border-black border-[1px] rounded-md transition-all duration-100 focus:outline-none focus:shadow-orange focus:shadow-[0_0_5px]' required name="password" type="password" placeholder="Password" value={formData.password} onChange={e => handleChange(e.target.name, e.target.value)}/>
                </div>
                {error && <p className="text-red-600">{error}</p>}
              </div>
            <button className='submit-sign-in-form-btn bg-orange px-8 py-2 mt-[20%] text-white rounded-lg text-[1.2em] transition-all duration-300 hover:bg-darkerOrange disabled:bg-orange disabled:cursor-not-allowed disabled:opacity-70 md:text-[1.5em] md:px-12 xl:mt-[10%]' disabled={authInProgress}>{!authInProgress ? 'Sign In' : <ButtonLoader/>}</button>
          </form>
    </div>
  )
}
