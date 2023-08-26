"use client"
import React, { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import Loader from '@/app/components/Loader'
import {useRouter} from 'next/navigation'
import '../../../styles/signin.css'

export default function SignIn() {

  const router = useRouter()

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
      }else if(res?.error === 'incorrect-password'){
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
      
        <h2>Welcome Back!</h2>
        <form className="sign-in-form" onSubmit={e => handleSubmit(e)}>
            <div style={{display:'flex', flexDirection:'column', width:'50%', height:'fit-content'}}>
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
          <button className='submit-sign-in-form-btn'>{!authInProgress ? 'Sign In' : <Loader/>}</button>
        </form>
      </div>
    </div>
  )
}
