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
            {/* Hero Section */}
            <section style={{
                textAlign: 'center',
                padding: '6rem 0',
                background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.05) 0%, transparent 70%)'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '4.4rem', marginBottom: '1.5rem', fontWeight: 800 }}
                >
                    <span className="gradient-text">Kantri Lawyer</span> <br />
                    Excellence in Legal Learning
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3rem' }}
                >
                    Kantri by Awareness, Honest by Conscience. Access world-class legal education resources tailored for your success.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                >
                    <Link href="/courses" className="btn-primary">
                        Browse Courses <ArrowRight size={20} />
                    </Link>
                    <Link href="/bookstore" className="btn-secondary">
                        Visit Bookstore
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '6rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Why Choose <span className="gradient-text">Kantri Lawyer?</span></h2>
                <div className="grid-4">
                    {features.map((f, i) => (
                        <Link key={i} href={f.link}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="glass-card"
                                style={{
                                    textAlign: 'center',
                                    padding: '2rem 1.2rem',
                                    cursor: 'pointer',
                                    height: '100%',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '20px'
                                }}
                            >
                                <div style={{
                                    background: 'rgba(5, 150, 105, 0.1)',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: 'var(--primary)'
                                }}>
                                    {f.icon}
                                </div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 800 }}>{f.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{f.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Course Section */}
            {courses.length > 0 && (
                <section style={{ padding: '8rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.8rem' }}>Featured <span className="gradient-text">Course</span></h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get started with our most popular Osmania University law course.</p>
                        </div>
                        <Link href="/courses" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                            View all courses <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) 1fr', gap: '5rem', padding: '4rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ padding: '6px 14px', background: 'var(--primary)', color: 'black', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', position: 'absolute', top: '24px', left: '24px', zIndex: 10, boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>BEST SELLER</div>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#0f172a', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
                                <img src={featuredCourse.image} alt={featuredCourse.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{featuredCourse.category}</div>
                            <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{featuredCourse.title}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
                                {featuredCourse.description}
                            </p>
                            <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{featuredCourse.price}</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{featuredCourse.originalPrice}</div>
                                </div>
                                <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '3rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>{featuredCourse.duration || '7.5h'}</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Interactive Content</div>
                                </div>
                            </div>
                            <Link href={`/courses/${featuredCourse.id}`} className="btn-primary" style={{ height: '60px', borderRadius: '18px', fontSize: '1.1rem' }}>
                                Enroll Now and Start Learning
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Premium Resources Grid */}
            <section style={{ padding: '6rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.8rem' }}>Top <span className="gradient-text">Resources</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Top rated study materials for competitive LLB preparation.</p>
                    </div>
                </div>
                <div className="grid-3">
                    {ebooks.slice(0, 1).map(item => <ProductCard key={item.id} type="ebooks" item={item} />)}
                    {books.slice(0, 1).map(item => <ProductCard key={item.id} type="bookstore" item={item} />)}
                    {courses.slice(1, 2).map(item => <ProductCard key={item.id} type="courses" item={item} />)}
                </div>
            </section>

            {/* Call to Action */}
            <section className="glass-card" style={{
                margin: '8rem 0',
                padding: '6rem 4rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
                borderRadius: '48px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Ready to start learning?</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                    Join thousands of students and start your professional legal growth today.
                </p>
                <Link href="/auth/signup" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                    Create Your Account
                </Link>
            </section>
        </div>
    );
}
