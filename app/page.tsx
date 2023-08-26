"use client"
import Link from 'next/link'
import './styles/app.css'
import { signOut } from 'next-auth/react'

export default function Home() {
  return (
    <main>
      {/* <Link href="/api/auth/signin">Sign In</Link>
        <Link href="/api/auth/signout">Sign Out</Link> */}
        <button style={{marginTop:"500px"}} onClick={() => signOut()}>Sign Out</button>
    </main>
  )
}
