// Application State
let appState = {
    uploadedFile: null,
    originalSummary: '',
    currentSummary: '',
    hasEdits: false
};

// Sample data from the provided JSON
const sampleData = {
    transcript: "Meeting: Q4 Planning Session\nDate: March 15, 2024\nAttendees: Sarah Johnson (Product Manager), Mike Chen (Engineering Lead), Lisa Rodriguez (Marketing Director), David Kim (Sales Manager)\n\nSarah: Let's start with our Q4 objectives. Our main goal is to launch the new dashboard feature and increase user engagement by 25%.\n\nMike: From an engineering perspective, we need 6 weeks for the dashboard development. We'll need additional QA resources.\n\nLisa: Marketing will need 3 weeks lead time for the launch campaign. We're targeting a soft launch in October followed by a full rollout in November.\n\nDavid: Sales team has already received inquiries about the dashboard feature. We expect this to drive 15% more conversions in Q4.\n\nAction Items:\n- Mike to provide detailed technical requirements by March 20\n- Lisa to draft marketing timeline by March 22\n- Sarah to schedule follow-up with QA team\n- David to prepare sales training materials\n\nNext meeting: March 29, 2024",
    
    presetInstructions: {
        executive: "Summarize in bullet points for executives",
        action_items: "Highlight only action items and deadlines",
        formal: "Create formal meeting minutes format"
    },
    
    summaries: {
        executive: "• Q4 objective: Launch new dashboard feature and increase user engagement by 25%\n• Engineering needs 6 weeks for development plus additional QA resources\n• Marketing requires 3 weeks for launch campaign with October soft launch\n• Sales expects 15% conversion increase from new feature\n• Key deadlines: March 20 (tech requirements), March 22 (marketing timeline), March 29 (next meeting)",
        
        action_items: "ACTION ITEMS:\n1. Mike Chen - Provide detailed technical requirements (Due: March 20)\n2. Lisa Rodriguez - Draft marketing timeline (Due: March 22)\n3. Sarah Johnson - Schedule follow-up with QA team (No specific date)\n4. David Kim - Prepare sales training materials (No specific date)\n\nNEXT MEETING: March 29, 2024",
        
        formal: "MEETING MINUTES\n\nMeeting: Q4 Planning Session\nDate: March 15, 2024\nChair: Sarah Johnson\nAttendees: Mike Chen, Lisa Rodriguez, David Kim\n\nPURPOSE:\nPlan Q4 objectives focusing on dashboard feature launch and user engagement improvement.\n\nKEY DECISIONS:\n- Target 25% increase in user engagement for Q4\n- Dashboard feature development timeline: 6 weeks\n- Marketing campaign timeline: 3 weeks lead time\n- Launch strategy: Soft launch in October, full rollout in November\n\nACTION ITEMS:\n1. Mike Chen - Provide detailed technical requirements (Due: March 20)\n2. Lisa Rodriguez - Draft marketing timeline (Due: March 22)\n3. Sarah Johnson - Schedule follow-up with QA team (No specific date)\n4. David Kim - Prepare sales training materials (No specific date)\n\nNEXT STEPS:\nFollow-up meeting scheduled for March 29, 2024"
    }
};

// DOM Elements - Initialize after DOM loads
let fileInput, selectFileBtn, useSampleBtn, fileUploadArea, filePreview, fileName, fileContent, clearFileBtn;
let customInstructions, instructionsCount, presetButtons;
let generateBtn, summaryOutput, summaryContent;
let editingSection, editableSummary, summaryCount, saveEditBtn, revertBtn, versionStatus;
let sharingSection, emailRecipients, emailSubject, previewSubject, previewRecipients, previewBody, sendEmailBtn;
let successModal, startOverBtn, closeModalBtn;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    initializeEventListeners();
    loadSavedData();
    updateGenerateButtonState();
    
    // Initialize email subject with dynamic date
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    if (emailSubject) {
        emailSubject.value = `Meeting Summary - ${today}`;
    }
});

