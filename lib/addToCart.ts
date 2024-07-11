// clickedFromHomeScreen let's us know if the function is getting called from the button on the cards of the products on the homescreen
export default async function addToCart(userDocId:string | undefined, productDocId:string, desiredQuantity:number, clickedFromHomeScreen:boolean){
    if(clickedFromHomeScreen && !userDocId){
      const localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(localCart){
      let productExists = false
      localCart.forEach((product:any) => {
        if(product.productDocId === productDocId){
          product.desiredQuantity += 1
          productExists = true
          return
        }
      })
      if(productExists){
        localStorage.setItem('localCart', JSON.stringify([...localCart]))
        return
      }
      const cartItems = [...localCart, {productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
      const stringifiedCartItems = JSON.stringify(cartItems)
      localStorage.setItem('localCart', stringifiedCartItems)
      return
    }
  }
    if(!userDocId) {
      const localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(localCart){
        const cartItems = [...localCart, {productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localCart', stringifiedCartItems)
        window.location.reload()
        return
      }
      const cartItems = [{productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
      const stringifiedCartItems = JSON.stringify(cartItems)
      localStorage.setItem('localCart', stringifiedCartItems)
      window.location.reload()
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editCart`, {
      method:"PATCH",
      body:JSON.stringify({
        userDocId,
        productDocId,
        desiredQuantity
      })
    })
    const parsedRes = await res.json()
    if(parsedRes.messageCode === 'added-to-cart' || parsedRes.messageCode === 'updated-cart'){
      return true
    }
    else if(parsedRes.errorCode === "invalid-quantity"){
      alert(parsedRes.errorMessage)
    }
  }