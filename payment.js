// Stripe Payment Integration for Tensor Academy

let stripePublishableKey = null;
let stripe = null;
let elements = null;
let cardElement = null;

// Initialize Stripe
async function initializeStripe() {
    try {
        const response = await fetch('/api/stripe-key');
        const data = await response.json();
        stripePublishableKey = data.publishableKey;

        if (window.Stripe) {
            stripe = window.Stripe(stripePublishableKey);
        }
    } catch (error) {
        console.error('Failed to initialize Stripe:', error);
    }
}

// Create Payment Intent and Process Payment
async function processStripePayment(amount, currency, courseTitle) {
    if (!stripe) {
        alert('Payment system is not initialized. Please refresh the page.');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('tensor_user'));

    try {
        // Create Payment Intent
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                courseTitle: courseTitle,
                userEmail: userData?.email || 'anonymous@tensor.com',
                userName: userData?.name || 'Anonymous'
            })
        });

        const { clientSecret, paymentIntentId } = await response.json();

        // Show payment modal or redirect to Stripe Checkout
        return { clientSecret, paymentIntentId };
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}

// Quick Donation Handler
async function handleQuickDonation(amount, currency = 'USD') {
    const userData = JSON.parse(localStorage.getItem('tensor_user'));

    if (!userData) {
        const shouldLogin = confirm('Please login to make a donation.\n\nClick OK to login.');
        if (shouldLogin) {
            localStorage.setItem('pending_payment', JSON.stringify({ amount, currency, type: 'donation' }));
            window.location.href = 'index.html?openAuth=true';
        }
        return;
    }

    try {
        const { clientSecret } = await processStripePayment(amount, currency, 'Donation to Tensor Academy');

        // For now, show success message
        // In production, you'd redirect to Stripe Checkout or use Stripe Elements
        alert(`Payment Intent Created!\n\nAmount: ${currency} ${amount}\n\nIn production, this would redirect to Stripe Checkout.\n\nPayment Intent: ${clientSecret.substring(0, 20)}...`);

        console.log('Payment Intent Client Secret:', clientSecret);
    } catch (error) {
        alert('Payment failed. Please try again.');
    }
}

// Course Enrollment Payment
async function handleCoursePayment(courseTitle, amount, currency = 'USD') {
    const userData = JSON.parse(localStorage.getItem('tensor_user'));

    if (!userData) {
        const shouldLogin = confirm(`To enroll in "${courseTitle}", please login first.\n\nClick OK to login.`);
        if (shouldLogin) {
            localStorage.setItem('pending_payment', JSON.stringify({
                amount,
                currency,
                type: 'course',
                courseTitle
            }));
            window.location.href = 'index.html?openAuth=true';
        }
        return;
    }

    try {
        const { clientSecret } = await processStripePayment(amount, currency, courseTitle);

        alert(`Enrollment Payment Initiated!\n\nCourse: ${courseTitle}\nAmount: ${currency} ${amount}\n\nIn production, you would be redirected to complete payment.`);

        console.log('Course Payment Client Secret:', clientSecret);
    } catch (error) {
        alert('Payment failed. Please try again.');
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStripe);
} else {
    initializeStripe();
}
