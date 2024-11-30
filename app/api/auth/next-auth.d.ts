import { DefaultSession } from "next-auth"

declare module "next-auth"{
    interface Session{
        user:{
            userDocId:string,
            cartCount:number
            wishlist:WishlistObject[]
        } & DefaultSession['user']
    }
}