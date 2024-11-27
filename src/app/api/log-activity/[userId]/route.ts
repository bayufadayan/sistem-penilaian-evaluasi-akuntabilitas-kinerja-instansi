// /api/score/[id]/detail.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
  try {
    // Parse URL parameters
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 5);
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "Semua"; // Filter default

    const offset = (page - 1) * limit;

    // Building dynamic where condition based on filter and search
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
          ? { actionType: { equals: filter } } // Filtering based on actionType
          : {},
      ],
    };

    // Fetch activity logs with pagination
    const logActivity = await prisma.activityLog.findMany({
      skip: offset,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: "desc", // You can change this as needed
      },
    });

    // Count total records for pagination
    const totalRecords = await prisma.activityLog.count({
      where: whereCondition,
    });

    // Pagination metadata
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
