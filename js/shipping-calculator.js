// Shipping rates data
const shippingRates = {
    'Australia': { 'rate_500g': 34.48, 'rate_1000g': 43.26, 'rate_add_kg': 17.57 },
    'Azerbaijan': { 'rate_500g': 20.96, 'rate_1000g': 22.84, 'rate_add_kg': 2.38 },
    'Germany': { 'rate_500g': 32.54, 'rate_1000g': 34.05, 'rate_add_kg': 2.93 },
    'United Kingdom': { 'rate_500g': 31.07, 'rate_1000g': 33.84, 'rate_add_kg': 5.54 },
    'France': { 'rate_500g': 19.93, 'rate_1000g': 21.46, 'rate_add_kg': 4.11 },
    'Italy': { 'rate_500g': 22.02, 'rate_1000g': 23.04, 'rate_add_kg': 3.11 },
    'Spain': { 'rate_500g': 29.56, 'rate_1000g': 30.23, 'rate_add_kg': 4.19 },
    'Poland': { 'rate_500g': 17.49, 'rate_1000g': 18.58, 'rate_add_kg': 1.34 },
    'Lithuania': { 'rate_500g': 18.42, 'rate_1000g': 18.81, 'rate_add_kg': 1.32 },
    'Latvia': { 'rate_500g': 19.17, 'rate_1000g': 20.48, 'rate_add_kg': 2.89 },
    'Estonia': { 'rate_500g': 19.92, 'rate_1000g': 21.21, 'rate_add_kg': 2.46 },
    'Finland': { 'rate_500g': null, 'rate_1000g': 23.5, 'rate_add_kg': 6.99 },
    'Sweden': { 'rate_500g': 26.84, 'rate_1000g': 28.21, 'rate_add_kg': 3.19 },
    'Norway': { 'rate_500g': 24.24, 'rate_1000g': 28.13, 'rate_add_kg': 3.69 },
    'Denmark': { 'rate_500g': 27.57, 'rate_1000g': 28.83, 'rate_add_kg': 3.21 },
    'Belgium': { 'rate_500g': 19.59, 'rate_1000g': 21.29, 'rate_add_kg': 3.17 },
    'Netherlands': { 'rate_500g': 19.87, 'rate_1000g': 21.25, 'rate_add_kg': 2.52 },
    'Luxembourg': { 'rate_500g': 18.52, 'rate_1000g': 19.61, 'rate_add_kg': 3.21 },
    'Austria': { 'rate_500g': 20.45, 'rate_1000g': 21.92, 'rate_add_kg': 2.99 },
    'Switzerland': { 'rate_500g': 26.84, 'rate_1000g': 28.21, 'rate_add_kg': 3.17 },
    'Czech Republic': { 'rate_500g': 16.57, 'rate_1000g': 17.97, 'rate_add_kg': 2.88 },
    'Slovakia': { 'rate_500g': 16.4, 'rate_1000g': 18.86, 'rate_add_kg': 3.3 },
    'Hungary': { 'rate_500g': 22.25, 'rate_1000g': 24.27, 'rate_add_kg': 2.86 },
    'Romania': { 'rate_500g': 23.25, 'rate_1000g': 28.52, 'rate_add_kg': 4.65 },
    'Bulgaria': { 'rate_500g': 19.08, 'rate_1000g': 21.77, 'rate_add_kg': 4.37 },
    'Greece': { 'rate_500g': 23.31, 'rate_1000g': 24.8, 'rate_add_kg': 4.51 },
    'Portugal': { 'rate_500g': 17.3, 'rate_1000g': 20.23, 'rate_add_kg': 4.25 },
    'Ireland': { 'rate_500g': 23.42, 'rate_1000g': 27.06, 'rate_add_kg': 7.52 },
    'United States': { 'rate_500g': 51.89, 'rate_1000g': 56.28, 'rate_add_kg': 8.79 },
    'Canada': { 'rate_500g': 21.89, 'rate_1000g': 27.77, 'rate_add_kg': 13.09 },
    'Brazil': { 'rate_500g': 30.34, 'rate_1000g': 39.71, 'rate_add_kg': 16.71 },
    'Argentina': { 'rate_500g': 32.43, 'rate_1000g': 38.96, 'rate_add_kg': 14.32 },
    'Mexico': { 'rate_500g': 29.56, 'rate_1000g': 35.51, 'rate_add_kg': 11.89 },
    'Chile': { 'rate_500g': 26.65, 'rate_1000g': 34.36, 'rate_add_kg': 15.23 },
    'Saudi Arabia': { 'rate_500g': 23.29, 'rate_1000g': 30.48, 'rate_add_kg': 14.14 },
    'United Arab Emirates': { 'rate_500g': 24.24, 'rate_1000g': 28.13, 'rate_add_kg': 7.17 },
    'Qatar': { 'rate_500g': 23.88, 'rate_1000g': 28.44, 'rate_add_kg': 9.62 },
    'Kuwait': { 'rate_500g': 24.27, 'rate_1000g': 29.33, 'rate_add_kg': 13.33 },
    'Bahrain': { 'rate_500g': 23.85, 'rate_1000g': 28.12, 'rate_add_kg': 8.46 },
    'Oman': { 'rate_500g': 23.48, 'rate_1000g': 26.2, 'rate_add_kg': 5.2 },
    'China': { 'rate_500g': 13.9, 'rate_1000g': 18.35, 'rate_add_kg': 8.15 },
    'Japan': { 'rate_500g': 31.04, 'rate_1000g': 35.94, 'rate_add_kg': 8.84 },
    'Singapore': { 'rate_500g': 21.61, 'rate_1000g': 24.55, 'rate_add_kg': 6.47 },
    'India': { 'rate_500g': 21.46, 'rate_1000g': 23.81, 'rate_add_kg': 7.52 },
    'Hong Kong': { 'rate_500g': 29.21, 'rate_1000g': 33.1, 'rate_add_kg': 7.8 },
    'Taiwan': { 'rate_500g': 15.67, 'rate_1000g': 19.62, 'rate_add_kg': 7.83 },
    'Armenia': { 'rate_500g': 28.37, 'rate_1000g': 30.4, 'rate_add_kg': 4.36 },
    'Georgia': { 'rate_500g': 21.19, 'rate_1000g': 22.24, 'rate_add_kg': 1.85 },
    'Russian Federation': { 'rate_500g': 22.64, 'rate_1000g': 23.09, 'rate_add_kg': 1.32 }
};

