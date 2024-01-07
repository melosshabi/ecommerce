export default async function removeFromCart(userDocId:string, productDocId:string){
    const res = await fetch(`https://ecommerce-beta-eight.vercel.app/api/editCart`,{
      method:"DELETE",
      body:JSON.stringify({
        userDocId,
        productDocId
      })
    })
    const parsedRes = await res.json()

    if(parsedRes.messageCode === "removed-from-cart"){
      window.location.reload()
    }
  }