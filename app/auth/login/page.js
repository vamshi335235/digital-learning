'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginUser } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }

        setLoading(true);
        try {
            const session = await loginUser(form);
            login(session);
            router.push(session.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            if (err.message === 'INVALID_CREDENTIALS') setError('Invalid email or password. Please try again.');
            else setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '440px' }}
            >
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
                            KANTRI<span style={{ color: '#10b981' }}> LAWYER</span>
                        </div>
                    </Link>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Kantri by Awareness, Honest by Conscience</p>
                </div>

                <div style={{
                    background: '#fff', borderRadius: '24px', padding: '2.5rem',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
                }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', color: '#0f172a' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Login to access your courses and materials</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="email" placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ ...inputStyle, paddingTop: '0.85rem', paddingBottom: '0.85rem', paddingLeft: '2.8rem', paddingRight: '3rem' }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading} style={btnStyle}>
                            {loading ? 'Logging in...' : <><LogIn size={18} /> Login to Account</>}
                        </button>
                    </form>

                    {/* Admin hint */}
                    <div style={{ marginTop: '1.5rem', padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={16} style={{ color: '#059669', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', color: '#059669' }}>
                            Admin: <strong>admin@gmail.com</strong> / <strong>admin123</strong>
                        </span>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link href="/auth/register" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                            Register Free →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    paddingTop: '0.85rem', paddingBottom: '0.85rem',
    paddingLeft: '2.8rem', paddingRight: '0.85rem',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '0.95rem', fontFamily: 'inherit', color: '#0f172a',
    background: '#f9fafb', outline: 'none', boxSizing: 'border-box'
};

const btnStyle = {
    padding: '1rem', background: '#059669', color: '#fff',
    border: 'none', borderRadius: '12px', fontWeight: 800,
    fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    marginTop: '4px', transition: '0.2s'
};
