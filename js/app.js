(function () {
  /*
   * Create a list that holds all of your cards
   */

  const cards = [
    'paper-plane','paper-plane',
    'anchor','anchor','bolt','bolt',
    'diamond','diamond','leaf','leaf',
    'cube','cube','bicycle','bicycle',
    'bomb','bomb'
  ];

  let alreadyOpenCard = [];
  let deckLock;
  let moves = 0;
  let matched = 0;
  let timeStart;

  initialize();

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }
      return array;
  }

  function resetDeck(initialReset) {
    resetMoves();
    resetStars();
    shuffle(cards);
    restartTimer();
    // Reset classes on all cards and assign new ones reflecting
    // shuffled deck
    const cardLiAll = document.querySelectorAll('.deck li');
    let cardCount = 0;
    for (let cardLi of cardLiAll){
      cardLi.className = '';
      cardLi.classList.add('card');
      const cardI = cardLi.firstElementChild;
      cardI.className = '';
      cardI.classList.add('fa',`fa-${cards[cardCount]}`);

      // Only add EventListeners on initial reset
      if (initialReset){
        cardLi.addEventListener('click', clickCard, false);
      }
      cardCount++;
    }
  }

  function initialize() {
    resetDeck(true);
    unlock();
    // Initialize button eventlisteners
    const restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click', function () {
      // Subsequent resets using button will not add event listeners
      resetDeck(false);
    },false);
    const playAgainButton = document.querySelector('.btn-play');
    playAgainButton.addEventListener('click', function () {
      // Subsequent resets using button will not add event listeners
      const modal = document.querySelector('.modal');
      modal.classList.remove('visible');
      resetDeck(false);
    },false);
  }

  // Card Event Listener callback
  function clickCard() {
    // Only process clicks if deck not temporarily locked
    if (!getLock()) {
      lock();
      // Only process card click if it has not already been matched and not open
      if (!this.classList.contains('match') && !this.classList.contains('open')) {
        openCard(this);
      } else {
        // Unlock deck since clicked on already open card
        unlock();
      }
    }
  }

  function openCard(card) {
      card.classList.add('open');
      // Set timeout for duration of opening animation
      setTimeout(function () {
        card.classList.add('show');
        checkCard(card);
      }, 200);
  }

  function checkCard(card) {
    // If already an open card present on deck
    if (alreadyOpenCard.length){
      // A card has already been open
      incrementMoves();
      // Get Icons of both cards currently open
      const cardIcon = card.firstElementChild.classList.item(1);
      const alreadyOpenCardIcon = alreadyOpenCard[0].firstElementChild.classList.item(1);
      // If cards Match
      if (alreadyOpenCardIcon === cardIcon) {
        matchedCards(card);
      // Else cards don't match
      } else {
        // Launch mismatch animation
        misMatchedCards(card);
        //Hide both cards in 1.2s to give time for player to memorize
        setTimeout(function () {
          hideCards(card);
        }, 1200);
      }
    // No card already open, leave current card open
    } else {
      alreadyOpenCard.push(card);
      unlock();
    }
  }

  function matchedCards(card) {
    card.classList.remove('open');
    alreadyOpenCard[0].classList.remove('open');
    card.classList.add('match');
    alreadyOpenCard[0].classList.add('match');
    alreadyOpenCard.pop();
    matched++;
    // Set timeout for duration of animation
    setTimeout(function () {
      unlock();
      // Check for victory condition
      if (matched === 8) victory();
    }, 300);

  }

  function misMatchedCards(card) {
    alreadyOpenCard[0].classList.add('mismatch');
    card.classList.add('mismatch');
  }

  function hideCards(card) {
    // Start hide animation
    card.classList.add('close');
    alreadyOpenCard[0].classList.add('close');
    // timeout for duration of closing animation
    setTimeout(function () {
      // Clear all classes from card
      card.classList.remove('show','open','mismatch','close');
      alreadyOpenCard[0].classList.remove('show','open','mismatch','close');
      alreadyOpenCard.pop();
      unlock();
    }, 200);
  }

  function incrementMoves() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = ++moves;

    //adjust star rating
    if(moves === 12) removeStar();
    if(moves === 18) removeStar();
  }

  function resetMoves() {
    moves = 0;
    matched = 0;
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = moves;
  }

  function resetStars() {
    const starsList = document.querySelectorAll('.score-panel .stars li i');
    const modalStarsList = document.querySelectorAll('.modal .stars li i');
    for (let star of starsList) {
      star.classList.replace( 'fa-star-o', 'fa-star');
    }
    for (let star of modalStarsList) {
      star.classList.replace( 'fa-star-o', 'fa-star');
    }
  }

  function removeStar() {
    const starList = document.querySelectorAll('.score-panel .stars li i');
    const modalStarsList = document.querySelectorAll('.modal .stars li i');
    for (let i = 2; i >= 1; i--) {
      if (starList[i].classList.contains('fa-star')) {
        starList[i].classList.replace( 'fa-star', 'fa-star-o');
        modalStarsList[i].classList.replace( 'fa-star', 'fa-star-o');
        break;
      }
    }
  }

  function victory() {
    const modal = document.querySelector('.modal');
    const modalMoves = document.querySelector('.movesWin');
    const modalTimer = document.querySelector('.timer');
    modalMoves.textContent = moves;
    const now = Date.now() - timeStart;
    modalTimer.textContent = readableTime(now);
    modal.classList.add('visible');
  }

  // Millisecond to readable time conversion function adapted from
  // https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
  function readableTime(millisec) {
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
    }
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
  }

  function lock() {
    deckLock = true;
  }

  function unlock() {
    deckLock = false;
  }

  function getLock() {
    return deckLock;
  }

  function restartTimer() {
    timeStart = Date.now();
  }
})();