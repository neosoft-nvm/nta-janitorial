// NTA Janitorial - Interactive Engine & Cost Estimator

document.addEventListener('DOMContentLoaded', () => {
    initEstimator();
    initBeforeAfterSlider();
});

// --- 1. INSTANT COST ESTIMATOR LOGIC ---
const estimatorState = {
    facility: 'office',
    facilityName: 'Corporate Office',
    multiplier: 1.0,
    sqft: 5000,
    frequency: 'daily',
    freqName: '5x / Week (Daily)',
    visitsPerWeek: 5,
    addons: {
        floor: false,
        carpet: false,
        disinfection: false
    }
};

function initEstimator() {
    const facilityBtns = document.querySelectorAll('.facility-btn');
    const freqBtns = document.querySelectorAll('.freq-btn');
    const sqftSlider = document.getElementById('sqftSlider');
    const addonFloor = document.getElementById('addonFloor');
    const addonCarpet = document.getElementById('addonCarpet');
    const addonDisinfection = document.getElementById('addonDisinfection');

    // Facility Buttons
    facilityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            facilityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estimatorState.facility = btn.dataset.type;
            estimatorState.facilityName = btn.innerText.trim();
            estimatorState.multiplier = parseFloat(btn.dataset.multiplier);
            calculateEstimate();
        });
    });

    // Frequency Buttons
    freqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            freqBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estimatorState.frequency = btn.dataset.freq;
            estimatorState.freqName = btn.innerText.trim();
            estimatorState.visitsPerWeek = parseFloat(btn.dataset.visits);
            calculateEstimate();
        });
    });

    // Sq Ft Slider
    if (sqftSlider) {
        sqftSlider.addEventListener('input', (e) => {
            estimatorState.sqft = parseInt(e.target.value);
            const sqftDisplay = document.getElementById('sqftDisplay');
            if (sqftDisplay) {
                sqftDisplay.innerText = Number(estimatorState.sqft).toLocaleString() + ' sq ft';
            }
            calculateEstimate();
        });
    }

    // Addons
    if (addonFloor) {
        addonFloor.addEventListener('change', (e) => {
            estimatorState.addons.floor = e.target.checked;
            calculateEstimate();
        });
    }
    if (addonCarpet) {
        addonCarpet.addEventListener('change', (e) => {
            estimatorState.addons.carpet = e.target.checked;
            calculateEstimate();
        });
    }
    if (addonDisinfection) {
        addonDisinfection.addEventListener('change', (e) => {
            estimatorState.addons.disinfection = e.target.checked;
            calculateEstimate();
        });
    }

    // Initial calculation
    calculateEstimate();
}

function calculateEstimate() {
    const sqft = estimatorState.sqft;
    const mult = estimatorState.multiplier;
    const visits = estimatorState.visitsPerWeek;

    // Commercial janitorial standard base rate calculation (approx $0.06 - $0.12/sqft/month adjusted by frequency & density)
    let baseMonthlyLow = 0;
    let baseMonthlyHigh = 0;

    // Base cost per 1,000 sq ft based on visits
    if (visits >= 5) {
        // Daily cleaning
        baseMonthlyLow = sqft * 0.085 * mult;
        baseMonthlyHigh = sqft * 0.125 * mult;
    } else if (visits === 3) {
        // 3x weekly
        baseMonthlyLow = sqft * 0.065 * mult;
        baseMonthlyHigh = sqft * 0.095 * mult;
    } else if (visits === 1) {
        // 1x weekly
        baseMonthlyLow = sqft * 0.045 * mult;
        baseMonthlyHigh = sqft * 0.065 * mult;
    } else {
        // Bi-weekly
        baseMonthlyLow = sqft * 0.030 * mult;
        baseMonthlyHigh = sqft * 0.045 * mult;
    }

    // Minimum baseline protection for small facilities
    if (baseMonthlyLow < 280) baseMonthlyLow = 280;
    if (baseMonthlyHigh < 420) baseMonthlyHigh = 420;

    // Addon amortized additions
    let addonSum = 0;
    if (estimatorState.addons.floor) addonSum += 120;
    if (estimatorState.addons.carpet) addonSum += 95;
    if (estimatorState.addons.disinfection) addonSum += 80;

    const finalLow = Math.round((baseMonthlyLow + addonSum) / 10) * 10;
    const finalHigh = Math.round((baseMonthlyHigh + addonSum * 1.3) / 10) * 10;

    // Update DOM
    const priceRange = document.getElementById('priceRange');
    const summaryFacility = document.getElementById('summaryFacility');
    const summarySqft = document.getElementById('summarySqft');
    const summaryFreq = document.getElementById('summaryFreq');

    if (priceRange) {
        priceRange.innerText = `$${finalLow.toLocaleString()} - $${finalHigh.toLocaleString()}`;
    }
    if (summaryFacility) summaryFacility.innerText = estimatorState.facilityName;
    if (summarySqft) summarySqft.innerText = Number(estimatorState.sqft).toLocaleString() + ' sq ft';
    if (summaryFreq) summaryFreq.innerText = estimatorState.freqName;
}

