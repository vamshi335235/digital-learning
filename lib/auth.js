// ── Password Hashing via Web Crypto API (SHA-256) ──────────────────────────
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_kl_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hash) {
    const computed = await hashPassword(password);
    return computed === hash;
}

// ── Roles ──────────────────────────────────────────────────────────────────
export const ROLES = {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin',
};

// ── User Storage Helpers (localStorage) ───────────────────────────────────
const USERS_KEY = 'kl_users_v2';
const SESSION_KEY = 'kl_session_v2';

export function getAllUsers() {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch { return []; }
}

export function saveAllUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
}

export function saveSession(user) {
    // Never store password hash in session
    const { passwordHash, ...safe } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// ── Register ──────────────────────────────────────────────────────────────
export async function registerUser({ name, email, password }) {
    const users = getAllUsers();

    // Email uniqueness check
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: ROLES.USER,
        createdAt: new Date().toISOString(),
        purchasedCourses: [],
        purchasedEbooks: [],
        purchasedBooks: [],
    };

    users.push(newUser);
    saveAllUsers(users);

    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    saveSession(session);
    return session;
}

// ── Login ─────────────────────────────────────────────────────────────────
export async function loginUser({ email, password }) {
    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) throw new Error('INVALID_CREDENTIALS');

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    saveSession(session);
    return session;
}

// ── Seed Admin (ensures admin always exists) ────────────────────────────────
export async function seedAdmin() {
    if (typeof window === 'undefined') return;
    const users = getAllUsers();
    const adminExists = users.find(u => u.role === ROLES.ADMIN);
    if (!adminExists) {
        const passwordHash = await hashPassword('admin@kantri2026');
        users.push({
            id: 'admin_1',
            name: 'Uday Kantri',
            email: 'admin@kantrilawyer.com',
            passwordHash,
            role: ROLES.ADMIN,
            createdAt: new Date().toISOString(),
        });
        saveAllUsers(users);
    }
}
