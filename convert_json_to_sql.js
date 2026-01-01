const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8') || '[]');
const lessons = JSON.parse(fs.readFileSync(path.join(__dirname, 'lessons.json'), 'utf8') || '[]');
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8') || '{}');

let sql = '-- Data Migration Dump\n\n';

// 1. Users
sql += '-- Users\n';
users.forEach(user => {
    const notes = user.notes ? `'${user.notes.replace(/'/g, "''")}'` : 'NULL';
    const type = user.type || 'student';
    sql += `INSERT INTO users (id, name, email, password, type, created_at, notes) VALUES (${user.id}, '${user.name.replace(/'/g, "''")}', '${user.email.replace(/'/g, "''")}', '${user.password}', '${type}', '${user.created || new Date().toISOString()}', ${notes});\n`;
});
sql += '\n';

// 2. Lessons
sql += '-- Lessons\n';
lessons.forEach(lesson => {
    const user_id = lesson.userId || 'NULL';
    const studentName = lesson.studentName ? `'${lesson.studentName.replace(/'/g, "''")}'` : 'NULL';
    const studentEmail = lesson.studentEmail ? `'${lesson.studentEmail.replace(/'/g, "''")}'` : 'NULL';
    const studentPhone = lesson.studentPhone ? `'${lesson.studentPhone.replace(/'/g, "''")}'` : 'NULL';
    const studentCountryCode = lesson.studentCountryCode ? `'${lesson.studentCountryCode.replace(/'/g, "''")}'` : 'NULL';
    const notes = lesson.notes ? `'${lesson.notes.replace(/'/g, "''")}'` : 'NULL';
    const customSubject = lesson.customSubject ? `'${lesson.customSubject.replace(/'/g, "''")}'` : 'NULL';

    // Fix undefined vs null
    const duration = lesson.duration || 60;
    const price = lesson.price || 0;

    sql += `INSERT INTO lessons (id, user_id, student_name, student_email, student_phone, student_country_code, subject, custom_subject, duration, status, price, datetime, notes, language, created_at) VALUES ('${lesson.id}', ${user_id}, ${studentName}, ${studentEmail}, ${studentPhone}, ${studentCountryCode}, '${lesson.subject}', ${customSubject}, ${duration}, '${lesson.status}', ${price}, '${lesson.datetime}', ${notes}, '${lesson.language}', '${lesson.timestamp}');\n`;
});
sql += '\n';

// 3. Courses
sql += '-- Courses\n';
Object.values(courses).forEach(course => {
    // We store the whole object as JSON in the data column
    const json = JSON.stringify(course).replace(/'/g, "''");
    const title = course.en?.title ? `'${course.en.title.replace(/'/g, "''")}'` : 'NULL';
    sql += `INSERT INTO courses (id, title_en, data) VALUES ('${course.id}', ${title}, '${json}');\n`;
});

fs.writeFileSync(path.join(__dirname, 'data.sql'), sql);
console.log('Successfully created data.sql');