function initializeDOMElements() {
    // File upload elements
    fileInput = document.getElementById('fileInput');
    selectFileBtn = document.getElementById('selectFileBtn');
    useSampleBtn = document.getElementById('useSampleBtn');
    fileUploadArea = document.getElementById('fileUploadArea');
    filePreview = document.getElementById('filePreview');
    fileName = document.getElementById('fileName');
    fileContent = document.getElementById('fileContent');
    clearFileBtn = document.getElementById('clearFileBtn');

    // Instructions elements
    customInstructions = document.getElementById('customInstructions');
    instructionsCount = document.getElementById('instructionsCount');
    presetButtons = document.querySelectorAll('.preset-btn');

    // Summary generation elements
    generateBtn = document.getElementById('generateBtn');
    summaryOutput = document.getElementById('summaryOutput');
    summaryContent = document.getElementById('summaryContent');

    // Editing elements
    editingSection = document.getElementById('editingSection');
    editableSummary = document.getElementById('editableSummary');
    summaryCount = document.getElementById('summaryCount');
    saveEditBtn = document.getElementById('saveEditBtn');
    revertBtn = document.getElementById('revertBtn');
    versionStatus = document.getElementById('versionStatus');

    // Sharing elements
    sharingSection = document.getElementById('sharingSection');
    emailRecipients = document.getElementById('emailRecipients');
    emailSubject = document.getElementById('emailSubject');
    previewSubject = document.getElementById('previewSubject');
    previewRecipients = document.getElementById('previewRecipients');
    previewBody = document.getElementById('previewBody');
    sendEmailBtn = document.getElementById('sendEmailBtn');

    // Modal elements
    successModal = document.getElementById('successModal');
    startOverBtn = document.getElementById('startOverBtn');
    closeModalBtn = document.getElementById('closeModalBtn');
}

function initializeEventListeners() {
    // File Upload
    if (selectFileBtn) selectFileBtn.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);
    if (useSampleBtn) useSampleBtn.addEventListener('click', useSampleTranscript);
    if (clearFileBtn) clearFileBtn.addEventListener('click', clearFile);
    
    // Drag and Drop
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleFileDrop);
    }
    
    // Instructions
    if (customInstructions) customInstructions.addEventListener('input', handleInstructionsChange);
    if (presetButtons) {
        presetButtons.forEach(btn => {
            btn.addEventListener('click', handlePresetSelect);
        });
    }
    
    // Generation
    if (generateBtn) generateBtn.addEventListener('click', generateSummary);
    
    // Editing
    if (editableSummary) editableSummary.addEventListener('input', handleSummaryEdit);
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdits);
    if (revertBtn) revertBtn.addEventListener('click', revertToOriginal);
    
    // Sharing
    if (emailRecipients) emailRecipients.addEventListener('input', updateEmailPreview);
    if (emailSubject) emailSubject.addEventListener('input', updateEmailPreview);
    if (sendEmailBtn) sendEmailBtn.addEventListener('click', sendEmail);
    
    // Modal
    if (startOverBtn) startOverBtn.addEventListener('click', startOver);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
}

// File Upload Functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    if (fileUploadArea) fileUploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    if (fileUploadArea) fileUploadArea.classList.remove('drag-over');
}

function handleFileDrop(event) {
    event.preventDefault();
    if (fileUploadArea) fileUploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            processFile(file);
        } else {
            showNotification('Please upload a valid .txt file', 'error');
        }
    }
}

function processFile(file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification('File size must be less than 10MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        appState.uploadedFile = {
            name: file.name,
            content: e.target.result
        };
        
        displayFilePreview(file.name, e.target.result);
        updateGenerateButtonState();
        saveData();
        showNotification('File uploaded successfully', 'success');
    };
    
    reader.readAsText(file);
}

function useSampleTranscript() {
    appState.uploadedFile = {
        name: 'sample_meeting_transcript.txt',
        content: sampleData.transcript
    };
    
    displayFilePreview('sample_meeting_transcript.txt', sampleData.transcript);
    updateGenerateButtonState();
    saveData();
    showNotification('Sample transcript loaded', 'info');
}

function displayFilePreview(name, content) {
    if (fileName) fileName.textContent = name;
    if (fileContent) fileContent.textContent = content.substring(0, 1000) + (content.length > 1000 ? '...' : '');
    
    if (fileUploadArea) fileUploadArea.style.display = 'none';
    if (filePreview) filePreview.classList.remove('hidden');
}

function clearFile() {
    appState.uploadedFile = null;
    if (fileInput) fileInput.value = '';
    if (fileUploadArea) fileUploadArea.style.display = 'block';
    if (filePreview) filePreview.classList.add('hidden');
    updateGenerateButtonState();
    saveData();
    showNotification('File cleared', 'info');
}

