
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//Function to get all products
export async function GET(request){
    try {
        let products = await prisma.product.findMany({
            where: {inStock: true},
            include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true,
                        user: {select: {name: true, image: true}}
                    }
                },
                store: true      
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        //remove products with store inActive false
        products = products.filter(product => product.store.isActive) 

        return NextResponse.json({products})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, {status: 400})
    }
}