// /api/score/[id]/detail.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 5);
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "Semua";

    const offset = (page - 1) * limit;

    const whereCondition: Prisma.ActivityLogWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  actionType: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  tableName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
        filter !== "Semua"
          ? filter === "Hari Ini"
            ? {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)), 
                  lt: new Date(new Date().setHours(24, 0, 0, 0)),
                },
              }
            : filter === "Minggu Ini"
            ? {
                createdAt: {
                  gte: new Date(
                    new Date().setDate(
                      new Date().getDate() - new Date().getDay()
                    )
                  ),
                  lt: new Date(
                    new Date().setDate(
                      new Date().getDate() + (7 - new Date().getDay())
                    )
                  ),
                },
              }
            : filter === "Lebih lama"
            ? {
                createdAt: {
                  lt: new Date(
                    new Date().setDate(
                      new Date().getDate() - new Date().getDay()
                    )
                  ),
                },
              }
            : {}
          : {},
      ],
    };

    const logActivity = await prisma.activityLog.findMany({
      skip: offset,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalRecords = await prisma.activityLog.count({
      where: whereCondition,
    });

    const pagination = {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      pageSize: limit,
    };

    return NextResponse.json(
      { data: logActivity, pagination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
};
