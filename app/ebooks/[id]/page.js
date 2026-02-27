'use client';
import { Download, FileText, ShieldCheck, Mail, User, Calendar, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
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

export default function EbookDetail({ params }) {
    const [activeTab, setActiveTab] = useState('preview');
    const isMobile = useIsMobile();

    const isAP = params.id === '2';
    const isTG = params.id === '1';
    const isLaw = isAP || isTG;

    const ebookData = {
        title: isAP
            ? 'Last Minute Exam Prep Guide for LLB – First Semester – AP'
            : 'Last Minute Exam Prep Guide for LLB – First Semester – TG',
        university: isAP ? 'Andhra University' : 'Osmania University',
        price: 299,
        originalPrice: 599,
        description: "This book is specially designed for students who start their exam preparation just one day before the exam. It is meant only for last-minute revision. You will also have another book, which is the original and official book, meant for serious, long-term preparation.",
        disclaimer: "Please note that this revision book does not give in-depth explanations of topics, and that is not required at this stage. Use this book only for final revision, not as your main study material.",
    };

    const discount = Math.round((1 - ebookData.price / ebookData.originalPrice) * 100);

    const PurchaseCard = () => (
        <div style={{ background: 'var(--surface)', border: isLaw ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹{ebookData.price}</span>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1rem' }}>₹{ebookData.originalPrice}</span>
                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>{discount}% OFF</span>
            </div>

            {/* Buy Button */}
            <button style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.95rem', background: 'var(--primary)', color: '#fff', border: 'none',
                borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                fontFamily: 'inherit', marginBottom: '1.2rem', gap: '8px'
            }}>
                Get eBook Now
            </button>

            {/* Security */}
            <div style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--primary)' }} /> Anti-Piracy Measures
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={13} /> Watermarked with Your Email</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={13} /> Encrypted Digital Access</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={13} /> Non-Transferable License</div>
                </div>
            </div>

            {/* Details */}
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={15} style={{ flexShrink: 0 }} /> High-Yield Revision PDF</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={15} style={{ flexShrink: 0 }} /> Instant Download After Payment</div>
                {isLaw && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={15} style={{ flexShrink: 0 }} /> Optimized for {ebookData.university}</div>}
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem 1rem 3rem' : '1rem 2rem 4rem', boxSizing: 'border-box' }}>

            {/* Mobile: Purchase card first */}
            {isMobile && (
                <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                    <PurchaseCard />
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
                gap: isMobile ? '1.5rem' : '4rem',
                alignItems: 'start',
            }}>
                {/* LEFT: eBook content */}
                <div style={{ minWidth: 0, width: '100%' }}>
                    {isLaw && (
                        <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                            LLB Revision Guide • {ebookData.university}
                        </div>
                    )}
                    <h1 style={{
                        fontSize: isMobile ? 'clamp(1.3rem, 5vw, 1.8rem)' : '2.2rem',
                        marginBottom: '1rem', lineHeight: 1.3, wordBreak: 'break-word'
                    }}>
                        {ebookData.title}
                    </h1>
                    <p style={{ fontSize: isMobile ? '0.95rem' : '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                        {ebookData.description}
                    </p>

                    {isLaw && (
                        <div style={{
                            background: 'rgba(244,63,94,0.08)', border: '1px solid var(--accent)',
                            padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem',
                            display: 'flex', gap: '0.8rem', alignItems: 'flex-start'
                        }}>
                            <AlertTriangle size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: '0.88rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
                                <strong>Important Note:</strong> {ebookData.disclaimer}
                            </p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                            {['preview', 'details'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    padding: '0.9rem 1.2rem', whiteSpace: 'nowrap', flexShrink: 0,
                                    color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: activeTab === tab ? 700 : 400,
                                    background: 'none', border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem'
                                }}>
                                    {tab === 'preview' ? 'Preview Pages' : (isLaw ? 'Syllabus Coverage' : 'Description')}
                                </button>
                            ))}
                        </div>

                        <div style={{ padding: isMobile ? '1rem' : '1.5rem', minHeight: '250px', background: 'var(--surface)' }}>
                            {activeTab === 'preview' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1/1.4',
                                        background: 'rgba(255,255,255,0.95)', borderRadius: '8px',
                                        margin: '0 auto', maxWidth: isMobile ? '260px' : '340px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                        padding: '1.2rem', color: '#333', position: 'relative',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                    }}>
                                        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', lineHeight: 1.3 }}>
                                            {isLaw ? 'Last Minute Revision' : 'Chapter 1: The Foundations'}
                                        </h2>
                                        <p style={{ marginTop: '1rem', textAlign: 'left', lineHeight: 1.7, fontSize: '0.8rem' }}>
                                            {isLaw
                                                ? "This guide provides high-yield summaries of all key legal principles required for the First Semester examinations..."
                                                : "JavaScript is a versatile language that has evolved significantly over the years..."}
                                        </p>
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                                            fontSize: '0.7rem', color: 'rgba(0,0,0,0.08)',
                                            fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap'
                                        }}>
                                            PREVIEW ONLY
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                                        {isLaw ? 'Subjects Covered' : 'About this eBook'}
                                    </h3>
                                    {isLaw ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.8rem' }}>
                                            {['Law of Contracts – I', 'Family Law – I', 'Constitutional Law – I', 'Law of Torts', 'Environmental Law'].map(s => (
                                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                    <CheckCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {s}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                                            This handbook covers everything from basics to advanced topics like closures, prototypes, and async programming.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Purchase card (desktop only — mobile version is above) */}
                {!isMobile && (
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <PurchaseCard />
                    </div>
                )}
            </div>
        </div>
    );
}
