import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesData } from '../data/courses';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const CourseDetail = () => {
    const { id } = useParams();
    const { language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Normalize ID to upper case in case URL is different
    const courseKey = id?.toUpperCase();

    // Get Course Data
    // Fallback ID if not found, or show error
    const courseData = coursesData[courseKey];
    const localized = courseData ? (courseData[language] || courseData['en']) : null;

    if (!localized) {
        return (
            <div style={{ padding: '150px 20px', textAlign: 'center' }}>
                <h2>Course Not Found</h2>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '20px' }}>Back Home</button>
            </div>
        );
    }

    const handleEnroll = () => {
        if (!user) {
            alert("Please login to enroll.");
            // Ideally trigger open login modal here
            return;
        }

        // Mock API Call
        alert(`Successfully enrolled in ${localized.title}!`);
    };

    return (
        <main className="course-page-container">
            <header className="course-header" style={{ paddingTop: '150px', paddingBottom: '60px', textAlign: 'center' }}>
                <motion.span
                    className="course-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: '#c5a059', fontFamily: 'Courier New', display: 'block', marginBottom: '15px' }}
                >
                    {courseKey}
                </motion.span>
                <motion.h1
                    className="course-title"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: '3.5rem', marginBottom: '20px' }}
                >
                    {localized.title}
                </motion.h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#8892b0', lineHeight: 1.8 }}>
                    {localized.description}
                </p>
                <div className="course-meta" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                    <span className="meta-tag" style={{ border: '1px solid #c5a059', padding: '8px 16px', borderRadius: '20px', color: '#f2d184' }}>{localized.duration}</span>
                    <span className="meta-tag" style={{ border: '1px solid #c5a059', padding: '8px 16px', borderRadius: '20px', color: '#f2d184' }}>{localized.level}</span>
                </div>
            </header>

            <section className="course-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
                <div className="syllabus-card" style={{ background: 'rgba(17, 34, 64, 0.6)', padding: '40px', borderRadius: '10px', border: '1px solid rgba(242, 209, 132, 0.15)' }}>
                    <h2 style={{ color: '#c5a059', marginBottom: '30px' }}>Syllabus</h2>
                    <ul className="syllabus-list" style={{ listStyle: 'none', padding: 0 }}>
                        {localized.syllabus.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#8892b0', display: 'flex', alignItems: 'center' }}
                            >
                                <span style={{ color: '#f2d184', marginRight: '15px' }}>▹</span> {item}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button onClick={handleEnroll} className="btn-primary">Enroll Now</button>
                    <br /><br />
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Back to Institute
                    </button>
                </div>
            </section>
        </main>
    );
};

export default CourseDetail;
