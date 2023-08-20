
import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }


// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   const { userId } = await req.json();

//   if (!userId || userId.length === 0) {
//     return new NextResponse("User id are required", { status: 400 });
//   }

//   const products = await prismadb.user.findMany({
//     where: {
//       id: userId
//     }
//   });

  
//   // const user = await prismadb.user.create({
//   //   data: {
//   //     soreId: params.storeId,
//   //     isPaid: false,
//   //     orderItems: {
//   //       create: productIds.map((productId: string) => ({
//   //         product: {
//   //           connect: {
//   //             id: productId
//   //           }
//   //         }
//   //       }))
//   //     }
//   //   }
//   // });


//   return NextResponse.json({ userId }, {
//     headers: corsHeaders
//   });
// };

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const users = await prismadb.user.findMany({
      where:{
        storeId: params.storeId
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("USERS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
