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

// Next question
const questionContainer = document.querySelector('.question-container');
const nextButton = document.getElementById('next-button');

let currentIndex = 0;

function displayNextQuestionAndAnswer() {
    if (currentIndex < jsonData.quizz.length) {
        const question = jsonData.quizz[currentIndex].question;
        const answer = jsonData.quizz[currentIndex].answer;

        console.log(`Question: ${question}`);
        console.log(`Answer: ${answer}`);

        document.getElementById("front").innerHTML = `<p>${question}</p>`;
        document.getElementById("back").innerHTML = `<p>${answer}</p>`;

        currentIndex++; // Move to the next question
    } else {
        currentIndex = 0;
    }
}

nextButton.addEventListener('click', displayNextQuestionAndAnswer);

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
