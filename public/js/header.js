const user = ParseApi.checkCurrentUser();
const loginContainer = document.querySelector('.header .login-container')
const userContainer = document.querySelector('.header .user-container')
if (user) {
    console.log(user);
    loginContainer.innerHTML = "Logout";
    loginContainer.href = "javascript:logout();";
    userContainer.innerHTML = user.username;
} else {
    userContainer.style = "display:none";
}
