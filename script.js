const registerSection = document.getElementById('registerSection');
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const updateForm = document.getElementById('updateForm');
const uploadForm = document.getElementById('uploadForm');

const registrationMessage = document.getElementById('registrationMessage');
const loginMessage = document.getElementById('loginMessage');
const updateMessage = document.getElementById('updateMessage');
const documentList = document.getElementById('documentList');

const storageKey = 'unicLockerUser';
let currentUser = null;

function generateUnicNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${randomLetters}-${randomDigits}`;
}

function saveUser(user) {
  localStorage.setItem(storageKey, JSON.stringify(user));
}

function getSavedUser() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
}

function showLogin() {
  registerSection.classList.add('hidden');
  dashboardSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

function showDashboard() {
  loginSection.classList.add('hidden');
  registerSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  renderProfile();
  renderDocuments();
}

function renderProfile() {
  document.getElementById('displayUnic').textContent = currentUser.unicNumber;
  document.getElementById('displayName').textContent = currentUser.fullName;
  document.getElementById('displayEmail').textContent = currentUser.email;
  document.getElementById('displayPhone').textContent = currentUser.phone;

  document.getElementById('updateName').value = currentUser.fullName;
  document.getElementById('updateEmail').value = currentUser.email;
  document.getElementById('updatePhone').value = currentUser.phone;
  document.getElementById('updateAddress').value = currentUser.address;
}

function renderDocuments() {
  documentList.innerHTML = '';
  const docs = currentUser.documents || {};
  const entries = Object.entries(docs).filter(([, value]) => value && value.length);

  if (entries.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'No documents uploaded yet.';
    documentList.appendChild(item);
    return;
  }

  entries.forEach(([key, value]) => {
    const item = document.createElement('li');
    item.textContent = `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
    documentList.appendChild(item);
  });
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const user = {
    fullName: document.getElementById('fullName').value.trim(),
    dob: document.getElementById('dob').value,
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    otp: document.getElementById('otp').value.trim(),
    address: document.getElementById('address').value.trim(),
    password: document.getElementById('registerPassword').value,
    unicNumber: generateUnicNumber(),
    documents: {}
  };

  currentUser = user;
  saveUser(user);

  registrationMessage.textContent = `Registration successful! Your UNIC Number is ${user.unicNumber}. Use it to login.`;
  registerForm.reset();

  setTimeout(() => {
    showLogin();
    document.getElementById('loginUnic').value = user.unicNumber;
  }, 900);
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const unic = document.getElementById('loginUnic').value.trim();
  const password = document.getElementById('loginPassword').value;
  const saved = getSavedUser();

  if (saved && unic === saved.unicNumber && password === saved.password) {
    currentUser = saved;
    loginMessage.textContent = '';
    showDashboard();
  } else {
    loginMessage.textContent = 'Invalid UNIC Number or password.';
  }
});

updateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  currentUser.fullName = document.getElementById('updateName').value.trim();
  currentUser.email = document.getElementById('updateEmail').value.trim();
  currentUser.phone = document.getElementById('updatePhone').value.trim();
  currentUser.address = document.getElementById('updateAddress').value.trim();

  saveUser(currentUser);
  renderProfile();
  updateMessage.textContent = 'Details updated successfully.';
  setTimeout(() => {
    updateMessage.textContent = '';
  }, 1500);
});

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const readFileNames = (inputId) => {
    const files = document.getElementById(inputId).files;
    if (!files || files.length === 0) {
      return null;
    }
    return Array.from(files).map((file) => file.name);
  };

  currentUser.documents = {
    Aadhaar: readFileNames('aadhaar'),
    '10th Certificate': readFileNames('cert10'),
    '12th Certificate': readFileNames('cert12'),
    'Other Documents': readFileNames('otherDocs')
  };

  saveUser(currentUser);
  renderDocuments();
  uploadForm.reset();
});

document.querySelectorAll('.tab-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  loginForm.reset();
  showLogin();
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = getSavedUser();
  if (saved) {
    showLogin();
  }
});
