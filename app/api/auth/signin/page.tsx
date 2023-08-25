"use client"
import React, { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import '../../../styles/signin.css'
import Loader from '@/app/components/Loader'

export default function SignIn() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authInProgress, setAuthInProgress] = useState<boolean>(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    setAuthInProgress(true)
    await signIn('credentials', {
      username,
      password,
      redirect:true,
      callbackUrl:'/'
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
                <input required type="text" placeholder="Username" className="sign-in-inputs username-input" value={username} onChange={e => setUsername(e.target.value)}/>
              </div>

              <div className='inputs-wrappers'>
                <label>Password</label>
                <input required type="password" placeholder="Password" className='sign-in-inputs username-input' value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
            </div>
          <button className='submit-sign-in-form-btn'>{!authInProgress ? 'Sign In' : <Loader/>}</button>
        </form>
      </div>
    </div>
  )
}
