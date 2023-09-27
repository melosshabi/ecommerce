import { DefaultSession } from "next-auth"

declare module "next-auth"{
    interface Session{
        user:{
            userDocId:string,
            cart:Array,
            wishlist:Array
        } & DefaultSession['user']
    }
}