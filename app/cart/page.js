'use client';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

export default function CartPage() {
    const isMobile = useIsMobile();

    const cartItems = [
        { id: 1, title: 'Law of Contracts – I', price: 1499, type: 'Course', image: '/assets/images/course_law.png' },
        { id: 101, title: 'Indian Contract Act Handbook', price: 899, type: 'Book', image: '/assets/images/book_llb.png' },
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    const OrderSummary = () => (
        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 800 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cartItems.length} items)</span>
                    <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span>
                </div>
                <div style={{
                    borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.3rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                        ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>
            <Link href="/checkout" style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '0.95rem', background: 'var(--primary)', color: '#fff',
                borderRadius: '10px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                boxSizing: 'border-box'
            }}>
                Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.8rem' }}>
                🔒 Secure Payment via Razorpay
            </p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '4rem 1rem 4rem' : '4rem 2rem 6rem', boxSizing: 'border-box' }}>

            <h1 style={{
                fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : '3rem',
                marginBottom: isMobile ? '1.5rem' : '2.5rem',
                fontWeight: 800
            }}>
                Your <span className="gradient-text">Shopping Bag</span>
            </h1>

            {/* On mobile: order summary appears FIRST above cart items */}
            {isMobile && cartItems.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <OrderSummary />
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
                gap: isMobile ? '1rem' : '3rem',
                alignItems: 'start'
            }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex', gap: '1rem', alignItems: 'center',
                                    background: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: '12px', padding: '1rem',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    width: isMobile ? '72px' : '90px',
                                    height: isMobile ? '72px' : '90px',
                                    borderRadius: '8px', overflow: 'hidden',
                                    background: '#eee', flexShrink: 0
                                }}>
                                    <img
                                        src={item.image} alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                                        {item.type}
                                    </div>
                                    <h3 style={{
                                        fontSize: isMobile ? '0.92rem' : '1.05rem',
                                        fontWeight: 700, marginBottom: '4px', lineHeight: 1.3,
                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                    }}>
                                        {item.title}
                                    </h3>
                                    <div style={{ fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: 800, color: 'var(--text)' }}>
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                {/* Remove button */}
                                <button style={{
                                    padding: '0.5rem', borderRadius: '8px',
                                    border: '1px solid var(--border)', background: 'none',
                                    cursor: 'pointer', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ef4444', transition: 'background 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <Trash2 size={isMobile ? 16 : 18} />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '4rem 2rem',
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: '16px'
                        }}>
                            <ShoppingBag size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2, display: 'block' }} />
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                            <Link href="/courses" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '0.8rem 1.8rem', background: 'var(--primary)', color: '#fff',
                                borderRadius: '10px', fontWeight: 700, textDecoration: 'none'
                            }}>
                                Browse Courses <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Order Summary — desktop only (mobile version is rendered above) */}
                {!isMobile && (
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <OrderSummary />
                    </div>
                )}
            </div>
        </div>
    );
}
