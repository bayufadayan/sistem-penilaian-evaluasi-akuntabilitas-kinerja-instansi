import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.nextUrl); // Use req.nextUrl instead
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const evaluationId = searchParams.get("evaluationId");
  const offset = (page - 1) * limit;

  const whereCondition: Prisma.ScoreWhereInput = {
    AND: [
      evaluationId
        ? {
            criteria: {
              is: {
                subComponent: {
                  is: {
                    component: {
                      is: {
                        id_LKE: evaluationId,
                      },
                    },
                  },
                },
              },
            },
          }
        : {},
      search
        ? {
            OR: [
              {
                criteria: {
                  is: {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
              {
                user: {
                  is: {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
              {
                notes: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {},
    ],
  };

  try {
    // Fetch scores with evidence count
    const scores = await prisma.score.findMany({
      skip: offset,
      take: limit,
      where: whereCondition,
      include: {
        criteria: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            Evidence: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedScores = scores.map((score) => ({
      ...score,
      evidence_count: score._count.Evidence,
    }));

    const totalRecords = await prisma.score.count({ where: whereCondition });

    const pagination = {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      pageSize: limit,
    };

    return NextResponse.json(
      { data: formattedScores, pagination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
};
