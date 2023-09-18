export default async function addToCart(userId:string | undefined, productDocId:string, desiredQuantity:number, reload:boolean){
    if(!userId) {
      alert("You need to sign up for an account to place orders or add items to your wishlist")
      return
    }
    const res = await fetch('http://localhost:3000/api/editCart', {
      method:"PATCH",
      body:JSON.stringify({
        userId,
        productDocId,
        desiredQuantity
      })
    })
    const parsedRes = await res.json()
    if(parsedRes.messageCode === 'added-to-cart' && reload){
      window.location.reload()
    }else if(parsedRes.errorCode === "invalid-quantity"){
      alert(parsedRes.errorMessage)
    }
  }