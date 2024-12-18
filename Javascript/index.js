// This is where the password is stored. This is for demonstration purposes, but in production, handle this on the server.
const VALID_USERNAME = "user";
const VALID_PASSWORD = "user";
const ALLOWED_IP = "213.6.235.238";  // Replace with the allowed IP address

// Function to get the client's IP address
function getIpAddress(callback) {
    // Using a free IP service to get the client's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => callback(data.ip))
        .catch(error => {
            console.error('Error fetching IP address:', error);
            alert("An error happened while fetching your IP Address");
        });
}

// Function to handle the login
function login(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // First, verify the user's IP address
    getIpAddress(function(ip) {
        // Check if the user's IP is the allowed one
        if (ip !== ALLOWED_IP) {
            alert("Your IP Address is incorrect");
            setTimeout(function() {
                window.location.href = "https://forum.sagov.us/";  // Redirect to Google after 5 seconds
            }, 3000);
        } else {
            // IP is allowed, proceed with the login check
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                // Store login status in localStorage (or use a backend session)
                localStorage.setItem("loggedIn", "true");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                alert("Login information is incorrect");
            }
        }
    });
}
