async function getProductById(id:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${id}`)
    const data = await res.json()
    return data
}
export default getProductById