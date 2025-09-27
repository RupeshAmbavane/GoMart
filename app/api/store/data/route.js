
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


//Get store info and store products
export async function GET(request){
    try{
        const {searchParams} = new URL(request.url)
        const username = searchParams.get("username").toLowerCase()

        if(!username){
            return NextResponse.json({error: "username is required"}, {status: 400})
        }

        //Get store info and InStock products with ratings
        const store = await prisma.store.findUnique({
           where: {username, isActive: true},
            include: {
                Product: {
                    include: {
                        rating: true
                    }
                }
            }
        })

        if(!store){
            return NextResponse.json({error: "store not found"}, {status: 404})
        }

        return NextResponse.json(store)
    }
    catch(error){
        console.error(error)
        return NextResponse.json({error: error.code || error.message} , {status: 400})
    }
}