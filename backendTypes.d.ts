import { ObjectId } from "mongodb"

// The type below is used for the POST request on the productReviews route
type postRequestReviewData = {
    _id:string,
    posterDocId:string,
    productId:string,
    rating:number | string,
    reviewText:string,
    datePosted:Date,
    dateEdited:Date
}
// This type is used on the editCart route
type BackendCartProduct = {
    productDocId:ObjectId | string,
    desiredQuantity:number,
    dateAdded:Date
}
type BackendWishlistProduct = {
    productDocId:string,
    dateAdded:Date
}
type FinishOrderData = {
    stripeSessionId:string
}
type OrderData = {
    clientDocId:string | null,
    productDocId:string,
    desiredQuantity:number,
    productPrice:number,
    totalPrice:number
}
// This type is used in the editCart route on the GET request since using the spread operator on a mongodb response doesn't return the document data alone instead it's nested inside the _doc property
type PromiseProduct = {
    _doc:Product
}
// This type is used when extracting the necessary data for the cart page (route:editCart)
type CartItems = {
    productName:string,
    manufacturer:string,
    productPrice:number,
    desiredQuantity:number,
    dateAddedToCart:Date
}
// This type is used when extracting the necessary data for the wishlist screen 
type WishlistItem = {
    productDocId:string,
    productName:string,
    manufacturer:string,
    productPrice:number,
    productImage:string
}
// This type resembles the object of the wishlisted product which is stored inside the wishlist array on the users' documents
interface WishlistObject {
    productDocId:string,
    dateAdded:Date
}
interface CartObject extends WishlistObject {
    desiredQuantity:number
}