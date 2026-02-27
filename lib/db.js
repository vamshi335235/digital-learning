// Central Data Handler using LocalStorage
// Sync only runs ONCE per session using a flag

const INITIAL_COURSES = [
    { id: 1, title: 'Law of Contracts – I – OU Semester-1', description: 'Comprehensive video curriculum covering the Indian Contract Act for first semester LLB students.', price: 1499, originalPrice: 2999, category: 'LLB 3 YDC OU', duration: '7.5 Hours', image: '/assets/images/course_law.png', rating: '4.9' },
    { id: 2, title: 'Constitutional Law – Unit 1 & 2', description: 'Deep dive into the preamble, fundamental rights, and directive principles with professional insights.', price: 999, originalPrice: 1999, category: 'LLB 3 YDC TG/AP', duration: '5.2 Hours', image: '/assets/images/course_law.png', rating: '4.8' },
    { id: 3, title: 'Family Law – TG State Universities', description: 'Exam-focused sessions on Hindu Law and Muslim Law as per Telangana university syllabi.', price: 1299, originalPrice: 2499, category: 'LLB 3 YDC KU', duration: '6.8 Hours', image: '/assets/images/course_law.png', rating: '4.7' }
];

const INITIAL_EBOOKS = [
    { id: 101, title: 'Last-Day Revision – TG Edition', description: 'Complete high-yield summary of Osmania University First Semester LLB syllabus.', price: 299, originalPrice: 599, category: 'LLB TG-STATE', image: '/assets/images/ebook_law.png', rating: '4.9' },
    { id: 102, title: 'Evidence Law Quick Guide – AP', description: 'A pocket-friendly digital guide with case law summaries for Andhra University students.', price: 349, originalPrice: 699, category: 'LLB AP-STATE', image: '/assets/images/ebook_law.png', rating: '4.8' },
];

const INITIAL_BOOKS = [
    { id: 201, title: 'LLB First Semester Handbook – TG', description: 'Covers all 5 subjects of Osmania University with precise interpretations and case laws.', price: 899, originalPrice: 1599, category: 'PHYSICAL BOOK', image: '/assets/images/book_llb.png', rating: '4.8' },
    { id: 202, title: 'The Indian Contract Act – Professional Edition', description: 'Comprehensive guide with legislative updates and landmark judgments in legal history.', price: 1299, originalPrice: 1999, category: 'ACADEMIC TEXT', image: '/assets/images/book_llb.png', rating: '4.9' },
];

const INITIAL_CLASSES = [
    { id: 301, title: 'Indian Contract Act - Case Law Q&A', date: 'Oct 25, 2026', time: '7:00 PM IST', host: 'Uday Kantri', description: 'Interactive deep-dive into major judgments of the Indian Contract Act.' },
    {
        id: 301,
        title: 'Indian Contract Act – Case Law Q&A',
        description: 'Interactive deep-dive into major judgments of the Indian Contract Act for first-year LLB students. Includes Q&A and exam tips.',
        date: 'Oct 25, 2026',
        time: '7:00 PM IST',
        duration: '90 mins',
        host: 'Uday Kantri',
        price: 199,
        meetLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        category: 'LLB',
    },
    {
        id: 302,
        title: 'Constitutional Law Unit-1 Masterclass',
        description: 'Live session covering preamble, citizenship, and fundamental rights with exam-focused notes and case law summaries.',
        date: 'Oct 28, 2026',
        time: '8:00 PM IST',
        duration: '120 mins',
        host: 'Uday Kantri',
        price: 299,
        meetLink: 'https://meet.google.com/xyz-uvwx-yz',
        status: 'scheduled',
        category: 'LLB',
    },
];

// Run sync only once per browser session (not on every getData call)
let _synced = false;

export const syncStorage = () => {
    if (typeof window === 'undefined' || _synced) return;
    _synced = true;

    if (!localStorage.getItem('platform_courses')) localStorage.setItem('platform_courses', JSON.stringify(INITIAL_COURSES));
    if (!localStorage.getItem('platform_ebooks')) localStorage.setItem('platform_ebooks', JSON.stringify(INITIAL_EBOOKS));
    if (!localStorage.getItem('platform_books')) localStorage.setItem('platform_books', JSON.stringify(INITIAL_BOOKS));

    // Force-reset classes if schema is outdated (missing meetLink/price)
    const storedClasses = localStorage.getItem('platform_classes');
    const classesOutdated = !storedClasses || !JSON.parse(storedClasses).find(c => c.meetLink);
    if (classesOutdated) localStorage.setItem('platform_classes', JSON.stringify(INITIAL_CLASSES));
};

// In-memory cache so repeated getData calls don't hit localStorage
const _cache = {};

export const getData = (key) => {
    if (typeof window === 'undefined') return [];
    syncStorage(); // no-op after first call
    if (_cache[key]) return _cache[key];
    const raw = localStorage.getItem(`platform_${key}`);
    const data = raw ? JSON.parse(raw) : [];
    _cache[key] = data;
    return data;
};

export const saveData = (key, data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`platform_${key}`, JSON.stringify(data));
    _cache[key] = data; // update cache immediately
};
