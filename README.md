# Deployment Checklist App

The **Deployment Checklist App** is a mobile application developed as part of a **project-based internship assignment**.  
The app is designed to manage **deployment and retrieval operations across multiple sites**, with proper tracking, validation, and summary reporting.

> ⚠️ **Important Note**  
> The complete and final implementation of this project is available in the **`final-code` branch**.  
> The `main` branch does not contain the final submission code.

---

## 📌 Problem Understanding

In real-world deployment scenarios, especially when multiple sites are involved, teams face challenges such as:
- Missing deployment or retrieval steps
- Lack of proof (image/location) for on-site activities
- No consolidated summary across sites
- Difficulty tracking deployment progress over time

This application addresses these problems by providing a **structured, repeatable, and verifiable workflow** for deployment and retrieval activities.

---

## 📱 App Overview

The Deployment Checklist App enables users to:
- Perform **deployment and retrieval activities repeatedly across multiple sites**
- Capture **proof of work** using images and GPS location
- Track activities **site-wise** and **time-wise**
- Generate **summaries for deployments and retrievals**
- Store all data securely on the device for offline access

The focus is on **clarity, reliability, and real-world usability**.

---

## 🔄 Complete Application Workflow

### 1️⃣ Site-Based Deployment

- Users perform deployment operations at different sites
- Each deployment activity includes:
  - Capturing **images** as proof
  - Recording **GPS coordinates** of the site
  - Associating deployment details with a specific site
  - Gathering weather conditions
  - Arrival timing on sites
  - Pre-Deployment checklist for once
  - Site arrival setup --> Device setup --> Placement of device checklist --> Deployment documentation --> Ground Truthing with Photos (repeat for all sites)
- Permissions are handled explicitly for:
  - Camera (photo/video)
  - Location access

This ensures every deployment action is **verifiable and traceable**.

---

### 2️⃣ Site-Based Retrieval

- Retrieval operations can be performed independently for the same sites
- Similar to deployment, retrieval includes:
  - Image capture
  - Location coordinates fetched for that site
  - Site association
- This allows the app to track **complete lifecycle** of a site  
  (Deployment → Retrieval)

---

### 3️⃣ Data Storage & Offline Support

- All deployment and retrieval data is stored using **AsyncStorage**
- This ensures:
  - Data persistence even after app restarts
  - Offline usability without dependency on internet
  - Faster access and retrieval of historical records

Stored data includes:
- Images
- GPS coordinates
- Site details
- Deployment and retrieval timestamps

---

### 4️⃣ Summary & Reporting

The app provides **clear summaries** to help users analyze activity:

#### 📍 Site-Based Summary
- View deployments and retrievals per site
- Understand activity history for each location

#### 📆 Weekly Summary
- Weekly overview of:
  - Deployment count
  - Retrieval count
- Helps in tracking operational progress over time

Both **deployment and retrieval summaries** are maintained separately for better clarity.

---

## 🧠 Focus Areas While Building the App

While developing this application, the primary focus was on:

- **Understanding the real-world deployment workflow**
- Designing a **repeatable and scalable process**
- Ensuring **data accuracy** using image and location capture
- Handling permissions responsibly
- Keeping the UI simple and intuitive
- Writing maintainable and structured code
- Making the app usable even in **offline scenarios**

The goal was not just to build a working app, but to demonstrate **problem-solving ability and system thinking**.

---

## 🛠️ Technical Implementation

- **Frontend:** React Native
- **Build & Deployment:** Expo / EAS Build
- **Data Storage:** AsyncStorage (local device storage)
- **Device Features Used:**
  - Camera (image capture)
  - GPS (location coordinates)
  - Media & location permissions
- **Platform:** Android

---

## 📦 APK & Demo Video

- The **APK file** is included in the submission
- A **demo video** is provided showcasing:
  - Deployment workflow
  - Retrieval workflow
  - Summary screens
  - Overall app functionality

---

## 🖼️ Screenshots

Screenshots of the application UI and workflows are provided below for reference.



---

## 🔗 Repository Access

Repository access has been shared with the reviewers as requested.

---

## 👤 Author

**Ishank Sharma**  
📞 +91 98118 70449

---

Thank you for reviewing this project.