// Country flags mapping
const countryFlags = {
    'Australia': '🇦🇺',
    'Azerbaijan': '🇦🇿',
    'Germany': '🇩🇪',
    'United Kingdom': '🇬🇧',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Poland': '🇵🇱',
    'Lithuania': '🇱🇹',
    'Latvia': '🇱🇻',
    'Estonia': '🇪🇪',
    'Finland': '🇫🇮',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Belgium': '🇧🇪',
    'Netherlands': '🇳🇱',
    'Luxembourg': '🇱🇺',
    'Austria': '🇦🇹',
    'Switzerland': '🇨🇭',
    'Czech Republic': '🇨🇿',
    'Slovakia': '🇸🇰',
    'Hungary': '🇭🇺',
    'Romania': '🇷🇴',
    'Bulgaria': '🇧🇬',
    'Greece': '🇬🇷',
    'Portugal': '🇵🇹',
    'Ireland': '🇮🇪',
    'United States': '🇺🇸',
    'Canada': '🇨🇦',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Mexico': '🇲🇽',
    'Chile': '🇨🇱',
    'Saudi Arabia': '🇸🇦',
    'United Arab Emirates': '🇦🇪',
    'Qatar': '🇶🇦',
    'Kuwait': '🇰🇼',
    'Bahrain': '🇧🇭',
    'Oman': '🇴🇲',
    'China': '🇨🇳',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'India': '🇮🇳',
    'Hong Kong': '🇭🇰',
    'Taiwan': '🇹🇼',
    'Armenia': '🇦🇲',
    'Georgia': '🇬🇪',
    'Russian Federation': '🇷🇺'
};

// Initialize shipping calculator
document.addEventListener('DOMContentLoaded', function() {
    initializeShippingCalculator();
    populateCountrySelect();
    addCalculatorEventListeners();
    initializeAnimations();
});

function initializeShippingCalculator() {
    const calculatorContainer = document.querySelector('.shipping-calculator');
    if (calculatorContainer) {
        calculatorContainer.classList.add('fade-in');
    }
}

