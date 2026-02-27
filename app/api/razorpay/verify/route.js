// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            purchaseType, // "course" | "ebook" | "class"
            itemId,
            amount,
            addressInfo // For physical books
        } = await request.json();

        // 1. Verify Signature
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            console.error('RAZORPAY_KEY_SECRET is not set');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Save purchase to Database
        if (purchaseType === 'books') {
            // Physical item order
            await prisma.order.create({
                data: {
                    userId,
                    bookId: Number(itemId),
                    amount: Number(amount),
                    paymentId: razorpay_payment_id,
                    status: 'confirmed',
                    address: addressInfo?.address,
                    city: addressInfo?.city,
                    state: addressInfo?.state,
                    pincode: addressInfo?.pincode,
                    phone: addressInfo?.phone
                }
            });
        } else {
            // Digital asset purchase (Course, Ebook, Live Class)
            await prisma.purchase.create({
                data: {
                    userId,
                    type: purchaseType, // "course", "ebook", "class"
                    courseId: purchaseType === 'courses' ? Number(itemId) : null,
                    ebookId: purchaseType === 'ebooks' ? Number(itemId) : null,
                    classId: purchaseType === 'classes' ? Number(itemId) : null,
                    amount: Number(amount),
                    paymentId: razorpay_payment_id,
                    status: 'completed'
                }
            });

            // Increment sales count
            if (purchaseType === 'courses') {
                await prisma.course.update({ where: { id: Number(itemId) }, data: { sales: { increment: 1 } } });
            } else if (purchaseType === 'ebooks') {
                await prisma.ebook.update({ where: { id: Number(itemId) }, data: { sales: { increment: 1 } } });
            } else if (purchaseType === 'classes') {
                await prisma.liveClass.update({ where: { id: Number(itemId) }, data: { status: 'scheduled' } });
            }
        }

        return NextResponse.json({ success: true, message: 'Payment verified and purchase recorded' });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
