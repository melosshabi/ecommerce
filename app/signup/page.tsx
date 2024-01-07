"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import '../styles/signup.css'
import Loader from '@/app/components/Loader'
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

    const res = await fetch(`${process.env.reqUrl}api/signup`, {
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
    <div className='sign-up-page'>    
      <div className="form-wrapper">
      
        <h2>Welcome!</h2>
        <form className="sign-up-form" onSubmit={e => handleSubmit(e)}>
         {/* Inputs container is the parent element of all the divs with the class of 'inputs-wrappers='  */}
            <div className="inputs-container" style={{display:'flex', flexDirection:'column', height:'fit-content'}}>
              <div className='inputs-wrappers'>
                <label>Username</label>
                <input name="username" required type="text" placeholder="Username" className="sign-up-inputs username-input" value={formData.username} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>

              <div className='inputs-wrappers'>
                <label>Email</label>
                <input name="email" required type="email" placeholder="Email" className="sign-up-inputs email-input" value={formData.email} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>

              <div className='inputs-wrappers'>
                <label>Password</label>
                <input name="password" required type="password" placeholder="Password" className='sign-up-inputs username-input' value={formData.password} onChange={e => handleChange(e.target.name, e.target.value)}/>
              </div>
              {error?.errorCode && <p className='error'>{error.errorMessage}</p>}
            </div>            
          <button className='submit-sign-up-form-btn' disabled={authInProgress}>{!authInProgress ? 'Sign Up' : <ButtonLoader/>}</button>
        </form>
      </div>
    </div>
  )
}
