import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: '#1e293b', /* Deep Slate for contrast */
            padding: '6rem 0 3rem',
            marginTop: '8rem',
            color: '#f8fafc', /* Light text for readability */
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container">
                <div className="grid-3">
                    <div>
                        <Link href="/" className="logo" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                            <span style={{ color: '#fff' }}>KANTRI</span><span className="gradient-text"> LAWYER</span>
                        </Link>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                            Kantri by Awareness, Honest by Conscience
                        </p>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <p>📞 +91 93929 07777</p>
                            <p>📧 uday@kantrilawyer.com</p>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff' }}>Quick Links</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/courses" className="nav-link">All Courses</Link></li>
                            <li><Link href="/ebooks" className="nav-link">eBooks Library</Link></li>
                            <li><Link href="/bookstore" className="nav-link">Physical Books</Link></li>
                            <li><Link href="/contact" className="nav-link">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/cancellation-and-refunds" className="nav-link">Cancellations & Refunds</Link></li>
                            <li><Link href="/shipping-policy" className="nav-link">Shipping Policy</Link></li>
                            <li><Link href="/privacy-policy" className="nav-link">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="nav-link">Terms of Service</Link></li>
                            <li><Link href="/admin/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Instructor Portal</Link></li>
                        </ul>
                    </div>
                </div>
                <div style={{
                    marginTop: '4rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.9rem'
                }}>
                    © {new Date().getFullYear()} Kantri Lawyer. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
