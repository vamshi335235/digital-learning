// app/api/admin/content/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to get correct prisma model
const getModel = (type) => {
    if (type === 'courses') return prisma.course;
    if (type === 'ebooks') return prisma.ebook;
    if (type === 'books') return prisma.book;
    if (type === 'classes') return prisma.liveClass;
    return null;
};

// GET all items for admin
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const model = getModel(type);

    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    try {
        const data = await model.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST: Create or Update
export async function POST(request) {
    try {
        const body = await request.json();
        const { type, action, data } = body;
        const model = getModel(type);

        if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

        if (action === 'delete') {
            await model.delete({ where: { id: data.id } });
            return NextResponse.json({ success: true });
        }

        // Upsert logic
        if (data.id && typeof data.id === 'number' && data.id > 1000000) {
            // This is a temporary frontend ID (timestamp), treat as create
            const { id, ...createData } = data;
            const newItem = await model.create({ data: createData });
            return NextResponse.json(newItem);
        } else if (data.id) {
            // Update existing
            const { id, ...updateData } = data;
            const updated = await model.update({
                where: { id: Number(id) },
                data: updateData
            });
            return NextResponse.json(updated);
        } else {
            // Create new
            const newItem = await model.create({ data });
            return NextResponse.json(newItem);
        }
    } catch (e) {
        console.error('[Admin Content API] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
