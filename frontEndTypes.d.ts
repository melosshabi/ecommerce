type signUpError = {
    errorMessage:string,
    errorCode:string
}
type signUpData = {
    username:string,
    email:string,
    password:string
}
type UserInfo = {
    userDocId:string,
    username:string,
    email:string,
    profilePictureUrl:string
}
type ProfilePageSidebar = {
    activePage:"account" | "cart" | "wishlist" | "userProducts" | "userOrders",
}
// This type is used for the data that is sent to the server when creating a new product
type ProductData = {
    productName:string,
    brandName?:string,
    manufacturer:string,
    price:number,
    quantity:number,
}
// The type below is used to for the cart page
interface CartProduct {
    _id:string,
    productName:string,
    manufacturer:string,
    brandName:string,
    productPrice:number,
    productImage?:string,
    // For unauthenticated users
    pictures:string[],
    quantity:number,
    dateAdded?:Date
    desiredQuantity:number
}
// This type is used for the productsArray prop on the Wishlist components which holds objects with 2 keys productDocId and dateAdded
type SessionWishlist = {
    productDocId:string,
    dateAdded:string,
}
interface WishlistItem extends CartProduct {
    dateAdded:Date,
}
// This type is used for the wishlist array saved on local storage
type LocalWishlistObject = {
    productDocId:string,
    dateAdded:string
}
// This type is used for the cart array saved on local storage
interface LocalCartObject extends LocalWishlistObject {
    desiredQuantity:number
}
type ProductLink = {
    productId:string
}
type HTMLSVGElement = HTMLElement & SVGElement