import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2XIO662sGa4QCFYJRAkdoVMBr5P9kPyY",
    authDomain: "pwd-notes.firebaseapp.com",
    projectId: "pwd-notes",
    storageBucket: "pwd-notes.appspot.com",
    messagingSenderId: "1033655385894",
    appId: "1:1033655385894:web:32d63f334d8c386b9d8be7"
}
  
// Initialize Firebase
const app = initializeApp(firebaseConfig)

export {app}
