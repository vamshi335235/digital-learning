'use client';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { getData } from '@/lib/db';

function BookstoreContent() {
    const searchParams = useSearchParams();
    const uni = searchParams.get('uni');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        setBooks(getData('books'));
    }, []);

    return (
        <div className="container">
            <header style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Physical <span className="gradient-text">Bookstore</span></h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto' }}>
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
        <Suspense fallback={<div>Loading Bookstore...</div>}>
            < BookstoreContent />
        </Suspense>
    );
}
