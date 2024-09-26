import { jwtVerify, SignJWT } from "jose"

const secret = process.env.JWT_AUTH_SECRET
const key = new TextEncoder().encode(secret)

export async function encrypt(payload:any){
    return await new SignJWT(payload)
    .setProtectedHeader({alg:'HS256'})
    .setIssuedAt()
    .setExpirationTime("1w")
    .sign(key)
}

export async function decrypt(input: string){
    const { payload } = await jwtVerify(input, key, {
        algorithms:['HS256'],
    })
    return payload
}
