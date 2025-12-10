function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
function isAuthenticated() {
  return !!getToken();
}

export { logout, getToken, getUser, isAuthenticated };
