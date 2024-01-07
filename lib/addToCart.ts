export default async function addToCart(userDocId:string | undefined, productDocId:string, desiredQuantity:number, reload:boolean){
    if(!userDocId) {
      alert("You need to sign up for an account to place orders or add items to your wishlist")
      return
    }
    const res = await fetch(`api/editCart`, {
      method:"PATCH",
      body:JSON.stringify({
        userDocId,
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