const db = require('./database');
const coursesData = require('./courses_data');

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Clear existing courses to avoid duplicates/conflicts during development
        await db.run("DELETE FROM courses");
        console.log('Cleared existing courses.');

        for (const [id, data] of Object.entries(coursesData)) {
            const titleEn = data.en ? data.en.title : 'Untitled';
            const jsonStr = JSON.stringify(data);

            await db.run(
                "INSERT INTO courses (id, title_en, data) VALUES (?, ?, ?)",
                [id, titleEn, jsonStr]
            );
            console.log(`Inserted course: ${id}`);
        }

        console.log('✅ Database seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
