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

    // Get detailed team comparison with all metrics
    const teams = await prisma.team.findMany({
      include: {
        components: {
          include: {
            evaluation: true
          }
        },
        users: true
      }
    });

    const teamComparison = teams.map((team: any) => {
      const components = team.components || [];
      const evaluations = Array.from(new Set(components.map((c: any) => c.evaluation))).filter((e: any) => e);

      // Count by status
      const completed = evaluations.filter((e: any) => e.status === 'COMPLETED').length;
      const inProgress = evaluations.filter((e: any) => e.status === 'IN_PROGRESS').length;
      const pending = evaluations.filter((e: any) => e.status === 'PENDING').length;

      // Calculate completion rate
      const completionRate = evaluations.length > 0 
        ? Math.round((completed / evaluations.length) * 100) 
        : 0;

      // Calculate average component weight
      const avgWeight = components.length > 0
        ? components.reduce((sum: any, c: any) => sum + (c.weight || 0), 0) / components.length
        : 0;

      return {
        id: team.id,
        name: team.name,
        memberCount: team.users.length,
        evaluationCount: evaluations.length,
        componentCount: components.length,
        avgWeight: Math.round(avgWeight * 100) / 100,
        completedCount: completed,
        inProgressCount: inProgress,
        pendingCount: pending,
        completionRate
      };
    });

    // Sort by completion rate and component count
    const sortedComparison = teamComparison.sort((a: any, b: any) => {
      if (b.completionRate !== a.completionRate) {
        return b.completionRate - a.completionRate;
      }
      return b.componentCount - a.componentCount;
    });

    // Get top performers
    const topPerformers = sortedComparison.slice(0, 5);

    // Get teams needing attention (low completion rate)
    const needsAttention = sortedComparison
      .filter((t: any) => t.completionRate < 50)
      .slice(0, 5);

    return NextResponse.json({
      allTeams: sortedComparison,
      topPerformers,
      needsAttention,
      summary: {
        totalTeams: teams.length,
        avgCompletionRate: sortedComparison.length > 0 
          ? Math.round(sortedComparison.reduce((sum: any, t: any) => sum + t.completionRate, 0) / sortedComparison.length)
          : 0,
        totalComponents: sortedComparison.reduce((sum: any, t: any) => sum + t.componentCount, 0)
      }
    });

  } catch (error) {
    console.error("Team comparison error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
