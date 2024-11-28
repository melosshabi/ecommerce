import React, { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import userIcon from '../images/user.png'
import checkmark from '../images/checkmark.svg'
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
      console.log(e.target.files)
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
      case 'jpeg':
      case 'png':
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
    <div className='mt-5 overflow-hidden relative rounded-lg shadow-[0_0_5px_black] lg:w-[60dvw] lg:m-0'>
      <div className='sm:w-[60dvw] sm:m-auto md:w-[50dvw] lg:w-[30dvw]'>
        <h2 className="font-medium text-3xl my-4 text-center">Account Information</h2>
        <div className='my-4 flex flex-col w-[90%] m-auto'>
          <label className='my-2'>Username</label>
          <input className='rounded-md p-2 border transition-all duration-100 focus:border-orange' style={{outline:'none'}} value={newUsername} onChange={e => setNewUsername(e.target.value)}/>
        </div>

        <div className='my-4 flex flex-col w-[90%] m-auto'>
        <label className='my-2'>Email</label>
          <input className='rounded-md p-2 border transition-all duration-100 focus:border-orange' style={{outline:'none'}} value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
        </div>
      </div>
      <div className='w-28 h-28 m-auto overflow-hidden rounded-full flex justify-center items-center'>
        {
          !localPictureUrl ? <Image className="w-full" width={100} height={100} src={profilePictureUrl ? profilePictureUrl : userIcon} alt="Profile picture of the signed in user"/>
          : <Image width={100} height={100} className="" src={localPictureUrl} alt="Preview of the newly selected picture"/>
        }
      </div>
      <input onChange={e => handleFileChange(e)} id="file-input" type="file" style={{display:'none'}} accept="image/*"/>
      <button className="block m-auto my-4 bg-orange text-white rounded-lg text-[1.2em] py-2 px-4 transition-all duration-200 hover:bg-darkerOrange" onClick={openImagePicker}>Select a new picture</button>
      <button className='block m-auto my-4 bg-orange text-white rounded-lg text-[1.2em] py-2 px-4 transition-all duration-200 hover:bg-darkerOrange disabled:cursor-not-allowed disabled:bg-orange disabled:opacity-70' disabled={updateInProgress} onClick={handleSubmit}>{!updateInProgress ? "Save" : "Saving"}</button>
      <div className="acc-updated-alert w-[85dvw] flex justify-center items-center absolute left-[7.5dvw] bottom-[-10dvh] bg-white rounded-lg p-2 shadow-[0_0_5px_black] transition-all duration-300 sm:w-[60dvw] sm:left-[20dvw] md:w-[50dvw] md:left-[25dvw] lg:w-[30dvw] lg:left-[15dvw] 2xl:w-[20dvw] 2xl:left-[20dvw]">
      <Image src={checkmark} className="w-8" alt="Green checkmark icon"/><p className='ml-2'>Account Updated Sucessfully</p>
      </div>
    </div>
  )
}