'use client';
import { useState, useRef, useEffect } from 'react';
import { Lock, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PREVIEW_SECONDS = 30;

export default function VideoPlayer({ videoUrl, isPurchased, courseId }) {
    const [isLocked, setIsLocked] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(PREVIEW_SECONDS);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const timerRef = useRef(null);
    const countdownRef = useRef(null);
    const ytContainerId = `yt-player-${courseId}`;

    const isYoutube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');

    // Extract YouTube Video ID
    const getYouTubeId = (url) => {
        if (!url) return '';
        const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : '';
    };

    // ─── YouTube IFrame API ────────────────────────────────────────────────────
    useEffect(() => {
        if (!isYoutube || isPurchased) return;

        const videoId = getYouTubeId(videoUrl);
        if (!videoId) return;

        // Load the YouTube IFrame API script once
        const loadYTScript = () => {
            if (window.YT && window.YT.Player) {
                initPlayer(videoId);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.head.appendChild(script);
            window.onYouTubeIframeAPIReady = () => initPlayer(videoId);
        };

        const initPlayer = (videoId) => {
            if (playerRef.current) return; // Already initialized
            playerRef.current = new window.YT.Player(ytContainerId, {
                videoId,
                playerVars: { autoplay: 0, controls: 1, rel: 0, modestbranding: 1 },
                events: {
                    onStateChange: (event) => {
                        // PLAYING
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            startCountdown();
                        }
                        // PAUSED or ENDED — stop countdown
                        if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                            clearCountdown();
                        }
                    }
                }
            });
        };

        loadYTScript();

        return () => {
            clearCountdown();
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [isYoutube, isPurchased, videoUrl]);

    // ─── Countdown Logic ───────────────────────────────────────────────────────
    const startCountdown = () => {
        if (timerRef.current) return; // Already running
        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    lockVideo();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const clearCountdown = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const lockVideo = () => {
        clearCountdown();
        setIsLocked(true);
        // Stop YouTube player exactly at 30s
        if (playerRef.current && playerRef.current.stopVideo) {
            playerRef.current.stopVideo();
        }
        // Stop native video exactly at 30s
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = PREVIEW_SECONDS;
        }
    };

    // ─── Native Video Handler ──────────────────────────────────────────────────
    const handleTimeUpdate = () => {
        if (!isPurchased && videoRef.current) {
            const current = videoRef.current.currentTime;
            const remaining = Math.max(0, PREVIEW_SECONDS - Math.floor(current));
            setSecondsLeft(remaining);
            if (current >= PREVIEW_SECONDS) {
                lockVideo();
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>

            {/* YouTube Player */}
            {isYoutube ? (
                <div id={ytContainerId} style={{ width: '100%', height: '100%' }} />
            ) : (
                /* Native Video */
                <video
                    ref={videoRef}
                    src={videoUrl}
                    style={{ width: '100%', height: '100%' }}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                />
            )}

            {/* Live Countdown Badge (shown while video is playing and not locked) */}
            {!isPurchased && !isLocked && (
                <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: 'rgba(0,0,0,0.75)',
                    color: secondsLeft <= 10 ? '#ef4444' : '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(6px)',
                    border: `1px solid ${secondsLeft <= 10 ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                    zIndex: 5,
                    transition: 'color 0.3s, border-color 0.3s'
                }}>
                    🔓 Preview: {secondsLeft}s left
                </div>
            )}

            {/* Lock Overlay */}
            <AnimatePresence>
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.93)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            textAlign: 'center',
                            zIndex: 10
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                width: '80px', height: '80px',
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 0 40px rgba(5,150,105,0.4)'
                            }}
                        >
                            <Lock size={36} color="#fff" />
                        </motion.div>

                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.8rem', fontWeight: 800 }}>
                            Your 30-Second Preview Has Ended
                        </h3>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '360px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            To watch the full course, complete your purchase and get lifetime access to all lessons.
                        </p>

                        <Link
                            href={`/checkout?type=courses&id=${courseId}`}
                            className="btn-primary"
                            style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '14px', gap: '10px' }}
                        >
                            <ShoppingCart size={20} /> Buy Full Course
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
