import { NextResponse } from 'next/server'

export function middleware(){
    const res = NextResponse.next()
    // res.headers.append("Access-Control-Allow-Origin", "https://ecommerce-three-rosy.vercel.app")
    res.headers.append("Access-Control-Allow-Origin", "http://localhost:3000")
    return res
}

export const config = {
    matcher: '/api/:path*'
}