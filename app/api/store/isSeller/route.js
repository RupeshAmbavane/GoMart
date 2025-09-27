import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import authSeller from "@/middlewares/authSeller"
import prisma from "@/lib/prisma"

// Auth Seller 

export async function GET(request){
    try{
        const {userId} = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: "unauthorized"}, {status: 401})
        }

        const storeInfo = await prisma.store.findUnique({
            where: { id: storeId }
        })

        return NextResponse.json({storeId , storeInfo})
    }
    catch(error){
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, {status: 400})
    }
}