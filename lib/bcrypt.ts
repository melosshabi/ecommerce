import * as bcrypt from 'bcrypt'

export function hashPassword(plainPassword:string){
    const salt = bcrypt.genSaltSync()
    return bcrypt.hash(plainPassword, salt)
}
export function comparePasswords(plainPassword:string, hash:string){
    return bcrypt.compare(plainPassword, hash)
}