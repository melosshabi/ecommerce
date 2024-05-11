export default async function removeFromCart(userDocId:string | undefined, productDocId:string){
    if(!userDocId){
      const localCart = JSON.parse(localStorage.getItem('localCart') as string)
      if(localCart){
        const filteredCartArr = localCart.filter((cartProduct : any) => cartProduct._id !== productDocId)
        console.log(filteredCartArr)
        localStorage.setItem('localCart', JSON.stringify(filteredCartArr))
        window.location.reload()
      }
    }
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