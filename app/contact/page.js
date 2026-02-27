'use client';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="container" style={{ paddingBottom: '6rem', paddingTop: '5rem' }}>
            <style>{`
                .contact-grid {
                    display: grid;
                    grid-template-columns: minmax(260px, 1fr) 1.5fr;
                    gap: 4rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .contact-form-inner {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .contact-hero-h1 { font-size: 3.5rem; }
                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .contact-form-inner {
                        grid-template-columns: 1fr !important;
                    }
                    .contact-hero-h1 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
                }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
                .input-group input, .input-group textarea {
                    background: #f8fafc;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 0.8rem;
                    color: var(--text);
                    width: 100%;
                    font-family: inherit;
                    font-size: 0.95rem;
                }
                .input-group input:focus, .input-group textarea:focus {
                    border-color: var(--primary);
                    outline: none;
                    background: #fff;
                }
            `}</style>

            <header style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '1rem' }}>
                <h1 className="contact-hero-h1" style={{ marginBottom: '1rem' }}>
                    Get in <span className="gradient-text">Touch</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
                    Have a question or need assistance? Our expert legal education team is here to support your journey.
                </p>
            </header>

            <div className="contact-grid">
                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(5, 150, 105, 0.1)', padding: '0.9rem', borderRadius: '12px', flexShrink: 0 }}>
                            <Phone className="text-primary" size={22} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Call Us</h4>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>+91 93929 07777</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '0.9rem', borderRadius: '12px', flexShrink: 0 }}>
                            <Mail className="text-secondary" size={22} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email Us</h4>
                            <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0, wordBreak: 'break-word' }}>uday@kantrilawyer.com</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(225, 29, 72, 0.1)', padding: '0.9rem', borderRadius: '12px', flexShrink: 0 }}>
                            <MapPin className="text-accent" size={22} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Location</h4>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Hyderabad, India</p>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ background: 'var(--surface)' }}
                >
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={20} className="text-primary" /> Send a Message
                    </h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="contact-form-inner">
                            <div className="input-group">
                                <label>Name</label>
                                <input type="text" placeholder="John Doe" />
                            </div>
                            <div className="input-group">
                                <label>Subject</label>
                                <input type="text" placeholder="Inquiry" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="you@example.com" />
                        </div>
                        <div className="input-group">
                            <label>Message</label>
                            <textarea placeholder="How can we help you?" style={{ minHeight: '140px', resize: 'vertical' }}></textarea>
                        </div>
                        <button className="btn-primary" style={{ justifyContent: 'center', padding: '1rem', color: '#fff', width: '100%' }}>
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
