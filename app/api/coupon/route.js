import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


//Verify coupon
export async function POST(request){
    try {
        const {userId, has} = getAuth(request)
        const {code} = await request.json()

        const coupon = await prisma.coupon.findUnique({where: {code: code.toUpperCase(),
            expiresAt: {
                gt: new Date()
            }

        }})

        if(!coupon){
            return NextResponse.json({error: "Invalid coupon"}, {status: 404})
        }

        if(coupon.forNewUser){
            const useOrders = await prisma.order.findMany({where: {userId}})
            if(useOrders.length > 0){
                return NextResponse.json({error: "This coupon is for new users only"}, {status: 400})
            }
        }

        if(coupon.forMember){
            const hasPlusPlan = has({plan: "plus"})
            if(!hasPlusPlan){
                return NextResponse.json({error: "This coupon is for members only"}, {status: 400})
            }
        }

        return NextResponse.json({coupon})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, {status: 400})
    }
}
