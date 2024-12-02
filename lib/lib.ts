// clickedFromHomeScreen let's us know if the function is getting called from the button on the cards of the products on the homescreen
export async function addToCart(authenticated:boolean, productDocId:string, desiredQuantity:number, clickedFromHomeScreen:boolean){
    if(clickedFromHomeScreen && !authenticated){
        const localCart = JSON.parse(localStorage.getItem('localCart') as string)
        if(localCart){
        let productExists = false
        localCart.forEach((product:LocalCartObject) => {
        if(product.productDocId === productDocId){
            product.desiredQuantity += 1
            productExists = true
            return
        }
    })
    if(productExists){
            localStorage.setItem('localCart', JSON.stringify([...localCart]))
            return true
        }
        const cartItems = [...localCart, {productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localCart', stringifiedCartItems)
        return true
    }
}
    if(!authenticated) {
        const localCart = JSON.parse(localStorage.getItem('localCart') as string)
        if(localCart){
            const cartItems = [...localCart, {productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
            const stringifiedCartItems = JSON.stringify(cartItems)
            localStorage.setItem('localCart', stringifiedCartItems)
            return true
        }
        const cartItems = [{productDocId:productDocId, desiredQuantity, dateAdded: new Date()}]
        const stringifiedCartItems = JSON.stringify(cartItems)
        localStorage.setItem('localCart', stringifiedCartItems)
        return true
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editCart`, {
        method:"PATCH",
        body:JSON.stringify({
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

export  async function removeFromCart(userDocId:string | undefined, productDocId:string){
    if(!userDocId){
        const localCart: LocalCartObject[] = JSON.parse(localStorage.getItem('localCart') as string)
        if(localCart){
            const filteredCartArr = localCart.filter(cartProduct => cartProduct.productDocId !== productDocId)
            localStorage.setItem('localCart', JSON.stringify(filteredCartArr))
            return true
        }
    }
    if(userDocId){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/editCart`,{
        method:"DELETE",
        body:JSON.stringify({
            productDocId
        })})
    const parsedRes = await res.json()
    if(parsedRes.messageCode === "removed-from-cart"){
        return true
    }
}
}

export async function addToWishlist(authenticated:boolean, productDocId:string, clickedFromHomeScreen:boolean){
    if(clickedFromHomeScreen && !authenticated){
        const localWishlist = JSON.parse(localStorage.getItem('localWishList') as string)
        if(localWishlist){
            let productExists = false
            localWishlist.forEach((product:any) => {
                if(product.productDocId === productDocId){
                    productExists = true
                    return
                }
            })
            if(productExists) return
            const wishListItems = [...localWishlist, {productDocId, dateAdded:new Date()}]
            const stringifiedWishlistItems = JSON.stringify(wishListItems)
            localStorage.setItem('localWishList', stringifiedWishlistItems)
            return true
        }
    }
    if(!authenticated) {
        const localWishList = JSON.parse(localStorage.getItem('localWishList') as string)
        if(localWishList){
            const wishlistItems = [...localWishList, {productDocId, dateAdded: new Date()}]
            const stringifiedWishlistItems = JSON.stringify(wishlistItems)
            localStorage.setItem('localWishList', stringifiedWishlistItems)
            return true
        }
        const wishlistItems = [{productDocId, dateAdded: new Date()}]
        const stringifiedWishlistItems = JSON.stringify(wishlistItems)
        localStorage.setItem('localWishList', stringifiedWishlistItems)
        return true
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist`,{
        method:"PATCH",
        body:JSON.stringify({
            productDocId
        })
    })
    const parsedRes = await res.json()
    if(parsedRes.messageCode === 'added-to-wishlist'){
        return true
    }
}

export async function removeFromWishlist(userDocId:string | undefined, productDocId:string){
    if(!userDocId){
        const localWishlist = JSON.parse(localStorage.getItem('localWishList') as string)
        if(localWishlist){
            const filteredWishlistArr = localWishlist.filter((wishlistProduct : any) => wishlistProduct.productDocId !== productDocId)
            localStorage.setItem('localWishList', JSON.stringify(filteredWishlistArr))
            return true
        }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist`,{
        method:"DELETE",
        body:JSON.stringify({
            userDocId,
            productDocId
        })
    })
    const parsedRes = await res.json()
    
    if(parsedRes.messageCode === 'removed-from-wishlist'){
        return true
    }
}

    // This function is used to replace the wishlist/cart list on the database with a new array that includes the products stored on localstorage
enum listToUpdateEnum {
    cartList,
    wishlist
}
export  async function updateCartListOrWishlist(userId:string, newList:LocalWishlistObject[] | LocalCartObject[], listToUpdate:listToUpdateEnum){
    if(listToUpdate === listToUpdateEnum.wishlist){
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUserWishlist`, {
                method:"PATCH",
                body:JSON.stringify({userId, newWishlist:newList})       
        })
}else if(listToUpdate === listToUpdateEnum.cartList){
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateUserCartList`, {
            method:"PATCH",
            body:JSON.stringify({userId, newCartList:newList})
        })
    }
}

export function parseMonth(monthIndex:number){
    switch(monthIndex){
        case 0:
            return  "Jan";
        case 1:
            return  "Feb";
            
        case 2:
            return  "Mar";
            
        case 3:
            return  "Apr";
            
        case 4:
            return  "May";
            
        case 5:
            return  "June";
            
        case 6:
            return  "July";
            
        case 7:
            return  "Aug";
            
        case 8:
            return  "Sep";
        case 9:
            return  "Oct";
        case 10:
            return  "Nov";
        case 11:
            return  "Dec";
        default:
            return  "";
    }
}

export async function placeOrder(items:ProductForOrder[], fromCart:boolean):Promise<string>{    
    if(fromCart){
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {
            method:"POST",
            headers:{
                "CalledOrderFromCart":fromCart.toString()
            },
            body:JSON.stringify([...items])
        })
        const data: {url:string, stripeSessionId:string} = await res.json()
        localStorage.setItem('stripeSessionId', data.stripeSessionId)
        return data.url
    }else{
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {
            method:"POST",
            body:JSON.stringify([...items])
        })
        const data: {url:string, stripeSessionId:string} = await res.json()
        localStorage.setItem('stripeSessionId', data.stripeSessionId)
        return data.url
    }
    
}

export async function getProductById(id:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/productDetails?_id=${id}`)
    const data = await res.json()
    return data
}