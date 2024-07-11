import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import userModel from '@/models/user'
import connectToDb from '@/lib/mongodb'
import { comparePasswords } from '@/lib/bcrypt'

export const nextAuthOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{
                    label:"Username",
                    type:"text",
                    placeholder:"Username"
                },
                password:{
                    label:"Password",
                    type:'password',
                    placeholder:"Password",
                }
            },
            async authorize(credentials){
                await connectToDb()
                const user = await userModel.findOne({username: credentials?.username})

                if(!user){
                    return {
                        errorMessage:'Username not found',
                        errorCode:'username-not-found'
                    }
                }

                const matched = await comparePasswords(credentials?.password as string, user.password)

                if(matched){
                    const passwordLessUser = {
                        ...user._doc
                    }
                    delete passwordLessUser.password
                    return passwordLessUser
                }

                return null
            }
        })
    ],
    callbacks:{
        async signIn({ user, credentials }) {

            // @ts-ignore
           if(user.errorCode === 'username-not-found'){
            throw new Error("username-not-found")
             // @ts-ignore
           }else if(user.errorCode === 'incorrect-password'){
            throw new Error("incorrect-password")
           }
           user.name = credentials?.username as string
           return true
        },
        async session({session, token}){
            await connectToDb()
            const user = await userModel.findOne({username:token.name})
            session.user.image = user._doc.profilePictureUrl
            session.user.userDocId = user._doc._id
            session.user.cart = user._doc.cart
            session.user.wishlist = user._doc.wishlist
            return session
        }
    },
    pages: {
        signIn:'/auth/signin/page'
    }
}