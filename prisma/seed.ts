import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { use } from "react";

const prisma = new PrismaClient();

async function main( req: Request,{ params }: { params: { storeId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const password = await hash("test", 12);

  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      storeId:params.storeId,
      email: "test@test.com",
      name: "Test User",
      password: password,
    },
  });
  return NextResponse.json(user);
}
