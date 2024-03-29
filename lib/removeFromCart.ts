export default async function removeFromCart(userDocId:string, productDocId:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editCart`,{
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