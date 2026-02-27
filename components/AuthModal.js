'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginUser, registerUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose, onSuccess, redirectMessage }) {
    const { login } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
        if (mode === 'register' && !form.name) { setError('Please enter your name.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

        setLoading(true);
        try {
            let session;
            if (mode === 'login') {
                session = await loginUser({ email: form.email, password: form.password });
            } else {
                session = await registerUser({ name: form.name, email: form.email, password: form.password });
            }
            login(session);
            if (session.role === 'admin') {
                onClose?.();
                router.push('/admin');
            } else {
                onSuccess?.();
                onClose?.();
            }
        } catch (err) {
            if (err.message === 'INVALID_CREDENTIALS') setError('Invalid email or password.');
            else if (err.message === 'EMAIL_EXISTS') setError('Email already registered. Please login.');
            else setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Layer 1: Full-screen dark backdrop ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0,
                            width: '100vw', height: '100vh',
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            zIndex: 9998,
                        }}
                    />

                    {/* ── Layer 2: Scroll container (sits on top of backdrop) ── */}
                    <div
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0,
                            width: '100vw', height: '100vh',
                            zIndex: 9999,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '80px 1rem 3rem',
                        }}
                    >
                        {/* ── The Card ── */}
                        <motion.div
                            initial={{ scale: 0.92, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.92, y: -20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: '#fff',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                width: '100%',
                                maxWidth: '420px',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
                                position: 'relative',
                                flexShrink: 0,
                            }}
                        >
                            {/* Close */}
                            <button onClick={onClose} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>

                            {/* Brand */}
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '4px' }}>
                                    KANTRI<span style={{ color: '#059669' }}> LAWYER</span>
                                </div>
                                {redirectMessage && (
                                    <div style={{ fontSize: '0.8rem', color: '#059669', background: 'rgba(5,150,105,0.08)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginTop: '6px' }}>
                                        🔒 {redirectMessage}
                                    </div>
                                )}
                            </div>

                            {/* Tab Toggle */}
                            <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '12px', padding: '4px', marginBottom: '1.8rem' }}>
                                {['login', 'register'].map(m => (
                                    <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                                        flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        background: mode === m ? '#fff' : 'transparent',
                                        color: mode === m ? '#0f172a' : '#94a3b8',
                                        fontWeight: mode === m ? 800 : 500,
                                        fontSize: '0.9rem',
                                        boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                        transition: '0.2s', fontFamily: 'inherit',
                                    }}>
                                        {m === 'login' ? '👤 Login' : '✨ Register'}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {mode === 'register' && (
                                    <div style={{ position: 'relative' }}>
                                        <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input type="text" placeholder="Full Name"
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={inputStyle} />
                                    </div>
                                )}

                                <div style={{ position: 'relative' }}>
                                    <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input type="email" placeholder="Email Address"
                                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        style={inputStyle} />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input type={showPass ? 'text' : 'password'} placeholder="Password"
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                        style={inputStyle} />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {error && (
                                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                        ⚠️ {error}
                                    </div>
                                )}

                                <button type="submit" disabled={loading} style={{
                                    padding: '1rem', background: '#059669', color: '#fff',
                                    border: 'none', borderRadius: '12px', fontWeight: 800,
                                    fontSize: '1rem', cursor: loading ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    fontFamily: 'inherit', marginTop: '4px',
                                    opacity: loading ? 0.8 : 1, transition: '0.2s'
                                }}>
                                    {loading ? 'Please wait...' : mode === 'login'
                                        ? <><LogIn size={18} /> Login to Continue</>
                                        : <><UserPlus size={18} /> Create Account</>
                                    }
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                                {mode === 'login'
                                    ? <>No account? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>Register Free</button></>
                                    : <>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>Login</button></>
                                }
                            </p>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.85rem 0.85rem 0.85rem 2.8rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: '0.2s',
};
