'use client';
import { Download, FileText, ShieldCheck, Mail, User, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function EbookDetail({ params }) {
    const [activeTab, setActiveTab] = useState('preview');

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '1rem' }}>
            <style>{`
                .eid-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 3rem;
                    margin-top: 2rem;
                }
                .eid-purchase-card { position: sticky; top: 100px; height: fit-content; }
                .eid-h1 { font-size: 2.5rem; }
                @media (max-width: 768px) {
                    .eid-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                        margin-top: 1rem !important;
                    }
                    .eid-purchase-card {
                        position: static !important;
                        order: -1;
                    }
                    .eid-h1 { font-size: clamp(1.4rem, 5vw, 2rem) !important; line-height: 1.3 !important; }
                    .eid-desc { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
                    .eid-tab-btn { padding: 0.8rem 1rem !important; font-size: 0.85rem !important; }
                    .eid-tab-body { padding: 1rem !important; min-height: 250px !important; }
                }
            `}</style>

            <div className="eid-grid">
                {/* eBook Content */}
                <div>
                    <h1 className="eid-h1" style={{ marginBottom: '0.8rem' }}>
                        The Modern JavaScript Handbook
                    </h1>
                    <p className="eid-desc" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                        ES6, ESNext, and everything you need to know to build world-class JavaScript applications.
                    </p>

                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                            <button
                                className="eid-tab-btn"
                                onClick={() => setActiveTab('preview')}
                                style={{
                                    padding: '1rem 1.5rem', whiteSpace: 'nowrap',
                                    color: activeTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: activeTab === 'preview' ? 700 : 400,
                                    background: 'none', border: 'none',
                                    borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                                    cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                Preview Pages
                            </button>
                            <button
                                className="eid-tab-btn"
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
                                Description
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="eid-tab-body" style={{ padding: '1.5rem', minHeight: '300px', background: 'var(--surface)', position: 'relative' }}>
                            {activeTab === 'preview' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1/1.4',
                                        background: 'rgba(255,255,255,0.95)', borderRadius: '4px',
                                        margin: '0 auto', maxWidth: '340px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                        padding: '1.5rem', color: '#333', position: 'relative',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                                    }}>
                                        <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', lineHeight: 1.3 }}>
                                            Chapter 1: The Foundations
                                        </h2>
                                        <p style={{ marginTop: '1.5rem', textAlign: 'left', lineHeight: 1.8, fontSize: '0.85rem' }}>
                                            JavaScript is a versatile language that has evolved significantly over the years. Before we dive into the advanced concepts of React and other frameworks, it is crucial to master the basics...
                                        </p>
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                                            fontSize: '0.75rem', color: 'rgba(0,0,0,0.1)',
                                            fontWeight: 800, pointerEvents: 'none',
                                            whiteSpace: 'nowrap', width: '100%', textAlign: 'center'
                                        }}>
                                            PREVIEW ONLY • PREVIEW ONLY
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ marginBottom: '1rem' }}>About this eBook</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                        This handbook covers everything from the basics of variables and functions to advanced topics like closures, prototypes, and asynchronous programming. Perfect for beginners and intermediate developers.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Purchase Card — shows at top on mobile */}
                <div className="eid-purchase-card">
                    <div className="glass-card" style={{ padding: '1.5rem', border: '2px solid var(--primary)' }}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹499</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px', fontSize: '0.95rem' }}>₹999</span>
                            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, marginLeft: '8px' }}>50% OFF</span>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginBottom: '1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', borderRadius: '10px' }}>
                            Buy eBook Now
                        </button>

                        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(5,150,105,0.04)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                            <h4 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                <ShieldCheck size={16} className="text-primary" /> Security Features
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={13} /> Watermarked with Your Email</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={13} /> Registered User Name</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> Purchase Date Stamp</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', fontWeight: 700 }}>eBook Includes:</h4>
                            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={15} /> 245 Pages (PDF)</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={15} /> Instant Access After Purchase</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
