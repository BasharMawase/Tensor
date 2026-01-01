import React from 'react';
import About from '../components/About';
import Academics from '../components/Academics';
import Courses from '../components/Courses';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <main>
            <section className="hero">
                <div className="hero-content">
                    <motion.img
                        src="/IMG_1852.JPG"
                        alt="Institute"
                        className="hero-logo-img"
                        style={{ maxWidth: '200px', borderRadius: '10px' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        CONSTRUCTING<br />THE FUTURE MIND
                    </motion.h1>
                    <motion.div
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        International Math Institute
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        A sanctuary for rigorous mathematical thought. Bridging pure abstraction with world-changing application.
                    </motion.p>
                    <motion.button
                        className="btn-primary"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        Explore Programs
                    </motion.button>
                </div>
            </section>

            <About />
            <Academics />
            <Courses />
        </main>
    );
};

export default Home;
