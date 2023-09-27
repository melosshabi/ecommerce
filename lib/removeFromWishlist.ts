export default async function removeFromWishlist(userDocId:string, productDocId:string){
    const res = await fetch('http://localhost:3000/api/editWishlist',{
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