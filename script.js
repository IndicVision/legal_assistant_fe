let url = "http://127.0.0.1:5000";

const chatBox = document.getElementById('chat-box');
window.onload = function() {
    showPages('documentParser');
};
init()

// Helper Functions

function init() {
    checkAPIStatus();
    formatPage();
    showInstructions();

    const inputField = document.getElementById('user-input');
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        } else if (event.key === 'Enter' && event.shiftKey) {
            testAPI();
        }
    });

    const backButton = document.getElementById('backBtn');
    backButton.addEventListener('click', function() {
        document.getElementById('container').style.display = 'none';
        document.getElementById('collections').style.display = 'block';
        
        const sectionsDiv = document.querySelector('.sections');
        sectionsDiv.innerHTML = '';
        
        const contentDiv = document.querySelector('.content');
        contentDiv.innerHTML = '';
        backButton.style.display = 'none';
    });
}

function testCollection() {
    document.getElementById('collections').style.display = 'none';
    document.getElementById('container').style.display = 'flex';
    const sectionsDiv = document.querySelector('.sections');
    const contentDiv = document.querySelector('.content');

    let test_sections = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    for (let i in test_sections) {
        const sectionButton = document.createElement('button');
        sectionButton.textContent = `Section ${i}`
        sectionButton.classList.add('section-button');
        sectionButton.addEventListener('click', function() {
            testContent = "Lorem ipsum odor amet, consectetuer adipiscing elit. Turpis non conubia eget, a iaculis parturient efficitur arcu. Augue facilisis lorem fermentum congue gravida. Parturient praesent suscipit posuere praesent tempor lacinia nibh. Lacinia tincidunt tortor himenaeos duis; blandit dolor laoreet. Pharetra justo fames pulvinar velit dictum. Rhoncus venenatis diam diam platea mattis venenatis. Metus dictum in platea est neque integer himenaeos ultrices. Ornare platea dis nulla, ornare pretium rhoncus. Vehicula etiam morbi mi litora aptent sodales suspendisse dui mi. Dui praesent per purus eget, placerat dapibus. Magna ullamcorper blandit lacinia molestie in erat ut maximus. Nec porttitor orci accumsan metus taciti. Eros senectus eros; ante sociosqu nisl mollis curabitur malesuada. Torquent taciti condimentum orci vivamus mattis adipiscing. Per dui platea sodales sapien nibh ipsum ante tempor suscipit. Curae suspendisse natoque dolor orci aliquet laoreet dolor dictum"
            contentDiv.innerHTML = `<h2>Test section ${i}</h2><p>${testContent}</p>`
        })
        sectionsDiv.appendChild(sectionButton);
    }
}

function loadSections(data, dictionary) {
    const sectionsDiv = document.querySelector('.sections');
    const contentDiv = document.querySelector('.content');
    const backButton = document.getElementById('backBtn')
    backButton.style.display = "block";
    contentDiv.innerHTML = `<h1>Select section to continue</h1>`
    for (let sectionId in data) {
        if (data.hasOwnProperty(sectionId)) {
            const section = data[sectionId];
            
            // Create a button or link for each section
            const sectionButton = document.createElement('button');
            sectionButton.textContent =  `${sectionId}. ${section.title}`;
            sectionButton.classList.add('section-button');
            // Add an event listener to display content on click
            sectionButton.addEventListener('click', function() {
                const markdownContent = marked.parse(section.html)
                // Display the content in the content div
                contentDiv.innerHTML = `<h2>${section.title}</h2><p>${markdownContent}</p>`;
                addTooltipListeners(contentDiv, data, dictionary);
            });
            
            // Append the button to the sections div
            sectionsDiv.appendChild(sectionButton);
        }
    }
}

