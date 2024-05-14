// This function is used to replace the wishlist/cart list on the database with a new array that includes the products stored on localstorage
enum listToUpdateEnum {
    cartList,
    wishlist
}
export default async function updateCartListOrWishlist(userId:string, newList:WishlistObject[] | CartObject[], listToUpdate:listToUpdateEnum){
    if(listToUpdate === listToUpdateEnum.wishlist){
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUserWishlist`, {
        method:"PATCH",
        body:JSON.stringify({userId, newWishlist:newList})
    })}else if(listToUpdate === listToUpdateEnum.cartList){
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUserCartList`, {
            method:"PATCH",
            body:JSON.stringify({userId, newCartList:newList})
        })
    }
}

