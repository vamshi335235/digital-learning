'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getData, getPlatformData } from '@/lib/db';
import Link from 'next/link';
import { Star, Clock, ArrowRight, Video, PlayCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const CATEGORIES = ['All', 'LLB 3 YDC OU', 'LLB 3 YDC TG/AP', 'LLB 3 YDC KU', 'LLB 5 YDC', 'TS LAWCET', 'AP LAWCET', 'CLAT'];

function CoursesContent() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showAuth, setShowAuth] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const load = async () => {
            setCourses(await getPlatformData('courses'));
        };
        load();
    }, []);

    const requireAuth = (url) => {
        if (!isLoggedIn) {
            setPendingUrl(url);
            setShowAuth(true);
            return false;
        }
        return true;
    };

    const handleCourseClick = (courseId) => {
        if (requireAuth(`/courses/${courseId}`)) router.push(`/courses/${courseId}`);
    };

    const handleAuthSuccess = () => {
        setShowAuth(false);
        if (pendingUrl) router.push(pendingUrl);
    };

    const filtered = courses.filter(c =>
        activeCategory === 'All' || c.category === activeCategory
    );

    return (
        <>
            <style>{`
                .courses-hero-h1 { font-size: 3.5rem; }
                .course-card { flex-direction: row; }
                .course-thumb { width: 200px; min-height: 150px; }
                .course-bottom { flex-direction: row; }
                .course-price-btn { flex-direction: row; }
                @media (max-width: 768px) {
                    .courses-hero-h1 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
                    .course-card { flex-direction: column !important; }
                    .course-thumb { width: 100% !important; min-height: 180px !important; }
                    .course-info { padding: 1rem !important; }
                    .course-bottom { flex-direction: column !important; gap: 0.8rem !important; align-items: flex-start !important; }
                    .course-price-btn { flex-direction: row !important; justify-content: space-between; width: 100%; }
                    .course-title { font-size: 1rem !important; }
                    .cat-pills { gap: 6px !important; }
                    .cat-pill { padding: 6px 12px !important; font-size: 0.8rem !important; }
                }
            `}</style>

            <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

                {/* Hero Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '5rem 0 4rem',
                    marginTop: '70px'
                }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5,150,105,0.2)', border: '1px solid rgba(5,150,105,0.4)', padding: '5px 16px', borderRadius: '20px', marginBottom: '1.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Video size={14} /> RECORDED COURSES
                        </div>
                        <h1 className="courses-hero-h1" style={{ fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                            Master Legal <span style={{ color: '#10b981' }}>Excellence</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto', padding: '0 1rem' }}>
                            Expert-led recorded courses for Osmania, Kakatiya and all state university syllabi.
                        </p>
                    </div>
                </div>

                <div className="container" style={{ paddingTop: '3rem', paddingBottom: '8rem' }}>

                    {/* Category Filter Pills */}
                    <div className="cat-pills" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className="cat-pill"
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '30px',
                                    border: activeCategory === cat ? 'none' : '1.5px solid var(--border)',
                                    background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                                    color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                                    fontWeight: activeCategory === cat ? 700 : 500,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results count */}
                    <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2rem', fontSize: '0.95rem' }}>
                        Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
                        {activeCategory !== 'All' && <> in <strong style={{ color: 'var(--primary)' }}>{activeCategory}</strong></>}
                    </p>

                    {/* Course Cards */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
                            <Video size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem' }}>No courses found in this category.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {filtered.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card course-card"
                                    style={{
                                        padding: '0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        cursor: 'pointer',
                                        transition: 'box-shadow 0.2s, transform 0.2s'
                                    }}
                                    whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                                    onClick={() => handleCourseClick(course.id)}
                                >
                                    {/* Thumbnail */}
                                    <div className="course-thumb" style={{
                                        flexShrink: 0,
                                        background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <PlayCircle size={44} style={{ color: '#10b981', opacity: 0.7 }} />
                                        )}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                                            VIDEO
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="course-info" style={{ padding: '1.8rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
                                                {course.category}
                                            </div>
                                            <h2 className="course-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', lineHeight: 1.3 }}>{course.title}</h2>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                {course.description.length > 110 ? course.description.substring(0, 110) + '...' : course.description}
                                            </p>
                                        </div>

                                        <div className="course-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem' }}>
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                                                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> {course.rating || '4.9'}
                                                </span>
                                                {course.duration && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <Clock size={14} /> {course.duration}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="course-price-btn" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <div>
                                                    <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>₹{course.price}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>₹{course.originalPrice}</span>
                                                </div>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleCourseClick(course.id); }}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '0.7rem 1.2rem',
                                                        background: 'var(--primary)', color: '#fff',
                                                        borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
                                                        border: 'none', cursor: 'pointer', flexShrink: 0
                                                    }}
                                                >
                                                    View <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onSuccess={handleAuthSuccess}
                redirectMessage="Login to access this course"
            />
        </>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading...</div>}>
            <CoursesContent />
        </Suspense>
    );
}
