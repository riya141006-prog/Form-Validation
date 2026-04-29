/* ─── HELPERS ───────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const setErr = (id, msg) => { $(id).textContent = msg; };
const clearErr = id => { $(id).textContent = ''; };
const markInvalid = id => { $(id).classList.add('invalid'); };
const markValid   = id => { $(id).classList.remove('invalid'); };

/* ─── DOB → AGE ─────────────────────────────────────────── */
$('dob').addEventListener('change', () => {
  const dobVal = $('dob').value;
  if (!dobVal) { $('age').value = ''; return; }
  const dob = new Date(dobVal);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  $('age').value = age >= 0 ? age : '';
});

/* ─── PASSWORD STRENGTH ─────────────────────────────────── */
$('password').addEventListener('input', () => {
  const val = $('password').value;
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;

  const fill = $('strength-fill');
  const label = $('strength-label');
  const levels = [
    { w:'0%',   bg:'transparent', text:'' },
    { w:'25%',  bg:'#ff4d6d',     text:'Weak' },
    { w:'50%',  bg:'#ff9f43',     text:'Fair' },
    { w:'75%',  bg:'#00d2d3',     text:'Good' },
    { w:'100%', bg:'#e8ff47',     text:'Strong' },
  ];
  fill.style.width      = levels[score].w;
  fill.style.background = levels[score].bg;
  label.textContent     = levels[score].text;
  label.style.color     = levels[score].bg;
});

/* ─── TOGGLE PASSWORD VISIBILITY ───────────────────────── */
function togglePass(inputId, btn) {
  const inp = $(inputId);
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.textContent = '🙈';
  } else {
    inp.type = 'password';
    btn.textContent = '👁';
  }
}

/* ─── STEP DOTS ─────────────────────────────────────────── */
function updateDots(activeStep) {
  for (let i = 1; i <= 3; i++) {
    const dot = $(`step-dot-${i}`);
    dot.classList.remove('active', 'done');
    if (i < activeStep)  dot.classList.add('done');
    if (i === activeStep) dot.classList.add('active');
  }
}

/* ─── SHOW STEP ─────────────────────────────────────────── */
function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const step = $(`form-step-${n}`);
  if (step) step.classList.add('active');
  updateDots(n);
}

/* ─── VALIDATORS ────────────────────────────────────────── */
function validateStep1() {
  let ok = true;

  // Prefix
  if (!$('prefix').value) {
    setErr('err-prefix', 'Required'); markInvalid('prefix'); ok = false;
  } else { clearErr('err-prefix'); markValid('prefix'); }

  // First Name
  const fn = $('firstName').value.trim();
  if (!fn) {
    setErr('err-firstName', 'First name is required'); markInvalid('firstName'); ok = false;
  } else if (!/^[A-Za-z\s'-]{2,}$/.test(fn)) {
    setErr('err-firstName', 'Only letters, min 2 chars'); markInvalid('firstName'); ok = false;
  } else { clearErr('err-firstName'); markValid('firstName'); }

  // Last Name
  const ln = $('lastName').value.trim();
  if (!ln) {
    setErr('err-lastName', 'Last name is required'); markInvalid('lastName'); ok = false;
  } else if (!/^[A-Za-z\s'-]{2,}$/.test(ln)) {
    setErr('err-lastName', 'Only letters, min 2 chars'); markInvalid('lastName'); ok = false;
  } else { clearErr('err-lastName'); markValid('lastName'); }

  // Username
  const un = $('username').value.trim();
  if (!un) {
    setErr('err-username', 'Username is required'); markInvalid('username'); ok = false;
  } else if (!/^[a-zA-Z0-9._]{4,20}$/.test(un)) {
    setErr('err-username', '4–20 chars, letters/numbers/._'); markInvalid('username'); ok = false;
  } else { clearErr('err-username'); markValid('username'); }

  // DOB
  const dob = $('dob').value;
  if (!dob) {
    setErr('err-dob', 'Date of birth required'); markInvalid('dob'); ok = false;
  } else {
    const age = parseInt($('age').value);
    if (age < 13) {
      setErr('err-dob', 'Must be at least 13 years old'); markInvalid('dob'); ok = false;
    } else if (age > 120) {
      setErr('err-dob', 'Invalid date of birth'); markInvalid('dob'); ok = false;
    } else { clearErr('err-dob'); markValid('dob'); }
  }

  // Age (already auto-filled, just clear)
  clearErr('err-age'); markValid('age');

  // Gender
  if (!$('gender').value) {
    setErr('err-gender', 'Select a gender'); markInvalid('gender'); ok = false;
  } else { clearErr('err-gender'); markValid('gender'); }

  return ok;
}

function validateStep2() {
  let ok = true;

  const pw = $('password').value;
  if (!pw) {
    setErr('err-password', 'Password is required'); markInvalid('password'); ok = false;
  } else if (pw.length < 8) {
    setErr('err-password', 'At least 8 characters'); markInvalid('password'); ok = false;
  } else if (!/[0-9]/.test(pw)) {
    setErr('err-password', 'Must include at least one number'); markInvalid('password'); ok = false;
  } else if (!/[^A-Za-z0-9]/.test(pw)) {
    setErr('err-password', 'Must include a special character'); markInvalid('password'); ok = false;
  } else { clearErr('err-password'); markValid('password'); }

  const cp = $('confirmPassword').value;
  if (!cp) {
    setErr('err-confirmPassword', 'Please confirm your password'); markInvalid('confirmPassword'); ok = false;
  } else if (cp !== pw) {
    setErr('err-confirmPassword', 'Passwords do not match'); markInvalid('confirmPassword'); ok = false;
  } else { clearErr('err-confirmPassword'); markValid('confirmPassword'); }

  return ok;
}

function validateStep3() {
  let ok = true;

  const email = $('email').value.trim();
  if (!email) {
    setErr('err-email', 'Email is required'); markInvalid('email'); ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setErr('err-email', 'Enter a valid email address'); markInvalid('email'); ok = false;
  } else { clearErr('err-email'); markValid('email'); }

  const phone = $('phone').value.trim();
  if (!phone) {
    setErr('err-phone', 'Contact number is required'); markInvalid('phone'); ok = false;
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    setErr('err-phone', 'Enter a valid 10-digit Indian mobile number'); markInvalid('phone'); ok = false;
  } else { clearErr('err-phone'); markValid('phone'); }

  return ok;
}

/* ─── NAVIGATION ────────────────────────────────────────── */
function goNext(currentStep) {
  const validators = [null, validateStep1, validateStep2, validateStep3];
  if (validators[currentStep]()) {
    showStep(currentStep + 1);
  }
}

function goBack(currentStep) {
  showStep(currentStep - 1);
}

/* ─── SUBMIT ────────────────────────────────────────────── */
$('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateStep3()) return;

  const name = `${$('prefix').value} ${$('firstName').value.trim()} ${$('lastName').value.trim()}`;
  $('success-msg').textContent = `Welcome, ${name}! Your spot at SONIC RUSH 2026 is confirmed. Check ${$('email').value} for your ticket.`;

  $('regForm').style.display = 'none';
  $('successScreen').classList.add('show');
  updateDots(4);
});

/* ─── RESET ─────────────────────────────────────────────── */
function resetForm() {
  $('regForm').reset();
  $('age').value = '';
  $('strength-fill').style.width = '0%';
  $('strength-label').textContent = '';
  document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.err').forEach(el => el.textContent = '');
  $('successScreen').classList.remove('show');
  $('regForm').style.display = '';
  showStep(1);
}

/* ─── INIT ──────────────────────────────────────────────── */
showStep(1);