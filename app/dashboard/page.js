'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, BookOpen, Video, Package, Settings, LogOut,
    User, Lock, Phone, Mail, CheckCircle, Edit3,
    Eye, EyeOff, Download, ExternalLink, Calendar,
    ShoppingBag, Award, Clock, AlertCircle, Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getData } from '@/lib/db';
import { getAllUsers, saveAllUsers, hashPassword, verifyPassword } from '@/lib/auth';
import Link from 'next/link';

const TABS = [
    { key: 'courses', label: 'My Courses', icon: <Play size={18} /> },
    { key: 'ebooks', label: 'My eBooks', icon: <BookOpen size={18} /> },
    { key: 'classes', label: 'Live Classes', icon: <Video size={18} /> },
    { key: 'orders', label: 'Book Orders', icon: <Package size={18} /> },
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'password', label: 'Change Password', icon: <Lock size={18} /> },
];

export default function Dashboard() {
    const { user, logout, login, isLoggedIn, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('courses');

    // Data
    const [myCourses, setMyCourses] = useState([]);
    const [myEbooks, setMyEbooks] = useState([]);
    const [myClasses, setMyClasses] = useState([]);
    const [myOrders, setMyOrders] = useState([]);

    // Profile form
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [profileMsg, setProfileMsg] = useState('');

    // Password form
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
    const [pwMsg, setPwMsg] = useState({ text: '', type: '' });

    // Redirect if not logged in OR if admin (admin has its own panel)
    useEffect(() => {
        if (loading) return;
        if (!isLoggedIn) { router.push('/auth/login'); return; }
        if (isAdmin) { router.push('/admin'); return; }
    }, [loading, isLoggedIn, isAdmin]);

    useEffect(() => {
        if (!user) return;
        setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });

        const purchasedCourseIds = JSON.parse(localStorage.getItem('purchased_courses') || '[]').map(String);
        const purchasedEbookIds = JSON.parse(localStorage.getItem('purchased_ebooks') || '[]').map(String);
        const purchasedBookIds = JSON.parse(localStorage.getItem('purchased_books') || '[]').map(String);

        const allCourses = getData('courses');
        const allEbooks = getData('ebooks');
        const allBooks = getData('books');
        const allClasses = getData('classes');

        const purchasedClassIds = JSON.parse(localStorage.getItem(`user_${user.id}_purchases`) || '[]')
            .filter(p => p.type === 'class').map(p => String(p.id));

        setMyCourses(allCourses.filter(c => purchasedCourseIds.includes(String(c.id))));
        setMyEbooks(allEbooks.filter(e => purchasedEbookIds.includes(String(e.id))));
        setMyClasses(allClasses.filter(c => purchasedClassIds.includes(String(c.id))));
        setMyOrders(allBooks.filter(b => purchasedBookIds.includes(String(b.id))));
    }, [user]);

    // ── Profile Update ──────────────────────────────────────────────────────
    const handleProfileSave = () => {
        if (!profile.name.trim()) { setProfileMsg('❌ Name cannot be empty.'); return; }
        const users = getAllUsers();
        const idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            users[idx].name = profile.name.trim();
            users[idx].phone = profile.phone.trim();
            saveAllUsers(users);
            login({ ...user, name: profile.name.trim(), phone: profile.phone.trim() });
            setProfileMsg('✅ Profile updated successfully!');
            setTimeout(() => setProfileMsg(''), 3000);
        }
    };

    // ── Password Change ─────────────────────────────────────────────────────
    const handlePasswordChange = async () => {
        setPwMsg({ text: '', type: '' });
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
            setPwMsg({ text: 'All fields are required.', type: 'error' }); return;
        }
        if (pwForm.newPw.length < 6) {
            setPwMsg({ text: 'New password must be at least 6 characters.', type: 'error' }); return;
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwMsg({ text: 'New passwords do not match.', type: 'error' }); return;
        }

        const users = getAllUsers();
        const idx = users.findIndex(u => u.email === user.email);
        if (idx === -1) { setPwMsg({ text: 'User not found.', type: 'error' }); return; }

        const valid = await verifyPassword(pwForm.current, users[idx].passwordHash);
        if (!valid) { setPwMsg({ text: 'Current password is incorrect.', type: 'error' }); return; }

        users[idx].passwordHash = await hashPassword(pwForm.newPw);
        saveAllUsers(users);
        setPwForm({ current: '', newPw: '', confirm: '' });
        setPwMsg({ text: '✅ Password changed successfully!', type: 'success' });
        setTimeout(() => setPwMsg({ text: '', type: '' }), 3000);
    };

    if (loading || !user) return (
        <div style={{ textAlign: 'center', padding: '8rem 2rem', color: 'var(--text-muted)' }}>
            Loading your dashboard...
        </div>
    );

    const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Top Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '3rem 0 5rem' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                        {initials}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
                            Welcome, {user.name?.split(' ')[0]}! 👋
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>
                    <button onClick={() => { logout(); router.push('/'); }} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '90px' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
                            {TABS.map(tab => (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                    width: '100%', padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: activeTab === tab.key ? 'rgba(5,150,105,0.07)' : 'transparent',
                                    borderLeft: activeTab === tab.key ? '3px solid #059669' : '3px solid transparent',
                                    border: 'none', borderLeft: activeTab === tab.key ? '3px solid #059669' : '3px solid transparent',
                                    color: activeTab === tab.key ? '#059669' : '#64748b',
                                    fontWeight: activeTab === tab.key ? 800 : 500,
                                    fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                                    fontFamily: 'inherit', transition: '0.15s',
                                    borderBottom: '1px solid #f1f5f9'
                                }}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', marginTop: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Summary</div>
                            {[
                                { label: 'Courses', val: myCourses.length, icon: <Play size={14} />, color: '#10b981' },
                                { label: 'eBooks', val: myEbooks.length, icon: <BookOpen size={14} />, color: '#3b82f6' },
                                { label: 'Classes', val: myClasses.length, icon: <Video size={14} />, color: '#8b5cf6' },
                                { label: 'Orders', val: myOrders.length, icon: <Package size={14} />, color: '#f59e0b' },
                            ].map(s => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                        <span style={{ color: s.color }}>{s.icon}</span> {s.label}
                                    </span>
                                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                            {/* ── MY COURSES ── */}
                            {activeTab === 'courses' && (
                                <Section title="My Courses" subtitle={`${myCourses.length} purchased course${myCourses.length !== 1 ? 's' : ''}`} icon={<Play />}>
                                    {myCourses.length === 0 ? (
                                        <EmptyState icon={<Play size={40} />} title="No Courses Yet" desc="Purchase your first course to see it here." link="/courses" linkLabel="Browse Courses" />
                                    ) : myCourses.map(course => (
                                        <div key={course.id} style={cardRow}>
                                            <div style={{ width: '80px', height: '60px', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Play size={22} style={{ color: '#10b981' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{course.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                                                    <span><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{course.duration || '7.5 Hours'}</span>
                                                    <span style={{ color: '#10b981', fontWeight: 700 }}><CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} />Enrolled</span>
                                                </div>
                                            </div>
                                            <Link href={`/courses/${course.id}`} style={greenBtn}>
                                                <Play size={15} /> Watch Now
                                            </Link>
                                        </div>
                                    ))}
                                </Section>
                            )}

                            {/* ── MY EBOOKS ── */}
                            {activeTab === 'ebooks' && (
                                <Section title="My eBooks" subtitle={`${myEbooks.length} purchased eBook${myEbooks.length !== 1 ? 's' : ''}`} icon={<BookOpen />}>
                                    {myEbooks.length === 0 ? (
                                        <EmptyState icon={<BookOpen size={40} />} title="No eBooks Yet" desc="Purchase an eBook to access it here." link="/ebooks" linkLabel="Browse eBooks" />
                                    ) : myEbooks.map(book => (
                                        <div key={book.id} style={cardRow}>
                                            <div style={{ width: '60px', height: '80px', background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <BookOpen size={22} style={{ color: '#3b82f6' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{book.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{book.category} &nbsp;·&nbsp; <span style={{ color: '#10b981', fontWeight: 700 }}>Purchased</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link href={`/ebooks/${book.id}`} style={{ ...greenBtn, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                                                    <Eye size={14} /> View
                                                </Link>
                                                <button style={{ ...greenBtn, background: 'rgba(16,185,129,0.1)', color: '#059669', border: 'none', cursor: 'pointer' }}>
                                                    <Download size={14} /> Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </Section>
                            )}

                            {/* ── LIVE CLASSES ── */}
                            {activeTab === 'classes' && (
                                <Section title="My Live Classes" subtitle="Classes you've purchased — Meet link visible here" icon={<Video />}>
                                    {myClasses.length === 0 ? (
                                        <EmptyState icon={<Video size={40} />} title="No Classes Purchased" desc="Purchase a live class to get the Google Meet link here." link="/live-classes" linkLabel="Browse Live Classes" />
                                    ) : myClasses.map(cls => (
                                        <div key={cls.id} style={cardRow}>
                                            <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Video size={22} style={{ color: '#8b5cf6' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{cls.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                    <span><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{cls.date}</span>
                                                    <span><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{cls.time}</span>
                                                    {cls.duration && <span>{cls.duration}</span>}
                                                    {cls.status && <span style={{ color: cls.status === 'live' ? '#16a34a' : '#64748b', fontWeight: 700, textTransform: 'capitalize' }}>{cls.status === 'live' ? '🔴 Live Now' : cls.status}</span>}
                                                </div>
                                            </div>
                                            {cls.meetLink && cls.status !== 'cancelled' ? (
                                                <a href={cls.meetLink} target="_blank" rel="noreferrer" style={{ ...greenBtn, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', textDecoration: 'none' }}>
                                                    <ExternalLink size={14} /> Join Meet
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                    {cls.status === 'cancelled' ? 'Cancelled' : 'Link pending'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </Section>
                            )}

                            {/* ── BOOK ORDERS ── */}
                            {activeTab === 'orders' && (
                                <Section title="Book Orders" subtitle={`${myOrders.length} order${myOrders.length !== 1 ? 's' : ''}`} icon={<Package />}>
                                    {myOrders.length === 0 ? (
                                        <EmptyState icon={<ShoppingBag size={40} />} title="No Orders Yet" desc="Purchase a physical book to track it here." link="/bookstore" linkLabel="Visit Bookstore" />
                                    ) : myOrders.map(book => (
                                        <div key={book.id} style={cardRow}>
                                            <div style={{ width: '56px', height: '56px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Package size={22} style={{ color: '#f59e0b' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{book.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                                                    <span>₹{book.price}</span>
                                                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>📦 Processing</span>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                                                ✓ Paid
                                            </div>
                                        </div>
                                    ))}
                                </Section>
                            )}

                            {/* ── PROFILE ── */}
                            {activeTab === 'profile' && (
                                <Section title="Profile Details" subtitle="Update your personal information" icon={<User />}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '520px' }}>
                                        <Field icon={<User size={16} />} label="Full Name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} placeholder="Your full name" />
                                        <Field icon={<Mail size={16} />} label="Email Address" value={profile.email} disabled placeholder="Email cannot be changed" hint="Email is your login ID and cannot be changed." />
                                        <Field icon={<Phone size={16} />} label="Phone Number (Optional)" value={profile.phone} onChange={v => setProfile({ ...profile, phone: v })} placeholder="+91 98765 43210" type="tel" />

                                        {profileMsg && (
                                            <div style={{ padding: '10px 16px', background: profileMsg.startsWith('✅') ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', color: profileMsg.startsWith('✅') ? '#059669' : '#dc2626', fontWeight: 600, fontSize: '0.88rem' }}>
                                                {profileMsg}
                                            </div>
                                        )}

                                        <button onClick={handleProfileSave} style={{ ...greenBtn, padding: '0.9rem 2rem', justifyContent: 'center', fontSize: '1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </div>
                                </Section>
                            )}

                            {/* ── CHANGE PASSWORD ── */}
                            {activeTab === 'password' && (
                                <Section title="Change Password" subtitle="Keep your account secure" icon={<Lock />}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '520px' }}>
                                        <PwField label="Current Password" value={pwForm.current} show={showPw.current} onChange={v => setPwForm({ ...pwForm, current: v })} onToggle={() => setShowPw({ ...showPw, current: !showPw.current })} />
                                        <PwField label="New Password" value={pwForm.newPw} show={showPw.newPw} onChange={v => setPwForm({ ...pwForm, newPw: v })} onToggle={() => setShowPw({ ...showPw, newPw: !showPw.newPw })} />
                                        <PwField label="Confirm New Password" value={pwForm.confirm} show={showPw.confirm} onChange={v => setPwForm({ ...pwForm, confirm: v })} onToggle={() => setShowPw({ ...showPw, confirm: !showPw.confirm })} />

                                        {pwMsg.text && (
                                            <div style={{ padding: '10px 16px', background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', color: pwMsg.type === 'success' ? '#059669' : '#dc2626', fontWeight: 600, fontSize: '0.88rem' }}>
                                                {pwMsg.text}
                                            </div>
                                        )}

                                        <button onClick={handlePasswordChange} style={{ ...greenBtn, padding: '0.9rem 2rem', justifyContent: 'center', fontSize: '1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>
                                            <Lock size={16} /> Update Password
                                        </button>
                                    </div>
                                </Section>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// ── Reusable Sub-components ─────────────────────────────────────────────────

function Section({ title, subtitle, icon, children }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ color: '#059669' }}>{icon}</div>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{title}</h2>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>{subtitle}</p>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
        </div>
    );
}

function EmptyState({ icon, title, desc, link, linkLabel }) {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
            <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{desc}</p>
            <Link href={link} style={{ ...greenBtn, textDecoration: 'none', display: 'inline-flex' }}>{linkLabel} →</Link>
        </div>
    );
}

function Field({ icon, label, value, onChange, disabled, placeholder, hint, type = 'text' }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>{icon}</span>
                <input type={type} value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled} placeholder={placeholder}
                    style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.8rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', color: disabled ? '#9ca3af' : '#0f172a', background: disabled ? '#f8fafc' : '#fff', outline: 'none', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'text' }} />
            </div>
            {hint && <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>{hint}</p>}
        </div>
    );
}

function PwField({ label, value, show, onChange, onToggle }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••"
                    style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 2.8rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}

// ── Shared Styles ─────────────────────────────────────────────────────────
const cardRow = {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1.2rem 1.5rem',
    background: '#fff', borderRadius: '14px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const greenBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '0.6rem 1.2rem',
    background: 'rgba(5,150,105,0.1)', color: '#059669',
    borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
    flexShrink: 0, transition: '0.2s', textDecoration: 'none',
};
