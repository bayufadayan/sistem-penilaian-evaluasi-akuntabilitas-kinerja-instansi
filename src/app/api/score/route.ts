import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const GET = async (request: Request) => {
    try {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const limit = Number(url.searchParams.get("limit") || 10);
        const search = url.searchParams.get("search") || "";
        const evaluationId = url.searchParams.get("evaluationId"); // Get evaluationId from query
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
                                                  id_LKE: evaluationId, // Filter berdasarkan LKE
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
                        email: true, // Include user email
                    },
                },
                _count: {
                    select: {
                        Evidence: true, // Counts the number of evidence records
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        // Map evidence count into scores
        const formattedScores = scores.map((score) => ({
            ...score,
            evidence_count: score._count.Evidence,
        }));

        // Count total records for pagination
        const totalRecords = await prisma.score.count({ where: whereCondition });

        // Pagination details
        const pagination = {
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            pageSize: limit,
        };

        return NextResponse.json({ data: formattedScores, pagination }, { status: 200 });
    } catch (error) {
        console.error("Error fetching scores:", error);
        return NextResponse.json(
            { error: "Failed to fetch scores" },
            { status: 500 }
        );
    }
};
