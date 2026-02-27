// lib/db.js
// Central Data Handler using LocalStorage with PostgreSQL Sync

// Fetches data from PostgreSQL API routes
export const fetchFromDB = async (type) => {
    try {
        const res = await fetch(`/api/data?type=${type}`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                localStorage.setItem(`platform_${type === 'books' ? 'books' : type}`, JSON.stringify(data));
                return data;
            }
        }
    } catch (e) {
        console.error(`Sync error (${type}):`, e);
    }
    return null;
};

// Async version to be used in useEffect
export const getPlatformData = async (key) => {
    if (typeof window === 'undefined') return [];

    // Always try to fetch fresh data if on client
    const fresh = await fetchFromDB(key);
    if (fresh) return fresh;

    // Fallback to local storage
    const raw = localStorage.getItem(`platform_${key}`);
    return raw ? JSON.parse(raw) : [];
};

// Synchronous version (fallback/immediate)
export const getData = (key) => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`platform_${key}`);
    return raw ? JSON.parse(raw) : [];
};

// ── Admin Functions ────────────────────────────────────────────────────────

export const saveItemToDB = async (type, item) => {
    try {
        const res = await fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, action: 'save', data: item })
        });
        return await res.json();
    } catch (e) {
        console.error('Save to DB failed:', e);
        return null;
    }
};

export const deleteItemFromDB = async (type, id) => {
    try {
        await fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, action: 'delete', data: { id } })
        });
        return true;
    } catch (e) {
        console.error('Delete from DB failed:', e);
        return false;
    }
};

export const saveData = (key, data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`platform_${key}`, JSON.stringify(data));
};
