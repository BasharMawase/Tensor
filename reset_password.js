const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const email = 'tensor@gmail.com';
const newPass = '123456';

console.log(`Resetting password for ${email}...`);

bcrypt.hash(newPass, 10, (err, hash) => {
    if (err) {
        console.error('Hashing error:', err);
        process.exit(1);
    }
    db.run("UPDATE users SET password = ? WHERE email = ?", [hash, email], function (err) {
        if (err) {
            console.error('Database error:', err);
        } else {
            console.log(`Password reset successfully. Rows affected: ${this.changes}`);
        }
        db.close();
    });
});
