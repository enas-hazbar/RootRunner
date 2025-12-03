<template>
  <GameTopBar 
    @show-hint="openHints"
    @show-challenge="showChallenge = true"
  />

  <div class="city-page">
    <!-- Background -->
    <div class="bg"></div>

    <!-- Main Box -->
    <div class="glass-card">
      <!-- Header -->
      <header class="top-section">
        <div class="logo-part">
          <img src="/citylogo.png" class="logo-img" />
          <h1 class="title">City view</h1>
        </div>

        <nav class="menu">
          <span :class="{active: tab === 'welcome'}" @click="switchTab('welcome')">Welcome</span>
          <span :class="{active: tab === 'employees'}" @click="switchTab('employees')">Employees</span>
          <span :class="{active: tab === 'contact'}" @click="switchTab('contact')">Contact</span>
<span 
  v-if="adminLoggedIn"
  :class="{active: tab === 'upload'}"
  @click="switchTab('upload')"
>
  Upload
</span>

        </nav>
      </header>

      <!-- Content Box -->
      <section class="content">
        <!-- WELCOME -->
        <div v-if="tab === 'welcome'" class="welcome-box">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae nunc 
            laoreet, fringilla libero a, tempor mi. Duis auctor, augue id tincidunt 
            lacinia, odio purus commodo leo, sed consequat neque elit vel lorem.
          </p>
        </div>

        <!-- EMPLOYEES -->
        <div v-if="tab === 'employees'" class="employees-box">
          <!-- List of employees -->
          <div v-if="!selected" class="employee-grid">
            <div
              v-for="e in employees"
              :key="e.id"
              class="employee-card"
              @click="onEmployeeClick(e)"
            >
              <img :src="e.img" class="emp-img" />
              <h3>{{ e.name }}</h3>
              <p>{{ e.role }}</p>
            </div>
          </div>

          <!-- Employee detail -->
          <div v-else class="employee-details">
            <button @click="goBackFromEmployee" class="back">← Back</button>

            <div class="details-header">
              <img :src="selected.img" class="detail-img" />
              <div>
                <h2>{{ selected.name }}</h2>
                <p class="detail-role">{{ selected.role }}</p>
              </div>
            </div>
          <p class="detail-text" v-html="selected.description"></p>
          <!-- Only show admin button for hidden employee -->
<button 
  v-if="selected.id === 8"
  class="admin-btn"
  @click="openAdminPortal"
>
  Open Admin Portal
</button>

          </div>
        </div>

        <!-- CONTACT -->
        <div v-if="tab === 'contact'" class="contact-box">
          <h2>Contact</h2>
          <p>If you need help, you can reach our team:</p>
          <ul class="contact-list">
            <li><strong>Email:</strong> info@cityview-company.com</li>
            <li><strong>Phone:</strong> +31 06 1234 5678</li>
            <li><strong>Office:</strong> Amstelveen, Brink 20</li>
          </ul>
        </div>

        <!-- HINT POPUP -->
        <div v-if="showHints" class="modal-overlay" @click.self="showHints = false">
          <div class="modal">
            <i class="fa-solid fa-xmark close-icon" @click="showHints = false"></i>

            <h2>Hints</h2>
            <br />

            <ol class="hint-list">
              <li :class="{ done: usedHint1 }">
                1. Search inside the co-worker files to find a hidden admin file.
              </li>

              <li :class="{ done: usedHint2 }">
                2. Modify the URL by adding the best city view name.
              </li>

            <li :class="{ done: usedHint3 }">
              3. Upload a city view or countryside photo to finish the challenge.
            </li>

            </ol>

            <p class="hint-note">Hints unlock automatically when discovered.</p>
          </div>
        </div>

        <!-- CHALLENGE POPUP -->
        <div v-if="showChallenge" class="modal-overlay" @click.self="showChallenge = false">
          <div class="modal">
            <i class="fa-solid fa-xmark close-icon" @click="showChallenge = false"></i>

            <h2>Challenge Objective</h2>
            <br />
            <p>
              Your mission: Find the hidden admin file somewhere in the system. Inside that file you’ll discover a link 
              to our secret admin website. Log in to that admin site using the credentials you find, and finally upload a
              picture showing either a city view or a countryside view to complete the challenge.
            </p>
            <br />
          </div>
        </div>

        <!-- HINT #1 COMPLETE POPUP -->
        <div v-if="showHint1Popup" class="modal-overlay" @click.self="showHint1Popup = false">
          <div class="modal">
            <i class="fa-solid fa-xmark close-icon" @click="showHint1Popup = false"></i>
            <h2>Hint #1 completed</h2>
            <p>You found the hidden employee file.</p>
          </div>
        </div>
        <!-- HINT #2 COMPLETE POPUP -->
