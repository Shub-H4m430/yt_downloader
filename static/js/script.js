// DOM Elements
const form = document.getElementById('downloadForm');
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const urlInput = document.getElementById('yt_link');
const formatLabels = document.querySelectorAll('.format-option label');

// Form submission handler
form.addEventListener('submit', function(e) {
    // Show loading state
    downloadBtn.classList.add('loading');
    downloadBtn.disabled = true;
    loadingSpinner.style.display = 'inline-block';
    btnText.textContent = 'Downloading...';
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Reset button state after form submission (in case of errors)
    setTimeout(() => {
        resetButtonState();
    }, 5000);
});

// Reset button to default state
function resetButtonState() {
    downloadBtn.classList.remove('loading');
    downloadBtn.disabled = false;
    loadingSpinner.style.display = 'none';
    btnText.textContent = 'Download Now';
}

// URL validation
urlInput.addEventListener('input', function() {
    const url = this.value;
    if (url && !isValidYouTubeUrl(url)) {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.3)';
    } else {
        this.style.borderColor = 'transparent';
        this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
});

// YouTube URL validation function
function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
}

// Add ripple effect to format labels
formatLabels.forEach(label => {
    label.addEventListener('click', function() {
        createRippleEffect(this);
    });
});

// Create ripple effect function
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Show error message function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show success message function
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Enhanced form validation
function validateForm() {
    const url = urlInput.value.trim();
    const selectedFormat = document.querySelector('input[name="format"]:checked');
    
    if (!url) {
        showError('Please enter a YouTube URL');
        return false;
    }
    
    if (!isValidYouTubeUrl(url)) {
        showError('Please enter a valid YouTube URL');
        return false;
    }
    
    if (!selectedFormat) {
        showError('Please select a download format');
        return false;
    }
    
    return true;
}

// Add form validation before submission
form.addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        resetButtonState();
        return false;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit form when URL input is focused
    if (e.key === 'Enter' && document.activeElement === urlInput) {
        if (validateForm()) {
            form.submit();
        }
    }
    
    // Escape key to clear messages
    if (e.key === 'Escape') {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }
});

// Auto-focus URL input on page load
window.addEventListener('load', function() {
    urlInput.focus();
});

// Paste event handler for URL input
urlInput.addEventListener('paste', function(e) {
    // Small delay to allow paste to complete
    setTimeout(() => {
        const url = this.value.trim();
        if (url && isValidYouTubeUrl(url)) {
            showSuccess('Valid YouTube URL detected!');
        }
    }, 100);
});

// Add smooth scroll behavior for better UX
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Handle format selection with keyboard
document.addEventListener('keydown', function(e) {
    if (e.key >= '1' && e.key <= '5') {
        const formatInputs = document.querySelectorAll('input[name="format"]');
        const index = parseInt(e.key) - 1;
        if (formatInputs[index]) {
            formatInputs[index].checked = true;
            createRippleEffect(formatInputs[index].nextElementSibling);
        }
    }
});

// Add tooltip-like behavior for format options
formatLabels.forEach((label, index) => {
    const shortcuts = ['1', '2', '3', '4', '5'];
    const originalText = label.textContent;
    
    label.addEventListener('mouseenter', function() {
        if (window.innerWidth > 600) { // Only on desktop
            this.setAttribute('title', `Press ${shortcuts[index]} to select`);
        }
    });
});

// Performance optimization: Debounce URL validation
let validationTimeout;
urlInput.addEventListener('input', function() {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => {
        const url = this.value;
        if (url && !isValidYouTubeUrl(url)) {
            this.style.borderColor = '#e74c3c';
            this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.3)';
        } else {
            this.style.borderColor = 'transparent';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }
    }, 300);
});

// DOM elements for preview section
const videoPreview = document.getElementById('videoPreview');
const videoTitle = document.getElementById('videoTitle');
const videoThumbnail = document.getElementById('videoThumbnail');

// Fetch video metadata from Flask when URL changes
function fetchVideoInfo(url) {
    fetch('/fetch_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ yt_link: url })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            videoPreview.style.display = 'none';
            showError(`Failed to fetch video info: ${data.error}`);
        } else {
            videoTitle.textContent = data.title || 'Untitled';
            videoThumbnail.src = data.thumbnail || '';
            videoPreview.style.display = 'block';
            showSuccess('Video info loaded');
        }
    })
    .catch(err => {
        videoPreview.style.display = 'none';
        showError('Error connecting to server');
    });
}

// Trigger fetch on blur
urlInput.addEventListener('blur', () => {
    const url = urlInput.value.trim();
    if (isValidYouTubeUrl(url)) {
        fetchVideoInfo(url);
    }
});

// Optional: trigger fetch again on paste (already exists — modify)
