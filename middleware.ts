import { NextResponse } from 'next/server'

export function middleware(){
    const res = NextResponse.next()
    res.headers.append("Access-Control-Allow-Origin", "https://ecommerce-three-rosy.vercel.app")
    console.log(res)
    return res
}

export const config = {
    matcher: '/api/:path*'
}