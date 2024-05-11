// clickedFromHomeScreen let's us know if the function is getting called from the button on the cards of the products on the homescreen
export default async function addToCart(userDocId:string | undefined, productDocId:string, desiredQuantity:number, reload:boolean, clickedFromHomeScreen:boolean){
    if(clickedFromHomeScreen && !userDocId){
      const localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(localCart){
      let productExists = false
      localCart.forEach((product:any) => {
        if(product._id === productDocId){
          product.desiredQuantity += 1
          productExists = true
          return
        }
      })
      if(productExists){
        const cartItems = [...localCart]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localCart', stringifiedCartItems)
        return
      }
      const cartItems = [...localCart, {_id:productDocId, desiredQuantity, dateAdded: new Date()}]
      const stringifiedCartItems = JSON.stringify(cartItems)
      localStorage.setItem('localCart', stringifiedCartItems)
      return
    }
  }
    if(!userDocId) {
      const localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(localCart){
        const cartItems = [...localCart, {_id:productDocId, desiredQuantity, dateAdded: new Date()}]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localCart', stringifiedCartItems)
        window.location.reload()
      }
      const cartItems = [{_id:productDocId, desiredQuantity}]
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
    console.log(parsedRes)
    if(parsedRes.messageCode === 'added-to-cart' && reload){
      window.location.reload()
    }else if(parsedRes.errorCode === "invalid-quantity"){
      alert(parsedRes.errorMessage)
    }
  }