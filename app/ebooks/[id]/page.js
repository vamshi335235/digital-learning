'use client';
import { Download, FileText, ShieldCheck, Mail, User, Calendar, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function EbookDetail({ params }) {
    const [activeTab, setActiveTab] = useState('preview');

    const isAP = params.id === '2';
    const isTG = params.id === '1';
    const isLaw = isAP || isTG;

    const ebookData = {
        title: isAP ? 'Last Minute Exam Prep Guide for LLB – First Semester – AP' :
            'Last Minute Exam Prep Guide for LLB – First Semester – TG',
        university: isAP ? 'Andhra University' : 'Osmania University',
        price: 299,
        originalPrice: 599,
        description: "This book is specially designed for students who start their exam preparation just one day before the exam. It is meant only for last-minute revision. You will also have another book, which is the original and official book, meant for serious, long-term preparation.",
        disclaimer: "Please note that this revision book does not give in-depth explanations of topics, and that is not required at this stage. Use this book only for final revision, not as your main study material.",
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '1rem' }}>
            <style>{`
                .ebook-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 4rem;
                    margin-top: 2rem;
                }
                .ebook-purchase-card {
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                }
                .ebook-h1 { font-size: 2.5rem; }
                .subjects-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                @media (max-width: 768px) {
                    .ebook-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .ebook-purchase-card {
                        position: static !important;
                        order: -1;
                    }
                    .ebook-h1 { font-size: clamp(1.4rem, 5vw, 2rem) !important; }
                    .subjects-grid { grid-template-columns: 1fr !important; }
                    .tab-btn { padding: 0.8rem 1rem !important; font-size: 0.85rem !important; }
                }
            `}</style>

            <div className="ebook-grid">
                {/* eBook Content */}
                <div>
                    {isLaw && <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.88rem' }}>LLB Revision Guide • {ebookData.university}</div>}
                    <h1 className="ebook-h1" style={{ marginBottom: '1rem', lineHeight: 1.3 }}>{ebookData.title}</h1>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                        {ebookData.description}
                    </p>

                    {isLaw && (
                        <div style={{
                            background: 'rgba(244, 63, 94, 0.08)',
                            border: '1px solid var(--accent)',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}>
                            <AlertTriangle className="text-accent" size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
                                <strong>Important Note:</strong> {ebookData.disclaimer}
                            </p>
                        </div>
                    )}

                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                            <button
                                className="tab-btn"
                                onClick={() => setActiveTab('preview')}
                                style={{
                                    padding: '1rem 1.5rem', whiteSpace: 'nowrap',
                                    color: activeTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : 'none',
                                    fontWeight: activeTab === 'preview' ? 700 : 400,
                                    background: 'none', border: 'none',
                                    borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                Preview Pages
                            </button>
                            <button
                                className="tab-btn"
                                onClick={() => setActiveTab('details')}
                                style={{
                                    padding: '1rem 1.5rem', whiteSpace: 'nowrap',
                                    color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: activeTab === 'details' ? 700 : 400,
                                    background: 'none', border: 'none',
                                    borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                {isLaw ? 'Syllabus Coverage' : 'Description'}
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', minHeight: '300px', background: 'var(--surface)', position: 'relative' }}>
                            {activeTab === 'preview' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1/1.4',
                                        background: 'rgba(255,255,255,0.95)', borderRadius: '4px',
                                        margin: '0 auto', maxWidth: '360px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                        padding: '1.5rem', color: '#333', position: 'relative',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                    }}>
                                        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>
                                            {isLaw ? 'Last Minute Revision' : 'Chapter 1: The Foundations'}
                                        </h2>
                                        <p style={{ marginTop: '1.5rem', textAlign: 'left', lineHeight: 1.8, fontSize: '0.85rem' }}>
                                            {isLaw
                                                ? "This guide is structured to provide high-yield summaries of all key legal principles required for the First Semester examinations..."
                                                : "JavaScript is a versatile language that has evolved significantly over the years..."}
                                        </p>
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                                            fontSize: '0.85rem', color: 'rgba(0,0,0,0.1)',
                                            fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap', width: '100%', textAlign: 'center'
                                        }}>
                                            {isLaw ? 'WATERMARK: USER@DOMAIN.COM' : 'PREVIEW ONLY • PREVIEW ONLY'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ marginBottom: '1.2rem' }}>{isLaw ? 'Subjects Covered' : 'About this eBook'}</h3>
                                    <div style={{ color: 'var(--text-muted)' }}>
                                        {isLaw ? (
                                            <div className="subjects-grid">
                                                {['Law of Contracts – I', 'Family Law – I', 'Constitutional Law – I', 'Law of Torts', 'Environmental Law'].map(s => (
                                                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <CheckCircle size={15} className="text-primary" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            "This handbook covers everything from the basics of variables and functions to advanced topics like closures, prototypes, and asynchronous programming."
                                        )}
                                    </div>
                                    {isLaw && (
                                        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--accent)', fontStyle: 'italic' }}>
                                            Note: This revision guide covers the official syllabus of {ebookData.university}.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Purchase Card — moved to top on mobile via order: -1 */}
                <div className="ebook-purchase-card">
                    <div className="glass-card" style={{ padding: '1.5rem', border: isLaw ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹{ebookData.price}</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px' }}>₹{ebookData.originalPrice}</span>
                            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, marginLeft: '8px' }}>
                                {Math.round((1 - ebookData.price / ebookData.originalPrice) * 100)}% OFF
                            </span>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginBottom: '1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}>
                            Get eBook Now
                        </button>

                        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(5,150,105,0.04)', fontSize: '0.85rem' }}>
                            <h4 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                <ShieldCheck size={16} className="text-primary" /> Anti-Piracy Measures
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={13} /> Watermarked with Your Email</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={13} /> Encrypted Digital Access</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> Non-Transferable License</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>eBook Details:</h4>
                            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={16} /> High-Yield Revision PDF</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={16} /> Instant Download After Payment</div>
                                {isLaw && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={16} /> Optimized for {ebookData.university}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
