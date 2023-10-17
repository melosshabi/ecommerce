import { NextResponse } from 'next/server'

export function middleware(){
    const res = NextResponse.next()

    res.headers.append("Access-Control-Allow-Origin", "https://s7z2pcwm-3000.euw.devtunnels.ms")

    return res
}

export const config = {
    matcher: '/api/:path*'
}