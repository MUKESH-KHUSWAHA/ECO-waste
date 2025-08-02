// report.js - Enhanced constraints and style for report.html

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('report-form');
    const imageInput = document.getElementById('image');
    const uploadArea = document.getElementById('upload-area');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');
    const description = document.getElementById('description');
    const charCount = document.getElementById('char-count');
    const loadingModal = document.getElementById('loading-modal');
    const resultModal = document.getElementById('result-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    // Character counter for description
    description.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/300`;
        
        if (count > 250) {
            charCount.classList.add('text-red-500');
        } else {
            charCount.classList.remove('text-red-500');
        }
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.parentElement.classList.add('border-emerald-400', 'bg-emerald-50');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.parentElement.classList.remove('border-emerald-400', 'bg-emerald-50');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.parentElement.classList.remove('border-emerald-400', 'bg-emerald-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });

    // File input change
    imageInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleImageFile(this.files[0]);
        }
    });

    // Remove image
    removeImageBtn.addEventListener('click', function() {
        imageInput.value = '';
        imagePreview.classList.add('hidden');
        uploadArea.classList.remove('hidden');
    });

    function handleImageFile(file) {
        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            showError('Please select a JPEG or PNG image file.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
            uploadArea.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate required fields
        const location = document.getElementById('location').value.trim();
        const reportType = document.getElementById('report-type').value;
        const descriptionText = description.value.trim();
        const imageFile = imageInput.files[0];

        if (!location || location.length < 3) {
            showError('Please enter a valid location (minimum 3 characters).');
            return;
        }

        if (!reportType) {
            showError('Please select a report type.');
            return;
        }

        if (!descriptionText || descriptionText.length < 10) {
            showError('Please enter a description (minimum 10 characters).');
            return;
        }

        if (!imageFile) {
            showError('Please upload an image.');
            return;
        }

        // Show loading modal
        loadingModal.classList.remove('hidden');

        // Prepare FormData
        const formData = new FormData();
        formData.append('location', location);
        formData.append('report-type', reportType);
        formData.append('description', descriptionText);
        formData.append('size', document.getElementById('size').value || '');
        formData.append('accessibility', document.getElementById('accessibility').value || '');
        formData.append('name', document.getElementById('name').value || '');
        formData.append('phone', document.getElementById('phone').value || '');
        formData.append('image', imageFile);

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                body: formData
            });
            loadingModal.classList.add('hidden');
            const result = await response.json();
            if (response.ok && result.success) {
                showSuccess('Report submitted successfully!', 'Your report has been received and will be processed within 24-48 hours.');
            } else {
                showError(result.error || 'Failed to submit report.');
            }
        } catch (error) {
            loadingModal.classList.add('hidden');
            showError('Failed to submit report. Please try again.');
        }
    });

    function getPriority(type) {
        const priorityMap = {
            'hazardous': 'Critical',
            'animal-death': 'High',
            'animal-care': 'High',
            'garbage': 'Medium',
            'cleaning': 'Medium',
            'recycling': 'Medium',
            'animal-adopt': 'Low',
            'other': 'Medium'
        };
        return priorityMap[type] || 'Medium';
    }

    function saveReport(report) {
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
    }

    function showError(message) {
        modalIcon.innerHTML = '<i class="fa-solid fa-exclamation-triangle text-red-500"></i>';
        modalTitle.textContent = 'Error';
        modalTitle.className = 'text-2xl font-bold mb-2 text-red-600';
        modalMessage.textContent = message;
        modalMessage.className = 'text-gray-600 mb-6';
        resultModal.classList.remove('hidden');
    }

    function showSuccess(title, message) {
        modalIcon.innerHTML = '<i class="fa-solid fa-check-circle text-green-500"></i>';
        modalTitle.textContent = title;
        modalTitle.className = 'text-2xl font-bold mb-2 text-green-600';
        modalMessage.textContent = message;
        modalMessage.className = 'text-gray-600 mb-6';
        resultModal.classList.remove('hidden');
    }

    // Modal close and redirect
    modalClose.addEventListener('click', function() {
        resultModal.classList.add('hidden');
        // Redirect to status section on homepage
        window.location.href = 'index.html#status-section';
    });

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === resultModal) {
            resultModal.classList.add('hidden');
            window.location.href = 'index.html#status-section';
        }
    });

    // Form validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('border-red-500', 'ring-red-200');
            } else {
                this.classList.remove('border-red-500', 'ring-red-200');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('border-red-500', 'ring-red-200');
            }
        });
    });

    // Add some visual feedback for form interactions
    const labels = form.querySelectorAll('label');
    labels.forEach(label => {
        label.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (input && input.tagName !== 'DIV') {
                input.focus();
            }
        });
    });
}); 
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('report-form');
    const imageInput = document.getElementById('image');
    const uploadArea = document.getElementById('upload-area');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');
    const loadingModal = document.getElementById('loading-modal');
    const resultModal = document.getElementById('result-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const descriptionTextarea = document.getElementById('description');
    const charCount = document.getElementById('char-count');

    // Character counter for description
    if (descriptionTextarea && charCount) {
        descriptionTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count}/300`;
            
            if (count > 300) {
                charCount.classList.add('text-red-500');
                charCount.classList.remove('text-gray-500');
            } else {
                charCount.classList.remove('text-red-500');
                charCount.classList.add('text-gray-500');
            }
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.parentElement.classList.add('border-emerald-400', 'bg-emerald-50');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('border-emerald-400', 'bg-emerald-50');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('border-emerald-400', 'bg-emerald-50');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });

        // Click to upload
        uploadArea.addEventListener('click', function() {
            imageInput.click();
        });
    }

    // File input change
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleImageFile(this.files[0]);
            }
        });
    }

    // Remove image
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            imageInput.value = '';
            imagePreview.classList.add('hidden');
            uploadArea.classList.remove('hidden');
        });
    }

    function handleImageFile(file) {
        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            showError('Please select a JPEG or PNG image file.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            uploadArea.classList.add('hidden');
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading modal
            loadingModal.classList.remove('hidden');
            
            try {
                const formData = new FormData(form);
                
                // Validate required fields
                if (!formData.get('location') || formData.get('location').trim().length < 3) {
                    throw new Error('Please enter a valid location (minimum 3 characters)');
                }
                
                if (!formData.get('report-type')) {
                    throw new Error('Please select a report type');
                }
                
                if (!formData.get('description') || formData.get('description').trim().length < 10) {
                    throw new Error('Please provide a detailed description (minimum 10 characters)');
                }
                
                if (!formData.get('image')) {
                    throw new Error('Please upload an image of the issue');
                }
                
                const response = await fetch('/api/report', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showSuccess('Report Submitted Successfully!', 'Thank you for helping keep our community clean. Your report has been received and will be reviewed shortly.');
                    form.reset();
                    imagePreview.classList.add('hidden');
                    uploadArea.classList.remove('hidden');
                    if (charCount) charCount.textContent = '0/300';
                } else {
                    throw new Error(result.error || 'Failed to submit report');
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showError(error.message || 'Failed to submit report. Please try again.');
            } finally {
                loadingModal.classList.add('hidden');
            }
        });
    }

    function showError(message) {
        modalIcon.innerHTML = '<i class="fa-solid fa-exclamation-triangle text-red-500"></i>';
        modalTitle.textContent = 'Error';
        modalTitle.className = 'text-3xl font-black mb-4 text-red-600 font-heading';
        modalMessage.textContent = message;
        modalMessage.className = 'text-gray-600 mb-8 text-lg';
        resultModal.classList.remove('hidden');
    }

    function showSuccess(title, message) {
        modalIcon.innerHTML = '<i class="fa-solid fa-check-circle text-green-500"></i>';
        modalTitle.textContent = title;
        modalTitle.className = 'text-3xl font-black mb-4 text-green-600 font-heading';
        modalMessage.textContent = message;
        modalMessage.className = 'text-gray-600 mb-8 text-lg';
        resultModal.classList.remove('hidden');
    }

    // Modal close and redirect
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            resultModal.classList.add('hidden');
            // Redirect to status section on homepage
            window.location.href = 'index.html#status-section';
        });
    }

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === resultModal) {
            resultModal.classList.add('hidden');
        }
        if (e.target === loadingModal) {
            loadingModal.classList.add('hidden');
        }
    });
});
