import {getAuth} from "@clerk/nextjs/server"
import authSeller from "@/middlewares/authSeller"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


// Get Dashboard data for seller (total products, total earnings, total orders, ratings)

export async function GET(request){
    try{
        const {userId} = getAuth(request)
        const {storeId} = await authSeller(userId)


        //Get all the orders
        const orders = await prisma.order.findMany({
            where: {storeId}
        })

        //Get all products with ratings for seller
        const products = await prisma.product.findMany({
            where: {storeId}
        })

        const ratings = await prisma.rating.findMany({
            where: {
              product: {
                storeId: storeId
              }
            },
            include: {
              product: true,
              user: true
            }
          })

          const dashboardData = {
            ratings,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((total, order) => total + order.total, 0)),
          }

          return NextResponse.json({dashboardData})
          

    } catch(error){
        console.error(error)
        return NextResponse.json({error : error.code || error.message}, {status: 400})
    }
}