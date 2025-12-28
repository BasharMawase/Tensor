// Private Lessons Booking System
let bookingData = {
    language: null,
    subject: null,
    studentName: '',
    studentEmail: '',
    studentCountryCode: '',
    studentPhone: '',
    duration: 60,
    notes: '',
    customSubject: ''
};

let currentStep = 1;

// Language Selection
document.addEventListener('DOMContentLoaded', () => {
    // Language cards
    const languageCards = document.querySelectorAll('[data-language]');
    languageCards.forEach(card => {
        card.addEventListener('click', () => {
            languageCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            bookingData.language = card.dataset.language;
            document.getElementById('next-1').disabled = false;
        });
    });

    const subjectCards = document.querySelectorAll('[data-subject]');
    const customInputContainer = document.getElementById('custom-subject-input-container');

    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            subjectCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            bookingData.subject = card.dataset.subject;
            document.getElementById('next-2').disabled = false;

            // Show/Hide custom input
            if (card.dataset.subject === 'custom') {
                customInputContainer.style.display = 'block';
                document.getElementById('custom-subject-name').focus();
            } else {
                customInputContainer.style.display = 'none';
            }
        });
    });

    // Duration change updates price
    const durationSelect = document.getElementById('lesson-duration');
    if (durationSelect) {
        durationSelect.addEventListener('change', (e) => {
            const duration = parseInt(e.target.value);
            bookingData.duration = duration;
        });
    }

    // Pre-fill user data if logged in
    const userData = JSON.parse(localStorage.getItem('tensor_user'));
    if (userData) {
        const nameInput = document.getElementById('student-name');
        const emailInput = document.getElementById('student-email');
        if (nameInput) nameInput.value = userData.name;
        if (emailInput) emailInput.value = userData.email;
    }
});

function nextStep() {
    // Validate current step
    if (currentStep === 2) {
        if (bookingData.subject === 'custom') {
            const customVal = document.getElementById('custom-subject-name').value;
            if (!customVal) {
                alert('Please specify your custom subject.');
                return;
            }
            bookingData.customSubject = customVal;
        }
    }

    if (currentStep === 3) {
        const form = document.getElementById('details-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Save form data
        bookingData.studentName = document.getElementById('student-name').value;
        bookingData.studentEmail = document.getElementById('student-email').value;
        bookingData.studentCountryCode = document.getElementById('student-country-code').value;
        bookingData.studentPhone = document.getElementById('student-phone').value;
        bookingData.notes = document.getElementById('lesson-notes').value;

        // Update summary
        updateSummary();
    }

    // Hide current section
    document.getElementById(`section-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.add('completed');

    // Show next section
    currentStep++;
    document.getElementById(`section-${currentStep}`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
    // Hide current section
    document.getElementById(`section-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');

    // Show previous section
    currentStep--;
    document.getElementById(`section-${currentStep}`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.remove('completed');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSummary() {
    // Language names
    const languageNames = {
        'en': 'English',
        'ar': 'العربية (Arabic)',
        'he': 'עברית (Hebrew)',
        'ru': 'Русский (Russian)'
    };

    // Subject names
    const subjectNames = {
        'calculus': 'Calculus',
        'algebra': 'Algebra',
        'geometry': 'Geometry',
        'analysis': 'Analysis',
        'topology': 'Topology',
        'python': 'Python Programming'
    };

    // Duration labels
    const durationLabels = {
        60: '1 Hour',
        90: '1.5 Hours',
        120: '2 Hours'
    };

    document.getElementById('summary-language').textContent = languageNames[bookingData.language];

    // Handle subject name or custom subject
    if (bookingData.subject === 'custom') {
        document.getElementById('summary-subject').textContent = `Custom: ${bookingData.customSubject}`;
    } else {
        document.getElementById('summary-subject').textContent = subjectNames[bookingData.subject];
    }

    document.getElementById('summary-name').textContent = bookingData.studentName;
    document.getElementById('summary-email').textContent = bookingData.studentEmail;

    document.getElementById('summary-duration').textContent = durationLabels[bookingData.duration];
}

async function confirmBooking() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('tensor_user'));

    if (!userData) {
        const shouldLogin = confirm('Please login to complete your booking.\n\nClick OK to login.');
        if (shouldLogin) {
            localStorage.setItem('pending_booking', JSON.stringify(bookingData));
            window.location.href = 'index.html?openAuth=true';
        }
        return;
    }

    try {
        // Send booking to backend
        const response = await fetch('/api/book-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...bookingData,
                userId: userData.id,
                userEmail: userData.email
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(`✅ Booking Request Received!\n\nWe are going to text you as soon as possible.`);
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('There was an error processing your booking. Please try again.');
    }
}
