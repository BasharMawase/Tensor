import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const About = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="about" ref={ref}>
            <motion.div
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <h2>The Tensor Philosophy</h2>
                <p>Mathematics is the universal language of the universe. We nurture the minds that speak it fluently.</p>
            </motion.div>

            <motion.div
                className="card-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div className="glass-card" variants={itemVariants}>
                    <h3>Global Vision</h3>
                    <p>With campuses in 4 continents, we bring together the brightest minds from diverse cultures, united by the pursuit of mathematical truth.</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVariants}>
                    <h3>Interdisciplinary</h3>
                    <p>We believe in the intersection of disciplines. Our curriculum integrates physics, computer science, and finance with pure math.</p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default About;
