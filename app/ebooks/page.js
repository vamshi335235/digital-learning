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
            <header style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Expertly Crafted <span className="gradient-text">eBooks</span></h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto' }}>
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
        <Suspense fallback={<div>Loading eBooks...</div>}>
            <EbooksContent />
        </Suspense>
    );
}
