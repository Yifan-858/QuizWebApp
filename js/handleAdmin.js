import { showPage } from "./handlePage.js";

//Admin Login
const admin = { userName: "Yifan", password: "123456" };
const handleAdminClick = () => {
  showPage("admin-login-page");
};

const adminLoginBtn = document.getElementById("admin-login-btn");
adminLoginBtn.addEventListener("click", () => handleAdminClick());

const adminLoginPage = document.getElementById("admin-login-page");

export const loginContainer = document.createElement("div");
loginContainer.classList.add("login-container");
adminLoginPage.appendChild(loginContainer);

const userNameLabel = document.createElement("p");
userNameLabel.textContent = "User Name";
loginContainer.appendChild(userNameLabel);

const userNameInput = document.createElement("input");
userNameInput.type = "text";
loginContainer.appendChild(userNameInput);

const passwordLabel = document.createElement("p");
passwordLabel.textContent = "Password";
loginContainer.appendChild(passwordLabel);

const passwordInput = document.createElement("input");
passwordInput.type = "password";
loginContainer.appendChild(passwordInput);

export const handleLoginClick = () => {
  if (
    userNameInput.value == admin.userName &&
    passwordInput.value == admin.password
  ) {
    userNameInput.value = "";
    passwordInput.value = "";
    showPage("admin-page");
  } else {
    alert("Invalid Login");
  }
};
