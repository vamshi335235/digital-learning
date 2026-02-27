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

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', pincode: '' });

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
            const res = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, currency: 'INR', receipt: 'receipt_' + Date.now() }),
            });
            const order = await res.json();
            if (!res.ok) throw new Error(order.message || 'Failed to create order');
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount, currency: order.currency,
                name: "Kantri Lawyer",
                description: item ? `Purchase: ${item.title}` : 'Learning Materials',
                image: "/assets/images/logo.png",
                order_id: order.id,
                handler: function (response) {
                    if (itemId) {
                        const purchased = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
                        if (!purchased.includes(itemId)) { purchased.push(itemId); localStorage.setItem('purchased_courses', JSON.stringify(purchased)); }
                    }
                    if (type === 'courses' && itemId) router.push(`/courses/${itemId}?unlocked=1`);
                    else router.push('/dashboard');
                },
                prefill: { name: formData.name, email: formData.email, contact: formData.phone },
                notes: { address: formData.address },
                theme: { color: "#10b981" },
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) { alert("Payment Failed: " + response.error.description); });
            rzp.open();
        } catch (error) {
            alert("Checkout Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1100px', paddingTop: '5rem', paddingBottom: '6rem' }}>
            <style>{`
                .checkout-h1 { font-size: 3rem; }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 3.5rem;
                }
                .checkout-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .order-summary-box { position: sticky; top: 100px; }
                .f-group { display: flex; flex-direction: column; gap: 8px; }
                .f-group label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
                .f-group input, .f-group textarea {
                    padding: 0.9rem;
                    background: var(--surface);
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    color: var(--text);
                    font-family: inherit;
                    font-size: 0.95rem;
                    transition: 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }
                .f-group input:focus, .f-group textarea:focus { border-color: var(--primary); outline: none; }
                .gradient-text { background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                @media (max-width: 768px) {
                    .checkout-h1 { font-size: clamp(1.8rem, 6vw, 2.4rem) !important; margin-bottom: 2rem !important; }
                    .checkout-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .checkout-form-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
                    .order-summary-box { position: static !important; order: -1; }
                }
            `}</style>

            <h1 className="checkout-h1" style={{ marginBottom: '3rem', fontWeight: 800 }}>
                Complete <span className="gradient-text">Checkout</span>
            </h1>

            <div className="checkout-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Personal Info */}
                    <section className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.8rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Personal Information</h3>
                        </div>
                        <div className="checkout-form-grid">
                            <div className="f-group">
                                <label>Full Name</label>
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
                                <label>Pincode</label>
                                <input type="text" placeholder="500001" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                            </div>
                        </div>
                        <div className="f-group" style={{ marginTop: '1.2rem' }}>
                            <label>Shipping Address (For Physical Items)</label>
                            <textarea placeholder="House details, Street name, Landmark" style={{ height: '90px', resize: 'vertical' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CreditCard size={20} />
                            </div>
                            <h3 style={{ margin: 0 }}>Payment Method</h3>
                        </div>
                        <div style={{ border: '2px solid var(--primary)', background: 'rgba(16,185,129,0.03)', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Razorpay Secure</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>UPI, Cards, Wallets & Netbanking</div>
                            </div>
                            <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" style={{ height: '24px', flexShrink: 0 }} />
                        </div>
                    </section>
                </div>

                {/* Order Summary */}
                <aside>
                    <div className="order-summary-box glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Order Summary</h3>
                        {item && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.2rem', background: 'rgba(5,150,105,0.05)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(5,150,105,0.15)' }}>
                                <div style={{ width: '44px', height: '44px', background: 'rgba(5,150,105,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                    <PlayCircle size={20} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '3px', fontWeight: 600 }}>{item.category}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
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

                        <div style={{ padding: '1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Payable Amount</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>₹{total}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text" placeholder="Flash Code"
                                    value={coupon} onChange={e => setCoupon(e.target.value)}
                                    style={{ flex: 1, padding: '0.8rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'inherit' }}
                                />
                                <button className="btn-secondary" onClick={() => setApplied(true)} style={{ whiteSpace: 'nowrap' }}>Apply</button>
                            </div>
                        </div>

                        <button
                            className="btn-primary" disabled={loading} onClick={makePayment}
                            style={{ width: '100%', justifyContent: 'center', height: '56px', borderRadius: '14px', fontSize: '1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            {loading ? 'Processing...' : 'Complete Secure Payment'} <ArrowRight size={18} />
                        </button>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={15} /> AES-256 Bit Encryption Active
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '5rem' }}>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
