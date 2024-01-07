export default async function removeFromWishlist(userDocId:string, productDocId:string){
    const res = await fetch(`https://ecommerce-beta-eight.vercel.app/api/editWishlist`,{
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