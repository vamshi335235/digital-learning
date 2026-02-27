'use client';
import { ShoppingCart, Truck, ShieldCheck, MapPin, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BookDetail({ params }) {
    const [pin, setPin] = useState('');
    const [pinStatus, setPinStatus] = useState(null);

    const bookData = {
        title: 'Last Minute Exam Prep Guide for LLB – First Semester – TG',
        price: 499,
        originalPrice: 999,
        category: 'LLB / Law',
        subjects: ['All 5 Subjects of Osmania University Syllabus'],
        description: "This book is specially designed for students who start their exam preparation just one day before the exam. It is meant only for last-minute revision. You will also have another book, which is the original and official book, meant for serious, long-term preparation.",
        features: [
            'Covers All 5 Subjects of Osmania University Syllabus',
            'Focused on final revision and core concepts',
            'Designed for quick reading'
        ],
        disclaimer: "Please note that this revision book does not give in-depth explanations of topics, and that is not required at this stage. Use this book only for final revision, not as your main study material."
    };

    const checkDelivery = () => {
        if (pin.length === 6) {
            setPinStatus('Available for delivery via DTDC Express');
        } else {
            setPinStatus('Invalid PIN code');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
                {/* Book Image */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '300px',
                        height: '450px',
                        background: 'var(--surface)',
                        boxShadow: 'var(--shadow)',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '2rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{bookData.title}</h2>
                        <div style={{ background: 'var(--primary)', color: 'black', padding: '5px 10px', borderRadius: '4px', fontWeight: '800', fontSize: '0.8rem' }}>TG EDITION</div>
                    </div>
                </div>

                {/* Details */}
                <div>
                    <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{bookData.category}</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{bookData.title}</h1>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Physical Book</span>
                        <span style={{ color: '#00ff88', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckCircle size={16} /> In Stock
                        </span>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>
                        ₹{bookData.price} <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem', marginLeft: '10px' }}>₹{bookData.originalPrice}</span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                        {bookData.description}
                    </p>

                    <div style={{
                        background: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid var(--accent)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <AlertTriangle className="text-accent" style={{ shrink: 0 }} />
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                            <strong>Important Note:</strong> {bookData.disclaimer}
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Truck size={18} className="text-primary" /> Check Delivery Availability
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit PIN Code"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    padding: '0.8rem',
                                    color: 'var(--text)',
                                    flex: 1
                                }}
                            />
                            <button onClick={checkDelivery} className="btn-secondary">Check</button>
                        </div>
                        {pinStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: pinStatus.includes('Available') ? 'var(--primary)' : 'var(--accent)' }}>{pinStatus}</p>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}>
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}>
                            Buy Now
                        </button>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck className="text-primary" size={20} /> 100% Authentic Material
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <MapPin className="text-primary" size={20} /> DTDC Express Shipping
                        </div>
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '6rem' }}>
                <h2 style={{ marginBottom: '2rem' }}>Book Details</h2>
                <div className="grid-3">
                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={18} className="text-primary" /> Covers Subjects
                        </h4>
                        <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <li>• Law of Contracts – I</li>
                            <li>• Family Law – I</li>
                            <li>• Constitutional Law – I</li>
                            <li>• Law of Torts</li>
                            <li>• Environmental Law</li>
                        </ul>
                    </div>
                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={18} className="text-primary" /> Ideal For
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Students requiring quick, high-yield revision just before Osmania University examinations.
                        </p>
                    </div>
                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle size={18} className="text-accent" /> Note to Students
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            From next time onwards, do not depend on last-day preparation. Start studying from the beginning using the original book for a better career.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
