let currentPassword = null;

// Check if password is stored in URL (QR code functionality)
function checkUrlPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get('password') || urlParams.get('p');
    if (password) {
        currentPassword = password;
        // Remove password from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
    }
    return false;
}

// Show/hide screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

// Show error message
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 5000);
}

// API call helper
async function apiCall(endpoint, data) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, password: currentPassword })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Er is een fout opgetreden');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Load status and update UI
async function loadStatus() {
    try {
        const status = await apiCall('status', {});
        
        // Update status display
        document.getElementById('eatenAmount').textContent = `${status.totalEatenToday} g`;
        document.getElementById('remainingAmount').textContent = `${status.remainingToday} g`;
        document.getElementById('currentWeight').textContent = `${status.currentBagWeight} g`;
        
        // Show warning if over limit
        const warningEl = document.getElementById('warningMessage');
        if (status.remainingToday < 0) {
            warningEl.textContent = `⚠️ Let op! De kat heeft ${Math.abs(status.remainingToday)} gram te veel gegeten vandaag.`;
            warningEl.classList.add('show');
        } else if (status.remainingToday < 10) {
            warningEl.textContent = `⚠️ Let op! Nog maar ${status.remainingToday} gram toegestaan vandaag.`;
            warningEl.classList.add('show');
        } else {
            warningEl.classList.remove('show');
        }
        
        // Update feedings list
        const feedingsList = document.getElementById('feedingsList');
        feedingsList.innerHTML = '';
        
        status.feedings.forEach(feeding => {
            const time = new Date(feeding.timestamp).toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const div = document.createElement('div');
            div.className = 'feeding-item';
            div.innerHTML = `
                <span class="feeding-time">${time}</span>
                <span class="feeding-amount">${feeding.amount.toFixed(1)} g</span>
            `;
            feedingsList.appendChild(div);
        });
        
        // Pre-fill weight before with current bag weight
        document.getElementById('weightBefore').value = status.currentBagWeight;
        
    } catch (error) {
        showError('feedingError', error.message);
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('passwordInput').value;
    currentPassword = password;
    
    try {
        // Test authentication by calling status
        await apiCall('status', {});
        
        // Success - show app screen
        showScreen('appScreen');
        await loadStatus();
        
    } catch (error) {
        showError('loginError', error.message);
        currentPassword = null;
    }
});

// Feeding form handler
document.getElementById('feedingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const weightBefore = parseFloat(document.getElementById('weightBefore').value);
    const weightAfter = parseFloat(document.getElementById('weightAfter').value);
    
    if (weightAfter > weightBefore) {
        showError('feedingError', 'Gewicht na vullen kan niet hoger zijn dan ervoor');
        return;
    }
    
    try {
        const result = await apiCall('feed', { weightBefore, weightAfter });
        
        // Show success and reload status
        await loadStatus();
        
        // Clear the after field, keep before field with new current weight
        document.getElementById('weightAfter').value = '';
        
        // Show success message
        const amount = weightBefore - weightAfter;
        alert(`✓ ${amount.toFixed(1)} gram toegevoegd!\n\nVandaag gegeten: ${result.totalEatenToday} g\nNog toegestaan: ${result.remainingToday} g`);
        
    } catch (error) {
        showError('feedingError', error.message);
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentPassword = null;
    document.getElementById('passwordInput').value = '';
    showScreen('loginScreen');
});

// Initialize app
async function init() {
    // Check if password in URL (QR code)
    if (checkUrlPassword()) {
        try {
            await apiCall('status', {});
            showScreen('appScreen');
            await loadStatus();
            return;
        } catch (error) {
            currentPassword = null;
        }
    }
    
    // Show login screen
    showScreen('loginScreen');
}

init();
