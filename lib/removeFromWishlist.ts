export default async function removeFromWishlist(userDocId:string | undefined, productDocId:string){
    if(!userDocId){
        const localWishlist = JSON.parse(localStorage.getItem('localWishList') as string)
        if(localWishlist){
            const filteredWishlistArr = localWishlist.filter((wishlistProduct : any) => wishlistProduct.productDocId !== productDocId)
            localStorage.setItem('localWishList', JSON.stringify(filteredWishlistArr))
            window.location.reload()
        }
        return
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist`,{
        method:"DELETE",
        body:JSON.stringify({
            userDocId,
            productDocId
        })
    })
    const parsedRes = await res.json()
    
    if(parsedRes.messageCode === 'removed-from-wishlist'){
        return true
    }
}