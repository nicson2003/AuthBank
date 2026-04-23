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

## 👥 Sample Users

These accounts are pre‑seeded for testing login and signup flows.

| ID  | Name            | Email              | Password   |
|-----|-----------------|--------------------|------------|
| 1   | Alice Johnson   | alice@example.com  | alice123   |
| 2   | Bob Smith       | bob@example.com    | bob456     |
| 3   | Charlie Brown   | charlie@example.com| charlie789 |
| 4   | Diana Prince    | diana@example.com  | diana123   |
| 5   | Ethan Hunt      | ethan@example.com  | ethan456   |
| 6   | Fiona Gallagher | fiona@example.com  | fiona789   |
| 7   | George Miller   | george@example.com | george123  |
| 8   | Hannah Lee      | hannah@example.com | hannah456  |
| 9   | Ian Wright      | ian@example.com    | ian789     |
| 10  | Julia Roberts   | julia@example.com  | julia123   |
| 11  | Kevin Durant    | kevin@example.com  | kevin456   |
| 12  | Laura Palmer    | laura@example.com  | laura789   |
| 13  | Michael Scott   | michael@example.com| michael123 |
| 14  | Nina Simone     | nina@example.com   | nina456    |
| 15  | Oscar Wilde     | oscar@example.com  | oscar789   |
| 16  | Paula Abdul     | paula@example.com  | paula123   |
| 17  | Quentin Blake   | quentin@example.com| quentin456 |
| 18  | Rachel Green    | rachel@example.com | rachel789  |
| 19  | Sam Wilson      | sam@example.com    | sam123     |
| 20  | Tina Fey        | tina@example.com   | tina456    |

