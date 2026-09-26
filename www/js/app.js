document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('DOMContentLoaded', () => {
    if (!window.cordova) {
        initApp();
    }
});

function onDeviceReady() {
    initApp();
}

const DEFAULT_AVATAR = "img/avatar.png";

const DEFAULT_PROFILE = {
    fullname: "Ethan Kyle Anggot",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "Passionate IT student specializing in web and mobile app development.",
    skills: "JavaScript, HTML/CSS, Cordova, Git",
    avatar: DEFAULT_AVATAR
};

function initApp() {
    loadProfileData();
    setupEventListeners();
}

function loadProfileData() {
    const savedData = localStorage.getItem('studentProfile');
    const profile = savedData ? JSON.parse(savedData) : DEFAULT_PROFILE;
    renderProfile(profile);
}

function renderProfile(profile) {
    document.getElementById('display-fullname').textContent = profile.fullname;
    document.getElementById('display-course').textContent = profile.course;
    document.getElementById('display-year').textContent = profile.yearLevel;
    document.getElementById('display-about').textContent = profile.about;

    const avatarElem = document.getElementById('display-avatar');
    avatarElem.src = profile.avatar || DEFAULT_AVATAR;

    const skillsList = document.getElementById('display-skills');
    skillsList.innerHTML = '';
    
    const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    skillsArray.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        li.className = 'skill-chip';
        skillsList.appendChild(li);
    });
}

function setupEventListeners() {
    document.getElementById('btn-edit-profile').addEventListener('click', openEditForm);
    document.getElementById('btn-save').addEventListener('click', saveProfile);
    document.getElementById('btn-cancel').addEventListener('click', closeEditForm);

    document.getElementById('btn-camera').addEventListener('click', capturePhoto);
    document.getElementById('btn-change-photo').addEventListener('click', capturePhoto);
    document.getElementById('display-avatar').addEventListener('click', capturePhoto);
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
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: #ffffff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    `;

    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.style.cssText = "width: 320px; height: 240px; border-radius: 8px; background: #000; object-fit: cover;";

    const previewImg = document.createElement('img');
    previewImg.style.cssText = "width: 320px; height: 240px; border-radius: 8px; object-fit: cover; display: none;";

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = "display: flex; gap: 10px;";

    const btnCapture = document.createElement('button');
    btnCapture.textContent = "Capture";
    btnCapture.className = "btn primary";

    const btnUse = document.createElement('button');
    btnUse.textContent = "Use Photo";
    btnUse.className = "btn primary";
    btnUse.style.display = "none";

    const btnRetake = document.createElement('button');
    btnRetake.textContent = "Retake";
    btnRetake.className = "btn secondary";
    btnRetake.style.display = "none";

    const btnCancel = document.createElement('button');
    btnCancel.textContent = "Cancel";
    btnCancel.className = "btn secondary";

    btnContainer.appendChild(btnCapture);
    btnContainer.appendChild(btnUse);
    btnContainer.appendChild(btnRetake);
    btnContainer.appendChild(btnCancel);

    overlay.appendChild(video);
    overlay.appendChild(previewImg);
    overlay.appendChild(btnContainer);
    document.body.appendChild(overlay);

    let capturedDataUrl = "";

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                activeStream = stream;
                video.srcObject = stream;
                video.style.display = "block";
                previewImg.style.display = "none";

                btnCapture.style.display = "inline-block";
                btnCancel.style.display = "inline-block";
                btnUse.style.display = "none";
                btnRetake.style.display = "none";
            })
            .catch(err => {
                console.error(err);
                showCameraAlert("Unable to access camera.");
                closeWebcamModal();
            });
    }

    startCamera();

    btnCapture.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 400, 400);
        capturedDataUrl = canvas.toDataURL('image/jpeg');

        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }

        previewImg.src = capturedDataUrl;
        video.style.display = "none";
        previewImg.style.display = "block";

        btnCapture.style.display = "none";
        btnCancel.style.display = "none";
        btnUse.style.display = "inline-block";
        btnRetake.style.display = "inline-block";
    };

    btnRetake.onclick = () => {
        startCamera();
    };

    btnUse.onclick = () => {
        closeWebcamModal();
        onCameraSuccess(capturedDataUrl);
    };

    btnCancel.onclick = () => {
        closeWebcamModal();
    };
}

function closeWebcamModal() {
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }
    const modal = document.getElementById('custom-camera-modal');
    if (modal) {
        modal.remove();
    }
}

function onCameraSuccess(imageData) {
    const imageBase64 = imageData.startsWith('data:image') 
        ? imageData 
        : "data:image/jpeg;base64," + imageData;

    document.getElementById('display-avatar').src = imageBase64;

    const savedData = localStorage.getItem('studentProfile');
    const profile = savedData ? JSON.parse(savedData) : { ...DEFAULT_PROFILE };
    profile.avatar = imageBase64;

    localStorage.setItem('studentProfile', JSON.stringify(profile));
}

function onCameraError(message) {
    if (message && (message.toLowerCase().includes("cancelled") || message.toLowerCase().includes("canceled"))) {
        return;
    }
    showCameraAlert("Unable to access the camera.");
}

function openEditForm() {
    const savedData = localStorage.getItem('studentProfile');
    const profile = savedData ? JSON.parse(savedData) : DEFAULT_PROFILE;

    document.getElementById('input-fullname').value = profile.fullname;
    document.getElementById('input-course').value = profile.course;
    document.getElementById('input-year').value = profile.yearLevel;
    document.getElementById('input-about').value = profile.about;
    document.getElementById('input-skills').value = profile.skills;

    hideValidationAlert();
    document.getElementById('edit-profile-modal').classList.remove('hidden');
    document.getElementById('edit-profile-modal').scrollIntoView({ behavior: 'smooth' });
}

function closeEditForm() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
    hideValidationAlert();
}

function saveProfile() {
    const fullname = document.getElementById('input-fullname').value.trim();
    const course = document.getElementById('input-course').value.trim();
    const yearLevel = document.getElementById('input-year').value;
    const about = document.getElementById('input-about').value.trim();
    const skills = document.getElementById('input-skills').value.trim();

    if (!fullname || !course || !yearLevel || !about || !skills) {
        showValidationAlert('Please complete all required fields before saving.');
        return;
    }

    const savedData = localStorage.getItem('studentProfile');
    const currentProfile = savedData ? JSON.parse(savedData) : { ...DEFAULT_PROFILE };

    const updatedProfile = {
        ...currentProfile,
        fullname,
        course,
        yearLevel,
        about,
        skills
    };

    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
    renderProfile(updatedProfile);
    closeEditForm();
}

function showValidationAlert(msg) {
    const box = document.getElementById('validation-alert');
    box.textContent = msg;
    box.classList.remove('hidden');
}

function hideValidationAlert() {
    document.getElementById('validation-alert').classList.add('hidden');
}

function showCameraAlert(msg) {
    const box = document.getElementById('camera-alert');
    box.textContent = msg;
    box.classList.remove('hidden');
}

function hideCameraAlert() {
    document.getElementById('camera-alert').classList.add('hidden');
}