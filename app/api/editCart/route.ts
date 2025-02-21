import productModel from "@/models/product"
import userModel from "@/models/user"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "../auth/[...nextauth]/options"
import { BackendCartProduct, CartItem, PromiseProduct } from "@/backendTypes"
import connectToDb from "@/lib/mongodb"
import { decrypt } from "@/lib/authLib"

async function getCartItems(userId:string){
        await connectToDb()
        const user = await userModel.findOne({_id:new ObjectId(userId)})
        const cartProductPromises:Promise<PromiseProduct>[] = []
        let cartProducts: CartItem[] = []
        user.cart.map((cartObj:BackendCartProduct) => {
            const promise = productModel.findOne({_id:cartObj.productDocId})
            cartProductPromises.push(promise)
        })
        await Promise.all(cartProductPromises).then(res => {
            res.forEach((product, index) => {
                const {_id, productName, manufacturer, brandName, productPrice, quantity,pictures} = product._doc
                const finalProduct = {_id:_id.toString(), productName, manufacturer, brandName, productPrice, productImage:pictures[0], quantity, desiredQuantity:user.cart[index].desiredQuantity, dateAdded:user.cart[index].dateAdded}
                cartProducts.push(finalProduct)
        })})
        return cartProducts
}

export async function GET(req:Request){
    const mobile = req.headers.get("Mobile")
    const authorization = req.headers.get("Authorization")
    if(mobile && !authorization){
        return NextResponse.json({error:"unauth"}, {status:401})
    }
    if(mobile && authorization){
        const token = authorization.split(" ")[1]
        const session = await decrypt(token)
        const cartProducts = await getCartItems(session._id as string)
        return NextResponse.json({cartProducts})
    }
    const session = await getServerSession(nextAuthOptions)
    if(session){
        const cartProducts = await getCartItems(session.user.userDocId)
        return NextResponse.json({cartProducts})
    }
}

