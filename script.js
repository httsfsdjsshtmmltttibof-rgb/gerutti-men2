let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// Share Functionality
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Gerutti Men',
            text: 'Gerutti Men - Hammasini shuyerdan toping!',
            url: window.location.href,
        })
        .catch((error) => console.log('Ulashishda xatolik:', error));
    } else {
        alert("Ulashish uchun havolani nusxalang:\n" + window.location.href);
    }
}

// Save/Download Functionality
function handleSave() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    } else {
        document.getElementById('installModal').classList.add('active');
    }
}

// Security Message
function showSecurityMessage() {
    const modal = document.getElementById('securityModal');
    modal.classList.add('active');
}

// Modal Management
function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    const errorMsg = document.getElementById('loginError');
    const pwdInput = document.getElementById('analyticsPassword');
    if (errorMsg) errorMsg.style.display = 'none';
    if (pwdInput) pwdInput.value = '';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModals();
    }
}

// Analytics Logic
function openAnalyticsLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
}

function checkPassword() {
    const rawPwd = document.getElementById('analyticsPassword').value;
    const pwd = rawPwd.trim().replace(/[\s\+]/g, '');
    const errorMsg = document.getElementById('loginError');

    if (pwd === "777050033" || pwd === "998777050033") {
        closeModals();
        setTimeout(() => {
            document.getElementById('analyticsModal').classList.add('active');
            // Firebase dan real vaqtda ma'lumotlarni yuklash
            if (typeof window.loadAnalyticsData === 'function') {
                window.loadAnalyticsData();
            }
        }, 300);
    } else {
        errorMsg.style.display = 'block';
    }
}

// Allow pressing Enter to submit password
document.getElementById('analyticsPassword')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Tugma bosilganda Firebase ga yozish (Firebase yuklanmagan bo'lsa ignore qiladi)
function trackClick(btnName) {
    if (typeof window.trackClick === 'function' && window.trackClick !== trackClick) {
        window.trackClick(btnName);
    }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker Registered'))
        .catch(err => console.log('SW Registration Failed:', err));
    });
}
