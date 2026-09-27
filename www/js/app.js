const API_BASE_URL = "http://localhost:3000/api";

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('DOMContentLoaded', () => {
    if (!window.cordova) {
        initApp();
    }
});

function onDeviceReady() {
    initApp();
}

function initApp() {
    setupEventListeners();
    checkAuthStatus();
}

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showLoginModal();
    } else {
        hideLoginModal();
        fetchProfileData();
    }
}

function setupEventListeners() {
    document.getElementById('btn-login').addEventListener('click', handleLogin);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    document.getElementById('btn-edit-profile').addEventListener('click', openEditForm);
    document.getElementById('btn-save').addEventListener('click', saveProfile);
    document.getElementById('btn-cancel').addEventListener('click', closeEditForm);

    document.getElementById('btn-camera').addEventListener('click', capturePhoto);
    document.getElementById('btn-change-photo').addEventListener('click', capturePhoto);
    document.getElementById('display-avatar').addEventListener('click', capturePhoto);
}

async function handleLogin() {
    const studentId = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!studentId || !password) {
        showLoginAlert('Student ID and Password are required.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, password: password })
        });

        const data = await response.json();

        if (!response.ok) {
            showLoginAlert(data.message || 'Invalid student ID or password.');
            return;
        }

        localStorage.setItem('authToken', data.token);
        hideLoginModal();
        fetchProfileData();
    } catch (err) {
        showLoginAlert('Unable to connect to backend server.');
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    showLoginModal();
}

function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('app-content').classList.add('hidden');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
    hideLoginAlert();
}

async function fetchProfileData() {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            handleLogout();
            return;
        }

        const profile = await response.json();
        renderProfile(profile);
    } catch (err) {
        showCameraAlert("Unable to retrieve your profile. Please try again.");
    }
}

function renderProfile(profile) {
    document.getElementById('display-fullname').textContent = profile.fullname;
    document.getElementById('display-course').textContent = profile.course;
    document.getElementById('display-year').textContent = profile.year_level;
    document.getElementById('display-about').textContent = profile.about;

    const avatarElem = document.getElementById('display-avatar');
    avatarElem.src = profile.avatar || 'img/avatar.png';

    const skillsList = document.getElementById('display-skills');
    skillsList.innerHTML = '';
    
    const skillsArray = (profile.skills || '').split(',').map(s => s.trim()).filter(s => s.length > 0);
    skillsArray.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        li.className = 'skill-chip';
        skillsList.appendChild(li);
    });
}

async function saveProfile() {
    const fullname = document.getElementById('input-fullname').value.trim();
    const course = document.getElementById('input-course').value.trim();
    const yearLevel = document.getElementById('input-year').value;
    const about = document.getElementById('input-about').value.trim();
    const skills = document.getElementById('input-skills').value.trim();

    if (!fullname || !course || !yearLevel || !about || !skills) {
        showValidationAlert('Please complete all required fields before saving.');
        return;
    }

    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullname, course, year_level: yearLevel, about, skills })
        });

        const data = await response.json();
        if (!response.ok) {
            showValidationAlert(data.message || 'Unable to update your profile.');
            return;
        }

        closeEditForm();
        fetchProfileData();
    } catch (err) {
        showValidationAlert('Unable to update your profile.');
    }
}

function capturePhoto() {
    hideCameraAlert();
    if (navigator.camera && window.cordova && cordova.platformId === 'android') {
        const cameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth: 400,
            targetHeight: 400
        };
        navigator.camera.getPicture(onCameraSuccess, onCameraError, cameraOptions);
    } else {
        openWebcamModal();
    }
}

let activeStream = null;

