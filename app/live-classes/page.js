'use client';
import { useState, useEffect } from 'react';
import { Video, Clock, User, Calendar, Lock, ExternalLink, ShoppingCart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getData } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const STATUS_STYLE = {
    scheduled: { bg: '#dbeafe', color: '#1d4ed8', label: '📅 Scheduled' },
    live: { bg: '#dcfce7', color: '#15803d', label: '🔴 Live Now' },
    completed: { bg: '#f1f5f9', color: '#64748b', label: '✅ Completed' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelled' },
};

export default function LiveClassesPage() {
    const { user, isLoggedIn } = useAuth();
    const [classes, setClasses] = useState([]);
    const [showAuth, setShowAuth] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Deduplicate by id to prevent React duplicate key warnings
        const raw = getData('classes') || [];
        const seen = new Set();
        const unique = raw.filter(cls => {
            if (seen.has(cls.id)) return false;
            seen.add(cls.id);
            return true;
        });
        setClasses(unique);
    }, []);

    // Check if user has purchased a specific class
    const hasPurchased = (classId) => {
        if (!user) return false;
        const key = `user_${user.id}_purchases`;
        const purchases = JSON.parse(localStorage.getItem(key) || '[]');
        return purchases.some(p => p.id === classId && p.type === 'class');
    };

    const handleJoin = (cls) => {
        if (!isLoggedIn) { setShowAuth(true); return; }
        if (!hasPurchased(cls.id)) {
            alert('Please purchase this class to access the Google Meet link.');
            return;
        }
        window.open(cls.meetLink, '_blank');
    };

    if (!mounted) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '2rem', paddingBottom: '5rem' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                    <Video size={14} /> Live Interactive Classes
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>
                    Learn Live with Expert Faculty
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
                    Join real-time sessions on important law topics. Ask questions, interact live, and get exam-ready.
                </p>
            </div>

            {/* Access info banner */}
            <div style={{ maxWidth: '900px', margin: '0 auto 2rem', padding: '0 1.5rem' }}>
                <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Lock size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#92400e', fontWeight: 600 }}>
                        <strong>Access Control:</strong> Google Meet links are hidden until you purchase the class. After purchase, the link appears in your Dashboard → Live Classes section.
                    </p>
                </div>
            </div>

            {/* Classes Grid */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {classes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                        <Video size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p style={{ fontWeight: 700 }}>No live classes scheduled yet. Check back soon!</p>
                    </div>
                )}

                {classes.map((cls, i) => {
                    const purchased = hasPurchased(cls.id);
                    const status = STATUS_STYLE[cls.status] || STATUS_STYLE.scheduled;
                    const isCancelled = cls.status === 'cancelled';
                    const isCompleted = cls.status === 'completed';

                    return (
                        <motion.div
                            key={`${cls.id}-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            style={{
                                background: '#fff',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                padding: '2rem',
                                display: 'flex',
                                gap: '2rem',
                                alignItems: 'flex-start',
                                boxShadow: cls.status === 'live' ? '0 0 0 2px #10b981, 0 8px 24px rgba(16,185,129,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
                                opacity: isCancelled ? 0.6 : 1,
                            }}
                        >
                            {/* Left — date block */}
                            <div style={{ textAlign: 'center', minWidth: '80px', flexShrink: 0 }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                                    {cls.date?.split(' ')[1]?.replace(',', '') || '—'}
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                    {cls.date?.split(' ')[0] || ''}
                                </div>
                                <div style={{ marginTop: '8px', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: status.bg, color: status.color }}>
                                    {status.label}
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: '1px', background: '#f1f5f9', alignSelf: 'stretch', flexShrink: 0 }} />

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>{cls.title}</h2>
                                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1rem', lineHeight: 1.6 }}>{cls.description}</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', fontSize: '0.82rem', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {cls.time}</span>
                                    {cls.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Video size={14} /> {cls.duration}</span>}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {cls.host || 'Uday Kantri'}</span>
                                </div>

                                {/* Meet Link — only if purchased */}
                                {purchased && cls.meetLink && !isCancelled && (
                                    <div style={{ marginTop: '1rem', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} style={{ color: '#16a34a' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d' }}>You're enrolled!</span>
                                        <a href={cls.meetLink} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', color: '#15803d', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
                                            Join Meet <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Right — Price + CTA */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: cls.price === 0 ? '#059669' : '#0f172a' }}>
                                    {cls.price === 0 ? 'FREE' : `₹${cls.price}`}
                                </div>
                                {!isCancelled && !isCompleted && (
                                    <>
                                        {purchased ? (
                                            <button
                                                onClick={() => cls.meetLink ? window.open(cls.meetLink, '_blank') : null}
                                                style={{ marginTop: '0.75rem', padding: '0.6rem 1.2rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <ExternalLink size={14} /> Join Class
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => !isLoggedIn ? setShowAuth(true) : alert(`Seat booked! Meet link will be sent to ${user?.email}. Pay ₹${cls.price} to confirm.`)}
                                                style={{ marginTop: '0.75rem', padding: '0.6rem 1.2rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <ShoppingCart size={14} /> {cls.price === 0 ? 'Join Free' : 'Book Seat'}
                                            </button>
                                        )}
                                    </>
                                )}
                                {isCompleted && (
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Session ended</div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} redirectMessage="Login to book a live class seat" />
        </div>
    );
}
