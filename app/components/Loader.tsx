import React from 'react'
import '../styles/loader.css'

export default function Loader({displayLoader} : {displayLoader:boolean}) {
  return (
    <div style={{display:displayLoader ? 'block' : 'none'}} className='loader'></div>
  )
}
