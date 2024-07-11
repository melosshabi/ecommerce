import { DefaultSession } from "next-auth"

declare module "next-auth"{
    interface Session{
        user:{
            userDocId:string,
            cart:CartObject[],
            wishlist:WishlistObject[]
        } & DefaultSession['user']
    }
}