<div v-if="showHint2Popup" class="modal-overlay" @click.self="showHint2Popup = false">
  <div class="modal">
    <i class="fa-solid fa-xmark close-icon" @click="showHint2Popup = false"></i>
    <h2>Hint #2 completed</h2>

    <p>
    You discovered the missing city name!<br><br>

      🔑 <strong>Username:</strong> cityadmin<br>
      🔐 <strong>Password:</strong> Alwzer2025
    </p> <br></br>
    <p>Use these credentials to log in to the admin portal.</p>
  </div>
</div>

        <!-- ADMIN PAGE -->
<div v-if="tab === 'admin'" class="admin-box">
  <h2>Admin Portal</h2>
<p v-if="!usedHint2">
  Welcome to the hidden admin interface.<br>
  Please log in to continue.<br><br>
  <strong>🔒 Admin credentials locked.</strong><br>
  Modify the URL with the best city view to unlock access.
</p>

<p v-else>
  <strong>Admin Access Unlocked!</strong><br><br>
  Enter your credentials below to continue.
</p>


  <div class="login-form-admin">
    <label>Username:</label>
    <input type="text" v-model="adminUser">

    <label>Password:</label>
    <input type="password" v-model="adminPass">

    <button @click="loginAdmin">Login</button>
  </div>
</div>
<div v-if="showSuccess" class="success-overlay" @click.self="closeSuccess">
  <div class="success-box">
    
    <!-- CityView Logo -->
    <img src="/citylogo.png" alt="CityView" class="success-logo" />

    <h2 class="success-title">CHALLENGE<br>COMPLETED!</h2>

    <p class="success-sub">
      You successfully finished the CityView mission.
    </p>

    <button class="success-btn" @click="goBack">
      Return to Dashboard
    </button>

    <p class="success-hint">You may close this popup anytime.</p>
  </div>
</div>

<div v-if="tab === 'upload'" class="upload-box">
  <h2>Upload City or Countryside View</h2>
  <p>Submit any image to complete the mission.</p>

  <!-- Styled Upload Field -->
  <label class="upload-label">
    <input 
      type="file" 
      accept="image/*" 
      @change="finishChallenge"
    />
    Choose Image
  </label>

  <!-- Image Preview -->
  <div v-if="previewImage" class="preview-wrapper">
    <h3>Preview:</h3>
    <img :src="previewImage" class="preview-img" />
  </div>

  <hr />

  <h3>Uploaded Images</h3>
  <div class="gallery-grid">
    <div v-for="img in allUploads" :key="img.username" class="gallery-item">
      <img :src="img.image" class="uploaded-img" />
      <p class="gallery-username">{{ img.username }}</p>
    </div>
  </div>
</div>

      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import GameTopBar from '@/components/GameTopBar.vue';
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  serverTimestamp
} from "firebase/firestore"
import { db } from "@/firebase"
import { getStorage } from "firebase/storage";

const tab = ref("welcome");

const startTime = ref(null);
const elapsedTime = ref(0);
let timerInterval = null;