// Instructions Functions
function handleInstructionsChange() {
    if (!customInstructions) return;
    
    const text = customInstructions.value;
    const count = text.length;
    
    if (instructionsCount) instructionsCount.textContent = count;
    
    const countElement = instructionsCount ? instructionsCount.parentElement : null;
    if (countElement) {
        if (count > 500) {
            countElement.classList.add('error');
            countElement.classList.remove('warning');
        } else if (count > 400) {
            countElement.classList.add('warning');
            countElement.classList.remove('error');
        } else {
            countElement.classList.remove('warning', 'error');
        }
    }
    
    updateGenerateButtonState();
    saveData();
}

function handlePresetSelect(event) {
    const preset = event.target.dataset.preset;
    const instruction = sampleData.presetInstructions[preset];
    
    // Update active state
    if (presetButtons) {
        presetButtons.forEach(btn => btn.classList.remove('active'));
    }
    event.target.classList.add('active');
    
    // Set instruction text
    if (customInstructions) {
        customInstructions.value = instruction;
        handleInstructionsChange();
    }
}

// Summary Generation
function generateSummary() {
    if (!appState.uploadedFile || !customInstructions || !customInstructions.value.trim()) {
        showNotification('Please upload a file and enter instructions first', 'error');
        return;
    }
    
    // Update UI to loading state
    if (generateBtn) {
        generateBtn.classList.add('loading');
        const btnText = generateBtn.querySelector('.btn-text');
        const spinner = generateBtn.querySelector('.loading-spinner');
        
        if (btnText) btnText.textContent = 'Generating...';
        if (spinner) spinner.classList.remove('hidden');
        generateBtn.disabled = true;
    }
    
    // Simulate API call with realistic delay
    setTimeout(() => {
        try {
            // Determine which summary to use based on instructions
            let summary = generateAISummary(customInstructions.value, appState.uploadedFile.content);
            
            // Store original summary
            appState.originalSummary = summary;
            appState.currentSummary = summary;
            appState.hasEdits = false;
            
            // Display summary
            if (summaryContent) summaryContent.textContent = summary;
            if (summaryOutput) summaryOutput.classList.remove('hidden');
            
            // Show editing section
            if (editableSummary) editableSummary.value = summary;
            if (editingSection) {
                editingSection.classList.remove('hidden');
                editingSection.classList.add('section-appear');
            }
            
            // Show sharing section
            if (sharingSection) {
                sharingSection.classList.remove('hidden');
                sharingSection.classList.add('section-appear');
            }
            
            updateSummaryCount();
            updateVersionStatus();
            updateEmailPreview();
            saveData();
            
            showNotification('Summary generated successfully', 'success');
            
        } catch (error) {
            console.error('Error generating summary:', error);
            showNotification('Failed to generate summary. Please try again.', 'error');
        } finally {
            // Reset button state
            if (generateBtn) {
                generateBtn.classList.remove('loading');
                const btnText = generateBtn.querySelector('.btn-text');
                const spinner = generateBtn.querySelector('.loading-spinner');
                
                if (btnText) btnText.textContent = 'Generate Summary';
                if (spinner) spinner.classList.add('hidden');
                generateBtn.disabled = false;
            }
        }
    }, 2500);
}

function generateAISummary(instructions, content) {
    const lowerInstructions = instructions.toLowerCase();
    
    if (lowerInstructions.includes('executive') || lowerInstructions.includes('bullet')) {
        return sampleData.summaries.executive;
    } else if (lowerInstructions.includes('action') || lowerInstructions.includes('deadline')) {
        return sampleData.summaries.action_items;
    } else if (lowerInstructions.includes('formal') || lowerInstructions.includes('minutes')) {
        return sampleData.summaries.formal;
    } else {
        // Default to executive summary
        return sampleData.summaries.executive;
    }
}

// Summary Editing
function handleSummaryEdit() {
    if (!editableSummary) return;
    
    const newContent = editableSummary.value;
    appState.currentSummary = newContent;
    appState.hasEdits = newContent !== appState.originalSummary;
    
    updateSummaryCount();
    updateVersionStatus();
    updateEmailPreview();
    saveData();
}

function updateSummaryCount() {
    if (!editableSummary || !summaryCount) return;
    
    const count = editableSummary.value.length;
    summaryCount.textContent = count;
}

function updateVersionStatus() {
    if (!versionStatus) return;
    
    if (appState.hasEdits) {
        versionStatus.textContent = 'Modified version';
        versionStatus.className = 'status status--warning';
    } else {
        versionStatus.textContent = 'Current version';
        versionStatus.className = 'status status--info';
    }
}

