// The type used for rendering the products on the homepage (The data stored on the database)
interface Product {
    _id:string,
    posterDocId:string,
    productName:string,
    brandName:string | undefined,
    noBrand:boolean,
    manufacturer:string,
    productPrice:number,
    quantity:number,
    pictures:string[],
    productReviews:Array,
}
type PublicUserInfo = {
    username:string,
    profilePicture:string,
    userDocId:string
}
type Review = {
    _id:string,
    posterDocId:string,
    posterName:string,
    posterProfilePicture:string,
    rating:string,
    reviewText:string,
    createdAt:string,
    updatedAt:string,
}
type OrderData = {
    _id:string,
    clientDocId:string,
    productDocId:string,
    desiredQuantity:number,
    productPrice:number,
    totalPrice:number
}