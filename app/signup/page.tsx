"use client"
import React, { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import '../styles/signup.css'
import Loader from '@/app/components/Loader'

export default function SignUp() {

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [authInProgress, setAuthInProgress] = useState<boolean>(false)
  const [error, setError] = useState<signUpError>()

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    setAuthInProgress(true)

    const res = await fetch('http://localhost:3000/api/signup', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({username, email, password})
    })
    const data = await res.json()
    if(data.errorCode === "username-taken"){
      setAuthInProgress(false)
      setError({
        errorMessage:data.errorMessage,
        errorCode:data.errorCode
      })
      document.querySelector('.username-input')?.classList.add('red-border')
      return
    }
  }

  return (
    <div className='sign-up-page'>    
      <div className="form-wrapper">
      
        <h2>Welcome!</h2>
        <form className="sign-up-form" onSubmit={e => handleSubmit(e)}>
            <div style={{display:'flex', flexDirection:'column', width:'50%', height:'fit-content'}}>
              <div className='inputs-wrappers'>
                <label>Username</label>
                <input required type="text" placeholder="Username" className="sign-up-inputs username-input" value={username} onChange={e => setUsername(e.target.value)}/>
              </div>

              <div className='inputs-wrappers'>
                <label>Email</label>
                <input required type="email" placeholder="Username" className="sign-up-inputs username-input" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>

              <div className='inputs-wrappers'>
                <label>Password</label>
                <input required type="password" placeholder="Password" className='sign-up-inputs username-input' value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
              {error?.errorCode && <p className='error'>{error.errorMessage}</p>}
            </div>            
          <button className='submit-sign-up-form-btn'>{!authInProgress ? 'Sign Up' : <Loader/>}</button>
        </form>
      </div>
    </div>
  )
}
