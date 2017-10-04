(function () {
  /*
   * Create a list that holds all of your cards
   */

  const cards = ['paper-plane','paper-plane','anchor','anchor','bolt','bolt',
  'diamond','diamond','leaf','leaf','cube','cube',
  'bicycle','bicycle','bomb','bomb'];

  let alreadyOpenCard = [];
  let deckLock;
  let moves = 0;
  let matched = 0;

  initialize();
  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */

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

    // Reset classes on all cards and assign new ones reflecting
    // shuffled deck
    const cardLiAll = document.querySelectorAll('.deck li');
    let cardCount = 0;
    for (let cardLi of cardLiAll){
      cardLi.className = "";
      cardLi.classList.add('card');
      const cardI = cardLi.firstElementChild;
      cardI.className = "";
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

  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */

  function clickCard() {
    // Only process clicks if deck not temporarily locked
    if (!getLock()) {
      lock();
      // Only process card click if it has not already been matched and not open
      if (!this.classList.contains('match')
        && !this.classList.contains('open')) {
        openCard(this);
      } else {
        // Unlock deck since clicked on already open card
        unlock();
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
  }

  function incrementMoves() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = ++moves;

    //adjust star rating
    if(moves === 11) removeStar();
    if(moves === 16) removeStar();
    if(moves === 22) removeStar();
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
    for (let i = 2; i >= 0; i--) {
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
    modalMoves.textContent = moves;
    modal.classList.add('visible');
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
})();