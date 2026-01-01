// Region/Language Selection Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if preference is already saved
    const savedRegion = localStorage.getItem('tensor_region_preference');

    // If preference exists, do nothing (respect user choice)
    if (savedRegion) return;

    // Fetch user location
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            handleLocationRedirect(data.country_code);
        })
        .catch(error => {
            console.log('Location detection failed, falling back to default modal', error);
            showRegionModal();
        });
});

function handleLocationRedirect(countryCode) {
    const menaCodes = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'JO', 'LB', 'SY', 'EG', 'LY', 'DZ', 'MA', 'TN', 'SD', 'PS'];

    if (countryCode === 'IL') {
        // Israel: Let them choose between Hebrew and Arabic (Israel)
        showIsraelModal();
    } else if (countryCode === 'RU' || countryCode === 'BY' || countryCode === 'KZ') {
        // Russia/CIS: Redirect to Russian
        autoRedirect('ru', 'index_ru.html');
    } else if (menaCodes.includes(countryCode)) {
        // Middle East: Redirect to Arabic
        autoRedirect('ar', 'index_ar.html');
    } else {
        // Rest of the World: English
        autoRedirect('en', 'index.html');
    }
}

function autoRedirect(lang, url) {
    console.log(`Auto-redirecting to ${lang} (${url})`);
    localStorage.setItem('tensor_region_preference', lang);

    // If we are not already on the target page, redirect
    // We check absolute paths or filenames to avoid loops
    if (!window.location.href.includes(url)) {
        window.location.href = url;
    }
}

function showIsraelModal() {
    const modalHTML = `
        <div id="region-modal" class="region-modal-overlay">
            <div class="region-modal-content">
                <div class="region-header">
                    <h2>Shalom / Salam</h2>
                    <p>Please select your preferred language</p>
                </div>
                
                <div class="region-grid" id="region-grid" style="grid-template-columns: repeat(2, 1fr) !important; max-width: 500px; margin: 0 auto;">
                    <a href="#" class="region-card" onclick="selectRegion('he', 'index_he.html')">
                        <div class="region-info">
                            <h3>Israel</h3>
                            <p>עברית</p>
                        </div>
                    </a>

                    <a href="#" class="region-card" onclick="selectRegion('ar-il', 'index_il_ar.html')">
                        <div class="region-info">
                            <h3>Israel</h3>
                            <p>العربية</p>
                        </div>
                    </a>
                </div>
                
                <button class="region-skip-btn" onclick="selectRegion('en', 'index.html')">
                    Continue in English
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        const modal = document.getElementById('region-modal');
        if (modal) modal.classList.add('active');
    }, 100);
}

// Fallback for failed geolocation
function showRegionModal() {
    const modalHTML = `
        <div id="region-modal" class="region-modal-overlay">
            <div class="region-modal-content">
                <div class="region-header">
                    <h2>Select Your Region</h2>
                    <p>Choose your preferred language and region.</p>
                </div>
                
                <div class="region-grid" id="region-grid">
                    <a href="#" class="region-card" onclick="selectRegion('en', 'index.html')">
                        <div class="region-info">
                            <h3>International</h3>
                            <p>English</p>
                        </div>
                    </a>
                    
                    <a href="#" class="region-card" onclick="selectRegion('he', 'index_he.html')">
                        <div class="region-info">
                            <h3>Israel</h3>
                            <p>עברית</p>
                        </div>
                    </a>

                    <a href="#" class="region-card" onclick="selectRegion('ar-il', 'index_il_ar.html')">
                        <div class="region-info">
                            <h3>Israel</h3>
                            <p>العربية</p>
                        </div>
                    </a>
                    
                    <a href="#" class="region-card" onclick="selectRegion('ar', 'index_ar.html')">
                        <div class="region-info">
                            <h3>MENA</h3>
                            <p>العربية</p>
                        </div>
                    </a>
                    
                    <a href="#" class="region-card" onclick="selectRegion('ru', 'index_ru.html')">
                        <div class="region-info">
                            <h3>CIS / Russia</h3>
                            <p>Русский</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        const modal = document.getElementById('region-modal');
        if (modal) modal.classList.add('active');
    }, 100);
}

window.selectRegion = function (lang, url) {
    localStorage.setItem('tensor_region_preference', lang);
    const modal = document.getElementById('region-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    } else {
        window.location.href = url;
    }
    return false;
};