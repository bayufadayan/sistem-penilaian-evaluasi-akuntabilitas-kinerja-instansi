/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total counts
    const totalTeams = await prisma.team.count();
    const totalEvaluations = await prisma.evaluationSheet.count();
    const totalUsers = await prisma.user.count();
    const totalEvidence = await prisma.evidence.count();

    // Get evaluation status breakdown
    const evaluationsByStatus = await prisma.evaluationSheet.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const statusBreakdown = evaluationsByStatus.map((item: any) => ({
      status: item.status,
      count: item._count.id
    }));

    // Get teams performance summary
    const teams = await prisma.team.findMany({
      include: {
        components: {
          include: {
            evaluation: true
          }
        }
      }
    });

    const teamPerformance = teams.map((team: any) => {
      const components = team.components || [];
      const evaluations = Array.from(new Set(components.map((c: any) => c.evaluation))).filter((e: any) => e);
      
      // No evaluation scoring in this schema, use component count as metric
      return {
        id: team.id,
        name: team.name,
        evaluationCount: evaluations.length,
        componentCount: components.length,
        completedCount: evaluations.filter((e: any) => e.status === 'COMPLETED').length,
        inProgressCount: evaluations.filter((e: any) => e.status === 'IN_PROGRESS').length
      };
    });

    // Get recent activity summary  
    const recentEvaluations = await prisma.evaluationSheet.findMany({
      take: 5,
      orderBy: {
        date_start: 'desc'
      }
    });

    const recentActivity = recentEvaluations.map((eval_: any) => ({
      id: eval_.id,
      name: eval_.title,
      status: eval_.status,
      date: eval_.date_start
    }));

    // Get completion rate
    const completedCount = await prisma.evaluationSheet.count({
      where: {
        status: 'COMPLETED'
      }
    });

    const completionRate = totalEvaluations > 0 ? Math.round((completedCount / totalEvaluations) * 100) : 0;

    return NextResponse.json({
      overview: {
        totalTeams,
        totalEvaluations,
        totalUsers,
        totalEvidence,
        completionRate
      },
      statusBreakdown,
      teamPerformance: teamPerformance.sort((a: any, b: any) => b.componentCount - a.componentCount),
      recentActivity
    });

  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
