export default async function addToWishlist(userDocId:string | undefined, productDocId:string){
    if(!userDocId) {
      alert("You need to sign up for an account to place orders or add items to your wishlist")
      return
    }
    const res = await fetch('http://localhost:3000/api/editWishlist',{
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
