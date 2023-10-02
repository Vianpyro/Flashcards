const flipper = document.querySelector('.flipper');

flipper.addEventListener('click', () => {
    if (flipper.style.transform === 'rotateX(180deg)') {
        flipper.style.transform = 'rotateX(0deg)';
        flipper.querySelector('.front').style.display = 'block';
        flipper.querySelector('.back').style.display = 'none';
    } else {
        flipper.style.transform = 'rotateX(180deg)';
        flipper.querySelector('.front').style.display = 'none';
        flipper.querySelector('.back').style.display = 'block';
    }
});

// Questions scroller
var nombreDePoints = 5;
var questionsScroller = document.querySelector('.questions-scroller');
var pointsString = '•'.repeat(nombreDePoints);
questionsScroller.textContent = pointsString;
