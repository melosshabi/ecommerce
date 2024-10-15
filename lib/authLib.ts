import { jwtVerify, SignJWT, errors } from "jose"

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
export async function verifyToken(token:string){
    try {
        await jwtVerify(token, key);
        return {valid:true}
    } catch (error) {
        if (error instanceof errors.JWTExpired) {
            return {valid:false, error:'expired'}
        }
        return {valid:false, error:'unkown'}
    }
}