function addTooltipListeners(contentDiv, data, dictionary) {
    const tooltips = contentDiv.querySelectorAll('.tooltip');

    tooltips.forEach(tooltip => {
        const value = tooltip.getAttribute('data-value');

        tooltip.addEventListener('mouseenter', function() {
            const tooltipContent = data[value] ? data[value].content : "No content available";
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip-content';
            tooltipElement.innerHTML = tooltipContent;
            document.body.appendChild(tooltipElement);
            
            const rect = tooltip.getBoundingClientRect();
            tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
            tooltipElement.style.left = `${rect.left + window.scrollX}px`;
        });

        tooltip.addEventListener('mouseleave', function() {
            const tooltipElement = document.querySelector('.tooltip-content');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    });
    const definedWords = contentDiv.querySelectorAll('.tooltip-word');
    definedWords.forEach(word => {
        const value = word.getAttribute('data-value')
        
        word.addEventListener('mouseenter', function() {
            const tooltipContent = dictionary[value] ? dictionary[value] : "No definition available";
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip-content';
            tooltipElement.innerHTML = tooltipContent;
            document.body.appendChild(tooltipElement);

            const rect = word.getBoundingClientRect();
            tooltipElement.style.top = `${rect.bottom + window.scrollY}px`;
            tooltipElement.style.left = `${rect.left + window.scrollX}px`;
        })

        word.addEventListener('mouseleave', function() {
            const tooltipElement = document.querySelector('.tooltip-content');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    })
}

function showPages(section) {
    document.getElementById('collections').style.display = 'none';
    document.getElementById('container').style.display = 'none';
    document.getElementById('chatbot').style.display = 'none';

    if (section === 'chatbot') {
        document.getElementById('chatbot').style.display = 'block';
        document.getElementById('chatbot-option').classList.add('selected');
        document.getElementById('doc-parser-option').classList.remove('selected');
        document.getElementById('backBtn').style.display = 'none'
        showInstructions();
    } else if (section === 'documentParser') {
        document.getElementById('collections').style.display = 'block';
        document.getElementById('doc-parser-option').classList.add('selected');
        document.getElementById('chatbot-option').classList.remove('selected');
    }
}

function showInstructions() {
    if (chatBox.childNodes.length === 0) {
        instructionMsgDiv = document.createElement('div');
        instructionMsgDiv.classList.add('instruct_msg');
        instructionMsgDiv.innerHTML = `
            <h2 style="text-align: center;">Instructions</h2>
            <p style="text-indent: 7%"> The IndicVision legal assistant chatbot is custom built finetuned LLM model trained to retrieve and comprehend the contents of the following government acts:</p>
            <li><b>The Actuaries Act of 2006</b>
            <li><b>The Aligarh Muslim University Act of 1920</b>
            <li><b>The Anand Marriage Act of 1909</b>
            <li><b>The Companies Act of 2013</b>
            <li><b>The Competition Act of 2002</b>
            <li><b>The Limited Liability Partnership Act of 2008</b>
            <li><b>The Provisional Collection of Taxes Act of 2023</b>
            <li><b>The Trademark Act of 1999</b>
            <p style="text-indent: 7%">These legal acts were not chosen in any predetermined order but rather randomly (except the <i>Trademark Act of 1999</i> which was specifically requested).
            The chosen documents represent a range of government acts spanning over various time frames to demonstrate it's scalability. The model isn't trained on any other legal act but can be scalable to include any legal act required.</p>
        `;
        instructionMsgDiv.innerHTML = `Sorry for the inconvenience but the chatbot is under repair, it will be up and running very soon : )`
        chatBox.appendChild(instructionMsgDiv);
    }
}

// API Calls

async function checkAPIStatus(){
    let collectionsDiv = document.querySelector('.collections')
    const statusMessageDiv = document.createElement('div')
    statusMessageDiv.classList.add('statusMessage')
    statusMessageDiv.textContent = "Connecting to API..."
    collectionsDiv.appendChild(statusMessageDiv)
    try {
        const response = await fetch(url+"/init");
        if (response.ok) {
            statusMessageDiv.textContent = "Connected to API"
            setTimeout(() => {
                statusMessageDiv.remove();
            }, 2000);
        }
    } catch (error) {
        setTimeout(() => {
            statusMessageDiv.remove();
            console.log("Trying again")
            init()
        }, 15000);
    }
}

async function formatPage() {
    await fetch(url+"/collections", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        let collections = data["collections"];
        let collectionsDiv = document.querySelector('.collections');
        for (let i in collections) {
            let collection = collections[i];
            
            let button = document.createElement('button');
            button.innerText = collection["name"];
            button.path = collection["path"];
            button.classList.add("collection-button");
            button.onclick = function() {
                getCollection(button.path);
            };
            collectionsDiv.appendChild(button);
        }
    })
    .catch(error => {
        console.error("Error fetching collections:", error)
    })
}

async function getCollection(path) {
    console.log(path)
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
    await fetch(url+"/format", {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'  // Add this line to set content type
        },
        body: JSON.stringify({
            "path": path,
        })
    })
    .then(response => response.json())
    .then(data => {
        loadingOverlay.style.display = 'none';
        if (data) {
            document.getElementById('collections').style.display = 'none';
            document.getElementById('container').style.display = 'flex';
            console.log(data)
            loadSections(data['sections'], data['dictionary']);
        }
    })
}


async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (instructionMsgDiv) {
        chatBox.removeChild(instructionMsgDiv); // Remove the instruction div
        instructionMsgDiv = null; // Clear the reference
    }
    if (userInput.trim() !== "") {
        console.log(chatBox.children)
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('msg','message');
        userMessageDiv.textContent = userInput;
        chatBox.appendChild(userMessageDiv);
        document.getElementById('user-input').value = '';
        const chatMessages = Array.from(chatBox.children).map(child => ({
            class: Array.from(child.classList).join(' '), // Join class names into a single string
            innerText: child.innerText // Get the inner text
        }));
        console.log(chatMessages)
        fetch(url+'/chat', {
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                query: userInput,
                messages: chatMessages
            })
        })
        .then(response => response.json())
        .then(data =>{
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('msg','bot_message');
            botMessageDiv.innerHTML = marked.parse(data.response);
            chatBox.appendChild(botMessageDiv)
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error("Error: ", error);
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.classList.add('msg', 'error_message');
            errorMessageDiv.textContent = "Error: please refresh and try again";
            chatBox.appendChild(errorMessageDiv);
        })
    }
}
