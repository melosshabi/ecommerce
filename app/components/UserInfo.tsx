import React, { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import userIcon from '../images/user.png'
import { useRouter } from 'next/navigation'

export default function UserInfo({username, email, profilePictureUrl}:UserInfo) {

  const router = useRouter()
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
      setPictureFile(e.target.files[0])
      getSelectedImageUrl(e.target.files[0])
    }
  }

  // This function returns the extension of a file
  function getExtension(filename:string){
    const parts = filename.split('.')
    return parts[parts.length - 1]
  }
  // This function runs when an image is selected and extracts the url of that image that will then be used to show a preview of that image
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

    if (pictureFile) formData.set('profilePicture', pictureFile)
    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUser`, {
      method:"PATCH",  
      body:formData
    })

    const response = await req.json()
    if(response.messageCode === "account-updated"){
      setUpdateInProgress(false)
      const alert = document.querySelector('.acc-updated-alert') as HTMLDivElement
      alert.classList.add('bottom-4')
      alert.classList.remove('bottom-[-10dvh]')
      setTimeout(() => {
        alert.classList.remove('bottom-4')
        alert.classList.add('bottom-[-10dvh]')
        setTimeout(() => router.push('/api/auth/signin'), 1000)
      }, 3000)
    }
  }

  return (
    <div className='mt-5'>
      <div>
        <div className='my-4 flex flex-col w-[90%] m-auto'>
          <label className='my-2'>Username</label>
          <input className='rounded-md p-2 border transition-all duration-100 focus:border-orange' style={{outline:'none'}} value={newUsername} onChange={e => setNewUsername(e.target.value)}/>
        </div>

        <div className='my-4 flex flex-col w-[90%] m-auto'>
        <label className='my-2'>Email</label>
          <input className='rounded-md p-2 border transition-all duration-100 focus:border-orange' style={{outline:'none'}} value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
        </div>
      </div>
      {
        !localPictureUrl ? <Image className="m-auto my-6 block" width={100} height={100} src={profilePictureUrl ? profilePictureUrl : userIcon} alt="Profile picture of the signed in user"/>
        : <Image width={100} height={100} className="m-auto my-6 block" src={localPictureUrl} alt="Preview of the newly selected picture"/>
      }
      <input onChange={e => handleFileChange(e)} id="file-input" type="file" style={{display:'none'}} accept="image/*"/>
      <button className="block m-auto my-4 bg-orange text-white rounded-lg text-[1.2em] py-2 px-4 transition-all duration-200 hover:bg-darkerOrange" onClick={openImagePicker}>Select a new picture</button>
      <button className='block m-auto my-4 bg-orange text-white rounded-lg text-[1.2em] py-2 px-4 transition-all duration-200 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:bg-orange disabled:opacity-70' disabled={updateInProgress} onClick={handleSubmit}>{!updateInProgress ? "Save" : "Saving"}</button>
    </div>
  )
}