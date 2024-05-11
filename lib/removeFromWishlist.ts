export default async function removeFromWishlist(userDocId:string | undefined, productDocId:string){
  if(!userDocId){
    const localWishlist = JSON.parse(localStorage.getItem('localWishlist') as string)
    if(localWishlist){
      const filteredWishlistArr = localWishlist.filter((wishlistProduct : any) => wishlistProduct._id !== productDocId)
      localStorage.setItem('localCart', JSON.stringify(filteredWishlistArr))
      window.location.reload()
    }
    
  }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editWishlist`,{
      method:"DELETE",
      body:JSON.stringify({
        userDocId,
        productDocId
      })
    })
    const parsedRes = await res.json()

    if(parsedRes.messageCode === 'removed-from-wishlist'){
      window.location.reload()
    }
  }