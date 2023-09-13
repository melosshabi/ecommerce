type signUpError = {
    errorMessage:string,
    errorCode:string
}
type signUpData = {
    username:string,
    email:string,
    password:string
}
// The type used for rendering the products on the homepage
interface Product {
    _id:string,
    posterDocId:string,
    productName:string,
    brandName:string | undefined,
    noBrand:boolean,
    manufacturer:string,
    productPrice:number,
    quantity:number,
    pictures:String[],
    productReviews:Array,
}
type UserInfo = {
    userId:string,
    username:string,
    email:string,
    profilePictureUrl:string
}
type ProfilePageSidebar = {
    activePage:"account" | "cart" | "wishlist" | "products" | "orders"
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
    productsArray: Array<CartListProduct>
}
type CartListProduct = {
    productDocId:string,
    // quantity in this case refers to the quantity chosen by the user
    desiredQuantity:number,
    dateAdded:string
}
// The type below is used to for the cart page
interface CartProducts extends Product {
    dateAddedToCart:Date
    desiredQuantity:number
}