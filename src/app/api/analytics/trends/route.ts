/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get('months') || '6');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get evaluations grouped by month
    const evaluations = await prisma.evaluationSheet.findMany({
      where: {
        date_start: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date_start: 'asc'
      }
    });

    // Group by month
    const monthlyData: { [key: string]: { count: number; completed: number } } = {};

    evaluations.forEach((eval_: any) => {
      const date = new Date(eval_.date_start);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, completed: 0 };
      }
      
      monthlyData[monthKey].count += 1;
      if (eval_.status === 'COMPLETED') {
        monthlyData[monthKey].completed += 1;
      }
    });

    // Convert to array and calculate averages
    const trends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      evaluationCount: data.count,
      completedCount: data.completed,
      completionRate: data.count > 0 ? Math.round((data.completed / data.count) * 100) : 0
    }));

    // Get component performance (count of components per team)
    const components = await prisma.component.findMany({
      include: {
        team: true
      }
    });

    const componentTrends = components.map((comp: any) => ({
      id: comp.id,
      name: comp.name,
      team: comp.team?.name || 'Unknown',
      weight: comp.weight
    }));

    return NextResponse.json({
      monthly: trends,
      componentPerformance: componentTrends
    });

  } catch (error) {
    console.error("Analytics trends error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
