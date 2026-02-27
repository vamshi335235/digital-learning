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

// Each lesson has its own videoUrl — admin sets these through the admin panel.
// For demo, the preview lesson uses the course URL; locked lessons show the lock screen.
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
    const [tab, setTab] = useState('curriculum');
    // Track the currently playing lesson
    const [selectedLesson, setSelectedLesson] = useState(DEFAULT_CURRICULUM[0].lessons[0]);

    useEffect(() => {
        const courses = getData('courses');
        const found = courses.find(c => String(c.id) === String(id)) || courses[0];
        setCourse(found);
        // Use the course's videoUrl for the first lesson if available
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

    // Determine if a lesson is clickable
    const canPlayLesson = (lesson) => isPurchased || lesson.preview;

    const handleLessonClick = (lesson) => {
        if (canPlayLesson(lesson)) {
            setSelectedLesson(lesson);
            // Auto-scroll to player on mobile
            document.getElementById('video-player-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

            {/* ── Dark Hero Banner ── */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', paddingTop: '100px', paddingBottom: '3rem' }}>
                <div className="container">
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.2rem' }}>
                        <Link href="/courses" style={{ color: '#10b981' }}>Courses</Link> / {course.category}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
                        <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '3px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>{course.category}</span>
                        <span style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '3px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>RECORDED COURSE</span>
                    </div>
                    <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '750px' }}>{course.title}</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '680px', marginBottom: '1.8rem' }}>{course.description}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}><Star size={15} fill="currentColor" /> {course.rating || '4.9'} Rating</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}><Clock size={15} /> 7.5 Hours</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}><PlayCircle size={15} /> {totalLessons} Lessons</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}><Globe size={15} /> English / Telugu</span>
                    </div>
                </div>
            </div>

            {/* ── Main Content (2 col: player+info LEFT, curriculum RIGHT) ── */}
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '2.5rem', alignItems: 'start' }}>

                    {/* ── LEFT: Video + Info ── */}
                    <div>
                        {/* Video Area */}
                        <div id="video-player-area" style={{ marginBottom: '1.2rem', background: '#000', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                            {/* Now Playing label */}
                            <div style={{ background: '#111', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <PlayCircle size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Now Playing: <strong>{selectedLesson.title}</strong>
                                </span>
                                {!canPlayLesson(selectedLesson) && (
                                    <span style={{ marginLeft: 'auto', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Lock size={12} /> LOCKED
                                    </span>
                                )}
                            </div>
                            <VideoPlayer
                                key={selectedLesson.title}  // remount player when lesson changes
                                videoUrl={selectedLesson.videoUrl || course.videoUrl || 'https://www.youtube.com/watch?v=dD9mgeTm5vQ'}
                                isPurchased={isPurchased && !selectedLesson.preview ? true : isPurchased}
                                courseId={String(id)}
                            />
                        </div>

                        {/* What You'll Learn */}
                        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Target style={{ color: 'var(--primary)' }} size={20} /> What You'll Learn
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {OUTCOMES.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <CheckSquare size={16} style={{ color: 'var(--primary)', marginTop: '3px', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            {[
                                { icon: <Video size={22} />, label: 'Video Lessons', value: `${totalLessons} Lessons` },
                                { icon: <Users size={22} />, label: 'Taught By', value: 'Uday Kantri' },
                                { icon: <Award size={22} />, label: 'Certificate', value: 'On Completion' },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.2rem', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{s.icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{s.value}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Purchase Card + Curriculum ── */}
                    <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Purchase Card */}
                        <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.09)', border: '1.5px solid rgba(0,0,0,0.07)' }}>
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>₹{course.price}</span>
                                    <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{course.originalPrice}</span>
                                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>⏰ Limited time offer</div>
                            </div>
                            <div style={{ padding: '1.2rem 2rem' }}>
                                {isPurchased ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.9rem', background: 'rgba(5,150,105,0.1)', borderRadius: '10px', color: '#059669', fontWeight: 800, marginBottom: '0.8rem' }}>
                                        <CheckCircle size={20} /> You're Enrolled!
                                    </div>
                                ) : (
                                    <Link href={`/checkout?type=courses&id=${id}`} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        width: '100%', padding: '0.95rem',
                                        background: 'var(--primary)', color: '#fff',
                                        fontWeight: 800, fontSize: '1.05rem', borderRadius: '12px',
                                        textDecoration: 'none', marginBottom: '0.8rem'
                                    }}>
                                        <ShoppingCart size={18} /> Buy Now
                                    </Link>
                                )}
                                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>30-Day Money Back Guarantee</div>
                            </div>
                            <div style={{ padding: '0 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', marginTop: '-0.3rem' }}>
                                {[
                                    [<Video size={14} />, '7.5 Hours on-demand video'],
                                    [<PlayCircle size={14} />, `${totalLessons} structured lessons`],
                                    [<BookOpen size={14} />, 'Full Syllabus coverage'],
                                    [<Clock size={14} />, 'Lifetime Access'],
                                ].map(([icon, text], i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                                        <span style={{ color: '#10b981' }}>{icon}</span> {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum Panel (scrollable) */}
                        <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Course Curriculum</h3>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{totalLessons} lessons</span>
                            </div>

                            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                {DEFAULT_CURRICULUM.map((mod, mi) => (
                                    <div key={mi}>
                                        {/* Module Header */}
                                        <button
                                            onClick={() => setOpenModule(openModule === mi ? -1 : mi)}
                                            style={{
                                                width: '100%', padding: '0.9rem 1.5rem',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                background: 'rgba(0,0,0,0.02)', border: 'none',
                                                borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{mod.module}</div>
                                                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{mod.title}</div>
                                            </div>
                                            {openModule === mi ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>

                                        {/* Lessons List */}
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
                                                                    transition: '0.15s'
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                                                    {isActive
                                                                        ? <PlayCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                                                        : canPlay
                                                                            ? <PlayCircle size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                                                            : <Lock size={14} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                                                                    }
                                                                    <span style={{
                                                                        fontSize: '0.82rem',
                                                                        color: isActive ? 'var(--primary)' : canPlay ? 'var(--text)' : '#94a3b8',
                                                                        fontWeight: isActive ? 700 : 400,
                                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                                    }}>
                                                                        {lesson.title}
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                                                                    {lesson.preview && !isPurchased && (
                                                                        <span style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 800 }}>FREE</span>
                                                                    )}
                                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lesson.duration}</span>
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

                            {/* Unlock CTA at bottom of curriculum */}
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
