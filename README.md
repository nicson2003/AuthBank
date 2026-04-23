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
| 1   | Alice Johnson   | alice@example.com  | secure1    |
| 2   | Bob Smith       | bob@example.com    | secure2    |
| 3   | Charlie Brown   | charlie@example.com| secure3    |
| 4   | Diana Prince    | diana@example.com  | secure4    |
| 5   | Ethan Hunt      | ethan@example.com  | secure5    |
| 6   | Fiona Gallagher | fiona@example.com  | secure6    |
| 7   | George Miller   | george@example.com | secure7    |
| 8   | Hannah Lee      | hannah@example.com | secure8    |
| 9   | Ian Wright      | ian@example.com    | secure9    |
| 10  | Julia Roberts   | julia@example.com  | secure10   |
| 11  | Kevin Durant    | kevin@example.com  | secure11   |
| 12  | Laura Palmer    | laura@example.com  | secure12   |
| 13  | Michael Scott   | michael@example.com| secure13   |
| 14  | Nina Simone     | nina@example.com   | secure14   |
| 15  | Oscar Wilde     | oscar@example.com  | secure15   |
| 16  | Paula Abdul     | paula@example.com  | secure16   |
| 17  | Quentin Blake   | quentin@example.com| secure17   |
| 18  | Rachel Green    | rachel@example.com | secure18   |
| 19  | Sam Wilson      | sam@example.com    | secure19   |
| 20  | Tina Fey        | tina@example.com   | secure20   |

