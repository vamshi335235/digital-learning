'use client';
import { motion } from 'framer-motion';
import { Star, Clock, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ item, type }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}
        >
            <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'var(--surface)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Image Display */}
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(45deg, var(--surface), var(--surface-hover))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                    }}>
                        {type.toUpperCase()} PREVIEW
                    </div>
                )}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    backdropFilter: 'blur(4px)'
                }}>
                    {item.category}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                }}>
                    {item.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} className="text-primary" fill="currentColor" /> {item.rating || '4.8'}
                    </span>
                    {item.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {item.duration}
                        </span>
                    )}
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)'
            }}>
                <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹{item.price}</span>
                    {item.originalPrice && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '5px' }}>
                            ₹{item.originalPrice}
                        </span>
                    )}
                </div>
                <Link href={`/${type}/${item.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}