function saveEdits() {
    appState.originalSummary = appState.currentSummary;
    appState.hasEdits = false;
    updateVersionStatus();
    saveData();
    showNotification('Changes saved', 'success');
}

function revertToOriginal() {
    if (!editableSummary) return;
    
    editableSummary.value = appState.originalSummary;
    appState.currentSummary = appState.originalSummary;
    appState.hasEdits = false;
    updateSummaryCount();
    updateVersionStatus();
    updateEmailPreview();
    saveData();
    showNotification('Reverted to original summary', 'info');
}

// Email Sharing
function updateEmailPreview() {
    if (!emailRecipients || !emailSubject || !previewSubject || !previewRecipients || !previewBody) return;
    
    const recipients = emailRecipients.value.trim();
    const subject = emailSubject.value.trim();
    const summary = appState.currentSummary;
    
    previewSubject.textContent = subject;
    previewRecipients.textContent = recipients || 'No recipients specified';
    previewBody.textContent = `Hi,\n\nPlease find the meeting summary below:\n\n${summary}\n\nBest regards`;
    
    // Enable/disable send button
    const isValid = recipients && subject && summary && validateEmails(recipients);
    if (sendEmailBtn) sendEmailBtn.disabled = !isValid;
}

function validateEmails(emailString) {
    const emails = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every(email => emailRegex.test(email));
}

function sendEmail() {
    if (!emailRecipients || !emailSubject) return;
    
    const recipients = emailRecipients.value.trim();
    const subject = emailSubject.value.trim();
    
    if (!validateEmails(recipients)) {
        showNotification('Please enter valid email addresses', 'error');
        return;
    }
    
    // Update UI to loading state
    if (sendEmailBtn) {
        sendEmailBtn.classList.add('loading');
        const btnText = sendEmailBtn.querySelector('.btn-text');
        const spinner = sendEmailBtn.querySelector('.loading-spinner');
        
        if (btnText) btnText.textContent = 'Sending...';
        if (spinner) spinner.classList.remove('hidden');
        sendEmailBtn.disabled = true;
    }
    
    // Simulate email sending
    setTimeout(() => {
        try {
            // Show success modal
            if (successModal) successModal.classList.remove('hidden');
            
            showNotification('Email sent successfully', 'success');
            
        } catch (error) {
            console.error('Error sending email:', error);
            showNotification('Failed to send email. Please try again.', 'error');
        } finally {
            // Reset button state
            if (sendEmailBtn) {
                sendEmailBtn.classList.remove('loading');
                const btnText = sendEmailBtn.querySelector('.btn-text');
                const spinner = sendEmailBtn.querySelector('.loading-spinner');
                
                if (btnText) btnText.textContent = 'Send Summary';
                if (spinner) spinner.classList.add('hidden');
                sendEmailBtn.disabled = false;
            }
        }
    }, 2000);
}

// Modal Functions
function startOver() {
    // Reset all state
    appState = {
        uploadedFile: null,
        originalSummary: '',
        currentSummary: '',
        hasEdits: false
    };
    
    // Reset UI
    clearFile();
    if (customInstructions) {
        customInstructions.value = '';
        handleInstructionsChange();
    }
    if (presetButtons) {
        presetButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    if (summaryOutput) summaryOutput.classList.add('hidden');
    if (editingSection) editingSection.classList.add('hidden');
    if (sharingSection) sharingSection.classList.add('hidden');
    
    if (emailRecipients) emailRecipients.value = '';
    if (emailSubject) {
        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        emailSubject.value = `Meeting Summary - ${today}`;
    }
    
    closeModal();
    saveData();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function closeModal() {
    if (successModal) successModal.classList.add('hidden');
}

// Utility Functions
function updateGenerateButtonState() {
    if (!generateBtn || !customInstructions) return;
    
    const hasFile = appState.uploadedFile !== null;
    const hasInstructions = customInstructions.value.trim().length > 0;
    const isValid = customInstructions.value.length <= 500;
    
    generateBtn.disabled = !(hasFile && hasInstructions && isValid);
}

// Data Persistence (Note: localStorage is not used per strict instructions)
function saveData() {
    // In a real application, this would save to a backend API
    // For demo purposes, we'll just keep data in memory
}

function loadSavedData() {
    // In a real application, this would load from a backend API
    // For demo purposes, data starts fresh each session
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}