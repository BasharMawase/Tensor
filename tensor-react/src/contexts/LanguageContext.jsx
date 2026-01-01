import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedLang = localStorage.getItem('tensor_region_preference');
        if (savedLang) {
            setLanguage(savedLang);
        }
        setLoading(false);
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('tensor_region_preference', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
