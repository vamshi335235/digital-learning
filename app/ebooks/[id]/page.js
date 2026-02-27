'use client';
import { Download, FileText, ShieldCheck, Mail, User, Calendar, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function EbookDetail({ params }) {
    const [activeTab, setActiveTab] = useState('preview');

    // Hardcoded for now until DB is ready
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
        covers: `All 5 Subjects of ${isAP ? 'Andhra' : 'Osmania'} University Syllabus`
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginTop: '2rem' }}>
                {/* eBook Content */}
                <div>
                    {isLaw && <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>LLB Revision Guide • {ebookData.university}</div>}
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ebookData.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                        {ebookData.description}
                    </p>

                    {isLaw && (
                        <div style={{
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid var(--accent)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '3rem',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <AlertTriangle className="text-accent" style={{ shrink: 0 }} />
                            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                                <strong>Important Note:</strong> {ebookData.disclaimer}
                            </p>
                        </div>
                    )}

                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                            <button
                                onClick={() => setActiveTab('preview')}
                                style={{
                                    padding: '1rem 2rem',
                                    color: activeTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === 'preview' ? '2px solid var(--primary)' : 'none'
                                }}
                            >
                                Preview Pages
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                style={{
                                    padding: '1rem 2rem',
                                    color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : 'none'
                                }}
                            >
                                {isLaw ? 'Syllabus Coverage' : 'Description'}
                            </button>
                        </div>

                        <div style={{ padding: '2rem', minHeight: '400px', background: 'var(--surface)', position: 'relative' }}>
                            {activeTab === 'preview' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1/1.4',
                                        background: 'rgba(255,255,255,0.95)',
                                        borderRadius: '4px',
                                        margin: '0 auto',
                                        maxWidth: '400px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        padding: '2rem',
                                        color: '#333',
                                        position: 'relative',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}>
                                        <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>{isLaw ? 'Last Minute Revision' : 'Chapter 1: The Foundations'}</h2>
                                        <p style={{ marginTop: '2rem', textAlign: 'left', lineHeight: '1.8', fontSize: '0.9rem' }}>
                                            {isLaw
                                                ? "This guide is structured to provide high-yield summaries of all key legal principles required for the First Semester examinations. Focusing on the Indian Contract Act and related statutes..."
                                                : "JavaScript is a versatile language that has evolved significantly over the years. Before we dive into the advanced concepts of React and other frameworks, it is crucial to master the basics..."}
                                        </p>

                                        {/* Watermark Illustration */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                                            fontSize: '1rem',
                                            color: 'rgba(0,0,0,0.1)',
                                            fontWeight: '800',
                                            pointerEvents: 'none',
                                            whiteSpace: 'nowrap',
                                            width: '100%'
                                        }}>
                                            {isLaw ? 'WATERMARK: USER@DOMAIN.COM' : 'PREVIEW ONLY • PREVIEW ONLY'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3>{isLaw ? 'Subjects Covered' : 'About this eBook'}</h3>
                                    <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                                        {isLaw ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} className="text-primary" /> Law of Contracts – I</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} className="text-primary" /> Family Law – I</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} className="text-primary" /> Constitutional Law – I</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} className="text-primary" /> Law of Torts</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} className="text-primary" /> Environmental Law</div>
                                            </div>
                                        ) : (
                                            "This handbook covers everything from the basics of variables and functions to advanced topics like closures, prototypes, and asynchronous programming."
                                        )}
                                    </div>
                                    {isLaw && (
                                        <p style={{ marginTop: '2rem', fontSize: '0.85rem', italic: 'true', color: 'var(--accent)' }}>
                                            Note: This revision guide covers the official syllabus of {ebookData.university}.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Purchase Card */}
                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', border: isLaw ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800' }}>₹{ebookData.price}</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px' }}>₹{ebookData.originalPrice}</span>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginBottom: '1rem' }}>
                            Get eBook Now
                        </button>

                        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                            <h4 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className="text-primary" /> Anti-Piracy Measures
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Watermarked with Your Email</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Encrypted Digital Access</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Non-Transferable License</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Ebook Details:</h4>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={18} /> High-Yield Revision PDF</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={18} /> Instant Download After Payment</div>
                                {isLaw && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={18} /> Optimized for {ebookData.university}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
