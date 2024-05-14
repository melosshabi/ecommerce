// This function is used to replace the wishlist on the database with a new array that includes the products stored on localstorage
export default async function updateUserWishlist(userId:string, newWishlist:WishlistObject[]){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUserWishlist`, {
        method:"PATCH",
        body:JSON.stringify({userId, newWishlist})
    })
    const data = await res.json()
    if(data.message === 'wishlist-updated') localStorage.removeItem('localWishList')
}

