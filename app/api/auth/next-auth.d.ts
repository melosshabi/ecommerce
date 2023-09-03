import { DefaultSession } from "next-auth"

declare module "next-auth"{
    interface Session{
        user:{
            userId:string,
            userDocId:string,
            cart:Array,
            wishlist:Array
        } & DefaultSession['user']
    }
}