function openWebcamModal() {
    closeWebcamModal();

    const overlay = document.createElement('div');
    overlay.id = 'custom-camera-modal';
    overlay.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        z-index: 99999; background:
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); display: flex; flex-direction: column;
        align-items: center; gap: 12px;
    `;

    const video = document.createElement('video');
    video.autoplay = true; video.playsInline = true;
    video.style.cssText = "width: 320px; height: 240px; border-radius: 8px; background: #000; object-fit: cover;";

    const previewImg = document.createElement('img');
    previewImg.style.cssText = "width: 320px; height: 240px; border-radius: 8px; object-fit: cover; display: none;";

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = "display: flex; gap: 10px;";

    const btnCapture = document.createElement('button');
    btnCapture.textContent = "Capture"; btnCapture.className = "btn primary";

    const btnUse = document.createElement('button');
    btnUse.textContent = "Use Photo"; btnUse.className = "btn primary"; btnUse.style.display = "none";

    const btnRetake = document.createElement('button');
    btnRetake.textContent = "Retake"; btnRetake.className = "btn secondary"; btnRetake.style.display = "none";

    const btnCancel = document.createElement('button');
    btnCancel.textContent = "Cancel"; btnCancel.className = "btn secondary";

    btnContainer.appendChild(btnCapture);
    btnContainer.appendChild(btnUse);
    btnContainer.appendChild(btnRetake);
    btnContainer.appendChild(btnCancel);

    overlay.appendChild(video); overlay.appendChild(previewImg); overlay.appendChild(btnContainer);
    document.body.appendChild(overlay);

    let capturedDataUrl = "";

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                activeStream = stream; video.srcObject = stream;
                video.style.display = "block"; previewImg.style.display = "none";
                btnCapture.style.display = "inline-block"; btnCancel.style.display = "inline-block";
                btnUse.style.display = "none"; btnRetake.style.display = "none";
            })
            .catch(() => {
                showCameraAlert("Unable to access camera.");
                closeWebcamModal();
            });
    }

    startCamera();

    btnCapture.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400; canvas.height = 400;
        canvas.getContext('2d').drawImage(video, 0, 0, 400, 400);
        capturedDataUrl = canvas.toDataURL('image/jpeg');

        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }

        previewImg.src = capturedDataUrl;
        video.style.display = "none"; previewImg.style.display = "block";
        btnCapture.style.display = "none"; btnCancel.style.display = "none";
        btnUse.style.display = "inline-block"; btnRetake.style.display = "inline-block";
    };

    btnRetake.onclick = () => startCamera();
    btnUse.onclick = () => {
        closeWebcamModal();
        onCameraSuccess(capturedDataUrl);
    };
    btnCancel.onclick = () => closeWebcamModal();
}

function closeWebcamModal() {
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }
    const modal = document.getElementById('custom-camera-modal');
    if (modal) modal.remove();
}

async function onCameraSuccess(imageData) {
    const imageBase64 = imageData.startsWith('data:image') ? imageData : "data:image/jpeg;base64," + imageData;
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fullname: document.getElementById('display-fullname').textContent,
                course: document.getElementById('display-course').textContent,
                year_level: document.getElementById('display-year').textContent,
                about: document.getElementById('display-about').textContent,
                skills: Array.from(document.querySelectorAll('#display-skills li')).map(li => li.textContent).join(', '),
                avatar: imageBase64
            })
        });

        if (response.ok) {
            fetchProfileData();
        } else {
            showCameraAlert("Unable to update profile picture in database.");
        }
    } catch (e) {
        showCameraAlert("Unable to save photo to backend.");
    }
}

function onCameraError(message) {
    if (message && message.toLowerCase().includes("cancel")) return;
    showCameraAlert("Unable to access the camera.");
}

function openEditForm() {
    document.getElementById('input-fullname').value = document.getElementById('display-fullname').textContent;
    document.getElementById('input-course').value = document.getElementById('display-course').textContent;
    document.getElementById('input-year').value = document.getElementById('display-year').textContent;
    document.getElementById('input-about').value = document.getElementById('display-about').textContent;
    document.getElementById('input-skills').value = Array.from(document.querySelectorAll('#display-skills li')).map(li => li.textContent).join(', ');

    hideValidationAlert();
    document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditForm() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
    hideValidationAlert();
}

function showLoginAlert(msg) {
    const box = document.getElementById('login-alert');
    box.textContent = msg; box.classList.remove('hidden');
}

function hideLoginAlert() {
    document.getElementById('login-alert').classList.add('hidden');
}

function showValidationAlert(msg) {
    const box = document.getElementById('validation-alert');
    box.textContent = msg; box.classList.remove('hidden');
}

function hideValidationAlert() {
    document.getElementById('validation-alert').classList.add('hidden');
}

function showCameraAlert(msg) {
    const box = document.getElementById('camera-alert');
    box.textContent = msg; box.classList.remove('hidden');
}

function hideCameraAlert() {
    document.getElementById('camera-alert').classList.add('hidden');
}