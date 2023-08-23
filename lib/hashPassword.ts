const bcrypt = require('bcrypt')

export default async function hashPassword(plainPassword:string){
    const salt = bcrypt.genSaltSync()
    return bcrypt.hash(plainPassword, salt)
}