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
                    console.log("Signed in")
                    return passwordLessUser
                }

                return {
                    errorMessage:"Incorrect Password",
                    errorCode:'incorrect-password'
                }
            }
        })
    ],
    callbacks:{
        // @ts-ignore
        async signIn({ user, account, profile, email, credentials }) {
            // @ts-ignore
           if(user.errorCode === 'username-not-found'){
            throw new Error("username-not-found")
             // @ts-ignore
           }else if(user.errorCode === 'incorrect-password'){
            throw new Error("incorrect-password")
           }
           return true
        }
    },
    pages: {
        signIn:'/auth/signin/page'
    }
}