const data = {
    officers: [
        {
            title: 'VOLUME I | ORGANIZATION AND FUNCTIONS',
            details: 'Media/Structure.png',
            icon: '<i class="fa-solid fa-sitemap"></i>' // Officer icon
        },
        {
            title: 'VOLUME II | POLICY',
            details: 'Text/volumeii.html', // Load text from this file
            icon: '<i class="fa-solid fa-user-shield"></i>' // Officer icon
        },
        {
            title: 'VOLUME III | LINE PROCEDURES',
            details: 'Text/volumeiii.html', // Load text from this file
            icon: '<i class="fa-solid fa-user-shield"></i>' // Officer icon
        },
        {
            title: 'VOLUME IV | PROFESSIONAL STANDARDS',
            details: 'Text/volumeiv.html', // Load text from this file
            icon: '<i class="fa-solid fa-user-shield"></i>' // Officer icon
        }
    ],
    crimes: [
        {
            title: 'Case #001: Robbery',
            details: 'Location: Main Street | Status: Solved',
            icon: '<i class="fa-solid fa-gavel"></i>' // Crime icon
        },
        {
            title: 'Case #002: Assault',
            details: 'Location: Park Avenue | Status: Pending',
            icon: '<i class="fa-solid fa-gavel"></i>' // Crime icon
        }
    ],
    traffic: [
        {
            title: 'Speeding',
            details: 'Fines: $200 | Points: 2',
            icon: '<i class="fa-solid fa-car-crash"></i>' // Traffic icon
        },
        {
            title: 'Reckless Driving',
            details: 'Fines: $500 | Points: 4',
            icon: '<i class="fa-solid fa-car-crash"></i>' // Traffic icon
        }
    ]
};

function toggleContainers(type) {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear content before adding new ones

    data[type].forEach(item => {
        const box = document.createElement('div');
        box.classList.add('container-box');

        box.innerHTML = `
            <h3>${item.icon} ${item.title}</h3>
            <hr>
        `;

        let contentElement;

        if (item.details.endsWith('.png') || item.details.endsWith('.jpg') || item.details.endsWith('.jpeg')) {
            contentElement = document.createElement('img');
            contentElement.src = item.details;
            contentElement.alt = `${item.title} Image`;
            contentElement.classList.add('container-image');
        } else if (item.details.endsWith('.html')) {
            contentElement = document.createElement('div');
            contentElement.textContent = 'Loading...';
            fetch(item.details)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(html => contentElement.innerHTML = html)
                .catch(error => {
                    console.error('Failed to load file:', error);
                    contentElement.textContent = 'Error loading file';
                });
        } else {
            contentElement = document.createElement('p');
            contentElement.textContent = item.details;
        }

        contentElement.style.display = 'none';
        box.appendChild(contentElement);

        const titleElement = box.querySelector('h3');
        titleElement.addEventListener('click', () => {
            contentElement.style.display = contentElement.style.display === 'block' ? 'none' : 'block';
        });

        content.appendChild(box);
    });
}

async function highlightSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (input) {
        let foundMatch = false;

        for (const category in data) {
            for (const item of data[category]) {
                const titleText = item.title.toLowerCase();
                const detailsText = item.details.toLowerCase();
                let htmlContent = '';

                if (item.details.endsWith('.html')) {
                    try {
                        const response = await fetch(item.details);
                        if (response.ok) htmlContent = await response.text();
                    } catch (error) {
                        console.error('Failed to load file:', error);
                    }
                }

                const sanitizedDetailsText = sanitizeDetailsText(item.details);

                if (titleText.includes(input) || sanitizedDetailsText.includes(input) || htmlContent.toLowerCase().includes(input)) {
                    foundMatch = true;
                    const box = document.createElement('div');
                    box.classList.add('container-box');

                    box.innerHTML = `
                        <h3>${item.icon} ${item.title}</h3>
                        <hr>
                        <p>${sanitizedDetailsText}</p>
                    `;

                    const details = box.querySelector('p');
                    details.style.display = 'block';

                    const titleElement = box.querySelector('h3');
                    titleElement.addEventListener('click', () => {
                        const allDetails = document.querySelectorAll('.container-box p');
                        allDetails.forEach(detail => {
                            if (detail !== details) detail.style.display = 'none';
                        });
                        details.style.display = details.style.display === 'block' ? 'none' : 'block';
                    });

                    highlightText(box.querySelector('h3'), input);
                    highlightText(box.querySelector('p'), input);

                    if (htmlContent) {
                        const htmlElement = document.createElement('div');
                        htmlElement.innerHTML = htmlContent;
                        highlightText(htmlElement, input);
                        box.appendChild(htmlElement);
                    }

                    content.appendChild(box);
                }
            }
        }

        if (!foundMatch) content.innerHTML = '<p>No matching records found.</p>';
    } else {
        content.innerHTML = '';
    }
}

function sanitizeDetailsText(detailsText) {
    return detailsText.replace(/(https?:\/\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.svg|\.webp))/gi, '');
}

function highlightText(element, query) {
    const originalHTML = element.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;

    const icon = tempDiv.querySelector('i');
    const textContent = tempDiv.textContent;

    const regex = new RegExp(`(${query})`, 'gi');
    const highlightedText = textContent.replace(regex, '<span class="highlight">$1</span>');

    if (icon) {
        element.innerHTML = `<i class="${icon.className}"></i> ${highlightedText}`;
    } else {
        element.innerHTML = highlightedText;
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