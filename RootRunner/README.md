# **RootRunner – Cybersecurity Learning Platform**

RootRunner is a beginner-friendly cybersecurity learning platform built with **Vue.js** and **Firebase**.
It teaches basic Red Team concepts through three interactive mini-games, including URL manipulation, hidden files, admin access, and secure authentication.

---

## ⭐ **Features**

* 🔐 **Secure login/signup** (hashed passwords + validation)
* 🔑 **Google Authentication**
* 🕹️ **3 Cybersecurity Mini-Games**
* 💡 **Hint system**
* 📊 **Leaderboard** (best time tracking)
* 📁 **CityView image upload system**
* 📮 **Contact form using EmailJS**
* 🔄 **Real-time Firestore updates**
* 🧠 **Progress tracking**

---

## 🛠️ **Tech Stack**

**Frontend:** Vue.js 3, CSS
**Backend Logic:** Vue + Firebase services
**Database:** Firebase Firestore
**Auth:** Firebase Authentication (Email & Google)

---

## 📁 **Project Structure**

```
src/
 ├── components/
 │    ├── GameTopBar.vue
 │    ├── Navbar.vue
 │    ├── NavbarDashboard.vue
 ├── views/
 │    ├── Home.vue
 │    ├── Dashboard.vue
 │    ├── GameCountries.vue
 │    ├─HackerAcadmy.vue
 │    ├── CityView.vue
 ├── firebase.js
 └── router.js
```

---

## 🚀 **Setup**

Clone:

```bash
[git clone https://github.com/enas-hazbar/RootRunner.git]
cd rootrunner
```

Install:

```bash
npm install
```

Run:

```bash
npm run serve
```

Configure Firebase inside:

```
/src/firebase.js
```

---

## 🎮 **Mini-Games Overview**

1. **URL Hacking Challenge**
2. **VIP User Credential Challenge**
3. **CityView Challenge** (hidden employee → URL change → admin login → upload)

---

## 🧪 **Testing**

* Login & signup validation
* Challenge logic
* Leaderboard system
* Secure routing
* Timer persistence (localStorage)
* Image upload

---

## 📌 **Future Improvements**

* More challenges
* Mobile responsiveness
* Admin panel
* Extra cybersecurity puzzles
* Stronger Firestore rules

---

## 👤 **Author**

**Enas Hezabr**
ICT Student
