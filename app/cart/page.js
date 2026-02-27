'use client';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
    // Mock cart data
    const cartItems = [
        { id: 1, title: 'Law of Contracts – I', price: 1499, type: 'Course', image: '/assets/images/course_law.png' },
        { id: 101, title: 'Indian Contract Act Handbook', price: 899, type: 'Book', image: '/assets/images/book_llb.png' },
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Your <span className="gradient-text">Shopping Bag</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                className="glass-card"
                                style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--surface)' }}
                            >
                                <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{item.type.toUpperCase()}</div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.title}</h3>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹{item.price}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}><Trash2 size={18} className="text-secondary" /></button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <ShoppingBag size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                            <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
                            <Link href="/courses" className="btn-primary" style={{ marginTop: '2rem' }}>Browse Courses</Link>
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ background: 'var(--surface)', position: 'sticky', top: '120px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                            <span style={{ fontWeight: '600' }}>₹{subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                            <span style={{ color: 'var(--primary)' }}>FREE</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Total</span>
                            <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>₹{subtotal}</span>
                        </div>
                    </div>
                    <Link href="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', color: '#fff' }}>
                        Proceed to Checkout <ArrowRight size={20} />
                    </Link>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        Secure Payment Powered by Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
}
