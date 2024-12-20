import { NextResponse } from 'next/server'

export function middleware(){
    const res = NextResponse.next()

    res.headers.append("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_URL as string)
    return res
}

export const config = {
    matcher: '/api/:path*'
}
