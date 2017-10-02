(function () {
  /*
   * Create a list that holds all of your cards
   */

  const cards = ['paper-plane','paper-plane','anchor','anchor','bolt','bolt',
  'diamond','diamond','leaf','leaf','cube','cube',
  'bicycle','bicycle','bomb','bomb'];

  let alreadyOpenCard = [];
  let gameStatus = 'default';
  let lock = false;
  let movesNumber = 0;
  let matched = 0;
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
    resetMoves();
    for (let cardLi of cardLiAll){
      cardLi.className = "";
      cardLi.classList.add('card');
      let cardI = cardLi.firstElementChild;
      cardI.className = "";
      cardI.classList.add('fa',`fa-${cards[cardCount]}`);
      // Only add EventListeners on initial reset
      if (initialReset){
        cardLi.addEventListener('click', clickCard, false);
        const restartButton = document.querySelector('.restart');
        restartButton.addEventListener('click', function () {
          // Subsequent resents will not add event listeners
          resetDeck(false);
        },false);
      }
      cardCount++;
    }
  }

  // Initial reset
  resetDeck(true);

  // li card classes:
  //   match = flip card;
  //   open =
  //   show =

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
    if (!lock) {
      // Only process card click if it has not already been matched or open
      if (!this.classList.contains('match')
        || !this.classList.contains('open')) {
        openCard(this);
        checkCard(this);
      }

      function openCard(card) {
          card.classList.add('open');
          card.classList.add('show');
      }
    }

    function checkCard(card) {

      // If already an open card present on deck
      if (alreadyOpenCard.length){
        // Single move completed
        incrementMoves();
        // Get Icons of both cards currently open
        let cardIcon = card.firstElementChild.classList.item(1);
        let alreadyOpenCardIcon = alreadyOpenCard[0].firstElementChild.classList.item(1);
        // If cards Match
        if (alreadyOpenCardIcon === cardIcon) {
          matchedCards(card);
          // Check for winning condition
          if (matched === 8) victory();
        // Cards don't match
        } else {
          // Lock deck for 1 second and show both cards
          lock = true;
          setTimeout( (function () {
            hideCards(card);
            alreadyOpenCard.pop();
            lock = false;
          }).bind(this), 1000);
        }
      // No already open card, leave current card open
      } else {
        alreadyOpenCard.push(card);
      }
    }

    function matchedCards(card) {

      card.classList.remove('open');
      card.classList.add('match');
      alreadyOpenCard[0].classList.remove('open');
      alreadyOpenCard[0].classList.add('match');
      alreadyOpenCard.pop();
      matched++;
      console.log('Matched: '+ matched);
    }

    function hideCards(card) {
      card.classList.remove('show');
      card.classList.remove('open');
      alreadyOpenCard[0].classList.remove('show');
      alreadyOpenCard[0].classList.remove('open');
    }
  }

  function incrementMoves() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = ++movesNumber;

    //adjust star rating
    if(getMoves() === 10) removeStar();
    if(getMoves() === 14) removeStar();
    if(getMoves() === 18) removeStar();
  }

  function getMoves() {
    return movesNumber;
  }

  function resetMoves() {
    movesNumber = 0;
    matched = 0;
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = movesNumber;
  }

  function resetStars() {
    let starsList = document.querySelectorAll('.stars li i');
    for (let star of starsList) {
      star.classList.replace( 'fa-star-o', 'fa-star');
    }
  }

  function removeStar() {
    let starList = document.querySelectorAll('.stars li i');
    for (let i = 2; i >= 0; i--) {
      if (starList[i].classList.contains('fa-star')) {
        starList[i].classList.replace( 'fa-star', 'fa-star-o');
        break;
      }
    }
  }

  function victory() {
    let modal = document.querySelector('.modal');
    resetDeck(false);
  }

})();