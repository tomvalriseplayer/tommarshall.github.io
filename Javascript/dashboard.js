const data = {
    manual: [
        {
            title: 'VOLUME IE | ORGANIZATION AND FUNCTIONS',
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
                }

                if (titleText.includes(input) || htmlContent.toLowerCase().includes(input)) {
                    foundMatch = true;

                    const box = document.createElement('div');
                    box.classList.add('container-box');

                    box.innerHTML = `
                        <h3>${item.icon} ${item.title}</h3>
                        <hr>
                    `;

                    const htmlElement = document.createElement('div');
                    htmlElement.innerHTML = htmlContent; // Render HTML

                    // Highlight matches within the rendered HTML content
                    highlightText(htmlElement, input);

                    box.appendChild(htmlElement);

                    const titleElement = box.querySelector('h3');
                    titleElement.addEventListener('click', () => {
                        htmlElement.style.display = htmlElement.style.display === 'block' ? 'none' : 'block';
                    });

                    // Highlight matches in the title
                    highlightText(box.querySelector('h3'), input);

                    content.appendChild(box);
                }
            }
        }

        if (!foundMatch) {
            content.innerHTML = '<p>No matching records found.</p>';
        }
    }
}

function highlightText(element, query) {
    // Ensure the query is not too short
    if (query.length < 2) return; // Prevent highlighting with single characters

    const regex = new RegExp(`(${query})`, 'gi'); // Case-insensitive regex
    const originalHTML = element.innerHTML;

    // Temporary div to work on the text content without affecting tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;

    // Find all text nodes in the element
    const textNodes = [];
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);

    while (walk.nextNode()) {
        textNodes.push(walk.currentNode);
    }

    // Highlight the text nodes without affecting the HTML tags
    textNodes.forEach(node => {
        const parentNode = node.parentNode;
        const highlightedText = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
        const span = document.createElement('span');
        span.innerHTML = highlightedText;

        // Replace the node with the highlighted span
        parentNode.replaceChild(span, node);
    });

    // Update the element with the newly highlighted text
    element.innerHTML = tempDiv.innerHTML;
}

// Function to clear the highlights
function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight');
    highlightedElements.forEach(element => {
        const originalText = element.textContent; // Get the original text content
        element.replaceWith(originalText); // Replace the highlight span with the original text
    });
}
