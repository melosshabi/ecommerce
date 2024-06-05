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