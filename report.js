// report.js - Enhanced constraints and style for report.html
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