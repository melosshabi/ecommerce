import * as bcrypt from 'bcrypt'

export async function hashPassword(plainPassword:string){
    const salt = bcrypt.genSaltSync()
    return bcrypt.hash(plainPassword, salt)
}
export async function comparePasswords(plainPassword:string, hash:string){
    return bcrypt.compare(plainPassword, hash)
}