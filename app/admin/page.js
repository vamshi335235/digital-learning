'use client';
import {
    LayoutDashboard, BookOpen, FileText, Package, Video,
    ShoppingBag, Users, Settings, LogOut, Plus, Edit,
    Trash2, X, Save, Menu, ShieldCheck, TrendingUp,
    PlayCircle, Eye, CheckCircle, Clock, Star, Link as LinkIcon,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getData, saveData, getPlatformData, saveItemToDB, deleteItemFromDB } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, adminUpdateUser, adminDeleteUser } from '@/lib/auth';

// ── Sidebar Tab Config ──────────────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} />, section: 'Main' },
    { id: 'courses', label: 'Courses', icon: <PlayCircle size={18} />, section: 'Content' },
    { id: 'ebooks', label: 'eBooks', icon: <FileText size={18} />, section: 'Content' },
    { id: 'bookstore', label: 'Bookstore', icon: <Package size={18} />, section: 'Content' },
    { id: 'classes', label: 'Live Classes', icon: <Video size={18} />, section: 'Content' },
    { id: 'users', label: 'Users', icon: <Users size={18} />, section: 'System' },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} />, section: 'System' },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} />, section: 'System' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, section: 'System' },
];

export default function AdminDashboard() {
    const { user, logout, isLoggedIn, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Data
    const [courses, setCourses] = useState([]);
    const [ebooks, setEbooks] = useState([]);
    const [bookstore, setBookstore] = useState([]);
    const [liveClasses, setLiveClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || loading || isLoggingOut) return;   // wait for auth to resolve
        if (!isLoggedIn || !isAdmin) {
            router.push('/auth/login');
        }
    }, [mounted, loading, isLoggedIn, isAdmin, isLoggingOut]);

    useEffect(() => {
        if (!mounted || !isAdmin) return;
        const load = async () => {
            setCourses(await getPlatformData('courses'));
            setEbooks(await getPlatformData('ebooks'));
            setBookstore(await getPlatformData('books'));
            setLiveClasses(await getPlatformData('classes'));
            setUsers(await getAllUsers());

            const ordRes = await fetch('/api/admin/orders');
            if (ordRes.ok) setOrders(await ordRes.json());

            const msgRes = await fetch('/api/admin/messages');
            if (msgRes.ok) setMessages(await msgRes.json());
        };
        load();
    }, [mounted, isAdmin]);

    if (!mounted || loading || !isAdmin) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
            <ShieldCheck size={24} style={{ marginRight: 12, color: '#10b981' }} /> Verifying admin access...
        </div>
    );

    // ── Save helpers ────────────────────────────────────────────────────────
    const commitChanges = async (type, data, singleItem = null) => {
        // Update local state for immediate feedback
        if (type === 'courses') setCourses(data);
        if (type === 'ebooks') setEbooks(data);
        if (type === 'books') setBookstore(data);
        if (type === 'classes') setLiveClasses(data);

        // Persistent local sync
        saveData(type, data);

        // Sync specific item to DB if provided
        if (singleItem) {
            try {
                const result = await saveItemToDB(type, singleItem);
                if (!result || result.error) {
                    alert('Warning: Changes saved locally but failed to sync with database: ' + (result?.error || 'Server error'));
                    return false;
                }
            } catch (e) {
                alert('Database sync error: ' + e.message);
                return false;
            }
        }
        return true;
    };

    const getTypeFromTab = () => {
        if (activeTab === 'ebooks') return 'ebooks';
        if (activeTab === 'bookstore') return 'books';
        if (activeTab === 'classes') return 'classes';
        return 'courses';
    };

    const getCurrentData = (type) => {
        if (type === 'ebooks') return ebooks;
        if (type === 'books') return bookstore;
        if (type === 'classes') return liveClasses;
        return courses;
    };

    // ── CRUD handlers ────────────────────────────────────────────────────────
    const handleDelete = async (id, type) => {
        if (!confirm('Delete this item? Changes will immediately reflect on the website and database.')) return;
        const filtered = getCurrentData(type).filter(item => item.id !== id);

        // Immediate local update
        if (type === 'courses') setCourses(filtered);
        if (type === 'ebooks') setEbooks(filtered);
        if (type === 'books') setBookstore(filtered);
        if (type === 'classes') setLiveClasses(filtered);
        saveData(type, filtered);

        // DB sync
        await deleteItemFromDB(type, id);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const type = getTypeFromTab();
        const current = getCurrentData(type);

        const updatedItem = {
            ...editingItem,
            title: fd.get('title')?.trim(),
            description: fd.get('description')?.trim(),
            category: fd.get('category')?.trim(),
            price: Number(fd.get('price')) || 0,
            originalPrice: Number(fd.get('originalPrice')) || 0,
            videoUrl: fd.get('videoUrl')?.trim() || editingItem.videoUrl || '',
            image: fd.get('image')?.trim() || editingItem.image || '',
            fileUrl: fd.get('fileUrl')?.trim() || editingItem.fileUrl || '',
            stock: Number(fd.get('stock')) || editingItem.stock || 0,
            duration: fd.get('duration')?.trim() || editingItem.duration || '',
            date: fd.get('date')?.trim() || editingItem.date || '',
            time: fd.get('time')?.trim() || editingItem.time || '',
            host: fd.get('host')?.trim() || editingItem.host || 'Uday Kantri',
            rating: fd.get('rating')?.trim() || editingItem.rating || '4.9',
            meetLink: fd.get('meetLink')?.trim() || editingItem.meetLink || '',
            status: fd.get('status') || editingItem.status || 'scheduled',
            isPublished: fd.get('isPublished') === 'on' || editingItem.isPublished !== false,
        };

        const isNew = !current.find(i => i.id === updatedItem.id || (i.id === 0 && updatedItem.id === 0));

        // Set temp ID if new to prevent errors
        if (isNew && updatedItem.id === 0) {
            updatedItem.id = Date.now();
        }

        const nextData = isNew
            ? [...current, updatedItem]
            : current.map(i => i.id === updatedItem.id ? updatedItem : i);

        setEditingItem(null); // Close modal immediately
        await commitChanges(type, nextData, updatedItem);

        // Final refresh to get real ID from DB if it was a new item
        if (isNew) {
            const freshData = await getPlatformData(type);
            if (type === 'courses') setCourses(freshData);
            if (type === 'ebooks') setEbooks(freshData);
            if (type === 'books') setBookstore(freshData);
            if (type === 'classes') setLiveClasses(freshData);
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            name: fd.get('name')?.trim(),
            role: fd.get('role'),
            phone: fd.get('phone')?.trim()
        };

        const success = await adminUpdateUser(editingUser.id, data);
        if (success) {
            setUsers(await getAllUsers());
            setEditingUser(null);
        } else {
            alert('Failed to update user.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Delete this user account permanently from database?')) return;
        const success = await adminDeleteUser(id);
        if (success) {
            setUsers(await getAllUsers());
        } else {
            alert('Failed to delete user.');
        }
    };

    const handleUpdateMessageStatus = async (id, status) => {
        const res = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', id, status })
        });
        if (res.ok) {
            setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        const res = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });
        if (res.ok) {
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    // ── Overview stats ────────────────────────────────────────────────────────
    const totalRevenue = [
        ...courses, ...ebooks, ...bookstore
    ].reduce((sum, item) => sum + (item.price * (item.sales || 0)), 0);

    const stats = [
        { label: 'Total Courses', value: courses.length, color: '#10b981', icon: <PlayCircle size={22} /> },
        { label: 'Total eBooks', value: ebooks.length, color: '#3b82f6', icon: <FileText size={22} /> },
        { label: 'Physical Books', value: bookstore.length, color: '#f59e0b', icon: <Package size={22} /> },
        { label: 'Live Classes', value: liveClasses.length, color: '#8b5cf6', icon: <Video size={22} /> },
        { label: 'Registered Users', value: users.length, color: '#ec4899', icon: <Users size={22} /> },
        { label: 'Support Messages', value: messages.length, color: '#0ea5e9', icon: <MessageSquare size={22} /> },
        { label: 'Revenue (est)', value: `₹${totalRevenue}`, color: '#059669', icon: <TrendingUp size={22} /> },
    ];

    // ── Shared section title bar ──────────────────────────────────────────────
    const titleBar = (label, type, blankItem) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
                <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>{label}</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>All changes apply immediately to the website</p>
            </div>
            {blankItem && (
                <button onClick={() => setEditingItem(blankItem)} style={btnGreen}>
                    <Plus size={16} /> Add New
                </button>
            )}
        </div>
    );

    // ── Generic content table ─────────────────────────────────────────────────
    const ContentTable = ({ items, type }) => (
        <div style={tableCard}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                        {['Title', 'Category', type === 'classes' ? 'Date/Time' : 'Price', type === 'classes' ? 'Host' : 'Video URL', 'Actions'].map(h => (
                            <th key={h} style={th}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No items yet. Click "Add New" to create one.</td></tr>
                    )}
                    {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={td}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{item.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.description?.slice(0, 60)}...</div>
                            </td>
                            <td style={td}><span style={catBadge}>{item.category}</span></td>
                            <td style={td}>
                                {type === 'classes'
                                    ? <><div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.date}</div><div style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.time}</div></>
                                    : <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{item.price}</span>
                                }
                            </td>
                            <td style={td}>
                                {type === 'classes'
                                    ? <span style={{ fontSize: '0.85rem' }}>{item.host || 'Uday Kantri'}</span>
                                    : item.videoUrl
                                        ? <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={13} /> Video set</span>
                                        : <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>⚠ No video</span>
                                }
                            </td>
                            <td style={{ ...td, textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setEditingItem(item)} style={btnEdit}><Edit size={15} /></button>
                                    <button onClick={() => handleDelete(item.id, type)} style={btnDel}><Trash2 size={15} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // ── Edit form fields per content type ─────────────────────────────────────
    const renderFields = () => {
        const isClass = activeTab === 'classes';
        const isCourse = activeTab === 'courses';
        return (
            <>
                <FormField label="Title *" name="title" defaultValue={editingItem.title} required />
                <FormField label="Description *" name="description" defaultValue={editingItem.description} type="textarea" required />

                {!isClass && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <FormField label="Price (₹) *" name="price" defaultValue={editingItem.price} type="number" />
                        <FormField label="Original Price" name="originalPrice" defaultValue={editingItem.originalPrice} type="number" />
                        <FormField label="Rating" name="rating" defaultValue={editingItem.rating || '4.9'} />
                    </div>
                )}

                <FormField label="Category *" name="category" defaultValue={editingItem.category} required />

                {isCourse && (
                    <>
                        <FormField label="Duration (e.g. 7.5 Hours)" name="duration" defaultValue={editingItem.duration} />
                        <FormField
                            label="🎬 Preview Video URL (YouTube / Vimeo / MP4) — 30s preview shown before purchase"
                            name="videoUrl"
                            defaultValue={editingItem.videoUrl}
                            placeholder="https://www.youtube.com/watch?v=..."
                            hint="Paste the full YouTube or video URL. First 30 seconds plays as preview."
                        />
                    </>
                )}

                {activeTab === 'ebooks' && (
                    <FormField
                        label="📄 eBook File URL (Secure PDF Link)"
                        name="fileUrl"
                        defaultValue={editingItem.fileUrl}
                        placeholder="https://storage.provider.com/ebook.pdf"
                        hint="The protected link provided to users after purchase."
                    />
                )}

                {activeTab === 'bookstore' && (
                    <FormField
                        label="📦 Stock Units Available"
                        name="stock"
                        defaultValue={editingItem.stock || 100}
                        type="number"
                    />
                )}

                {!isClass && (
                    <FormField
                        label="Thumbnail Image URL"
                        name="image"
                        defaultValue={editingItem.image}
                        placeholder="/assets/images/course_law.png"
                    />
                )}

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" name="isPublished" defaultChecked={editingItem.isPublished !== false} id="isPublished" />
                    <label htmlFor="isPublished" style={{ ...labelStyle, marginBottom: 0 }}>Product is Live/Published</label>
                </div>

                {isClass && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <FormField label="Date *" name="date" defaultValue={editingItem.date} placeholder="Oct 25, 2026" required />
                            <FormField label="Start Time *" name="time" defaultValue={editingItem.time} placeholder="7:00 PM IST" required />
                            <FormField label="Duration" name="duration" defaultValue={editingItem.duration} placeholder="90 mins" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormField label="Price (₹) — 0 for Free" name="price" defaultValue={editingItem.price ?? 0} type="number" required />
                            <FormField label="Host Name" name="host" defaultValue={editingItem.host || 'Uday Kantri'} />
                        </div>
                        <FormField
                            label="🔗 Google Meet Link (only paid users see this)"
                            name="meetLink"
                            defaultValue={editingItem.meetLink}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            hint="Paste the full Google Meet URL. Only users who have paid will see this link."
                        />
                        <div>
                            <label style={labelStyle}>Class Status</label>
                            <select name="status" defaultValue={editingItem.status || 'scheduled'}
                                style={{ width: '100%', padding: '0.85rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', background: '#fafafa' }}>
                                <option value="scheduled">📅 Scheduled</option>
                                <option value="live">🔴 Live Now</option>
                                <option value="completed">✅ Completed</option>
                                <option value="cancelled">❌ Cancelled</option>
                            </select>
                        </div>
                    </>
                )}
            </>
        );
    };

    const sections = ['Main', 'Content', 'System'];

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside style={{
                width: sidebarOpen ? '260px' : '0px', flexShrink: 0,
                background: '#0f172a', height: '100vh', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease',
            }}>
                {/* Brand */}
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap' }}>
                        KANTRI<span style={{ color: '#10b981' }}> ADMIN</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>Content Management Panel</div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0.75rem' }}>
                    {sections.map(section => (
                        <div key={section} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '0 0.5rem', marginBottom: '0.5rem' }}>{section}</div>
                            {TABS.filter(t => t.section === section).map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                    width: '100%', padding: '0.75rem 1rem',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: activeTab === tab.id ? 'rgba(16,185,129,0.12)' : 'transparent',
                                    border: '0',
                                    borderLeft: activeTab === tab.id ? '3px solid #10b981' : '3px solid transparent',
                                    color: activeTab === tab.id ? '#10b981' : '#64748b',
                                    fontWeight: activeTab === tab.id ? 700 : 500,
                                    fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left',
                                    borderRadius: '0 8px 8px 0', fontFamily: 'inherit',
                                    marginBottom: '2px', whiteSpace: 'nowrap', transition: '0.15s'
                                }}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.8rem 0.5rem', marginBottom: '0.8rem' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                            <div style={{ color: '#475569', fontSize: '0.7rem' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={() => {
                        setIsLoggingOut(true);
                        logout();
                        router.push('/');
                    }} style={{ width: '100%', padding: '0.65rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main ──────────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Top Bar */}
                <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem', flexShrink: 0 }}>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                        <Menu size={20} />
                    </button>
                    <div>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>{TABS.find(t => t.id === activeTab)?.label}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem', marginLeft: '8px' }}>/ Admin Panel</span>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <a href="/" target="_blank" style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Eye size={14} /> View Website
                        </a>
                    </div>
                </header>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <AnimatePresence mode="wait">

                        {/* ── OVERVIEW ── */}
                        {activeTab === 'overview' && (
                            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.4rem' }}>Dashboard Overview</h2>
                                <p style={{ color: '#64748b', marginBottom: '2rem' }}>All changes made here reflect instantly on the main website.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                                    {stats.map((s, i) => (
                                        <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                                            <div>
                                                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
                                                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick actions */}
                                <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                    {[
                                        { label: 'Add Course', tab: 'courses', color: '#10b981' },
                                        { label: 'Add eBook', tab: 'ebooks', color: '#3b82f6' },
                                        { label: 'Add Book', tab: 'bookstore', color: '#f59e0b' },
                                        { label: 'View Messages', tab: 'messages', color: '#0ea5e9' },
                                        { label: 'Add Live Class', tab: 'classes', color: '#8b5cf6' },
                                    ].map(a => (
                                        <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={{ padding: '1.2rem', background: a.color + '12', border: `1.5px solid ${a.color}30`, borderRadius: '12px', color: a.color, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            + {a.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── COURSES ── */}
                        {activeTab === 'courses' && (
                            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {titleBar(`Courses (${courses.length})`, 'courses', { id: 0, title: '', price: 0, originalPrice: 0, category: 'LLB 3 YDC OU', description: '', image: '/assets/images/course_law.png', videoUrl: '', duration: '', rating: '4.9' })}
                                <ContentTable items={courses} type="courses" />
                            </motion.div>
                        )}

                        {/* ── EBOOKS ── */}
                        {activeTab === 'ebooks' && (
                            <motion.div key="ebooks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {titleBar(`eBooks (${ebooks.length})`, 'ebooks', { id: 0, title: '', price: 0, originalPrice: 0, category: 'LLB TG-STATE', description: '', image: '/assets/images/ebook_law.png', rating: '4.9' })}
                                <ContentTable items={ebooks} type="ebooks" />
                            </motion.div>
                        )}

                        {/* ── BOOKSTORE ── */}
                        {activeTab === 'bookstore' && (
                            <motion.div key="bookstore" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {titleBar(`Physical Books (${bookstore.length})`, 'books', { id: 0, title: '', price: 0, originalPrice: 0, category: 'PHYSICAL BOOK', description: '', image: '/assets/images/book_llb.png', rating: '4.8' })}
                                <ContentTable items={bookstore} type="books" />
                            </motion.div>
                        )}

                        {/* ── LIVE CLASSES ── */}
                        {activeTab === 'classes' && (
                            <motion.div key="classes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {titleBar(`Live Classes (${liveClasses.length})`, 'classes', { id: 0, title: '', date: '', time: '', host: 'Uday Kantri', category: 'LIVE', description: '' })}
                                <ContentTable items={liveClasses} type="classes" />
                            </motion.div>
                        )}

                        {/* ── USERS ── */}
                        {activeTab === 'users' && (
                            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>Users ({users.length})</h2>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Manage registered users and their roles</p>
                                    </div>
                                </div>
                                <div style={tableCard}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                                {['User', 'Email', 'Role', 'Phone', 'Joined', 'Actions'].map(h => (
                                                    <th key={h} style={th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 && (
                                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No users registered yet.</td></tr>
                                            )}
                                            {users.map(u => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={td}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'admin' ? '#10b981' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                                                {u.name?.[0]?.toUpperCase()}
                                                            </div>
                                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={td}><span style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.email}</span></td>
                                                    <td style={td}>
                                                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: u.role === 'admin' ? '#10b98120' : '#3b82f620', color: u.role === 'admin' ? '#059669' : '#2563eb' }}>
                                                            {u.role?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td style={td}><span style={{ fontSize: '0.85rem' }}>{u.phone || '—'}</span></td>
                                                    <td style={td}><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</span></td>
                                                    <td style={{ ...td, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => setEditingUser(u)} style={btnEdit}><Edit size={15} /></button>
                                                            {u.role !== 'admin' && (
                                                                <button onClick={() => handleDeleteUser(u.id)} style={btnDel}><Trash2 size={15} /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* ── ORDERS ── */}
                        {activeTab === 'orders' && (
                            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Sales & Orders</h2>
                                        <p style={{ color: '#64748b' }}>Track all digital and physical transactions from PostgreSQL.</p>
                                    </div>
                                    <button onClick={async () => {
                                        const ordRes = await fetch('/api/admin/orders');
                                        if (ordRes.ok) setOrders(await ordRes.json());
                                    }} style={{ ...btnEdit, padding: '8px 16px', fontSize: '0.8rem' }}>Refresh Orders</button>
                                </div>

                                <div style={tableCard}>
                                    <table style={table}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                {['Customer', 'Product', 'Type', 'Amount', 'Date', 'Status'].map(h => (
                                                    <th key={h} style={th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length === 0 && (
                                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No orders found in database.</td></tr>
                                            )}
                                            {orders.map(o => (
                                                <tr key={o.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={td}>
                                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{o.userName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.userEmail}</div>
                                                    </td>
                                                    <td style={{ ...td, fontWeight: 700 }}>{o.itemTitle}</td>
                                                    <td style={td}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b' }}>{o.type}</span>
                                                    </td>
                                                    <td style={{ ...td, fontWeight: 900, color: '#10b981' }}>₹{o.amount}</td>
                                                    <td style={{ ...td, color: '#64748b', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td style={td}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: o.status === 'completed' || o.status === 'confirmed' ? '#059669' : '#b45309' }}>
                                                            {o.status?.toUpperCase() || 'PAID'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* ── MESSAGES ── */}
                        {activeTab === 'messages' && (
                            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Contact Messages</h2>
                                        <p style={{ color: '#64748b' }}>Customer inquiries from your contact form.</p>
                                    </div>
                                    <button onClick={async () => {
                                        const res = await fetch('/api/admin/messages');
                                        if (res.ok) setMessages(await res.json());
                                    }} style={{ ...btnEdit, padding: '8px 16px', fontSize: '0.8rem' }}>Refresh Messages</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                                    {messages.length === 0 && (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '20px', color: '#94a3b8' }}>
                                            📬 No messages received yet.
                                        </div>
                                    )}
                                    {messages.map(m => (
                                        <div key={m.id} style={{
                                            background: '#fff', borderRadius: '16px', padding: '1.5rem',
                                            border: '1px solid #e2e8f0', position: 'relative',
                                            boxShadow: m.status === 'new' ? '0 10px 25px rgba(16,185,129,0.08)' : 'none'
                                        }}>
                                            {m.status === 'new' && (
                                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10b981', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px' }}>NEW</div>
                                            )}

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#475569' }}>
                                                    {m.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{m.name}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.email}</div>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Subject</div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{m.subject}</div>
                                            </div>

                                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Message</div>
                                                <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.message}</div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    {new Date(m.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {m.status === 'new' && (
                                                        <button onClick={() => handleUpdateMessageStatus(m.id, 'read')} style={{ ...btnEdit, color: '#059669', background: '#ecfdf5', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800 }}>Mark as Read</button>
                                                    )}
                                                    <button onClick={() => handleDeleteMessage(m.id)} style={{ ...btnDel, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800 }}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── SETTINGS ── */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '2rem' }}>Platform Settings</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {[
                                        { label: 'Platform Name', value: 'Kantri Lawyer', hint: 'Shown in browser tab and meta tags' },
                                        { label: 'Tagline', value: 'Kantri by Awareness, Honest by Conscience', hint: 'Hero section tagline' },
                                        { label: 'Admin Email', value: 'admin@kantrilawyer.com', hint: 'Used to receive order notifications' },
                                        { label: 'Razorpay Key', value: 'rzp_test_*****', hint: 'Set in .env.local as NEXT_PUBLIC_RAZORPAY_KEY_ID' },
                                        { label: 'Preview Duration', value: '30 seconds', hint: 'Free preview duration before paywall' },
                                        { label: 'WhatsApp Number', value: '+91 XXXXX XXXXX', hint: 'Book Free Consultation button target' },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{s.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.hint}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* ── Content Edit Modal ─────────────────────────────────────────── */}
            <AnimatePresence>
                {editingItem && (
                    <>
                        <div onClick={() => setEditingItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
                        <div style={{ position: 'fixed', inset: 0, zIndex: 101, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' }}>
                            <motion.form
                                onSubmit={handleSaveItem}
                                initial={{ scale: 0.95, y: -10, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '680px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
                            >
                                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontWeight: 800 }}>{editingItem.id === 0 ? '➕ Add New' : '✏️ Edit'} {TABS.find(t => t.id === activeTab)?.label}</h3>
                                    <button type="button" onClick={() => setEditingItem(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                                </div>
                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {renderFields()}
                                </div>
                                <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                    <button type="submit" style={btnGreen}><Save size={16} /> Save &amp; Publish</button>
                                </div>
                            </motion.form>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* ── User Edit Modal ────────────────────────────────────────────── */}
            <AnimatePresence>
                {editingUser && (
                    <>
                        <div onClick={() => setEditingUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
                        <div style={{ position: 'fixed', inset: 0, zIndex: 101, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.form
                                onSubmit={handleSaveUser}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', overflow: 'hidden' }}
                            >
                                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontWeight: 800 }}>✏️ Edit User</h3>
                                    <button type="button" onClick={() => setEditingUser(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                                </div>
                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <FormField label="Full Name" name="name" defaultValue={editingUser.name} />
                                    <FormField label="Email (Read-only)" name="email" defaultValue={editingUser.email} disabled />
                                    <FormField label="Phone" name="phone" defaultValue={editingUser.phone || ''} placeholder="+91 XXXXX XXXXX" />
                                    <div>
                                        <label style={labelStyle}>Role</label>
                                        <select name="role" defaultValue={editingUser.role} style={{ width: '100%', padding: '0.85rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                                            <option value="user">User (Student)</option>
                                            <option value="admin">Admin (Instructor)</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                    <button type="submit" style={btnGreen}><Save size={16} /> Update User</button>
                                </div>
                            </motion.form>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Reusable FormField ─────────────────────────────────────────────────────
function FormField({ label, name, defaultValue, type = 'text', required, placeholder, hint, disabled }) {
    return (
        <div>
            <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
            {type === 'textarea'
                ? <textarea name={name} defaultValue={defaultValue} required={required} placeholder={placeholder} rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
                : <input type={type} name={name} defaultValue={defaultValue} required={required} placeholder={placeholder} disabled={disabled}
                    style={{ ...inputStyle, cursor: disabled ? 'not-allowed' : 'text', color: disabled ? '#9ca3af' : '#0f172a' }} />
            }
            {hint && <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>{hint}</p>}
        </div>
    );
}

// ── Shared Styles ──────────────────────────────────────────────────────────
const tableCard = { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' };
const th = { padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', background: '#fafafa' };
const td = { padding: '1rem 1.5rem', verticalAlign: 'middle' };
const catBadge = { background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 };
const btnGreen = { padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontFamily: 'inherit' };
const btnEdit = { padding: '7px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const btnDel = { padding: '7px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const inputStyle = { width: '100%', padding: '0.85rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fafafa' };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '6px' };
