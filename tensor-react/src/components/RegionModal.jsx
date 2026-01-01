import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import '../index.css'; // Ensure styles are available

const RegionModal = () => {
    const { changeLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if preference exists
        const pref = localStorage.getItem('tensor_region_preference');
        if (!pref) {
            setIsVisible(true);
        }
    }, []);

    const handleSelect = (lang) => {
        changeLanguage(lang);
        setIsVisible(false);
    };

    const options = [
        { code: 'en', flag: '🌎', region: 'International', label: 'English' },
        { code: 'he', flag: '🇮🇱', region: 'Israel', label: 'Hebrew (עברית)' },
        { code: 'ar', flag: '🇦🇪', region: 'MENA', label: 'Arabic (العربية)' },
        { code: 'ru', flag: '🇷🇺', region: 'CIS / Russia', label: 'Russian (Русский)' },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    id="region-modal-overlay"
                    className="visible" // Force the CSS class if needed, or rely on framer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex' }} // Override CSS potentially hiding it
                >
                    <motion.div
                        id="region-modal"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="modal-header">
                            <h2>Welcome to Tensor</h2>
                            <p>Please select your region & language</p>
                        </div>

                        <div className="region-grid">
                            {options.map((opt) => (
                                <div
                                    key={opt.code}
                                    className="region-option"
                                    onClick={() => handleSelect(opt.code)}
                                >
                                    <div className="flag-icon">{opt.flag}</div>
                                    <div className="region-info">
                                        <h3>{opt.region}</h3>
                                        <span>{opt.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            id="skip-region-btn"
                            onClick={() => handleSelect('en')}
                        >
                            Stay on this page (English)
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RegionModal;
