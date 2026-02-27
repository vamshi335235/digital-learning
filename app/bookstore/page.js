'use client';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { getData, getPlatformData } from '@/lib/db';

function BookstoreContent() {
    const searchParams = useSearchParams();
    const uni = searchParams.get('uni');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const load = async () => {
            setBooks(await getPlatformData('books'));
        };
        load();
    }, []);

    return (
        <div className="container">
            <style>{`
                .bookstore-h1 { font-size: 3.5rem; }
                @media (max-width: 768px) {
                    .bookstore-h1 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
                    .bookstore-header { padding-top: 2rem !important; margin-bottom: 2rem !important; }
                }
            `}</style>

            <header className="bookstore-header" style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '4rem' }}>
                <h1 className="bookstore-h1" style={{ marginBottom: '1rem' }}>
                    Physical <span className="gradient-text">Bookstore</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', padding: '0 0.5rem' }}>
                    Quality legal textbooks and university guides delivered to your doorstep across {uni ? uni : 'India'}.
                </p>
            </header>

            <div className="grid-3" style={{ marginBottom: '6rem' }}>
                {books.map(book => (
                    <ProductCard key={book.id} item={book} type="bookstore" />
                ))}
            </div>
        </div>
    );
}

export default function BookstorePage() {
    return (
        <Suspense fallback={<div style={{ padding: '6rem 1rem', textAlign: 'center' }}>Loading Bookstore...</div>}>
            <BookstoreContent />
        </Suspense>
    );
}
