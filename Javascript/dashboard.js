const data = {
    officers: [
        { 
            title: 'VOLUME I | ORGANIZATION AND FUNCTIONS', 
            details: 'Media/Structure.png',
            icon: '<i class="fa-solid fa-sitemap"></i>'  // Officer icon
        },
        { 
            title: 'VOLUME II | POLICY', 
            details: 'Text/volumei.txt', // Load text from this file
            icon: '<i class="fa-solid fa-user-shield"></i>'  // Officer icon
        }
    ],
    crimes: [
        { 
            title: 'Case #001: Robbery', 
            details: 'Location: Main Street | Status: Solved',
            icon: '<i class="fa-solid fa-gavel"></i>'  // Crime icon
        },
        { 
            title: 'Case #002: Assault', 
            details: 'Location: Park Avenue | Status: Pending',
            icon: '<i class="fa-solid fa-gavel"></i>'  // Crime icon
        }
    ],
    traffic: [
        { 
            title: 'Speeding', 
            details: 'Fines: $200 | Points: 2',
            icon: '<i class="fa-solid fa-car-crash"></i>'  // Traffic icon
        },
        { 
            title: 'Reckless Driving', 
            details: 'Fines: $500 | Points: 4',
            icon: '<i class="fa-solid fa-car-crash"></i>'  // Traffic icon
        }
    ]
};

function toggleContainers(type) {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear content before adding new ones

    // Loop over the data to create the container boxes
    data[type].forEach(item => {
        const box = document.createElement('div');
        box.classList.add('container-box');
        
        // Add icon and title to the box
        box.innerHTML = `
            <h3>${item.icon} ${item.title}</h3>
            <hr>
        `;

        // Create the element for content (image or text)
        let contentElement;

        if (item.details.endsWith('.png') || item.details.endsWith('.jpg') || item.details.endsWith('.jpeg')) {
            // If the details are an image path, create the image element
            contentElement = document.createElement('img');
            contentElement.src = item.details;
            contentElement.alt = `${item.title} Image`;
            contentElement.classList.add('container-image');
        } else if (item.details.endsWith('.txt')) {
            // If the details are a .txt file, fetch the content
            contentElement = document.createElement('p');
            contentElement.textContent = 'Loading...'; // Placeholder while loading
            fetch(item.details)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    contentElement.textContent = text; // Replace placeholder with file content
                })
                .catch(error => {
                    console.error('Failed to load file:', error);
                    contentElement.textContent = 'Error loading file';
                });
        } else {
            // If the details are text, create the text element
            contentElement = document.createElement('p');
            contentElement.textContent = item.details;
        }

        // Initially set the content to be hidden (toggle functionality)
        contentElement.style.display = 'none';
        box.appendChild(contentElement);

        // Add the click event listener to toggle the details visibility
        box.addEventListener('click', function () {
            contentElement.style.display = contentElement.style.display === 'block' ? 'none' : 'block';
        });

        content.appendChild(box);
    });
}

// Function to highlight the text and handle search functionality
function highlightSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear the content before displaying results

    if (input) {
        // Loop through the data and show matching containers
        let foundMatch = false;

        // Loop through all data categories (officers, crimes, traffic)
        for (const category in data) {
            data[category].forEach(item => {
                const titleText = item.title.toLowerCase();
                const detailsText = item.details.toLowerCase();

                // If title or details match the search term, display the container
                if (titleText.includes(input) || detailsText.includes(input)) {
                    foundMatch = true;
                    const box = document.createElement('div');
                    box.classList.add('container-box');
                    
                    box.innerHTML = `
                        <h3>${item.icon} ${item.title}</h3>
                        <hr>
                        <p>${item.details}</p>
                    `;

                    // Automatically open the container if a match is found
                    const details = box.querySelector('p');
                    details.style.display = 'block';  // Make sure details are visible

                    // Add the click event listener to toggle the details visibility
                    box.addEventListener('click', function () {
                        const details = box.querySelector('p');
                        const allDetails = document.querySelectorAll('.container-box p');
                        allDetails.forEach(detail => {
                            if (detail !== details) {
                                detail.style.display = 'none';
                            }
                        });
                        details.style.display = details.style.display === 'block' ? 'none' : 'block';
                    });

                    // Highlight matching text in title and details
                    highlightText(box.querySelector('h3'), input);  // Highlight in the title
                    highlightText(box.querySelector('p'), input);   // Highlight in the details
                    
                    content.appendChild(box);
                }
            });
        }

        // If no matches were found, hide all containers
        if (!foundMatch) {
            content.innerHTML = '<p>No matching records found.</p>';
        }
    } else {
        // If no input is given, show no containers (same as initial load)
        content.innerHTML = ''; // Empty the content, no containers visible
    }
}

function highlightText(element, query) {
    const originalHTML = element.innerHTML;  // Save original HTML to preserve the icon

    // Create a temporary div to extract just the text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;

    // Find the icon and text separately
    const icon = tempDiv.querySelector('i');
    const textContent = tempDiv.textContent;  // Get the text content without the icon

    // Use regex to highlight the text matching the query
    const regex = new RegExp(`(${query})`, 'gi');  // Case-insensitive match
    const highlightedText = textContent.replace(regex, '<span class="highlight">$1</span>');  // Wrap matched text in <span>

    // Rebuild the HTML with the icon and highlighted text
    if (icon) {
        element.innerHTML = `<i class="${icon.className}"></i> ${highlightedText}`;
    } else {
        element.innerHTML = highlightedText;  // In case there's no icon
    }
}

// Function to clear the highlights
function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight');
    highlightedElements.forEach(element => {
        const originalText = element.textContent;  // Get the original text content
        element.replaceWith(originalText);  // Replace the highlight span with the original text
    });
}
