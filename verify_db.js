
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Connecting to PostgreSQL...');
        const count = await prisma.course.count();
        console.log('✅ Connection Successful!');
        console.log('Total courses in database:', count);

        const courses = await prisma.course.findMany({ take: 1 });
        if (courses.length > 0) {
            console.log('Sample Data (First Course):', courses[0].title);
        } else {
            console.log('Database is empty (needs seeding).');
        }
    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
