import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: '#1e293b',
            marginTop: '6rem',
            color: '#f8fafc',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <style>{`
                .footer-inner { padding: 4rem 0 2rem; }
                .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 3rem; }
                .footer-logo { margin-bottom: 0.8rem; display: inline-block; }
                .footer-tagline { color: #94a3b8; margin-bottom: 1rem; font-size: 0.9rem; line-height: 1.5; }
                .footer-contact { font-size: 0.85rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.4rem; }
                .footer-col-title { color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; }
                .footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
                .footer-bottom {
                    margin-top: 3rem; padding-top: 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    text-align: center; color: #64748b; font-size: 0.82rem;
                }
                @media (max-width: 768px) {
                    .footer-inner { padding: 2.5rem 0 1.5rem !important; }
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 2rem !important;
                    }
                    .footer-brand { grid-column: 1 / -1; }
                    .footer-bottom { margin-top: 2rem !important; font-size: 0.78rem !important; }
                }
                @media (max-width: 480px) {
                    .footer-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                    .footer-inner { padding: 2rem 0 1rem !important; }
                }
            `}</style>

            <div className="container footer-inner">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link href="/" className="logo footer-logo">
                            <span style={{ color: '#fff' }}>KANTRI</span>
                            <span className="gradient-text"> LAWYER</span>
                        </Link>
                        <p className="footer-tagline">
                            Kantri by Awareness, Honest by Conscience
                        </p>
                        <div className="footer-contact">
                            <p>📞 +91 93929 07777</p>
                            <p>📧 uday@kantrilawyer.com</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-col-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link href="/courses" className="nav-link">All Courses</Link></li>
                            <li><Link href="/ebooks" className="nav-link">eBooks Library</Link></li>
                            <li><Link href="/bookstore" className="nav-link">Physical Books</Link></li>
                            <li><Link href="/contact" className="nav-link">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="footer-col-title">Legal</h4>
                        <ul className="footer-links">
                            <li><Link href="/cancellation-and-refunds" className="nav-link">Cancellations &amp; Refunds</Link></li>
                            <li><Link href="/shipping-policy" className="nav-link">Shipping Policy</Link></li>
                            <li><Link href="/privacy-policy" className="nav-link">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="nav-link">Terms of Service</Link></li>
                            <li><Link href="/admin/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>Instructor Portal</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Kantri Lawyer. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
