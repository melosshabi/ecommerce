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
    datePosted:string,
    dateEdited:string,
}
// // This type is used for placing and fetching already placed orders
// type orderData = {
//     productDocId:string,
//     productName:string,
//     desiredQuantity:string,
//     orderId?:string,
//     price:number
// }