export default async function addToWishlist(authenticated:boolean, productDocId:string, clickedFromHomeScreen:boolean){
  if(clickedFromHomeScreen && !authenticated){
    const localWishlist = JSON.parse(localStorage.getItem('localWishList') as string)
    if(localWishlist){
    let productExists = false
    localWishlist.forEach((product:any) => {
      if(product.productDocId === productDocId){
        productExists = true
        return
      }
    })
    if(productExists) return
      const wishListItems = [...localWishlist, {productDocId, dateAdded:new Date()}]
      const stringifiedWishlistItems = JSON.stringify(wishListItems)
      localStorage.setItem('localWishList', stringifiedWishlistItems)
      return
  }
}
    if(!authenticated) {
      const localWishList = JSON.parse(localStorage.getItem('localWishList') as string)
      if(localWishList){
        const wishlistItems = [...localWishList, {productDocId, dateAdded: new Date()}]
        const stringifiedWishlistItems = JSON.stringify(wishlistItems)
        localStorage.setItem('localWishList', stringifiedWishlistItems)
        window.location.reload()
        return
      }
      const wishlistItems = [{productDocId, dateAdded: new Date()}]
      const stringifiedWishlistItems = JSON.stringify(wishlistItems)
      localStorage.setItem('localWishList', stringifiedWishlistItems)
      window.location.reload()
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist`,{
      method:"PATCH",
      body:JSON.stringify({
        productDocId
      })
    })

    const parsedRes = await res.json()
    if(parsedRes.messageCode === 'added-to-wishlist'){
      window.location.reload()
    }
  }
