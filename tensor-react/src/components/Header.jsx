import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
    const { language, changeLanguage } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: '#about', label: 'Institute' },
        { id: '#academics', label: 'Math' },
        { id: '#languages', label: 'Languages' },
        { id: '#programming', label: 'Programming' },
        { id: '#ai-data-science', label: 'AI & Data' },
        { id: '#contact', label: 'Contact' },
    ];

    return (
        <header className={scrolled ? 'scrolled' : ''}>
            <div className="header-left">
                <a href="#" className="logo">
                    <span className="logo-icon">∇</span> TENSOR
                </a>
                <div className="lang-switch">
                    {['en', 'ar', 'he', 'ru'].map((lang) => (
                        <button
                            key={lang}
                            className={`lang-btn ${language === lang ? 'active' : ''}`}
                            onClick={() => changeLanguage(lang)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
                <button
                    className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>

            <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                {navItems.map((item) => (
                    <a key={item.id} href={item.id} className="nav-item">
                        {item.label}
                    </a>
                ))}
                {/* Placeholder for Admin Link */}
            </nav>
        </header>
    );
};

export default Header;
