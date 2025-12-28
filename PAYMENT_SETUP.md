# Tensor Academy - Stripe Payment Integration Setup Guide

## 🎯 Overview
Tensor Academy now has a fully integrated Stripe payment system for:
- Course enrollments
- Donations
- Private lesson bookings
- General payments

## 📋 Prerequisites
1. Node.js and npm installed
2. Stripe account (free to create)

## 🚀 Setup Instructions

### Step 1: Create a Stripe Account
1. Go to https://stripe.com
2. Click "Sign up" and create a free account
3. Complete the registration process

### Step 2: Get Your API Keys
1. Log in to Stripe Dashboard: https://dashboard.stripe.com
2. Click on "Developers" in the left sidebar
3. Click on "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### Step 3: Configure Environment Variables
1. Open the `.env` file in the Tensor directory
2. Replace the placeholder keys with your actual Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
PORT=3000
NODE_ENV=development
```

### Step 4: Restart the Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## 💳 How It Works

### For Donations:
1. User clicks on a donation amount button ($50, $100, etc.)
2. System checks if user is logged in
3. If not logged in, prompts to login/signup
4. Creates a Stripe Payment Intent
5. In production, redirects to Stripe Checkout

### For Course Enrollment:
1. User clicks "Enroll Now" on a course
2. System checks authentication
3. Creates payment intent with course details
4. Processes payment through Stripe

### Payment Flow:
```
User Action → Check Auth → Create Payment Intent → Stripe Checkout → Confirmation
```

## 🔧 API Endpoints

### Create Payment Intent
**POST** `/api/create-payment-intent`
```json
{
  "amount": 100,
  "currency": "usd",
  "courseTitle": "Calculus & Analysis",
  "userEmail": "student@example.com",
  "userName": "John Doe"
}
```

### Get Stripe Key
**GET** `/api/stripe-key`
Returns the publishable key for frontend

### Webhook (for production)
**POST** `/api/webhook`
Handles Stripe events (payment success, failure, etc.)

## 🧪 Testing

### Test Card Numbers (Stripe Test Mode):
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

### Test the Integration:
1. Open http://localhost:3000
2. Login or create an account
3. Click on a donation button
4. Check the console for Payment Intent details

## 📱 Production Deployment

### Before Going Live:
1. Switch to live API keys (start with `pk_live_` and `sk_live_`)
2. Set up Stripe Checkout or Stripe Elements UI
3. Configure webhooks in Stripe Dashboard
4. Add webhook secret to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```
5. Implement proper error handling
6. Add email confirmations
7. Set up database to store transactions

### Webhook Setup:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your URL: `https://yourdomain.com/api/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret to `.env`

## 🎨 Frontend Integration

The payment system is integrated in:
- `payment.js` - Main payment logic
- `script.js` - Donation button handlers
- `course.html` - Enrollment payments
- All index pages - Stripe SDK loaded

## 🔒 Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use test keys** for development
3. **Validate on server** - Never trust client-side amounts
4. **Use HTTPS** in production
5. **Implement rate limiting** for payment endpoints

## 📊 Monitoring

View all test payments in:
https://dashboard.stripe.com/test/payments

## 🆘 Troubleshooting

### "Stripe is not defined"
- Make sure Stripe.js is loaded: `<script src="https://js.stripe.com/v3/"></script>`

### "Invalid API Key"
- Check your `.env` file has correct keys
- Restart the server after changing `.env`

### Payment Intent fails
- Check server logs for detailed error
- Verify amount is in cents (multiply by 100)
- Ensure currency is lowercase (usd, eur, etc.)

## 📚 Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com

## 🎉 Next Steps

1. Get your Stripe API keys
2. Update `.env` file
3. Restart server
4. Test with donation buttons
5. Customize payment flow as needed

---

**Need Help?** Check the Stripe documentation or contact support.
