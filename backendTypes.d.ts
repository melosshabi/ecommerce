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
