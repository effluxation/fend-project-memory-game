(function () {
  /*
   * Create a list that holds all of your cards
   */

  const cards = ['paper-plane','paper-plane','anchor','anchor','bolt','bolt',
  'diamond','diamond','leaf','leaf','cube','cube',
  'bicycle','bicycle','bomb','bomb'];


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

  function resetDeck(initial) {

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
      let cardI = cardLi.firstElementChild;
      cardI.className = "";
      cardI.classList.add('fa',`fa-${cards[cardCount]}`)
      // Only add EventListeners on initial reset
      if (initial) cardLi.addEventListener('click', clickCard, false);
      cardCount++;

    }
    console.log(initial)
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
  function clickCard(e) {
        this.classList.add('open');
        addStar();
        moveIncrement();
  }

   // Add event listener to restart button
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', function () {
    resetDeck(false);
  },false);

  function moveIncrement() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = Number(movesElement.textContent)+1;
  }

  function resetMoves() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = 0;
  }


  function resetStars() {
    let starsList = document.querySelectorAll('.stars li i');
    for (let star of starsList) {
      star.classList.replace( 'fa-star', 'fa-star-o');
    }
  }

  function addStar() {
    let starsList = document.querySelectorAll('.stars li i');
    for (let star of starsList) {
      if (star.classList.contains('fa-star-o')) {
        console
        star.classList.replace( 'fa-star-o', 'fa-star');
        break;
      }
    }
  }

})()