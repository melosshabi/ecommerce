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
    // hideSidebar:boolean
}
// This type is used for the data that is sent to the server when creating a new product
type ProductData = {
    productName:string,
    brandName?:string,
    noBrand:boolean,
    manufacturer:string,
    price:number,
    quantity:number,
}
type CartListProps = {
    productsArray: Array<CartObject>
}
// The type below is used to for the cart page
interface CartProduct extends Product {
    dateAddedToCart:Date
    desiredQuantity:number
}
type WishlistProps = {
    productsArray: Array<SessionWishlist>
    userDocId:string | undefined
}
// This type is used for the productsArray prop on the Wishlist components which holds objects with 2 keys productDocId and dateAdded
type SessionWishlist = {
    productDocId:string,
    dateAdded:string,
}
interface WishlistItem extends Product {
    dateAdded:Date,
}
// This type is used for the wishlist arrays on local storage and on session.data.user.wishlist which hold objects with 2 keys productDocId and dateAdded
type WishlistObject = {
    productDocId:string,
    dateAdded:string
}
// This type is used for the cart arrays on local storage and on session.data.user.cart which hold objects with 2 keys productDocId and dateAdded
interface CartObject extends WishlistObject {
    desiredQuantity:number
}
// This type is used to fetch and display the products posted by the signed in user the in UserProductsList component
interface UserProduct extends Product{
    createdAt:Date
}
type ProductLink = {
    productId:string
}
type HTMLSVGElement = HTMLElement & SVGElement