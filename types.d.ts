type signUpError = {
        errorMessage:string,
        errorCode:string
}
type signUpData = {
    username:string,
    email:string,
    password:string
}
type Products = {
    posterDocId:string,
    productName:string,
    productPrice:number,
    productReviews:Array,
    productImages:Array,
    quantity:number
}
type UserInfo = {
    userId:string,
    username:string,
    email:string,
    profilePictureUrl:string
}