const flipper = document.querySelector('.flipper');

flipper.addEventListener('click', () => {
    if (flipper.style.transform === 'rotateX(180deg)') {
        flipper.style.transform = 'rotateX(0deg)';
        flipper.querySelector('.front').style.display = 'flex';
        flipper.querySelector('.back').style.display = 'none';
    } else {
        flipper.style.transform = 'rotateX(180deg)';
        flipper.querySelector('.front').style.display = 'none';
        flipper.querySelector('.back').style.display = 'flex';
    }
});

// Question selection
const questionContainer = document.querySelector('.question-container');
const nextButton = document.getElementById('next-button');
const randomButton = document.getElementById('shuffle-button');
const previousButton = document.getElementById('previous-button');

let currentIndex = 0;

function displayNextQuestionAndAnswer() {
    if (currentIndex < jsonData.quizz.length) {
        const question = jsonData.quizz[currentIndex].question;
        const answer = jsonData.quizz[currentIndex].answer;

        document.getElementById("front").innerHTML = `<p>${question}</p>`;
        document.getElementById("back").innerHTML = `<p>${answer}</p>`;

        currentIndex++; // Move to the next question
    } else {
        currentIndex = 0;
    }
}

function displayRandomQuestionAndAnswer() {
    let randomIndex;;
    if (jsonData.quizz.length > 1) {
        do {
            randomIndex = Math.floor(Math.random() * jsonData.quizz.length);
        }
        while (randomIndex === currentIndex);
    }

    const question = jsonData.quizz[randomIndex].question;
    const answer = jsonData.quizz[randomIndex].answer;
    
    document.getElementById("front").innerHTML = `<p>${question}</p>`;
    document.getElementById("back").innerHTML = `<p>${answer}</p>`;
}

function displayPreviousQuestionAndAnswer() {
    if (currentIndex > 0) {
        const question = jsonData.quizz[currentIndex].question;
        const answer = jsonData.quizz[currentIndex].answer;

        document.getElementById("front").innerHTML = `<p>${question}</p>`;
        document.getElementById("back").innerHTML = `<p>${answer}</p>`;

        currentIndex--; // Move to the previous question
    } else {
        currentIndex = jsonData.quizz.length--;
    }
}

nextButton.addEventListener('click', displayNextQuestionAndAnswer);
randomButton.addEventListener('click', displayRandomQuestionAndAnswer);
previousButton.addEventListener('click', displayPreviousQuestionAndAnswer);

// Import
var jsonData;
const fileInput = document.getElementById('file-input');
const importButton = document.getElementById('import-button');

fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const fileContent = e.target.result;
            jsonData = JSON.parse(fileContent);
            
            document.getElementById("title").textContent = jsonData.title;
            
            // Questions scroller
            var nombreDePoints = jsonData.quizz.length;
            var questionsScroller = document.querySelector('.questions-scroller');
            var pointsString = '•'.repeat(nombreDePoints);
            questionsScroller.textContent = pointsString;
            displayNextQuestionAndAnswer();
        };
        
        reader.readAsText(selectedFile);
        fileInput.value = '';
    }
});
