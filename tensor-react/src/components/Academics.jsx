import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Academics = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="academics" ref={ref}>
            <motion.div
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <h2>Academic Divisions</h2>
                <p>From foundational theory to complex system modeling.</p>
            </motion.div>

            <motion.div
                className="card-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div className="glass-card" variants={itemVariants}>
                    <h3>Pure Mathematics</h3>
                    <p>Algebra, Analysis, Topology, and Number Theory. The pursuit of beauty and logic in its purest form.</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVariants}>
                    <h3>Applied Mathematics</h3>
                    <p>Differential Equations, Optimization, and Fluid Dynamics. Solving the real-world problems of tomorrow.</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVariants}>
                    <h3>Computational Science</h3>
                    <p>Where code meets calculus. Algorithm design, cryptography, and artificial intelligence foundations.</p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Academics;
