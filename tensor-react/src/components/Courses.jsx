import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { coursesData } from '../data/courses';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Filter math courses
    const mathCourses = Object.entries(coursesData)
        .filter(([id]) => id.startsWith('MTH'));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section id="courses" ref={ref}>
            <motion.div
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
            >
                <h2>Core Curriculum</h2>
                <p>A rigorous journey through the foundations of modern mathematics.</p>
            </motion.div>

            <motion.div
                className="course-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {mathCourses.map(([id, data]) => {
                    const localized = data[language] || data['en'];
                    return (
                        <motion.div
                            key={id}
                            className="course-card"
                            variants={itemVariants}
                            onClick={() => navigate(`/course/${id}`)}
                            style={{ cursor: 'pointer' }}
                            whileHover={{ scale: 1.03, borderColor: '#f2d184' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="course-number">{id}</span>
                            <h3>{localized.title}</h3>
                            <p>{localized.description}</p>
                            <div className="course-tags">
                                <span className="course-tag">{localized.level}</span>
                                <span className="course-tag">{localized.duration}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default Courses;
