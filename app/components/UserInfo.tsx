import React, { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import userIcon from '../images/user.png'

export default function UserInfo({userId, username, email, profilePictureUrl}:UserInfo) {

  const [newUsername, setNewUsername] = useState<string>(username)
  const [newEmail, setNewEmail] = useState<string>(email)
  const [pictureFile, setPictureFile] = useState<any>(undefined)
  // The picture url selected by the user
  const [localPictureUrl, setLocalPictureUrl] = useState<string | undefined>(undefined)
  const [updateInProgress, setUpdateInProgress] = useState<boolean>(false)

  function openImagePicker(){
    // @ts-ignore
    document.querySelector('#file-input')?.click()
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files){
      console.log("File", e.target.files[0])
      setPictureFile(e.target.files[0])
      getSelectedImageUrl(e.target.files[0])
    }
  }

  // This function returns the extension of a file
  function getExtension(filename:string){
    const parts = filename.split('.')
    return parts[parts.length - 1]
  }
  // This function fires when an image is selected and extracts the url of that image that will then be used to show a preview of that image
  function getSelectedImageUrl(file:File){
    const extension = getExtension(file.name)
    const fileReader = new FileReader()
    switch(extension.toLowerCase()){
      case 'jpg':
        fileReader.onload = e => setLocalPictureUrl(e.target?.result as string)
        fileReader.readAsDataURL(file)
        break;
      case 'jpeg':
        fileReader.onload = e => setLocalPictureUrl(e.target?.result as string)
        fileReader.readAsDataURL(file)
        break;
  }}

  async function handleSubmit(){

    setUpdateInProgress(true)

    const formData = new FormData()
    formData.set('newUsername', newUsername)
    formData.set('newEmail', newEmail)
    formData.set('profilePicture', pictureFile)
    formData.set('userId', userId)
    const req = await fetch('http://localhost:3000/api/updateUser', {
      method:"PATCH",  
      body:formData
    })

    const response = await req.json()
    if(response.messageCode === "account-updated"){
      setUpdateInProgress(false)
      const alert = document.querySelector('.account-updated-alert')
      alert?.classList.add('active-updated-alert')
      setTimeout(() => alert?.classList.remove('active-updated-alert'), 5000)
      window.location.reload()
    }
  }

  return (
    <div className='user-info-wrapper'>

      <div className="user-info-inputs-wrapper">

        <div className='user-info-label-wrappers'>
          <label>Username</label>
          <input className='user-info-inputs' value={newUsername} onChange={e => setNewUsername(e.target.value)}/>
        </div>

        <div className='user-info-label-wrappers'>
        <label>Email</label>
          <input className='user-info-inputs' value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
        </div>
      </div>
      {
        !localPictureUrl ? <Image className="profilePicture" width={100} height={100} src={profilePictureUrl ? profilePictureUrl : userIcon} alt="Profile picture of the signed in user"/>
        : <Image width={100} height={100} className="profilePicture" src={localPictureUrl} alt="Preview of the newly selected picture"/>
      }
      <input onChange={e => handleFileChange(e)} id="file-input" type="file" style={{display:'none'}} accept="image/*"/>
      <button className="select-new-picture-btn" onClick={openImagePicker}>Select a new picture</button>
      <button className='update-info-btn' disabled={updateInProgress} onClick={handleSubmit}>{!updateInProgress ? "Update" : "Updating"}</button>
    </div>
  )
}