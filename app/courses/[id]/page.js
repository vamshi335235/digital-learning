'use client';
import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle, Lock, CheckCircle, Clock, Star, Globe,
    BookOpen, Target, ChevronDown, ChevronUp,
    Video, Users, Award, ShoppingCart, ArrowRight, CheckSquare
} from 'lucide-react';
import { getData } from '@/lib/db';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';

const DEFAULT_CURRICULUM = [
    {
        module: 'Module 1', title: 'Foundations of Contract Law',
        lessons: [
            { title: 'Introduction & Overview of Indian Contract Act', duration: '12 min', preview: true, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'What Constitutes a Valid Contract?', duration: '18 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Offer & Acceptance – Communication Rules', duration: '22 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Revocation of Offer (Standard & Electronic)', duration: '15 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
        ]
    },
    {
        module: 'Module 2', title: 'Consideration & Capacity',
        lessons: [
            { title: 'Doctrine of Consideration', duration: '20 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Doctrine of Privity of Contract', duration: '16 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: "Capacity of Parties – Minor's Agreement", duration: '18 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Persons Disqualified by Law', duration: '10 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
        ]
    },
    {
        module: 'Module 3', title: 'Free Consent & Lawful Object',
        lessons: [
            { title: 'Coercion, Undue Influence & Fraud', duration: '25 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Misrepresentation & Mistake', duration: '20 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Lawful Object & Public Policy', duration: '14 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Void, Voidable & Illegal Agreements', duration: '18 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
        ]
    },
    {
        module: 'Module 4', title: 'Discharge & Breach',
        lessons: [
            { title: 'Discharge by Performance & Appropriation', duration: '22 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Discharge by Novation & Remission', duration: '15 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Doctrine of Frustration (Impossibility)', duration: '20 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Breach of Contract – Actual & Anticipatory', duration: '18 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
        ]
    },
    {
        module: 'Module 5', title: 'Remedies & Specific Relief',
        lessons: [
            { title: 'Quasi Contracts & Quantum Meruit', duration: '16 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Liquidated vs Unliquidated Damages', duration: '18 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Specific Performance (2018 Amendment)', duration: '22 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
            { title: 'Preventive Relief & Injunctions', duration: '15 min', preview: false, videoUrl: 'https://www.youtube.com/watch?v=dD9mgeTm5vQ' },
        ]
    }
];

const OUTCOMES = [
    'Understand the Indian Contract Act fundamentals',
    'Learn offer, acceptance, and consideration deeply',
    'Analyze capacity, consent, and enforceability',
    'Distinguish void, voidable, illegal contracts',
    'Apply legal concepts to practical problems',
    'Ace Osmania University semester examinations'
];

export default function CourseDetail({ params }) {
    const { id } = use(params);
    const [course, setCourse] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [openModule, setOpenModule] = useState(0);
    const [selectedLesson, setSelectedLesson] = useState(DEFAULT_CURRICULUM[0].lessons[0]);

    useEffect(() => {
        const courses = getData('courses');
        const found = courses.find(c => String(c.id) === String(id)) || courses[0];
        setCourse(found);
        if (found?.videoUrl) {
            setSelectedLesson({ ...DEFAULT_CURRICULUM[0].lessons[0], videoUrl: found.videoUrl });
        }
        const purchased = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
        setIsPurchased(purchased.map(String).includes(String(id)));
    }, [id]);

    if (!course) return (
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading course...
        </div>
    );

    const totalLessons = DEFAULT_CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0);
    const canPlayLesson = (lesson) => isPurchased || lesson.preview;

    const handleLessonClick = (lesson) => {
        if (canPlayLesson(lesson)) {
            setSelectedLesson(lesson);
            document.getElementById('video-player-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <style>{`
                .cd-hero { padding-top: 100px; padding-bottom: 3rem; }
                .cd-hero h1 { font-size: 2.6rem; }
                .cd-meta { gap: 1.5rem; }
                .cd-grid {
                    display: grid;
                    grid-template-columns: 1fr 370px;
                    gap: 2.5rem;
                    align-items: start;
                }
                .cd-sidebar { position: sticky; top: 90px; }
                .cd-outcomes { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .cd-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .cd-buy-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    width: 100%; padding: 0.95rem;
                    background: var(--primary); color: #fff;
                    font-weight: 800; font-size: 1.05rem; border-radius: 12px;
                    text-decoration: none; margin-bottom: 0.8rem;
                }
                @media (max-width: 900px) {
                    .cd-grid { grid-template-columns: 1fr !important; }
                    .cd-sidebar { position: static !important; }
                }
                @media (max-width: 768px) {
                    .cd-hero { padding-top: 85px !important; padding-bottom: 2rem !important; }
                    .cd-hero h1 { font-size: clamp(1.4rem, 5vw, 2rem) !important; }
                    .cd-meta { gap: 0.8rem !important; flex-wrap: wrap !important; }
                    .cd-outcomes { grid-template-columns: 1fr !important; gap: 0.7rem !important; }
                    .cd-stats { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            {/* Dark Hero */}
            <div className="cd-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="container">
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                        <Link href="/courses" style={{ color: '#10b981' }}>Courses</Link> / {course.category}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '3px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>{course.category}</span>
                        <span style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '3px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>RECORDED COURSE</span>
                    </div>
                    <h1 style={{ fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '750px' }}>{course.title}</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '680px', marginBottom: '1.5rem' }}>{course.description}</p>
                    <div className="cd-meta" style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}><Star size={14} fill="currentColor" /> {course.rating || '4.9'} Rating</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}><Clock size={14} /> 7.5 Hours</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}><PlayCircle size={14} /> {totalLessons} Lessons</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}><Globe size={14} /> English / Telugu</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
                <div className="cd-grid">

                    {/* LEFT: Video + Info */}
                    <div>
                        <div id="video-player-area" style={{ marginBottom: '1.2rem', background: '#000', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                            <div style={{ background: '#111', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <PlayCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                                <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Now Playing: <strong>{selectedLesson.title}</strong>
                                </span>
                                {!canPlayLesson(selectedLesson) && (
                                    <span style={{ marginLeft: 'auto', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                        <Lock size={11} /> LOCKED
                                    </span>
                                )}
                            </div>
                            <VideoPlayer
                                key={selectedLesson.title}
                                videoUrl={selectedLesson.videoUrl || course.videoUrl || 'https://www.youtube.com/watch?v=dD9mgeTm5vQ'}
                                isPurchased={isPurchased && !selectedLesson.preview ? true : isPurchased}
                                courseId={String(id)}
                            />
                        </div>

                        {/* What You'll Learn */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.2rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Target style={{ color: 'var(--primary)' }} size={18} /> What You'll Learn
                            </h2>
                            <div className="cd-outcomes">
                                {OUTCOMES.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <CheckSquare size={15} style={{ color: 'var(--primary)', marginTop: '3px', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Purchase card on mobile — shown here between video and stats */}
                        <div style={{ display: 'none' }} className="cd-mobile-purchase">
                            {/* Rendered via sidebar on desktop; on mobile we duplicate via CSS trick below */}
                        </div>

                        {/* Stats */}
                        <div className="cd-stats">
                            {[
                                { icon: <Video size={20} />, label: 'Video Lessons', value: `${totalLessons} Lessons` },
                                { icon: <Users size={20} />, label: 'Taught By', value: 'Uday Kantri' },
                                { icon: <Award size={20} />, label: 'Certificate', value: 'On Completion' },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>{s.icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{s.value}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Purchase Card + Curriculum */}
                    <div className="cd-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Purchase Card */}
                        <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.09)', border: '1.5px solid rgba(0,0,0,0.07)' }}>
                            <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>₹{course.price}</span>
                                    <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{course.originalPrice}</span>
                                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>⏰ Limited time offer</div>
                            </div>
                            <div style={{ padding: '1.2rem 1.8rem' }}>
                                {isPurchased ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.9rem', background: 'rgba(5,150,105,0.1)', borderRadius: '10px', color: '#059669', fontWeight: 800, marginBottom: '0.8rem' }}>
                                        <CheckCircle size={20} /> You're Enrolled!
                                    </div>
                                ) : (
                                    <Link href={`/checkout?type=courses&id=${id}`} className="cd-buy-btn">
                                        <ShoppingCart size={18} /> Buy Now — ₹{course.price}
                                    </Link>
                                )}
                                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>30-Day Money Back Guarantee</div>
                            </div>
                            <div style={{ padding: '0 1.8rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', marginTop: '-0.3rem' }}>
                                {[
                                    [<Video size={13} />, '7.5 Hours on-demand video'],
                                    [<PlayCircle size={13} />, `${totalLessons} structured lessons`],
                                    [<BookOpen size={13} />, 'Full Syllabus coverage'],
                                    [<Clock size={13} />, 'Lifetime Access'],
                                ].map(([icon, text], i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                                        <span style={{ color: '#10b981' }}>{icon}</span> {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Course Curriculum</h3>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{totalLessons} lessons</span>
                            </div>
                            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                {DEFAULT_CURRICULUM.map((mod, mi) => (
                                    <div key={mi}>
                                        <button
                                            onClick={() => setOpenModule(openModule === mi ? -1 : mi)}
                                            style={{
                                                width: '100%', padding: '0.9rem 1.5rem',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                background: 'rgba(0,0,0,0.02)', border: 'none',
                                                borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left',
                                                fontFamily: 'inherit'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{mod.module}</div>
                                                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{mod.title}</div>
                                            </div>
                                            {openModule === mi ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                        <AnimatePresence>
                                            {openModule === mi && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    {mod.lessons.map((lesson, li) => {
                                                        const isActive = selectedLesson.title === lesson.title;
                                                        const canPlay = canPlayLesson(lesson);
                                                        return (
                                                            <div
                                                                key={li}
                                                                onClick={() => handleLessonClick(lesson)}
                                                                style={{
                                                                    padding: '0.8rem 1.5rem 0.8rem 2rem',
                                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                                                                    cursor: canPlay ? 'pointer' : 'not-allowed',
                                                                    background: isActive ? 'rgba(5,150,105,0.08)' : 'transparent',
                                                                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                                                    {isActive
                                                                        ? <PlayCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                                                        : canPlay
                                                                            ? <PlayCircle size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                                                            : <Lock size={13} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                                                                    }
                                                                    <span style={{
                                                                        fontSize: '0.82rem',
                                                                        color: isActive ? 'var(--primary)' : canPlay ? 'var(--text)' : '#94a3b8',
                                                                        fontWeight: isActive ? 700 : 400,
                                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                                    }}>{lesson.title}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                                                                    {lesson.preview && !isPurchased && (
                                                                        <span style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 800 }}>FREE</span>
                                                                    )}
                                                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{lesson.duration}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                            {!isPurchased && (
                                <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(5,150,105,0.04)', textAlign: 'center' }}>
                                    <Lock size={18} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                                        Purchase to unlock all {totalLessons} lessons
                                    </p>
                                    <Link href={`/checkout?type=courses&id=${id}`} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '0.6rem 1.5rem', background: 'var(--primary)', color: '#fff',
                                        borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none'
                                    }}>
                                        Buy Now <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
