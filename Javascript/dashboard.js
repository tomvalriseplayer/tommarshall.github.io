const data = {
    manual: [
        {
            title: 'VOLUME I | ORGANIZATION AND FUNCTIONS',
            details: 'Media/Structure.png',
            icon: '<i class="fa-solid fa-sitemap"></i>', // Officer icon
            cssPath: '' // No CSS needed for images
        },
        {
            title: 'VOLUME II | POLICY',
            details: 'Text/volumeii.html', // Load text from this file
            icon: '<i class="fa-solid fa-paste"></i>', // Officer icon
            cssPath: 'Style/volumeii.css'
        },
        {
            title: 'VOLUME III | LINE PROCEDURES',
            details: 'Text/volumeiii.html', // Load text from this file
            icon: '<i class="fa-solid fa-book-journal-whills"></i>', // Officer icon
            cssPath: 'Style/volumeiii.css'
        },
        {
            title: 'VOLUME IV | PROFESSIONAL STANDARDS',
            details: 'Text/volumeiv.html', // Load text from this file
            icon: '<i class="fa-solid fa-user-shield"></i>', // Officer icon
            cssPath: 'Style/volumeiv.css'
        }
    ],
    impound: [
        {
            title: 'WHEN TO IMPOUND A VEHICLE?',
            details: 'Text/impoundi.html',
            icon: '<i class="fa-solid fa-gavel"></i>', // Crime icon
            cssPath: 'Style/impound.css'
        },
        {
            title: 'LIST OF VIOLATIONS',
            details: 'Text/impoundii.html',
            icon: '<i class="fa-solid fa-gavel"></i>', // Crime icon
            cssPath: 'Style/impound.css'
        },
        {
            title: 'WHEN TO IMPOUND A VEHICLE?',
            details: 'Text/impoundiii.html',
            icon: '<i class="fa-solid fa-gavel"></i>', // Crime icon
            cssPath: 'Style/impound.css'
        }
    ],
    traffic: [
        {
            title: 'Speeding',
            details: 'Fines: $200 | Points: 2',
            icon: '<i class="fa-solid fa-car-crash"></i>', // Traffic icon
            cssPath: '' // No CSS needed for text
        },
        {
            title: 'Reckless Driving',
            details: 'Fines: $500 | Points: 4',
            icon: '<i class="fa-solid fa-car-crash"></i>', // Traffic icon
            cssPath: '' // No CSS needed for text
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
            contentElement = document.createElement('iframe');
            contentElement.src = item.details;
            contentElement.classList.add('container-iframe');
            contentElement.style.width = '100%';
            contentElement.style.border = 'none';
            contentElement.onload = () => {
                const iframeDoc = contentElement.contentDocument || contentElement.contentWindow.document;
                if (item.cssPath) {
                    const link = iframeDoc.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = item.cssPath;
                    iframeDoc.head.appendChild(link);
                }
                // Center the content inside the iframe
                iframeDoc.body.style.display = 'flex';
                iframeDoc.body.style.justifyContent = 'center';
                iframeDoc.body.style.alignItems = 'center';
                iframeDoc.body.style.textAlign = 'center';
                iframeDoc.body.style.margin = '0';
                iframeDoc.body.style.padding = '20px';
                iframeDoc.body.style.boxSizing = 'border-box';
                // Adjust iframe height to fit content
                contentElement.style.height = iframeDoc.body.scrollHeight + 'px';
            };
        } else {
            contentElement = document.createElement('p');
            contentElement.textContent = item.details;
        }

        contentElement.style.display = 'none';
        box.appendChild(contentElement);

        const titleElement = box.querySelector('h3');
        titleElement.addEventListener('click', () => {
            contentElement.style.display = contentElement.style.display === 'block' ? 'none' : 'block';
            if (contentElement.tagName === 'IFRAME') {
                const iframeDoc = contentElement.contentDocument || contentElement.contentWindow.document;
                contentElement.style.height = iframeDoc.body.scrollHeight + 'px';
            }
        });

        content.appendChild(box);
    });
}

