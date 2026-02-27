'use client';
import { CreditCard, ShieldCheck, User, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getData } from '@/lib/db';
import { Suspense } from 'react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [coupon, setCoupon] = useState('');
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(null);

    const type = searchParams.get('type') || 'courses';
    const itemId = searchParams.get('id');

    useEffect(() => {
        if (itemId) {
            const allItems = getData(type);
            const found = allItems.find(i => i.id === itemId || i.id === Number(itemId));
            if (found) setItem(found);
        }
    }, [itemId, type]);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', pincode: ''
    });

    const subtotal = item ? item.price : 2398;
    const discount = applied ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    const makePayment = async () => {
        if (!formData.email || !formData.phone || !formData.name) {
            alert('Please fill in your contact details first.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order on Server
            const res = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    currency: 'INR',
                    receipt: 'receipt_' + Date.now()
                }),
            });

            const order = await res.json();

            if (!res.ok) throw new Error(order.message || 'Failed to create order');

            // 2. Initialize Razorpay Options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Kantri Lawyer",
                description: item ? `Purchase: ${item.title}` : 'Learning Materials',
                image: "/assets/images/logo.png",
                order_id: order.id,
                handler: function (response) {
                    // ✅ Mark course as purchased so VideoPlayer unlocks full access
                    if (itemId) {
                        const purchased = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
                        if (!purchased.includes(itemId)) {
                            purchased.push(itemId);
                            localStorage.setItem('purchased_courses', JSON.stringify(purchased));
                        }
                    }
                    // Redirect back to course if purchased from course page
                    if (type === 'courses' && itemId) {
                        router.push(`/courses/${itemId}?unlocked=1`);
                    } else {
                        router.push('/dashboard');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    address: formData.address,
                },
                theme: {
                    color: "#10b981",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Checkout Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1100px', paddingTop: '4rem', paddingBottom: '6rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: 800 }}>Complete <span className="gradient-text">Checkout</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Identification */}
                    <section className="glass-card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Personal Information</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="f-group">
                                <label>Your Full Name</label>
                                <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="f-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="f-group">
                                <label>Phone Number</label>
                                <input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="f-group">
                                <label>Local Area Pincode</label>
                                <input type="text" placeholder="500001" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                            </div>
                        </div>
                        <div className="f-group" style={{ marginTop: '1.5rem' }}>
                            <label>Shipping Address (For Physical Items)</label>
                            <textarea placeholder="House details, Street name, Landmark" style={{ height: '100px' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </section>

                    {/* Payment Summary */}
                    <section className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard size={20} />
                            </div>
                            <h3 style={{ margin: 0 }}>Payment Method</h3>
                        </div>

                        <div style={{ border: '2px solid var(--primary)', background: 'rgba(16, 185, 129, 0.03)', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>Razorpay Secure</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>UPI, Cards, Wallets & Netbanking</div>
                            </div>
                            <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" style={{ height: '24px' }} />
                        </div>
                    </section>
                </div>

                <aside>
                    <div className="order-summary-box glass-card" style={{ position: 'sticky', top: '120px', padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Order Summary</h3>
                        {item && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', background: 'rgba(5,150,105,0.05)', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(5,150,105,0.15)' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(5,150,105,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                    <PlayCircle size={24} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>{item.category}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Basket Total</span>
                                <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Shipping & Delivery</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span>
                            </div>
                            {applied && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                                    <span>Discount Applied</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Payable Amount</span>
                                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{total}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Flash Code"
                                    value={coupon}
                                    onChange={e => setCoupon(e.target.value)}
                                    style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff' }}
                                />
                                <button className="btn-secondary" onClick={() => setApplied(true)}>Apply</button>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            disabled={loading}
                            onClick={makePayment}
                            style={{ width: '100%', justifyContent: 'center', height: '60px', borderRadius: '16px', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Processing...' : 'Complete Secure Payment'} <ArrowRight size={20} />
                        </button>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                            <ShieldCheck size={16} /> AES-256 Bit Encryption Active
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .f-group { display: flex; flex-direction: column; gap: 8px; }
                .f-group label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
                .f-group input, .f-group textarea {
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    color: #fff;
                    font-family: inherit;
                    transition: 0.2s;
                }
                .f-group input:focus, .f-group textarea:focus { border-color: var(--primary); outline: none; background: rgba(255,255,255,0.06); }
                .gradient-text { background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '4rem' }}>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
