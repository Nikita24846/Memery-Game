document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.querySelector('.board-container');
    const board = document.querySelector('.board');
    const movesElement = document.querySelector('.moves');
    const timerElement = document.querySelector('.timer');
    const startButton = document.querySelector('#start-button');
    const playAgainFromMessageButton = document.querySelector('#play-again-from-message');
    const exitFromMessageButton = document.querySelector('#exit-from-message');
    const messageBox = document.querySelector('.message-box');

    let cards;
    let flippedCards = [];
    let matchedCards = 0;
    let moves = 0;
    let timer;
    let time = 0;
    const timeLimit = 60; // 1 minute

    // Update symbols with emojis
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍', '🥥', '🍓'];
    
    function startGame() {
        resetGame();
        createBoard();
        startTimer();
        boardContainer.style.display = 'flex';
        messageBox.style.display = 'none';
        startButton.classList.add('hidden');
        playAgainFromMessageButton.classList.add('hidden');
        exitFromMessageButton.classList.add('hidden');
    }

    function resetGame() {
        clearInterval(timer);
        time = 0;
        moves = 0;
        matchedCards = 0;
        flippedCards = [];
        movesElement.textContent = '0 moves';
        timerElement.textContent = 'Time: 0 sec';
        startButton.classList.remove('hidden');
    }

    function startTimer() {
        timer = setInterval(() => {
            time++;
            timerElement.textContent = `Time: ${time} sec`;
            if (time >= timeLimit) {
                clearInterval(timer);
                loseGame();
            }
        }, 1000);
    }

    function createBoard() {
        const cardSymbols = shuffle([...symbols, ...symbols]);
        board.innerHTML = '';
        cardSymbols.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            `;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
        cards = document.querySelectorAll('.card');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        moves++;
        movesElement.textContent = `${moves} moves`;
        const [card1, card2] = flippedCards;
        if (card1.querySelector('.card-back').textContent === card2.querySelector('.card-back').textContent) {
            matchedCards += 2;
            flippedCards = [];
            if (matchedCards === cards.length) {
                winGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function winGame() {
        clearInterval(timer);
        displayMessage('You won!');
    }

    function loseGame() {
        displayMessage('You are a loser!');
    }

    function displayMessage(message) {
        messageBox.querySelector('.message').textContent = message;
        messageBox.style.display = 'block';
        boardContainer.style.display = 'none';
        playAgainFromMessageButton.classList.remove('hidden');
        exitFromMessageButton.classList.remove('hidden');
    }

    startButton.addEventListener('click', startGame);
    playAgainFromMessageButton.addEventListener('click', () => {
        location.reload(); // Reload the page to reset the game
    });

    exitFromMessageButton.addEventListener('click', () => {
        // Hide the game area and display a thank you message
        boardContainer.style.display = 'none';
        messageBox.style.display = 'block';
        messageBox.querySelector('.message').textContent = 'Thank you for playing!';
        playAgainFromMessageButton.classList.add('hidden');
        exitFromMessageButton.classList.add('hidden');
    });
});
