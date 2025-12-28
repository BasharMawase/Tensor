const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, 'users.json');
const VISITORS_FILE = path.join(__dirname, 'visitors.json');
const LESSONS_FILE = path.join(__dirname, 'lessons.json');

// Helper to read users
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE));
    } catch (e) {
        return [];
    }
}

// Helper to write users
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

const readLessons = () => {
    if (!fs.existsSync(LESSONS_FILE)) return [];
    try {
        const data = fs.readFileSync(LESSONS_FILE);
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveLessons = (lessons) => fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname)));

// Helper to handle visitor count
function getVisitorCount() {
    if (!fs.existsSync(VISITORS_FILE)) {
        fs.writeFileSync(VISITORS_FILE, JSON.stringify({ count: 0 }));
        return 0;
    }
    try {
        const data = JSON.parse(fs.readFileSync(VISITORS_FILE));
        return data.count;
    } catch (e) {
        return 0;
    }
}

function incrementVisitorCount() {
    let count = getVisitorCount();
    count++;
    fs.writeFileSync(VISITORS_FILE, JSON.stringify({ count }));
    return count;
}

// Visitor Count API
app.get('/api/visitor-count', (req, res) => {
    const count = incrementVisitorCount();
    res.json({ count });
});

// --- Auth Routes ---

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
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
    const newBooking = {
        id: bookingId,
        language,
        subject,
        customSubject,
        studentName,
        studentEmail,
        studentCountryCode,
        studentPhone,
        duration,
        notes,
        userId,
        status: 'new',
        timestamp: new Date().toISOString()
    };

    const lessons = readLessons();
    lessons.push(newBooking);
    saveLessons(lessons);

    console.log(`[Private Lesson Booked]`);
    console.log(`  ID: ${bookingId}`);
    console.log(`  Student: ${studentName} (${studentEmail})`);
    console.log(`  Phone: ${studentCountryCode} ${studentPhone}`);
    console.log(`  Subject: ${subject === 'custom' ? customSubject : subject} in ${language}`);
    console.log(`  Duration: ${duration} minutes`);

    res.json({
        success: true,
        message: 'Lesson booked successfully!',
        bookingId: bookingId,
        confirmationEmail: studentEmail
    });
});

// Admin API: Get all lessons
app.get('/api/admin/lessons', (req, res) => {
    // In a real app, you'd check for admin auth here
    const lessons = readLessons();
    res.json(lessons);
});

// Admin API: Update lesson status
app.post('/api/admin/lessons/status', (req, res) => {
    const { id, status } = req.body;
    let lessons = readLessons();
    const lessonIndex = lessons.findIndex(l => l.id === id);

    if (lessonIndex !== -1) {
        lessons[lessonIndex].status = status;
        saveLessons(lessons);
        res.json({ success: true, message: `Lesson ${id} updated to ${status}` });
    } else {
        res.status(404).json({ success: false, message: 'Lesson not found' });
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