enum CartActions {
    add = "add-new",
    update = "update-stock"
}
export async function PATCH(req:Request){
    const data = await req.json()
    // App
    const mobile = req.headers.get('Mobile')
    if(mobile){
        const authorization = req.headers.get('Authorization')
        if(!authorization){
            return NextResponse.json({errMsg:"unauthenticated"}, {status:401})
        }
        const action = req.headers.get("Action")
        const key = authorization.split(" ")[1]
        const user = await decrypt(key)

        if(action === CartActions.update){
            try{
                await connectToDb()
                const product = await productModel.findOne({_id: new ObjectId(data.productDocId)})
                if(data.quantity > product.quantity){
                    return NextResponse.json({
                        errorMessage:"Can't add more stock than is available",
                        errCode:"invalid-quantity"
                    }, {status:400})
                }else if(data.quantity < 1){
                    return NextResponse.json({
                        errorMessage:"Quantity can't be less than 1",
                        errCode:"invalid-quantity"
                    }, {status:400})
                }
                const userDB = await userModel.findOne({_id:new ObjectId(user._id as string)})
                let productUpdated = false
                userDB.cart.map(async (product:BackendCartProduct) => {
                    if(product.productDocId.toString() === data.productDocId){
                        productUpdated = true
                        await userModel.updateOne({_id:new ObjectId(user._id as string), "cart.productDocId": new ObjectId(data.productDocId)}, {
                            $set:{"cart.$.desiredQuantity":data.quantity}
                        })
                    }
                })
                if(productUpdated)
                    return NextResponse.json({
                        message:"Updated cart",
                        messageCode:"updated-cart"
                })
            }catch(err){
                return NextResponse.json({msg:err})
            }
        }else if(action === CartActions.add){
            try{
                await connectToDb()
                const userDb = await userModel.findOne({_id:new ObjectId(user._id as string)})
                let itemExists = false
                userDb.cart.forEach((item: BackendCartProduct) => {
                    if(data.productDocId === item.productDocId.toString()){
                        itemExists = true
                    }
                })
                if(itemExists) return NextResponse.json({msg:"product-already-on-cart"})
                await userModel.updateOne({_id:new ObjectId(user._id as string)}, {
                    $push:{cart:{productDocId: new ObjectId(data.productDocId), desiredQuantity:data.desiredQuantity, dateAdded: new Date()}}
                })
                return NextResponse.json({msg:"added-to-cart"})
            }catch(err){
                return NextResponse.json({msg:err})
            }
            
        }
        return NextResponse.json({err:"unkown-error"}, {status:500})
    }
    // Web
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your cart", errCode:"unauthenticated"}, {status:400})
    }
    try{
        const product = await productModel.findOne({_id: new ObjectId(data.productDocId)})
        if(data.quantity > product.quantity){
            return NextResponse.json({
                errorMessage:"Can't add more items to your cart than there is available",
                errorCode:"invalid-quantity"
            }, {status:400})
        }else if(data.quantity < 1){
            return NextResponse.json({
                errorMessage:"Quantity can't be less than 1",
                errCode:"invalid-quantity"
            }, {status:400})
        }
        const user = await userModel.findOne({_id:new ObjectId(session.user.userDocId)})
        let existingProductUpdated = false
        user.cart.map(async (product:BackendCartProduct) => {
            if(product.productDocId.toString() === data.productDocId){
                existingProductUpdated = true
                await userModel.findOneAndUpdate({_id:new ObjectId(session.user.userDocId), "cart.productDocId":new ObjectId(data.productDocId)}, {
                    $set:{"cart.$.desiredQuantity":data.quantity}
                }, {new:true})
            }
        })
        if(existingProductUpdated) return NextResponse.json({
            message:"Updated cart",
            messageCode:"updated-cart"
        })
        await userModel.updateOne({_id:new ObjectId(session.user.userDocId)}, {
            $push:{cart:{productDocId:new ObjectId(data.productDocId), desiredQuantity:data.desiredQuantity, dateAdded:new Date()}}
        })
        return NextResponse.json({
            message:"Added to cart",
            messageCode:"added-to-cart"
        })
    }catch(err){
        return NextResponse.json({
            errorMessage:"There was a problem adding this product to your cart",
            errorCode:"unkown-error"
        }, {status:500})
    }
}

export async function DELETE(req:Request){
    const data = await req.json()
    const mobile = req.headers.get("Mobile")
    if(mobile){
        const session = req.headers.get("Authorization")
        const token = session?.split(" ")[1]
        if(token){
            const user = await decrypt(token)
            try{
                const ids: ObjectId[] = []
                data.itemsToRemove.forEach((id:string) => {
                    ids.push(new ObjectId(id))
                })
                await connectToDb()
                await userModel.findOneAndUpdate({_id:new ObjectId(user._id as string)},{
                    $pull:{cart:{productDocId:{$in: ids}}}
                })
                return NextResponse.json({msg:"products-deleted"})
            }catch(err){
                return NextResponse.json({msg:"Failed"}, {status:500})
            }
            
        }
        return NextResponse.json({err:"unauthenticated"}, {status:400})
    }
    const session = await getServerSession(nextAuthOptions)
    if(!session){
        return NextResponse.json({errMessage:"You need to sign in before editing your cart", errCode:"unauthenticated"}, {status:400})
    }
    
    try{
        await connectToDb()
        const user = await userModel.findOneAndUpdate({_id:new ObjectId(session.user.userDocId)}, {
            $pull:{cart:{productDocId:new ObjectId(data.productDocId)}}
        }, {new:true})

    }catch(err){
        console.log(err)
        return NextResponse.json({
            errorMessage:"There was a problem",
            errorCode:'unkown-error'
        })
    }
    return NextResponse.json({
        message:"Removed from cart",
        messageCode:"removed-from-cart"
    })
}