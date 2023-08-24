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
}