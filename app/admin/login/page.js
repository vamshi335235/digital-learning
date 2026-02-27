'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Instructor Specific Credentials
        if (email === 'admin@platform.com' && password === 'admin123') {
            localStorage.setItem('adminAuth', 'true');
            router.push('/admin');
        } else {
            setError('Unauthorized: Administrator credentials required.');
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="auth-mesh-bg"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="admin-login-card shadow-2xl"
            >
                <div className="auth-header">
                    <div className="auth-brand">
                        <div className="brand-logo-hex">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="brand-name">
                            <h2>Studio <span className="pro-pill">PRO</span></h2>
                            <p>Instructor Control Center</p>
                        </div>
                    </div>
                </div>

                <div className="auth-body">
                    <div className="auth-intro">
                        <h1>Administrator Login</h1>
                        <p>Enter your unique master credentials to access the platform studio.</p>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="auth-error-box"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="auth-input-group">
                            <label>Superuser Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="admin@platform.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label>Master Security Key</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn-master">
                            Initialize Session <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                <div className="auth-footer">
                    <button onClick={() => router.push('/')} className="back-to-site">
                        ← Exit to public website
                    </button>
                </div>
            </motion.div>

            <style jsx>{`
                .admin-login-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Outfit', sans-serif;
                }

                .auth-mesh-bg {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: 
                        radial-gradient(at 0% 0%, rgba(5, 150, 105, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(79, 70, 229, 0.05) 0px, transparent 50%);
                    z-index: 0;
                }

                .admin-login-card {
                    width: 100%;
                    max-width: 480px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 32px;
                    padding: 3rem;
                    position: relative;
                    z-index: 1;
                }

                .auth-header {
                    margin-bottom: 3.5rem;
                }

                .auth-brand {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .brand-logo-hex {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: #ffffff;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2);
                }

                .brand-name h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pro-pill {
                    font-size: 0.7rem;
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .brand-name p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-weight: 600;
                }

                .auth-intro {
                    margin-bottom: 2.5rem;
                }

                .auth-intro h1 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }

                .auth-intro p {
                    color: #64748b;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .auth-error-box {
                    background: #fef2f2;
                    color: #ef4444;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid #fee2e2;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .auth-input-group {
                    margin-bottom: 1.5rem;
                }

                .auth-input-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                    padding-left: 4px;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    background: #f8fafc;
                    border: 2px solid #f1f5f9;
                    border-radius: 16px;
                    font-family: inherit;
                    font-size: 1rem;
                    transition: all 0.2s;
                    color: #1e293b;
                }

                .input-wrapper input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.05);
                }

                .auth-btn-master {
                    width: 100%;
                    padding: 1.2rem;
                    background: #1e293b;
                    color: #ffffff;
                    border: none;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 1rem;
                }

                .auth-btn-master:hover {
                    background: #0f172a;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
                }

                .auth-footer {
                    margin-top: 2.5rem;
                    text-align: center;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1.5rem;
                }

                .back-to-site {
                    color: #94a3b8;
                    font-weight: 600;
                    font-size: 0.85rem;
                    background: transparent;
                    border: none;
                }

                .back-to-site:hover {
                    color: var(--text);
                }
            `}</style>
        </div>
    );
}

