import {getAuth} from "@clerk/nextjs/server"
import authSeller from "@/middlewares/authSeller"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//Toogle stock of a product
export async function POST(request){
    try {
        const {userId} = getAuth(request)
        const productId = await request.json()

        if(!productId){
            return NextResponse.json({error: "missing product id"}, {status: 400})
        }

        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: "unauthorized"}, {status: 401})
        }

        //check if product exists
        const product = await prisma.product.findFirst({
            where: { id: productId , storeId }
        })

        if(!product){
            return NextResponse.json({error: "product not found"}, {status: 404})
        }

        await prisma.product.update({
            where: { id: productId },
            data: { stock: !product.stock }
        })

        return NextResponse.json({message: "Product stock updated successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, {status: 400})
    }
}