function populateCountrySelect() {
    const countrySelect = document.getElementById('country-select');
    if (!countrySelect) return;

    // Clear existing options except the first one
    countrySelect.innerHTML = '<option value="">Select your country</option>';

    // Sort countries alphabetically
    const sortedCountries = Object.keys(shippingRates).sort();

    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = `${countryFlags[country] || ''} ${country}`;
        countrySelect.appendChild(option);
    });
}

function addCalculatorEventListeners() {
    const countrySelect = document.getElementById('country-select');
    const productCountInput = document.getElementById('product-count-input');
    const calculateBtn = document.getElementById('calculate-btn');

    if (countrySelect) {
        countrySelect.addEventListener('change', updateCalculation);
    }

    if (productCountInput) {
        productCountInput.addEventListener('input', updateCalculation);
        productCountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateShipping();
            }
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateShipping);
    }
}

function updateCalculation() {
    const country = document.getElementById('country-select').value;
    const productCount = parseInt(document.getElementById('product-count-input').value);

    if (country && productCount > 0) {
        calculateShipping();
    } else {
        clearResults();
    }
}

function calculateShipping() {
    const country = document.getElementById('country-select').value;
    const productCount = parseInt(document.getElementById('product-count-input').value);
    const resultsContainer = document.getElementById('shipping-results');

    if (!country || !productCount || productCount <= 0) {
        showError('Please select a country and enter a valid number of products.');
        return;
    }

    const rates = shippingRates[country];
    if (!rates) {
        showError('Shipping rates not available for selected country.');
        return;
    }

    // Calculate total weight based on product count (400g per product)
    const totalWeight = (productCount * 0.4); // 0.4 kg per product
    const cost = calculateShippingCost(totalWeight, rates);
    displayResults(country, productCount, totalWeight, cost, rates);
    
    // Animate results
    resultsContainer.classList.remove('fade-in');
    setTimeout(() => {
        resultsContainer.classList.add('fade-in');
    }, 100);
}

function calculateShippingCost(weight, rates) {
    if (weight <= 0.5) {
        return rates.rate_500g;
    } else if (weight <= 1) {
        return rates.rate_1000g;
    } else {
        const additionalKg = Math.ceil(weight - 1);
        return rates.rate_1000g + (additionalKg * rates.rate_add_kg);
    }
}

function displayResults(country, productCount, totalWeight, cost, rates) {
    const resultsContainer = document.getElementById('shipping-results');
    
    if (cost === null || cost === undefined) {
        showError('Shipping not available for packages under 1kg to this destination.');
        return;
    }

    const flag = countryFlags[country] || '';
    
    resultsContainer.innerHTML = `
        <div class="shipping-result">
            <div class="result-header">
                <h3>${flag} ${country}</h3>
                <div class="result-cost">$${cost.toFixed(2)} USD</div>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label">Number of Products:</span>
                    <span class="detail-value">${productCount} ${productCount === 1 ? 'product' : 'products'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Package Weight:</span>
                    <span class="detail-value">${totalWeight.toFixed(1)}kg</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Weight per Product:</span>
                    <span class="detail-value">~400g</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estimated Delivery:</span>
                    <span class="detail-value">5-21 business days</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tracking:</span>
                    <span class="detail-value">Included</span>
                </div>
            </div>
            <div class="rate-breakdown">
                <h4>Rate Breakdown</h4>
                <div class="breakdown-item">
                    <span>1 product (up to 500g):</span>
                    <span>$${rates.rate_500g ? rates.rate_500g.toFixed(2) : 'N/A'}</span>
                </div>
                <div class="breakdown-item">
                    <span>2-3 products (up to 1000g):</span>
                    <span>$${rates.rate_1000g.toFixed(2)}</span>
                </div>
                <div class="breakdown-item">
                    <span>Each additional product group:</span>
                    <span>$${rates.rate_add_kg.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function showError(message) {
    const resultsContainer = document.getElementById('shipping-results');
    resultsContainer.innerHTML = `
        <div class="shipping-error">
            <div class="error-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
    resultsContainer.style.display = 'block';
}

function clearResults() {
    const resultsContainer = document.getElementById('shipping-results');
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
}

function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.shipping-zone, .shipping-info-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Popular destinations quick calculator
function showQuickRate(country) {
    document.getElementById('country-select').value = country;
    document.getElementById('product-count-input').value = '1';
    calculateShipping();
    
    // Scroll to calculator
    document.querySelector('.shipping-calculator').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}