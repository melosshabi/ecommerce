export default async function removeFromWishlist(userId:string, productDocId:string){
    const res = await fetch('http://localhost:3000/api/editWishlist',{
      method:"DELETE",
      body:JSON.stringify({
        userId,
        productDocId
      })
    })
    const parsedRes = await res.json()

    if(parsedRes.messageCode === 'removed-from-wishlist'){
      window.location.reload()
    }
  }