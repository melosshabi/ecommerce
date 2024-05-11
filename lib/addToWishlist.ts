export default async function addToWishlist(userDocId:string | undefined, productDocId:string, clickedFromHomeScreen:boolean){
  if(clickedFromHomeScreen && !userDocId){
    const localWishlist = JSON.parse(localStorage.getItem('localWishList') as string)
    if(localWishlist){
    let productExists = false
    localWishlist.forEach((product:any) => {
      if(product._id === productDocId){
        productExists = true
        return
      }
    })
    if(productExists) return
      const wishListItems = [...localWishlist, {_id:productDocId}]
      const stringifiedWishlistItems = JSON.stringify(wishListItems)
      localStorage.setItem('localWishList', stringifiedWishlistItems)
      return
  }
}
    if(!userDocId) {
      const localWishList = JSON.parse(localStorage.getItem('localWishList') as string)
      if(localWishList){
        const cartItems = [...localWishList, {_id:productDocId, dateAdded: new Date()}]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localWishList', stringifiedCartItems)
        window.location.reload()
      }
      const wishlistItems = [{_id:productDocId}]
      const stringifiedWishlistItems = JSON.stringify(wishlistItems)
      localStorage.setItem('localWishList', stringifiedWishlistItems)
      window.location.reload()
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editWishlist`,{
      method:"PATCH",
      body:JSON.stringify({
        userDocId,
        productDocId
      })
    })

    const parsedRes = await res.json()
    if(parsedRes.messageCode === 'added-to-wishlist'){
      window.location.reload()
    }
  }
