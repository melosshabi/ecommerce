export default async function removeFromCart(userId:string, productDocId:string){
    const res = await fetch('http://localhost:3000/api/editCart',{
      method:"DELETE",
      body:JSON.stringify({
        userId,
        productDocId
      })
    })
    const parsedRes = await res.json()

    if(parsedRes.messageCode === "removed-from-cart"){
      window.location.reload()
    }
  }