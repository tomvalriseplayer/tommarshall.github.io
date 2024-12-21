// This is where the credentials are stored. This is for demonstration purposes, but in production, handle this on the server.
const CREDENTIALS = {
    "213.6.235.238": { username: "Tom Marshall", password: "VCsGMGX+bpCQ5$wL" },
    "106.207.129.17": { username: "Jimmy Marshall", password: "bpCQ5$wLVCsGMGX+" }
};

// Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1319952772573167675/kp5tSmMXou8Z9xXBhHHHY2Mz9CX9LgRY95qqLMMfHj2wCnSxQefXo9fZ4NzDCy4zYv2_';

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

// Function to send a notification to Discord
function sendDiscordNotification(ip, username) {
    const embed = {
        author: {
            name: "Police Database",
            icon_url: "https://static.valrisegaming.com/SAMP-RP/SAPD/logos/SAPD.png"
        },
        color: 0x2c3e50,
        description: `**${username}** logged in with IP **${ip}**`,
        footer: {
            text: "Tom's Database",
            icon_url: "https://cdn.discordapp.com/avatars/1308870491955527862/06922297fb12faea2013dfa99b301cfd.webp?size=1024&format=webp"
        },
        timestamp: new Date().toISOString()
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(error => console.error('Error sending Discord notification:', error));
}

// Function to send a visit notification to Discord
function sendVisitNotification(ip) {
    const embed = {
        author: {
            name: "Police Database",
            icon_url: "https://static.valrisegaming.com/SAMP-RP/SAPD/logos/SAPD.png"
        },
        color: 0x2c3e50,
        description: `A guy with IP**${ip}** has visited the database`,
        footer: {
            text: "Tom's Database",
            icon_url: "https://cdn.discordapp.com/avatars/1308870491955527862/06922297fb12faea2013dfa99b301cfd.webp?size=1024&format=webp"
        },
        timestamp: new Date().toISOString()
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(error => console.error('Error sending Discord visit notification:', error));
}

// Function to handle the login
function login(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // First, verify the user's IP address
    getIpAddress(function(ip) {
        // Check if the user's IP is in the allowed list
        if (!CREDENTIALS[ip]) {
            alert("Your IP Address is incorrect");
            setTimeout(function() {
                window.location.href = "https://forum.sagov.us/";  // Redirect to forums.sagov.us after 3 seconds
            }, 3000);
        } else {
            // IP is allowed, proceed with the login check
            const validCredentials = CREDENTIALS[ip];
            if (username === validCredentials.username && password === validCredentials.password) {
                // Use sessionStorage instead of localStorage
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "dashboard.html"; // Redirect to dashboard
                sendDiscordNotification(ip, username); // Send notification to Discord
            } else {
                alert("Login information is incorrect");
            }
        }
    });
}

// Modified window.onload to include visit notification
window.onload = function() {
    getIpAddress(function(ip) {
        // Send visit notification first
        sendVisitNotification(ip);
        
        // Then check if IP is allowed
        if (!CREDENTIALS[ip]) {
            window.location.href = "https://forum.sagov.us/";
        }
    });
};