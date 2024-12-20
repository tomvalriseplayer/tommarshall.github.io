// This is where the password is stored. This is for demonstration purposes, but in production, handle this on the server.
const VALID_USERNAME = "T.J.A Marshall";
const VALID_PASSWORD = "VCsGMGX+bpCQ5$wL";
const ALLOWED_IPS = ["213.6.235.238", "106.207.129.17"];  // Array of allowed IPs

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
        // Check if the user's IP is in the allowed list
        if (!ALLOWED_IPS.includes(ip)) {
            alert("Your IP Address is incorrect");
            setTimeout(function() {
                window.location.href = "https://forum.sagov.us/";  // Redirect to Google after 5 seconds
            }, 3000);
        } else {
            // IP is allowed, proceed with the login check
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                // Use sessionStorage instead of localStorage
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                alert("Login information is incorrect");
            }
        }
    });
}
