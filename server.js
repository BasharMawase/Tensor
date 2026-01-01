const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./database');

// NOTE: JSON file paths removed as we are now using SQLite
// const USERS_FILE = ...; 
// const VISITORS_FILE = ...; // Keeping visitors file for now simpler, or we can move to DB too. Let's stick to DB.


// Helper functions removed. Using db directly.


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname)));

// Visitor Count Helper using DB
async function getVisitorCount() {
    try {
        const row = await db.get("SELECT visitors FROM daily_stats WHERE date = DATE('now')");
        return row ? row.visitors : 0;
    } catch (e) {
        console.error("Visitor count error", e);
        return 0;
    }
}

async function incrementVisitorCount() {
    try {
        const date = new Date().toISOString().split('T')[0];
        await db.run(`INSERT INTO daily_stats (date, visitors) VALUES (?, 1) 
                      ON CONFLICT(date) DO UPDATE SET visitors = visitors + 1`, [date]);
        const row = await db.get("SELECT visitors FROM daily_stats WHERE date = ?", [date]);
        return row.visitors;
    } catch (e) {
        console.error("Visitor increment error", e);
        return 0;
    }
}

// Visitor Count API
app.get('/api/visitor-count', async (req, res) => {
    const count = await incrementVisitorCount();
    res.json({ count });
});

// --- Auth Routes ---

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.json({ id: result.id, name, email });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const result = await db.run(
            "INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, verificationToken]
        );

        // SIMULATE EMAIL SENDING
        const verificationLink = `http://localhost:${PORT}/api/auth/verify?token=${verificationToken}`;
        console.log(`\n---------------------------------------------------------`);
        console.log(`📧 EMAIL SIMULATION: Verification for ${email}`);
        console.log(`🔗 LINK: ${verificationLink}`);
        console.log(`---------------------------------------------------------\n`);

        res.json({
            id: result.id,
            name,
            email,
            verificationToken, // Exposed for frontend demo simulation
            message: 'Signup successful! Please check your server console for the verification link.'
        });
    } catch (e) {
        console.error("Signup error", e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Email Endpoint
app.get('/api/auth/verify', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await db.get("SELECT id FROM users WHERE verification_token = ?", [token]);

        if (!user) {
            return res.status(400).send("Invalid or expired verification token.");
        }

        await db.run("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?", [user.id]);

        // Redirect to success page
        res.redirect('/verification-success.html');
    } catch (e) {
        console.error("Verification error", e);
        res.status(500).send("Server error during verification.");
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.is_verified !== 1) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Enrollment Endpoint
app.post('/api/enroll', (req, res) => {
    const { userId, userName, userEmail, courseTitle } = req.body;

    console.log(`[Enrollment] ${userName} (${userEmail}) enrolled in: ${courseTitle}`);

    // In a real app, save to database
    res.json({
        success: true,
        message: `Successfully enrolled in ${courseTitle}`,
        enrollmentId: 'ENR-' + Date.now()
    });
});

// --- API Routes ---

// 1. Payment Endpoint
app.post('/api/pay', (req, res) => {
    const { cardName, cardNumber, expiry, cvv, amount, currency } = req.body;

    // In a real app, integrate Stripe/PayPal here.
    console.log(`[Payment Received] ${currency} ${amount} from ${cardName}`);
    console.log(`Card: ${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`);

    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Payment processed successfully!',
            transactionId: 'TXN-' + Math.floor(Math.random() * 1000000)
        });
    }, 1500);
});

// 2. Contact / Private Lesson Booking
app.post('/api/book-session', (req, res) => {
    const { name, email, subject, language, message } = req.body;

    console.log(`[New Booking] ${name} wants a session for ${subject} in ${language}`);

    res.json({
        success: true,
        message: 'Booking request received! We will contact you shortly.'
    });
});

// 3. Faculty Application
app.post('/api/apply', (req, res) => {
    const { name, expertise, bio } = req.body;

    console.log(`[Faculty Application] ${name} applied. Expertise: ${expertise}`);

    res.json({
        success: true,
        message: 'Application submitted. The dean will review your profile.'
    });
});

// Admin Dashboard Route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Course Management Routes ---

// Get All Courses
app.get('/api/courses', async (req, res) => {
    try {
        const rows = await db.all("SELECT id, data FROM courses");
        const courses = {};
        rows.forEach(row => {
            const data = JSON.parse(row.data);
            if (row.videos) {
                // Ensure videos are merged if they exist in the row separately (schema migration node)
                // But our schema says videos are inside data OR separate?
                // Actually my usage in convert_json_to_sql stored videos inside data.
                // Wait, schema.sql says `data JSON`. 
                // Let's assume data has everything.
            }
            courses[row.id] = { ...data, id: row.id };
        });
        res.json(courses);
    } catch (e) {
        console.error(e);
        res.json({});
    }
});

