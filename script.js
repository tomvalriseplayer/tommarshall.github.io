const validUsername = "admin";
const validPassword = "password123";
const allowedIPs = ["192.168.0.1", "203.0.113.5"]; // Replace with allowed IPs

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Fetch the client's IP
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const clientIP = data.ip;

    if (username === validUsername && password === validPassword && allowedIPs.includes(clientIP)) {
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("errorMessage").textContent = 
            username !== validUsername || password !== validPassword
            ? "Invalid username or password."
            : "Access denied. Your IP is not authorized.";
    }
});

// Restrict dashboard access if not logged in
if (window.location.pathname.endsWith("dashboard.html") && !sessionStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
}
