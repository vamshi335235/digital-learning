'use client';
import { Download, FileText, ShieldCheck, Mail, User, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function EbookDetail({ params }) {
    const [activeTab, setActiveTab] = useState('preview');

    return (
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginTop: '2rem' }}>
                {/* eBook Content */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Modern JavaScript Handbook</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                        ES6, ESNext, and everything you need to know to build world-class JavaScript applications.
                    </p>

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
                                Description
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
                                        position: 'relative'
                                    }}>
                                        <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>Chapter 1: The Foundations</h2>
                                        <p style={{ marginTop: '2rem', textAlign: 'left', lineHeight: '1.8' }}>
                                            JavaScript is a versatile language that has evolved significantly over the years. Before we dive into the advanced concepts of React and other frameworks, it is crucial to master the basics...
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
                                            PREVIEW ONLY • PREVIEW ONLY • PREVIEW ONLY
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3>About this eBook</h3>
                                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                                        This handbook covers everything from the basics of variables and functions to advanced topics like closures, prototypes, and asynchronous programming.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Purchase Card */}
                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800' }}>₹499</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px' }}>₹999</span>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginBottom: '1rem' }}>
                            Buy eBook Now
                        </button>

                        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
                            <h4 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className="text-primary" /> Security Features
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Watermarked with Your Email</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Registered User Name</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Purchase Date Stamp</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Ebook Includes:</h4>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={18} /> 245 Pages (PDF)</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={18} /> Instant Access After Purchase</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