onMounted(async () => {
  if (!localStorage.getItem("CityViewTimerStart")) {
    const now = Date.now();
    localStorage.setItem("CityViewTimerStart", now);
    startTime.value = now;
  } else {
    startTime.value = Number(localStorage.getItem("CityViewTimerStart"));
  }

  timerInterval = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);

  await loadAllUploads();
  handleHiddenEmployee();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

const showHints = ref(false);
const showChallenge = ref(false);

const usedHint1 = ref(false);
const usedHint2 = ref(false);
const usedHint3 = ref(false);

const showHint1Popup = ref(false);
const showHint2Popup = ref(false);
const showSuccess = ref(false);

const adminUser = ref("");
const adminPass = ref("");

const correctAdminUser = "cityadmin";
const correctAdminPass = "Alwzer2025";

const adminLoggedIn = ref(false);

const route = useRoute();
const router = useRouter();

const progressCityView = ref(0);

const storage = getStorage();
const allUploads = ref([]);
const previewImage = ref(null);

const employees = ref([
  {
    id: 1,
    name: "Sarah Miles",
    role: "Project Manager",
    img: "https://i.pinimg.com/736x/d7/a7/61/d7a761f988ccb4131ddc15a19844bc52.jpg",
    description: "Sarah oversees the entire City View department."
  },
  {
    id: 2,
    name: "David Turner",
    role: "Field Technician",
    img: "https://i.pinimg.com/736x/8c/5e/9d/8c5e9dd58ecd175df019b09f6bac72b6.jpg",
    description: "David works on equipment diagnostics."
  },
  {
    id: 3,
    name: "Lena O'Neil",
    role: "Data Analyst",
    img: "https://i.pinimg.com/736x/f5/b5/0d/f5b50deff13e3efee1d5ac379988455f.jpg",
    description: "Lena analyzes environmental patterns."
  }
]);

const hiddenEmployee = {
  id: 8,
  name: "Ena",
  role: "CEO",
  img: "https://i.pinimg.com/736x/be/3a/9e/be3a9ec574d30ef373aa7df1d8f5e3bc.jpg",
  description: `
      You found the confidential employee record.<br><br>
      The admin portal is located here:<br><br>
      (Use the button below to open it)<br><br>
      The missing part of the URL is still hidden...
    `
};

const selected = ref(null);

watch(() => route.query.employee, (val) => {
  if (Number(val) === 8 && !usedHint1.value) {
    usedHint1.value = true;
    showHint1Popup.value = true;
    saveCityViewProgress(33);
  }
}, { immediate: true });

watch(() => route.query.city, (city) => {
  if (!city) return;
  if (city.toLowerCase() === "newyork" && !usedHint2.value) {
    usedHint2.value = true;
    showHint2Popup.value = true;
    saveCityViewProgress(66);

    router.replace({ query: { ...route.query, CityViewAdmin: true } });
    tab.value = "admin";
  }
}, { immediate: true });

function switchTab(t) {
  tab.value = t;
  selected.value = null;
}

function openHints() {
  showHints.value = true;
}

function onEmployeeClick(e) {
  selected.value = e;
  tab.value = "employees";
  router.replace({ query: { ...route.query, employee: e.id } });
}

function goBackFromEmployee() {
  selected.value = null;
  const newQuery = { ...route.query };
  delete newQuery.employee;
  router.replace({ query: newQuery });
}

async function saveCityViewProgress(val) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;

  await setDoc(doc(db, "users", user), {
    progress: { CityView: val }
  }, { merge: true });
}

function loginAdmin() {
  if (!usedHint2.value) return alert("Unlock the second hint first.");

  if (adminUser.value === correctAdminUser && adminPass.value === correctAdminPass) {
    adminLoggedIn.value = true;
    alert("Login successful! Upload your final image.");
    tab.value = "upload";
  } else {
    alert("Incorrect username or password.");
  }
}

async function finishChallenge(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) return alert("Only images allowed.");
  if (file.size > 4 * 1024 * 1024) return alert("Max 4MB.");

  previewImage.value = URL.createObjectURL(file);

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result;
    const username = localStorage.getItem("loggedInUser");

    try {
      await setDoc(doc(db, "CityViewUploads", username), {
        image: base64,
        uploadedAt: new Date()
      }, { merge: true });

      usedHint3.value = true;
      saveCityViewProgress(100);

      await loadAllUploads();

      clearInterval(timerInterval);
      const totalSeconds = elapsedTime.value;

      await setDoc(
        doc(db, "leaderboard", `${username}_CityView`),
        {
          username,
          game: "CityView",
          time: totalSeconds,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      localStorage.removeItem("CityViewTimerStart");

      showSuccess.value = true;
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    }
  };

  reader.readAsDataURL(file);
}

async function loadAllUploads() {
  allUploads.value = [];
  const snapshot = await getDocs(collection(db, "CityViewUploads"));
  snapshot.forEach(docSnap => {
    allUploads.value.push({ username: docSnap.id, ...docSnap.data() });
  });
}

function closeSuccess() {
  showSuccess.value = false;
}

function goBack() {
  window.location.href = "/Dashboard";
}

function handleHiddenEmployee() {
  const employeeId = Number(route.query.employee);
  if (employeeId === 8) {
    selected.value = hiddenEmployee;
    tab.value = "employees";
  }
}
function openAdminPortal() {
  router.replace({
    query: {
      ...route.query,
      CityViewAdmin: true
    }
  });
  tab.value = "admin";
}

</script>

<style scoped>
.city-page {
  position: relative;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
}

.bg {
  position: absolute;
  inset: 0;
  background: url("/city1.png") center/cover no-repeat;
  filter: brightness(0.5);
  z-index: 1;
}

:deep(.game-topbar) {
  position: relative;
  z-index: 3;
}

