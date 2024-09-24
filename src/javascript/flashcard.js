document.addEventListener("DOMContentLoaded", () => {
    // Get references to various HTML elements
    const flipper = document.querySelector("#flipper");
    const nextButton = document.getElementById("next-button");
    const randomButton = document.getElementById("shuffle-button");
    const previousButton = document.getElementById("previous-button");
    const fileInput = document.getElementById("file-input");
    const fileEdit = document.getElementById("edit-input");
    const addImage = document.getElementById("add-image");
    const addFlashcard = document.getElementById("add-flashcard");
    const imageInput = document.getElementById('image-input');
    const downloadButton = document.getElementById("download-button");
    const frontDisplay = document.getElementById("front");
    const backDisplay = document.getElementById("back");
    const titleDisplay = document.getElementById("quizz-title");
    const questionsScroller = document.getElementById("questions-scroller");
    const front = flipper.querySelector("#front");
    const back = flipper.querySelector("#back");

    // Disable the buttons until a file is loaded
    nextButton.disabled = true;
    randomButton.disabled = true;
    previousButton.disabled = true;

    // Initialize variables
    let currentIndex = 0;
    let jsonData = {};
    let numberOfQuestions = 0;

    // Update the question and answer displays
    function updateDisplay(question, image, answer) {
        // If the question has an image, display it
        frontDisplay.innerHTML = `<p>${question}</p>`;
        if (image) displayBase64Image(image, frontDisplay);
        backDisplay.innerHTML = `<p>${answer}</p>`;
    }

    // Display a specific question and answer
    function displayQuestionAndAnswer(index) {
        toggleFlipper("front");
        const question = jsonData.quizz[index].question;
        const image = jsonData.quizz[index].image;
        const answer = jsonData.quizz[index].answer;
        updateDisplay(question, image, answer);
        renderDots(index);
    }

    // Render navigation dots for questions
    function renderDots(center_dot_index) {
        const dots = [];
        numberOfQuestions = jsonData.quizz.length;

        for (let i = 0; i < numberOfQuestions; i++) {
            const dot = document.createElement("span");
            dot.innerHTML = "•";

            if (i === center_dot_index) {
                dot.id = "qs-active";
            } else {
                // Add a click event listener to change the displayed question
                dot.addEventListener("click", function () {
                    displayQuestionAndAnswer(i);
                });
            }

            dots.push(dot);
        }

        questionsScroller.innerHTML = "";
        dots.forEach((dot) => questionsScroller.appendChild(dot));
        questionsScroller.style.display = "flex";
    }

    // Handle the "Next" button click event
    nextButton.addEventListener("click", () => {
        if (fileEdit.checked) saveFlashcardChanges();
        currentIndex = (currentIndex + 1) % jsonData.quizz.length;
        displayQuestionAndAnswer(currentIndex);
    });

    // Handle the "Previous" button click event
    previousButton.addEventListener("click", () => {
        if (fileEdit.checked) saveFlashcardChanges();
        currentIndex = (currentIndex - 1 + jsonData.quizz.length) % jsonData.quizz.length;
        displayQuestionAndAnswer(currentIndex);
    });

    // Handle the "Random" button click event
    randomButton.addEventListener("click", () => {
        if (fileEdit.checked) saveFlashcardChanges();
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * jsonData.quizz.length);
        } while (randomIndex === currentIndex);
        currentIndex = randomIndex;
        displayQuestionAndAnswer(currentIndex);
    });

    // Handle file input change event to load a JSON file
    fileInput.addEventListener("change", (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const fileContent = e.target.result;
                jsonData = JSON.parse(fileContent);
                titleDisplay.textContent = jsonData.title;
                numberOfQuestions = jsonData.quizz.length;
                currentIndex = 0;
                displayQuestionAndAnswer(currentIndex);
            };

            reader.readAsText(selectedFile);
            fileInput.value = "";

            // Enable the buttons
            nextButton.disabled = false;
            randomButton.disabled = false;
            previousButton.disabled = false;
        }
    });

    fileEdit.addEventListener("change", () => {
        if (fileEdit.checked) {
            // Enable editing
            frontDisplay.contentEditable = true;
            backDisplay.contentEditable = true;
            titleDisplay.contentEditable = true;

            // Show the add image button
            addImage.style.display = "block";
            addFlashcard.style.display = "block";
        } else {
            // Hide the add image button
            addImage.style.display = "none";
            addFlashcard.style.display = "none";

            // Disable editing and save the changes
            frontDisplay.contentEditable = false;
            backDisplay.contentEditable = false;
            titleDisplay.contentEditable = false;

            // Save the changes
            saveFlashcardChanges();
        }
    });

    // Toggle the flipper between front and back when clicked
    function toggleFlipper(side) {
        if (flipper.style.transform === "rotateX(180deg)" || side === "front") {
            flipper.style.transform = "rotateX(0deg)";
            front.style.display = "flex";
            back.style.display = "none";
        } else {
            flipper.style.transform = "rotateX(180deg)";
            front.style.display = "none";
            back.style.display = "flex";
        }
    }

    function saveFlashcardChanges() {
        // Create the quizz objects if it doesn't exist
        if (!jsonData.quizz) jsonData.quizz = [];
        if (!jsonData.quizz[currentIndex]) jsonData.quizz[currentIndex] = {};

        // Save the changes
        jsonData.title = cleanText(titleDisplay.innerText);
        jsonData.quizz[currentIndex].question = cleanText(frontDisplay.innerText);
        jsonData.quizz[currentIndex].answer = cleanText(backDisplay.innerText);
    }

    saveFlashcardChanges();

    // Add a click event listener to the flipper to toggle between front and back
    flipper.addEventListener("click", () => {
        if (!fileEdit.checked) toggleFlipper();
    });

    downloadButton.addEventListener('click', function () {
        if (fileEdit.checked) fileEdit.click();
        downloadJSON(jsonData, "quizz");
    });

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            convertImageToBase64(file, (base64String) => {
                // Save the image to the current flashcard
                jsonData.quizz[currentIndex].image = base64String;

                // Immediately update the display with the new image
                const currentQuestion = jsonData.quizz[currentIndex].question;
                const currentAnswer = jsonData.quizz[currentIndex].answer;
                updateDisplay(currentQuestion, base64String, currentAnswer);
            });
        }
    });


    // Handle the "Add Flashcard" button click event
    addFlashcard.addEventListener("click", () => {
        const newFlashcard = {
            question: "New question",
            answer: "New answer",
            image: null
        };

        // Add the new flashcard to the jsonData.quizz array
        jsonData.quizz.push(newFlashcard);
        numberOfQuestions = jsonData.quizz.length;

        // Set the current index to the new flashcard and display it
        currentIndex = numberOfQuestions - 1;
        displayQuestionAndAnswer(currentIndex);
        updateDisplay(newFlashcard.question, newFlashcard.image, newFlashcard.answer);

        // Enable the navigation buttons if they were disabled
        nextButton.disabled = false;
        randomButton.disabled = false;
        previousButton.disabled = false;
    });
});

// Display a Base64 image
function displayBase64Image(base64String, targetElement) {
    const img = document.createElement("img");
    img.src = base64String;
    targetElement.appendChild(img);
}

function convertImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.error("Error: ", error);
    };
}

function downloadJSON(jsonData, fileName) {
    // Convert JSON object to a string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary anchor element
    const tempLink = document.createElement("a");
    tempLink.href = URL.createObjectURL(blob);
    tempLink.download = `${fileName}.json`;

    // Simulate a click on the anchor element
    tempLink.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(tempLink.href);
}

function cleanText(text) {
    return text.replace(/\n/g, '').trim();
}
