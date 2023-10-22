document.addEventListener('DOMContentLoaded', () => {
    const flipper = document.querySelector('.flipper');
    const nextButton = document.getElementById('next-button');
    const randomButton = document.getElementById('shuffle-button');
    const previousButton = document.getElementById('previous-button');
    const fileInput = document.getElementById('file-input');
    const frontDisplay = document.getElementById("front");
    const backDisplay = document.getElementById("back");
    const titleDisplay = document.getElementById("title");
    const questionsScroller = document.querySelector('.questions-scroller');
    const front = flipper.querySelector('.front');
    const back = flipper.querySelector('.back');

    let currentIndex;
    let jsonData;
    let numberOfQuestions;

    function updateDisplay(question, answer) {
        frontDisplay.innerHTML = `<p>${question}</p>`;
        backDisplay.innerHTML = `<p>${answer}</p>`;

    }
    
    function displayQuestionAndAnswer(index) {
        toggleFlipper('front');
        const question = jsonData.quizz[index].question;
        const answer = jsonData.quizz[index].answer;
        updateDisplay(question, answer);
        renderDots(index);
    }

    function renderDots(center_dot_index) {
        const dots = [];

        for (let i = 0; i < numberOfQuestions; i++) {
            const dot = document.createElement('span');
            dot.innerHTML = '•';

            if (i === center_dot_index) {
                dot.className = 'qs-active';
            } else {
                dot.addEventListener('click', function () {
                    displayQuestionAndAnswer(i);
                });
            }

            dots.push(dot);
        }

        questionsScroller.innerHTML = '';
        dots.forEach(dot => questionsScroller.appendChild(dot));
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % jsonData.quizz.length;
        displayQuestionAndAnswer(currentIndex);
    });

    previousButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + jsonData.quizz.length) % jsonData.quizz.length;
        displayQuestionAndAnswer(currentIndex);
    });

    randomButton.addEventListener('click', () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * jsonData.quizz.length);
        } while (randomIndex === currentIndex);
        currentIndex = randomIndex;
        displayQuestionAndAnswer(currentIndex);
    });

    fileInput.addEventListener('change', (event) => {
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
            fileInput.value = '';
        }
    });

    function toggleFlipper(side) {
        if (flipper.style.transform === 'rotateX(180deg)' || side === 'front') {
            flipper.style.transform = 'rotateX(0deg)';
            front.style.display = 'flex';
            back.style.display = 'none';
        } else {
            flipper.style.transform = 'rotateX(180deg)';
            front.style.display = 'none';
            back.style.display = 'flex';
        }
    }

    flipper.addEventListener('click', () => {
        toggleFlipper(); // Toggle between front and back when clicking.
    });
});