.glass-card {
  position: relative;
  z-index: 2;
  margin: 10px auto 55px; 
  max-width: 1100px;
  padding: 30px 40px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  color: white;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-part {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-img {
  width: 95px;
}

.title {
  font-size: 38px;
  font-weight: 700;
}

.menu span {
  margin-left: 26px;
  cursor: pointer;
  font-weight: 600;
}
.menu span.active {
  border-bottom: 2px solid white;
}

.content {
  margin-top: 35px;
  background: white;
  color: #222;
  padding: 22px 28px;
  border-radius: 16px;
  min-height: 300px;
}

.employee-grid {
  display: flex;
  justify-content: center;
  gap: 22px;
}

.employee-card {
  width: 180px;
  padding: 12px;
  background: #f3f6ff;
  border-radius: 14px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}
.employee-card:hover {
  background: #e1f4ff;
  transform: translateY(-5px);
}
.emp-img {
  width: 100%;
  border-radius: 12px;
}

.employee-details .back {
  margin-bottom: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #008cff;
}

.contact-list {
  margin-top: 10px;
  line-height: 1.6;
}

.hint-list {
  list-style: none;
  padding: 0;
}
.hint-list li {
  padding: 10px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.hint-list li.done {
  text-decoration: line-through;
  color: #00eaff;
}

.hint-note {
  margin-top: 12px;
  color: rgba(215, 230, 255, 0.7);
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.modal {
  background: linear-gradient(180deg, #0b0f12 0%, #1b2730 100%);
  color: #fff;
  padding: 25px;
  width: min(700px, 90%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  position: relative;
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 16px;
  cursor: pointer;
  font-size: 20px;
  color: #aaa;
}
.close-icon:hover {
  color: #0ef;
}

.details-header {
  display: flex;
  align-items: flex-start;
  gap: 25px;
  margin-bottom: 20px;
}

.detail-img {
  width: 140px;
  border-radius: 12px;
  flex-shrink: 0;
}

.details-header > div {
  flex: 1;
}

.detail-role {
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
}

.contact-box {
  position: relative;
  left: 3%;
}
.admin-btn {
  margin-top: 15px;
  padding: 10px 18px;
  background: #0077ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.admin-btn:hover {
  background: #005fcc;
  transform: translateY(-2px);
}
.admin-box {
  background: #ffffff;
  padding: 35px 45px;
  border-radius: 18px;
  margin-top: 20px;
  min-height: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.admin-box h2 {
  font-size: 30px;
  color: #222;
  font-weight: 700;
  margin-bottom: 15px;
}

.admin-box p {
  font-size: 16px;
  color: #444;
  line-height: 1.5;
  margin-bottom: 25px;
}

.login-form-admin {
  display: flex;
  flex-direction: column;
  gap: 12px; 
  max-width: 350px;
}

.login-form-admin label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.login-form-admin input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
  color: #0b0f12;
}

.login-form-admin input:focus {
  border-color: #008cff;
  box-shadow: 0 0 6px rgba(0, 140, 255, 0.25);
}

.login-form-admin button {
  margin-top: 12px;
  padding: 10px 14px;
  background: #008cff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: fit-content;
  transition: 0.25s;
}

.login-form-admin button:hover {
  background: #0aa2ff;
  box-shadow: 0 4px 12px rgba(0, 140, 255, 0.35);
  transform: translateY(-2px);
}
.credentials-box {
  margin-top: 15px;
  padding: 12px;
  background: #eef6ff;
  border-radius: 8px;
  color: #222;
  font-weight: 600;
}
.success-overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  animation: fadeIn 0.35s ease-out;
}

.success-box {
  background: #8bdeff;
  backdrop-filter: blur(22px);
  border-radius: 28px;
  padding: 50px 60px;
  width: min(640px, 90%);
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  animation: popupIn 0.35s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.success-logo {
  width: 95px;
  margin-bottom: 22px;
  opacity: 0.95;
}

.success-title {
  font-size: 34px;
  font-weight: 800;
  color: #1e3553;
  line-height: 1.25;
  margin-bottom: 18px;
}

.success-sub {
  font-size: 18px;
  color: #334a62;
  margin-bottom: 32px;
}

.success-btn {
  padding: 14px 34px;
  font-size: 18px;
  background: #3e7fe3;
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
}

.success-btn:hover {
  background: #2f6ed2;
}

.success-hint {
  margin-top: 26px;
  font-size: 15px;
  color: #6d7c8f;
}

@keyframes popupIn {
  0% { transform: translateY(20px) scale(0.97); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.upload-label {
  padding: 10px 18px;
  background: #0077ff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
  transition: 0.2s;
}

.upload-label:hover {
  background: #005fcc;
  transform: translateY(-2px);
}

.upload-label input {
  display: none;
}

.preview-wrapper {
  margin-top: 15px;
}

.preview-img {
  width: 260px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  margin-top: 8px;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.gallery-item {
  width: 150px;
  text-align: center;
}

.uploaded-img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.gallery-username {
  margin-top: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}
</style>
