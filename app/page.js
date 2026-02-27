'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Video, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { getData } from '@/lib/db';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [ebooks, setEbooks] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        setCourses(getData('courses'));
        setEbooks(getData('ebooks'));
        setBooks(getData('books'));
    }, []);

    const features = [
        { icon: <Video className="text-primary" />, title: 'Expert Courses', desc: 'Pre-recorded video curriculum with quiz modules.', link: '/courses' },
        { icon: <BookOpen className="text-primary" />, title: 'Digital eBooks', desc: 'High-quality ebooks with watermarked security.', link: '/ebooks' },
        { icon: <Users className="text-primary" />, title: 'Live Classes', desc: 'Interactive sessions via Google Meet integration.', link: '/live-classes' },
        { icon: <ShoppingBag className="text-primary" />, title: 'Physical Bookstore', desc: 'Delivery validation with DTDC integration.', link: '/bookstore' },
    ];

    const featuredCourse = courses[0] || {
        id: 1,
        title: 'Law of Contracts – I',
        description: 'Master the Indian Contract Act with a focus on Osmania University syllabus.',
        price: 1499,
        originalPrice: 2999,
        category: 'LLB 3 YDC OU Law',
        image: '/assets/images/course_law.png'
    };

    return (
        <div className="container">
            <style>{`
                /* ── Hero ── */
                .home-hero { text-align: center; padding: 6rem 0; background: radial-gradient(circle at center, rgba(0,255,136,0.05) 0%, transparent 70%); }
                .home-hero h1 { font-size: 4.4rem; margin-bottom: 1.5rem; font-weight: 800; }
                .home-hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 800px; margin: 0 auto 3rem; }
                .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

                /* ── Why Choose ── */
                .why-section { padding: 6rem 0; }
                .why-section h2 { text-align: center; margin-bottom: 4rem; font-size: 2.5rem; }

                /* ── Featured Course ── */
                .featured-section { padding: 6rem 0; }
                .featured-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem; }
                .featured-header h2 { font-size: 2.8rem; }
                .featured-card {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 4rem;
                    padding: 3rem;
                    align-items: center;
                }
                .featured-price-row { display: flex; gap: 3rem; margin-bottom: 2.5rem; }
                .featured-price-divider { border-left: 2px solid #e2e8f0; padding-left: 3rem; }

                /* ── Resources ── */
                .resources-section { padding: 6rem 0; }
                .resources-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem; }
                .resources-header h2 { font-size: 2.8rem; }

                /* ── CTA ── */
                .cta-section {
                    margin: 6rem 0;
                    padding: 5rem 3rem;
                    text-align: center;
                    background: linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.05));
                    border-radius: 32px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .cta-section h2 { font-size: 3.5rem; margin-bottom: 1.5rem; font-weight: 800; }
                .cta-section p { color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1.1rem; max-width: 600px; margin-left: auto; margin-right: auto; }

                /* ── MOBILE ── */
                @media (max-width: 768px) {
                    .home-hero { padding: 4rem 0 3rem; }
                    .home-hero h1 { font-size: clamp(2rem, 8vw, 3rem) !important; }
                    .home-hero p { font-size: 1rem !important; padding: 0 0.5rem; margin-bottom: 2rem; }

                    .why-section { padding: 3rem 0; }
                    .why-section h2 { font-size: 1.8rem !important; margin-bottom: 2rem; }

                    .featured-section { padding: 3rem 0; }
                    .featured-header h2 { font-size: 1.8rem !important; }
                    .featured-card {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                        padding: 1.5rem !important;
                    }
                    .featured-price-row { gap: 1.5rem !important; margin-bottom: 1.5rem !important; }
                    .featured-price-divider { padding-left: 1.5rem !important; }
                    .featured-h3 { font-size: 1.4rem !important; }
                    .featured-enroll-btn { width: 100% !important; justify-content: center !important; font-size: 0.95rem !important; height: auto !important; padding: 0.9rem 1.5rem !important; border-radius: 12px !important; }

                    .resources-section { padding: 3rem 0; }
                    .resources-header h2 { font-size: 1.8rem !important; }

                    .cta-section { margin: 3rem 0 !important; padding: 3rem 1.5rem !important; border-radius: 20px !important; }
                    .cta-section h2 { font-size: clamp(1.6rem, 6vw, 2.5rem) !important; margin-bottom: 1rem !important; }
                    .cta-section p { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
                }
            `}</style>

            {/* ── Hero Section ── */}
            <section className="home-hero">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="gradient-text">Kantri Lawyer</span> <br />
                    Excellence in Legal Learning
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    Kantri by Awareness, Honest by Conscience. Access world-class legal education resources tailored for your success.
                </motion.p>
                <motion.div className="hero-btns" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Link href="/courses" className="btn-primary">
                        Browse Courses <ArrowRight size={20} />
                    </Link>
                    <Link href="/bookstore" className="btn-secondary">
                        Visit Bookstore
                    </Link>
                </motion.div>
            </section>

            {/* ── Features Grid ── */}
            <section className="why-section">
                <h2>Why Choose <span className="gradient-text">Kantri Lawyer?</span></h2>
                <div className="grid-4">
                    {features.map((f, i) => (
                        <Link key={i} href={f.link}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="glass-card"
                                style={{
                                    textAlign: 'center', padding: '2rem 1.2rem',
                                    cursor: 'pointer', height: '100%',
                                    border: '1.5px solid var(--border)', borderRadius: '20px'
                                }}
                            >
                                <div style={{
                                    background: 'rgba(5,150,105,0.1)', width: '60px', height: '60px',
                                    borderRadius: '16px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', margin: '0 auto 1.2rem', color: 'var(--primary)'
                                }}>
                                    {f.icon}
                                </div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 800 }}>{f.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Featured Course ── */}
            {courses.length > 0 && (
                <section className="featured-section">
                    <div className="featured-header">
                        <div>
                            <h2>Featured <span className="gradient-text">Course</span></h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
                                Get started with our most popular Osmania University law course.
                            </p>
                        </div>
                        <Link href="/courses" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            View all courses <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="glass-card featured-card">
                        {/* Image */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ padding: '5px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, position: 'absolute', top: '16px', left: '16px', zIndex: 10, boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                                BEST SELLER
                            </div>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#0f172a', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                                <img src={featuredCourse.image} alt={featuredCourse.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                {featuredCourse.category}
                            </div>
                            <h3 className="featured-h3" style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                                {featuredCourse.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
                                {featuredCourse.description}
                            </p>
                            <div className="featured-price-row">
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{featuredCourse.price}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{featuredCourse.originalPrice}</div>
                                </div>
                                <div className="featured-price-divider">
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{featuredCourse.duration || '7.5h'}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Interactive Content</div>
                                </div>
                            </div>
                            <Link href={`/courses/${featuredCourse.id}`} className="btn-primary featured-enroll-btn" style={{ height: '56px', borderRadius: '16px', fontSize: '1rem' }}>
                                Enroll Now and Start Learning
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Premium Resources Grid ── */}
            <section className="resources-section">
                <div className="resources-header">
                    <div>
                        <h2>Top <span className="gradient-text">Resources</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
                            Top rated study materials for competitive LLB preparation.
                        </p>
                    </div>
                </div>
                <div className="grid-3">
                    {ebooks.slice(0, 1).map(item => <ProductCard key={item.id} type="ebooks" item={item} />)}
                    {books.slice(0, 1).map(item => <ProductCard key={item.id} type="bookstore" item={item} />)}
                    {courses.slice(1, 2).map(item => <ProductCard key={item.id} type="courses" item={item} />)}
                </div>
            </section>

            {/* ── Call to Action ── */}
            <section className="cta-section glass-card">
                <h2>Ready to start learning?</h2>
                <p>Join thousands of students and start your professional legal growth today.</p>
                <Link href="/auth/signup" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                    Create Your Account
                </Link>
            </section>
        </div>
    );
}
