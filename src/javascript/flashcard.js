document.addEventListener("DOMContentLoaded", () => {
    // Get references to various HTML elements
    const appTitle = document.getElementById("app-title");
    const flipper = document.querySelector("#flipper");
    const nextButton = document.getElementById("next-button");
    const randomButton = document.getElementById("shuffle-button");
    const previousButton = document.getElementById("previous-button");
    const fileInput = document.getElementById("file-input");
    const fileEdit = document.getElementById("edit-input");
    const addImage = document.getElementById("add-image");
    const addFlashcard = document.getElementById("add-flashcard");
    const flipFlashcard = document.getElementById("flip-flashcard");
    const deleteFlashcard = document.getElementById("delete-flashcard");
    const imageInput = document.getElementById('image-input');
    const downloadButton = document.getElementById("download-button");
    const flashcardContainer = document.getElementById("flashcard-container");
    const frontDisplay = document.getElementById("front");
    const backDisplay = document.getElementById("back");
    const titleDisplay = document.getElementById("quizz-title");
    const questionsScroller = document.getElementById("questions-scroller");
    const front = flipper.querySelector("#front");
    const back = flipper.querySelector("#back");

    // Initialize variables
    let currentIndex = 0;
    let jsonData = { "quizz": [] };
    let startX = 0;
    let endX = 0;

    // Update the question and answer displays
    const updateDisplay = ({ question, image, answer }) => {
        frontDisplay.innerHTML = `<p>${question}</p>`;
        if (image) displayBase64Image(image, frontDisplay);
        backDisplay.innerHTML = `<p>${answer}</p>`;
    };

    // Display a specific question and answer
    function displayQuestionAndAnswer(index) {
        toggleFlipper("front");
        updateDisplay(jsonData.quizz[index]);
        renderDots(index);
    }

    // Render navigation dots for questions
    const renderDots = (centerDotIndex) => {
        questionsScroller.innerHTML = "";
        jsonData.quizz.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.innerHTML = "•";
            dot.id = i === centerDotIndex ? "qs-active" : "";
            dot.addEventListener("click", () => displayQuestionAndAnswer(i));
            questionsScroller.appendChild(dot);
        });
        questionsScroller.style.display = jsonData.quizz.length > 1 ? "flex" : "none";
    };

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
        if (jsonData.quizz.length < 2) return;
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
                currentIndex = 0;
                displayQuestionAndAnswer(currentIndex);
                toggleButtonsState();
            };

            reader.readAsText(selectedFile);
            fileInput.value = "";
        }
    });

    fileEdit.addEventListener("change", () => {
        if (fileEdit.checked) {
            // Enable editing
            toggleEditMode(true);
        } else {
            // Disable editing and save the changes
            toggleEditMode(false);
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
        // Create the quizz object if it doesn't exist
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
                console.log(jsonData.quizz[currentIndex]);
                updateDisplay(jsonData.quizz[currentIndex]);
            });
        }
    });

    // Handle the "Add Flashcard" button click event
    addFlashcard.addEventListener("click", () => {
        const newFlashcard = {
            question: "New question",
            answer: "New answer"
        };

        // Add the new flashcard to the jsonData.quizz array
        jsonData.quizz.push(newFlashcard);

        saveFlashcardChanges();

        // Set the current index to the new flashcard and display it
        currentIndex = jsonData.quizz.length - 1;
        displayQuestionAndAnswer(currentIndex);
        updateDisplay(newFlashcard);

        toggleButtonsState();
    });

    flipFlashcard.addEventListener("click", () => {
        toggleFlipper();
    });

    // Handle the "Delete Flashcard" button click event
    deleteFlashcard.addEventListener("click", () => {
        if (jsonData.quizz.length === 0) return;

        // Show a confirmation dialog
        const confirmDelete = confirm("Are you sure you want to delete this flashcard?");

        if (confirmDelete) {
            // Remove the current flashcard from the array
            jsonData.quizz.splice(currentIndex, 1);
            const numberOfQuestions = jsonData.quizz.length;

            // Adjust the currentIndex to a valid index
            if (currentIndex >= numberOfQuestions) {
                currentIndex = numberOfQuestions - 1;
            }

            // If there are no flashcards left, clear the display
            if (numberOfQuestions === 0) {
                addFlashcard.click();
            } else {
                // Display the next available flashcard
                displayQuestionAndAnswer(currentIndex);
            }

            // Update the navigation dots
            renderDots(currentIndex);
        }
    });

    // Editing mode
    function toggleEditMode(isEditing) {
        frontDisplay.contentEditable = isEditing;
        backDisplay.contentEditable = isEditing;
        titleDisplay.contentEditable = isEditing;

        [addImage, addFlashcard, flipFlashcard, deleteFlashcard].forEach(element => {
            element.style.display = isEditing ? "block" : "none";
        });

        if (!isEditing) saveFlashcardChanges();
    }

    function toggleButtonsState() {
        const disableButtons = jsonData.quizz.length <= 1;
        [nextButton, randomButton, previousButton].forEach(button => {
            button.disabled = disableButtons;
        });
    }

    flashcardContainer.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
        endX = startX;  // Initialize endX to startX
    }, { passive: true });

    flashcardContainer.addEventListener("touchmove", (event) => {
        endX = event.touches[0].clientX;
    }, { passive: true });

    flashcardContainer.addEventListener("touchend", () => {
        const diffX = startX - endX;

        if (Math.abs(diffX) > 100) {
            if (diffX > 0) {
                nextButton.click();
            } else {
                previousButton.click();
            }
        }
    });

    // Retrieve the latest version of the application on Github
    fetch("https://api.github.com/repos/Vianpyro/flashcards/actions/runs")
        .then(response => response.json())
        .then(data => {
            const successfulRun = data.workflow_runs.find(run => run.status === "completed" && run.conclusion === "success");
            if (successfulRun) {
                const latestVersion = successfulRun.display_title;
                appTitle.title = latestVersion;
            }
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
