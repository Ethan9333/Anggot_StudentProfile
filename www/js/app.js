document.addEventListener('deviceready', onDeviceReady, false);


document.addEventListener('DOMContentLoaded', () => {
    if (!window.cordova) {
        initApp();
    }
});

function onDeviceReady() {
    initApp();
}


const DEFAULT_PROFILE = {
    fullname: "Ethan Kyle Anggot",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "Passionate IT student specializing in web and mobile app development.",
    skills: "JavaScript, HTML/CSS, Cordova, Git"
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
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnSave = document.getElementById('btn-save');
    const btnCancel = document.getElementById('btn-cancel');

    btnEdit.addEventListener('click', openEditForm);
    btnSave.addEventListener('click', saveProfile);
    btnCancel.addEventListener('click', closeEditForm);
}

function openEditForm() {
    const savedData = localStorage.getItem('studentProfile');
    const profile = savedData ? JSON.parse(savedData) : DEFAULT_PROFILE;

    
    document.getElementById('input-fullname').value = profile.fullname;
    document.getElementById('input-course').value = profile.course;
    document.getElementById('input-year').value = profile.yearLevel;
    document.getElementById('input-about').value = profile.about;
    document.getElementById('input-skills').value = profile.skills;

    hideAlert();
    document.getElementById('edit-profile-modal').classList.remove('hidden');
    document.getElementById('edit-profile-modal').scrollIntoView({ behavior: 'smooth' });
}

function closeEditForm() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
    hideAlert();
}

function saveProfile() {
    const fullname = document.getElementById('input-fullname').value.trim();
    const course = document.getElementById('input-course').value.trim();
    const yearLevel = document.getElementById('input-year').value;
    const about = document.getElementById('input-about').value.trim();
    const skills = document.getElementById('input-skills').value.trim();

   
    if (!fullname || !course || !yearLevel || !about || !skills) {
        showAlert('Please complete all required fields before saving.');
        return;
    }

    const updatedProfile = { fullname, course, yearLevel, about, skills };


    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));

   
    renderProfile(updatedProfile);

    
    closeEditForm();
}

function showAlert(message) {
    const alertBox = document.getElementById('validation-alert');
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
}

function hideAlert() {
    const alertBox = document.getElementById('validation-alert');
    alertBox.classList.add('hidden');
}