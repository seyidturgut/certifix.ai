import { NextResponse } from 'next/server';
import { getUserPlanAndUsage } from '@/lib/plan-utils';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const data = await getUserPlanAndUsage(id);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