// Update/Add Course
app.post('/api/courses', (req, res) => {
    const { id, data } = req.body;
    if (!id || !data) return res.status(400).json({ success: false, message: 'Missing course ID or data' });

    const courses = readCourses();
    courses[id] = { ...courses[id], ...data, id }; // Merge updates
    saveCourses(courses);
    res.json({ success: true, message: 'Course saved', course: courses[id] });
});

// Delete Course
app.delete('/api/courses/:id', (req, res) => {
    const courses = readCourses();
    if (!courses[req.params.id]) return res.status(404).json({ success: false, message: 'Course not found' });

    delete courses[req.params.id];
    saveCourses(courses);
    res.json({ success: true, message: 'Course deleted' });
});

// Add Video to Course
app.post('/api/courses/:id/videos', (req, res) => {
    const { title, url, description } = req.body;
    const courses = readCourses();
    const course = courses[req.params.id];

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (!course.videos) course.videos = [];

    const newVideo = {
        id: Date.now().toString(),
        title,
        url,
        description: description || '',
        addedAt: new Date().toISOString()
    };

    course.videos.push(newVideo);
    saveCourses(courses);
    res.json({ success: true, message: 'Video added', video: newVideo });
});

// Delete Video from Course
app.delete('/api/courses/:courseId/videos/:videoId', (req, res) => {
    const { courseId, videoId } = req.params;
    const courses = readCourses();
    const course = courses[courseId];

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const initialLength = course.videos ? course.videos.length : 0;
    course.videos = (course.videos || []).filter(v => v.id !== videoId);

    if (course.videos.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Video not found' });
    }

    saveCourses(courses);
    res.json({ success: true, message: 'Video removed' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n---------------------------------------------------------`);
    console.log(`🚀 Tensor Academy Backend Server running at http://localhost:${PORT}`);
    console.log(`---------------------------------------------------------\n`);
});

// --- Stripe Payment Integration ---

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, currency, courseTitle, userEmail, userName } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency || 'usd',
            metadata: {
                courseTitle: courseTitle || 'General Donation',
                userEmail: userEmail || 'anonymous',
                userName: userName || 'Anonymous'
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log(`[Payment Intent Created] ${currency} ${amount} for ${courseTitle} by ${userName}`);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment Intent Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Stripe Publishable Key
app.get('/api/stripe-key', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Webhook for Stripe Events
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
            // Send confirmation email, update database, etc.
            break;
        case 'payment_intent.payment_failed':
            console.log(`❌ Payment failed: ${event.data.object.id}`);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Book Private Lesson Endpoint
app.post('/api/book-lesson', async (req, res) => {
    const {
        language,
        subject,
        customSubject,
        studentName,
        studentEmail,
        studentCountryCode,
        studentPhone,
        duration,
        notes,
        userId
    } = req.body;

    const bookingId = 'LESSON-' + Date.now();

    try {
        await db.run(
            `INSERT INTO lessons (id, user_id, student_name, student_email, student_phone, student_country_code, subject, custom_subject, duration, notes, language, status, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
            [bookingId, userId, studentName, studentEmail, studentPhone, studentCountryCode, subject, customSubject, duration, notes, language, new Date().toISOString()]
        );

        console.log(`[Private Lesson Booked] ${bookingId} for ${studentName}`);

        res.json({
            success: true,
            message: 'Lesson booked successfully!',
            bookingId: bookingId,
            confirmationEmail: studentEmail
        });
    } catch (e) {
        console.error("Booking error", e);
        res.status(500).json({ success: false, message: 'Booking failed' });
    }
});

// Admin API: Get all lessons
// Admin API: Get all lessons
app.get('/api/admin/lessons', async (req, res) => {
    try {
        const lessons = await db.all("SELECT * FROM lessons");
        // Maintain JS camelCase structure if needed by frontend
        const formatted = lessons.map(l => ({
            id: l.id,
            userId: l.user_id,
            studentName: l.student_name,
            studentEmail: l.student_email,
            studentPhone: l.student_phone,
            studentCountryCode: l.student_country_code,
            subject: l.subject,
            customSubject: l.custom_subject,
            duration: l.duration,
            status: l.status,
            price: l.price,
            datetime: l.datetime,
            notes: l.notes,
            language: l.language,
            timestamp: l.created_at
        }));
        res.json(formatted);
    } catch (e) {
        console.error(e);
        res.status(500).json([]);
    }
});

// Admin API: Update lesson status
app.post('/api/admin/lessons/status', async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.run("UPDATE lessons SET status = ? WHERE id = ?", [status, id]);
        res.json({ success: true, message: `Lesson ${id} updated to ${status}` });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// Admin API: Get all users
// Admin API: Get all users
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await db.all("SELECT id, name, email, type, created_at as created, notes FROM users");
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json([]);
    }
});

// Admin API: Create User
app.post('/api/admin/users', async (req, res) => {
    const { name, email, type, notes } = req.body;

    try {
        const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existing) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash('123456', 10);
        const result = await db.run(
            "INSERT INTO users (name, email, type, notes, password) VALUES (?, ?, ?, ?, ?)",
            [name, email, type || 'student', notes || '', hashedPassword]
        );

        res.json({ success: true, user: { id: result.id, name, email, type, notes } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Creation failed' });
    }
});

// Admin API: Delete all users
app.delete('/api/admin/users', async (req, res) => {
    try {
        await db.run("DELETE FROM users"); // Danger!
        res.json({ success: true, message: 'All users cleared successfully' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Clear failed' });
    }
});

// Admin API: Database Stats
app.get('/api/admin/database/stats', async (req, res) => {
    try {
        const userCount = (await db.get("SELECT COUNT(*) as c FROM users")).c;
        const lessonCount = (await db.get("SELECT COUNT(*) as c FROM lessons")).c;
        const visitorCount = await getVisitorCount();

        const stats = {
            users: { count: userCount, size: 0 },
            lessons: { count: lessonCount, size: 0 },
            visitors: { count: visitorCount || 0, size: 0 }
        };
        res.json(stats);
    } catch (e) {
        res.json({});
    }
});

// Admin API: Backup Database
app.post('/api/admin/database/backup', (req, res) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'backups');
    const dbPath = path.join(__dirname, 'database.db');

    try {
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

        if (fs.existsSync(dbPath)) {
            const backupPath = path.join(backupDir, `database_${timestamp}.db`);
            fs.copyFileSync(dbPath, backupPath);
            res.json({ success: true, message: `Successfully backed up database to ${backupPath}.` });
        } else {
            res.status(404).json({ success: false, message: 'Database file not found.' });
        }
    } catch (e) {
        console.error('Backup error:', e);
        res.status(500).json({ success: false, message: 'Backup failed: ' + e.message });
    }
});

// --- Bit Payment Integration ---

app.post('/api/create-bit-payment', async (req, res) => {
    try {
        const { amount, description, recurring, donorEmail } = req.body;

        // Bit API credentials (using environment variables)
        const bitConfig = {
            terminalId: process.env.BIT_TERMINAL_ID || 'TEST_TERMINAL',
            clientId: process.env.BIT_CLIENT_ID || 'TEST_CLIENT',
            secretKey: process.env.BIT_SECRET_KEY || 'TEST_SECRET'
        };

        // In a real scenario, you'd call the Bit API here.
        // For demonstration purposes, we'll simulate a successful response if keys are "TEST_*"

        console.log(`[Bit Payment Request]`);
        console.log(`  Amount: ₪${amount}`);
        console.log(`  Description: ${description}`);
        console.log(`  Recurring: ${recurring}`);
        console.log(`  Email: ${donorEmail}`);

        // This is where you would normally make the axios POST request to Bit
        /*
        const bitResponse = await axios.post(
            'https://api.bit-pay.co.il/api/v1/payments',
            {
                terminal: bitConfig.terminalId,
                amount: Math.round(amount * 100), // agorot
                currency: 'ILS',
                description: description,
                success_url: `${req.protocol}://${req.get('host')}/donation-success.html`,
                cancel_url: `${req.protocol}://${req.get('host')}/index.html#support`,
                callback_url: `${req.protocol}://${req.get('host')}/api/bit-webhook`,
                reference: `DON_${Date.now()}`,
                recurring: recurring ? 'monthly' : 'one_time'
            },
            {
                headers: {
                    'Authorization': `Bearer ${bitConfig.secretKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        */

        // Simulating the redirect URL for the demo
        const simulatedPaymentUrl = `https://payment.bit-pay.co.il/simulated-checkout?amount=${amount}&ref=DON_${Date.now()}`;

        res.json({
            success: true,
            paymentUrl: simulatedPaymentUrl,
            paymentId: 'BIT-' + Date.now()
        });

    } catch (error) {
        console.error('Bit integration error:', error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
});

// Webhook to handle payment notifications
app.post('/api/bit-webhook', async (req, res) => {
    const paymentStatus = req.body.status;
    const paymentId = req.body.id;
    const reference = req.body.reference;

    console.log(`[Bit Webhook Received] ID: ${paymentId}, Status: ${paymentStatus}, Ref: ${reference}`);

    // Verify signature in production...

    switch (paymentStatus) {
        case 'approved':
            console.log('  Payment marked as SUCCESS');
            break;
        case 'declined':
            console.log('  Payment marked as DECLINED');
            break;
    }

    res.status(200).send('OK');
});
