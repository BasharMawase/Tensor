import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        language: '',
        subject: '',
        name: '',
        email: '',
        duration: '60'
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);
    const updateData = (field, value) => setFormData({ ...formData, [field]: value });

    const confirmBooking = () => {
        // Mock API call
        alert("Booking Confirmed! We will contact you shortly.");
        navigate('/');
    };

    return (
        <main className="booking-page" style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '800px', width: '90%', background: 'rgba(17, 34, 64, 0.8)', padding: '40px', borderRadius: '20px', border: '1px solid #c5a059' }}>
                <h1 style={{ textAlign: 'center', color: '#f2d184', marginBottom: '10px' }}>Book Private Lesson</h1>
                <p style={{ textAlign: 'center', color: '#8892b0', marginBottom: '40px' }}>Step {step} of 4</p>

                {step === 1 && (
                    <div className="step-content">
                        <h3 style={{ color: '#e6f1ff', marginBottom: '20px', textAlign: 'center' }}>Select Language</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {['English', 'Arabic', 'Hebrew', 'Russian'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => { updateData('language', lang); handleNext(); }}
                                    style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid #c5a059', color: '#f2d184', borderRadius: '10px', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h3 style={{ color: '#e6f1ff', marginBottom: '20px', textAlign: 'center' }}>Select Subject</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {['Calculus', 'Algebra', 'Physics', 'Python'].map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => { updateData('subject', sub); handleNext(); }}
                                    style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid #c5a059', color: '#f2d184', borderRadius: '10px', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePrev} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}>Back</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h3 style={{ color: '#e6f1ff', marginBottom: '20px', textAlign: 'center' }}>Your Details</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => updateData('name', e.target.value)}
                            style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid #8892b0', color: 'white' }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => updateData('email', e.target.value)}
                            style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', border: '1px solid #8892b0', color: 'white' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handlePrev} className="btn-secondary" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #8892b0', color: '#8892b0', borderRadius: '5px', cursor: 'pointer' }}>Back</button>
                            <button onClick={handleNext} className="btn-primary" style={{ cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h3 style={{ color: '#e6f1ff', marginBottom: '20px', textAlign: 'center' }}>Confirmation</h3>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px', marginBottom: '20px', color: '#e6f1ff' }}>
                            <p><strong>Language:</strong> {formData.language}</p>
                            <p><strong>Subject:</strong> {formData.subject}</p>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handlePrev} className="btn-secondary" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #8892b0', color: '#8892b0', borderRadius: '5px', cursor: 'pointer' }}>Back</button>
                            <button onClick={confirmBooking} className="btn-primary" style={{ cursor: 'pointer' }}>Confirm Booking</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Booking;
