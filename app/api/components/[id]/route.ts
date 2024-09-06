import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Component } from "@prisma/client";
const prisma = new PrismaClient();

export const DELETE = async (
    request: Request,
    { params }: { params: { id: string } }
  ) => {
    const component = await prisma.component.delete({
      where: {
        id: Number(params.id),
      },
    });
  
    return NextResponse.json(component, { status: 200 });
  };

  
export const PATCH = async (request: Request, {params}: {params: {id: string}}) =>{
  const body: Component = await request.json();
  const component = await prisma.component.update({
      where:{
          id: Number(params.id)
      },
      data:{
          name: body.name,
          description: body.description,
          weight: body.weight,
      }
  });
  return NextResponse.json(component, {status: 200});
}