async function highlightSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous results

    if (input) {
        let foundMatch = false;
        const addedContainers = new Set(); // Track added containers

        for (const category in data) {
            for (const item of data[category]) {
                const titleText = item.title.toLowerCase();
                let htmlContent = '';

                if (item.details.endsWith('.html')) {
                    try {
                        const response = await fetch(item.details);
                        if (response.ok) htmlContent = await response.text();
                    } catch (error) {
                        console.error('Failed to load file:', error);
                    }
                } else {
                    htmlContent = item.details; // For non-HTML content
                }

                const contentText = htmlContent.toLowerCase();
                if ((titleText.includes(input) || contentText.includes(input)) && !addedContainers.has(item.title)) {
                    foundMatch = true;
                    addedContainers.add(item.title); // Mark container as added

                    const box = document.createElement('div');
                    box.classList.add('container-box');

                    box.innerHTML = `
                        <h3>${item.icon} ${item.title}</h3>
                        <hr>
                    `;

                    let contentElement;
                    if (item.details.endsWith('.html')) {
                        contentElement = document.createElement('iframe');
                        contentElement.src = item.details;
                        contentElement.classList.add('container-iframe');
                        contentElement.style.width = '100%';
                        contentElement.style.border = 'none';
                        contentElement.onload = () => {
                            const iframeDoc = contentElement.contentDocument || contentElement.contentWindow.document;
                            if (item.cssPath) {
                                const link = iframeDoc.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = item.cssPath;
                                iframeDoc.head.appendChild(link);
                            }
                            // Center the content inside the iframe
                            iframeDoc.body.style.display = 'flex';
                            iframeDoc.body.style.justifyContent = 'center';
                            iframeDoc.body.style.alignItems = 'center';
                            iframeDoc.body.style.textAlign = 'center';
                            iframeDoc.body.style.margin = '0';
                            iframeDoc.body.style.padding = '20px';
                            iframeDoc.body.style.boxSizing = 'border-box';
                            // Adjust iframe height to fit content
                            contentElement.style.height = iframeDoc.body.scrollHeight + 'px';
                            highlightText(iframeDoc.body, input); // Highlight text inside iframe
                        };
                    } else if (item.details.endsWith('.png') || item.details.endsWith('.jpg')) {
                        contentElement = document.createElement('img');
                        contentElement.src = item.details;
                        contentElement.alt = item.title;
                        contentElement.classList.add('container-image');
                    } else {
                        contentElement = document.createElement('p');
                        contentElement.textContent = item.details;
                        highlightText(contentElement, input);
                    }

                    contentElement.style.display = 'block'; // Auto-show matching content
                    box.appendChild(contentElement);

                    // Highlight title if it matches
                    if (titleText.includes(input)) {
                        highlightText(box.querySelector('h3'), input);
                    }

                    content.appendChild(box);
                }
            }
        }

        if (!foundMatch) {
            content.innerHTML = '<p>No matching records found.</p>';
        }
    } else {
        // If input is cleared, reset the content to initial state
        content.innerHTML = ''; // Clear content
        // Optionally, you can add code here to show the main menu buttons if needed
    }
}

function highlightText(element, query) {
    if (query.length < 2) return;

    // Function to highlight text in a node
    function highlightTextInNode(node) {
        const regex = new RegExp(`(${query})`, 'gi');
        if (node.nodeType === 3) { // Text node
            const text = node.nodeValue;
            if (regex.test(text)) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === 1 && // Element node
                  !['SCRIPT', 'STYLE', 'IFRAME'].includes(node.nodeName)) {
            Array.from(node.childNodes).forEach(child => highlightTextInNode(child));
        }
    }

    // Start the recursive highlighting
    highlightTextInNode(element);
}

// Function to clear the highlights
function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight');
    highlightedElements.forEach(element => {
        const originalText = element.textContent; // Get the original text content
        element.replaceWith(originalText); // Replace the highlight span with the original text
    });
}