// Lock in quote and prefill modal
function lockInQuote() {
    const serviceName = `${estimatorState.facilityName} (${Number(estimatorState.sqft).toLocaleString()} sq ft, ${estimatorState.freqName})`;
    openQuoteModal(serviceName);
}

// --- 2. INTERACTIVE BEFORE / AFTER SLIDER ---
function initBeforeAfterSlider() {
    const range = document.getElementById('baRange');
    const beforeWrapper = document.getElementById('baBeforeWrapper');
    const handle = document.getElementById('baHandle');
    const beforeImg = document.getElementById('baBeforeImg');
    const container = document.getElementById('baContainer');

    if (!range || !beforeWrapper || !handle) return;

    function updateSlider(val) {
        beforeWrapper.style.width = `${val}%`;
        handle.style.left = `${val}%`;
    }

    range.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });

    // Ensure image width matches container width
    window.addEventListener('resize', () => {
        if (container && beforeImg) {
            beforeImg.style.width = `${container.offsetWidth}px`;
        }
    });

    if (container && beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
    }
}

// --- 3. MODAL HANDLING ---
function openQuoteModal(serviceName = '') {
    const modal = document.getElementById('quoteModal');
    const modalCard = document.getElementById('quoteModalCard');
    const modalTitle = document.getElementById('modalTitle');
    const hiddenService = document.getElementById('modalServiceType');

    if (serviceName && modalTitle) {
        modalTitle.innerText = `Quote: ${serviceName}`;
        if (hiddenService) hiddenService.value = serviceName;
    } else if (modalTitle) {
        modalTitle.innerText = 'Request Rapid Facility Quote';
    }

    if (modal && modalCard) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
    }
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    const modalCard = document.getElementById('quoteModalCard');

    if (modal && modalCard) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100');
        modalCard.classList.add('scale-95');
        modalCard.classList.remove('scale-100');
    }
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quoteModal');
    const modalCard = document.getElementById('quoteModalCard');
    if (modal && e.target === modal) {
        closeQuoteModal();
    }
});

// --- 4. MOBILE MENU ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// --- 5. FORM SUBMISSIONS ---
function handleFormSubmit(e) {
    e.preventDefault();
    showToast('Quote Request Submitted! An NTA supervisor will call you within 2-4 hours.');
    e.target.reset();
}

function handleModalSubmit(e) {
    e.preventDefault();
    closeQuoteModal();
    showToast('Walkthrough Request Received! We will confirm your facility schedule shortly.');
    e.target.reset();
}

function showToast(message) {
    const toast = document.getElementById('successToast');
    if (toast) {
        toast.querySelector('.text-xs').innerText = message;
        toast.classList.remove('translate-y-24', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 5000);
    }
}
