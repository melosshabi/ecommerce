// import type { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { Model } from 'mongoose'

// export const nextAuthOptions:NextAuthOptions = {
//     providers:[
//         CredentialsProvider({
//             name:"Credentials",
//             credentials:{
//                 username:{
//                     label:"Username",
//                     type:"text",
//                     placeholder:"Username"
//                 },
//                 password:{
//                     label:"Password",
//                     type:'password',
//                     placeholder:"Password",
//                 }
//             },
//             async authorize(credentials){
//             //    const user = await Model.findOne({username: credentials?.username}).catch(err => console.log("error:", err))
//             //    console.log(user)
//             //    if(user) return user
//             //    return null
//                 const user = {id:'50', name:'mela', password:'mela123', email:'melosshabi05@gmail.com'}
//                 if(credentials?.username === user.name && credentials.password === user.password){
//                     return user
//                 }
//                 else {
//                     return null
//                 }
//             }
//         })
//     ],
// }