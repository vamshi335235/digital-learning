'use client';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { getData } from '@/lib/db';

function EbooksContent() {
    const searchParams = useSearchParams();
    const uni = searchParams.get('uni');
    const [ebooks, setEbooks] = useState([]);

    useEffect(() => {
        setEbooks(getData('ebooks'));
    }, []);

    return (
        <div className="container">
            <style>{`
                .ebooks-h1 { font-size: 3.5rem; }
                @media (max-width: 768px) {
                    .ebooks-h1 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
                    .ebooks-header { padding-top: 2rem !important; margin-bottom: 2rem !important; }
                }
            `}</style>

            <header className="ebooks-header" style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '4rem' }}>
                <h1 className="ebooks-h1" style={{ marginBottom: '1rem' }}>
                    Expertly Crafted <span className="gradient-text">eBooks</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', padding: '0 0.5rem' }}>
                    Access premium {uni ? uni : ''} digital resources and study guides with advanced security and watermarking.
                </p>
            </header>

            <div className="grid-3" style={{ marginBottom: '6rem' }}>
                {ebooks.map(ebook => (
                    <ProductCard key={ebook.id} item={ebook} type="ebooks" />
                ))}
            </div>
        </div>
    );
}

export default function EbooksPage() {
    return (
        <Suspense fallback={<div style={{ padding: '6rem 1rem', textAlign: 'center' }}>Loading eBooks...</div>}>
            <EbooksContent />
        </Suspense>
    );
}
