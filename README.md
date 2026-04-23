# AuthBank – React Native Authentication App

AuthBank is a React Native application built to demonstrate **authentication flows** using **React Context API**.  
It includes **Login**, **Signup**, and **Home** screens with state management, navigation, and optional persistence.  
This project serves as an assignment to test understanding of **Context API**, **form handling**, and **navigation** in React Native.

---

## 📦 Features

- **Authentication Context**
  - Centralized state management with Context API
  - Functions: `login`, `signup`, `logout`
  - Stores the current `user` object globally

- **Screens**
  - **Login Screen**
    - Email & Password input fields
    - Validation for email format and credentials
    - Navigation to Signup
  - **Signup Screen**
    - Name, Email, Password input fields
    - Validation for missing fields, email format, and password length
    - Navigation back to Login
  - **Home Screen**
    - Displays logged‑in user’s name and email
    - Logout button to clear session

- **Persistence (Optional)**
  - Authentication state stored in **AsyncStorage**
  - Keeps user logged in after app restart

- **Navigation**
  - Managed with **React Navigation**
  - Stack navigation between Login, Signup, and Home

- **UI Design**
  - Clean and intuitive layouts
  - Styled input fields, buttons, and error messages
  - Optional **Password Visibility Toggle**

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- React Native CLI environment set up
- Android Studio / Xcode for device emulation
- Yarn or npm package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/authbank.git
cd authbank

# Install dependencies
npm install
# or
yarn install

# iOS setup
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
