"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import ButtonLoader from '@/app/components/ButtonLoader'
import decorationImg from '../../../images/decoration.svg'
import Image from 'next/image'
import '@/app/styles/signin.css'

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
      document.querySelector('.sign-in-username-input')?.classList.remove('red-border')
      setError('')
    }else{
      document.querySelector('.sign-in-password-input')?.classList.remove('red-border')
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
    }).then(res => {
      if(res?.error === 'username-not-found'){
        setError('Username not found')
        setAuthInProgress(false)
        document.querySelector('.sign-in-username-input')?.classList.add('red-border')
      }else if(res?.error === "CredentialsSignin"){
        setError("Incorrect Password")
        setAuthInProgress(false)
        document.querySelector('.sign-in-password-input')?.classList.add('red-border')
      }else{
        router.push('/')
      }
    })
  }

  return (
    <div className='sign-in-page'>    
      <div className="form-wrapper">
        <div className='decoration-img-wrapper'>
          <Image className="decoration-img" src={decorationImg} width={1500} height={1500} alt="Decoration image"/>
        </div>
        <div>
        
          <form className="sign-in-form" onSubmit={e => handleSubmit(e)}>
            <h2>Welcome Back!</h2>
              <div className="inputs-container" style={{display:'flex', flexDirection:'column', height:'fit-content'}}>
                <div className='inputs-wrappers'>
                  <label>Username</label>
                  <input required name="username" type="text" placeholder="Username" className="sign-in-inputs sign-in-username-input" value={formData.username} onChange={e => handleChange(e.target.name, e.target.value)}/>
                </div>

                <div className='inputs-wrappers'>
                  <label>Password</label>
                  <input required name="password" type="password" placeholder="Password" className='sign-in-inputs sign-in-password-input' value={formData.password} onChange={e => handleChange(e.target.name, e.target.value)}/>
                </div>
                {error && <p className="error">{error}</p>}
              </div>
            <button className='submit-sign-in-form-btn'>{!authInProgress ? 'Sign In' : <ButtonLoader/>}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
