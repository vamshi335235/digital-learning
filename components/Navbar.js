'use client';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const pathname = usePathname();
    const { user, logout, isLoggedIn, isAdmin } = useAuth();

    const isActive = (path) => pathname === path;

    const tgUniversities = [
        { name: 'Osmania University', short: 'OU' },
        { name: 'Kakatiya University', short: 'KU-TG' },
        { name: 'Palamuru University', short: 'PU' },
        { name: 'Satavahana University', short: 'SU' },
        { name: 'Telangana University', short: 'TU' }
    ];

    const apUniversities = [
        { name: 'Andhra University', short: 'AU' },
        { name: 'Acharya Nagarjuna University', short: 'ANU' },
        { name: 'Adikavi Nannaya University', short: 'AKNU' },
        { name: 'Andhra Kesari University', short: 'AKU' },
        { name: 'Damodaram Sanjivayya NLU', short: 'DSNLU' },
        { name: 'KL University', short: 'KLU' },
        { name: 'Krishna University', short: 'KU-AP' },
        { name: 'Rayalaseema University', short: 'RU' },
        { name: 'Sri Krishnadevaraya University', short: 'SKU' },
        { name: 'Sri Padmavati Mahila', short: 'SPMVV' },
        { name: 'Sri Venkateswara University', short: 'SVU' },
        { name: 'Vikrama Simhapuri University', short: 'VSU' },
        { name: 'Yogi Vemana University', short: 'YVU' }
    ];

    const menuItems = [
        { label: 'Courses', key: 'courses' },
        { label: 'eBooks', key: 'ebooks' },
        { label: 'Bookstore', key: 'bookstore' }
    ];

    return (
        <nav className="nav">
            <div className="container nav-content">
                <Link href="/" className="logo">
                    KANTRI<span className="gradient-text"> LAWYER</span>
                </Link>

                {/* Desktop Links with Mega Menu */}
                <div className="nav-links desktop-only">
                    <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>

                    {menuItems.map((menu) => (
                        <div
                            key={menu.key}
                            className="nav-item-dropdown"
                            onMouseEnter={() => setActiveMenu(menu.key)}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link href={`/${menu.key}`} className={`nav-link ${isActive(`/${menu.key}`) ? 'active' : ''}`}>
                                {menu.label} <ChevronDown size={14} />
                            </Link>

                            {activeMenu === menu.key && (
                                <div className="mega-menu">
                                    <div className="mega-menu-content">
                                        <div className="mega-column">
                                            <h4>Telangana (TG)</h4>
                                            <ul>
                                                {tgUniversities.map(uni => (
                                                    <li key={uni.short}>
                                                        <Link href={`/${menu.key}?uni=${uni.short}`} className={pathname.includes(uni.short) ? 'active' : ''}>
                                                            {uni.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mega-column">
                                            <h4>Andhra Pradesh (AP)</h4>
                                            <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 1rem' }}>
                                                {apUniversities.map(uni => (
                                                    <li key={uni.short}>
                                                        <Link href={`/${menu.key}?uni=${uni.short}`} className={pathname.includes(uni.short) ? 'active' : ''}>
                                                            {uni.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mega-column">
                                            <h4>Exams & Categories</h4>
                                            <ul>
                                                <li><Link href="/courses?cat=llb-3-ydc" className={pathname.includes('llb-3-ydc') ? 'active' : ''}>LLB 3 YDC</Link></li>
                                                <li><Link href="/courses?cat=llb-5-ydc" className={pathname.includes('llb-5-ydc') ? 'active' : ''}>LLB 5 YDC</Link></li>
                                                <li style={{ marginTop: '1rem' }}>
                                                    <h5 style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Entrance Exams</h5>
                                                    <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <li><Link href="/courses?cat=ts-lawcet" className={pathname.includes('ts-lawcet') ? 'active' : ''}>TS LAWCET</Link></li>
                                                        <li><Link href="/courses?cat=ap-lawcet" className={pathname.includes('ap-lawcet') ? 'active' : ''}>AP LAWCET</Link></li>
                                                        <li><Link href="/courses?cat=clat" className={pathname.includes('clat') ? 'active' : ''}>CLAT</Link></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <Link href="/live-classes" className={`nav-link ${isActive('/live-classes') ? 'active' : ''}`}>Live Classes</Link>
                    <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                </div>

                <div className="nav-links">
                    <Link href="/cart" className="nav-link"><ShoppingCart size={20} /></Link>
                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isAdmin ? (
                                // Admin → Admin Panel button
                                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 1rem', background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '10px', color: '#059669', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none' }}>
                                    🛡️ Admin Panel
                                </Link>
                            ) : (
                                // Regular user → My Dashboard
                                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 1rem', background: 'rgba(5,150,105,0.1)', borderRadius: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                                    <User size={16} /> {user?.name?.split(' ')[0]}
                                </Link>
                            )}
                            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', background: 'none', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <LogOut size={15} /> Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                            <User size={18} /> Login
                        </button>
                    )}
                    <button className="mobile-only" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
                    <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
                        <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Home</Link>
                        {menuItems.map(item => (
                            <Link key={item.key} href={`/${item.key}`} className={`nav-link ${isActive(`/${item.key}`) ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/live-classes" className={`nav-link ${isActive('/live-classes') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Live Classes</Link>
                        <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Contact</Link>
                        <hr style={{ borderColor: 'var(--border)', margin: '1rem 0', opacity: 0.1 }} />
                        <Link href="/auth/login" className="btn-primary" style={{ justifyContent: 'center', color: '#fff' }} onClick={() => setIsOpen(false)}>
                            <User size={18} /> Login / Signup
                        </Link>
                    </div>
                </div>
            )}

            <style jsx>{`
                .nav-item-dropdown {
                    position: relative;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
                .mega-menu {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffffff;
                    border: 1px solid var(--border);
                    border-radius: 0 0 16px 16px;
                    padding: 3rem;
                    min-width: 950px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.1);
                    z-index: 100;
                    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mega-menu::before {
                    content: '';
                    position: absolute;
                    top: -20px;
                    left: 0;
                    right: 0;
                    height: 20px;
                    background: transparent;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .mega-menu-content {
                    display: grid;
                    grid-template-columns: 200px 1fr 200px;
                    gap: 2rem;
                }
                .mega-column h4 {
                    font-size: 0.85rem;
                    color: var(--primary);
                    text-transform: uppercase;
                    margin-bottom: 1.2rem;
                    letter-spacing: 2px;
                    font-weight: 800;
                    border-bottom: 2px solid var(--primary);
                    display: inline-block;
                    padding-bottom: 0.3rem;
                }
                .mega-column ul {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .mega-column a {
                    font-size: 0.95rem;
                    color: var(--text-muted);
                    padding: 0.5rem 0.8rem;
                    border-radius: 6px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    position: relative;
                }
                .mega-column a::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 50%;
                    opacity: 0;
                    transition: all 0.3s ease;
                    transform: scale(0);
                }
                .mega-column a:hover::before, .mega-column a.active::before {
                    opacity: 1;
                    transform: scale(1);
                }
                .mega-column a:hover, .mega-column a.active {
                    color: var(--text);
                    background: rgba(5, 150, 105, 0.1);
                    padding-left: 1.2rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                    font-weight: 700;
                }
                
                /* Mobile Drawer Styles */
                .mobile-menu-overlay {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(8px);
                    z-index: 999;
                }
                .mobile-menu-drawer {
                    background: #ffffff;
                    padding: 3rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.8rem;
                    border-bottom: 3px solid var(--primary);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mobile-menu-drawer .nav-link:hover,
                .mobile-menu-drawer .nav-link.active {
                    background: rgba(5, 150, 105, 0.1);
                    padding-left: 2.5rem;
                    box-shadow: inset 4px 0 0 var(--primary);
                }
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 992px) {
                    .desktop-only { display: none !important; }
                }
                .desktop-only { display: flex; gap: 1rem; }
            `}</style>
        </nav>
    );
}
