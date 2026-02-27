'use client';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="container" style={{ paddingBottom: '6rem', paddingTop: '4rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Get in <span className="gradient-text">Touch</span></h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Have a question or need assistance? Our expert legal education team is here to support your journey.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '4rem', maxWidth: '1100px', margin: '0 auto' }}>
                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(5, 150, 105, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                            <Phone className="text-primary" size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Call Us</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>+91 93929 07777</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                            <Mail className="text-secondary" size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email Us</h4>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>uday@kantrilawyer.com</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--surface)' }}
                    >
                        <div style={{ background: 'rgba(225, 29, 72, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                            <MapPin className="text-accent" size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Location</h4>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Hyderabad, India</p>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                            <label>Message</label>
                            <textarea placeholder="How can we help you?" style={{ minHeight: '150px' }}></textarea>
                        </div>
                        <button className="btn-primary" style={{ justifyContent: 'center', padding: '1rem', color: '#fff' }}>
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </motion.div>
            </div>

            <style jsx>{`
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 0.85rem; color: var(--text-muted); }
        .input-group input, .input-group textarea {
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.8rem;
          color: var(--text);
          width: 100%;
          font-family: inherit;
        }
        .input-group input:focus, .input-group textarea:focus {
          border-color: var(--primary);
          outline: none;
          background: #fff;
        }
      `}</style>
        </div>
    );
}
