class Player {
  constructor(number, name, id) {
    this.number = number;
    this.name = name;
    this.out = false;
    this.coins = 2;
    this.numCards = 2;
    this.cards = [];
    this.id = id;
  }
  //Resets everything to its original state
  resetPlayer() {
    this.out = false;
    this.coins = 2;
    this.numCards = 2;
    this.cards = [];
  }
  //Increments coins by one
  gainOneCoin() {
    this.coins += 1;
  }
  //Increments coins by two
  gainTwoCoins() {
    this.coins += 2;
  }
  //Incermensts coins by three
  gainThreeCoins() {
    this.coins += 3;
  }
  //Decrements coins by 2
  loseTwoCoins() {
    if (this.coins < 2) {
      this.coins = 0;
    } else {
      this.coins -= 2;
    }
  }
  //Decrements coins by 3
  loseThreeCoins() {
    this.coins -= 3;
    if (this.coins < 0) {
      this.coins = 0;
    }
  }
  //Decrements coins by 7
  loseSevenCoins() {
    this.coins -= 7;
  }
  // Takes in a string of the card selected to be discarded
  //Decrements number of cards
  //Removes the card from cards array
  //If numCards equals 0, sets out to true
  loseCard(card) {
    this.numCards -= 1;
    if (this.numCards <= 0) {
      this.out = true;
      this.cards.pop();
    } else {
      if (this.cards[0] === card) {
        this.cards.shift();
      } else if (this.cards[1] === card) {
        this.cards.pop();
      }
    }
  }
  //Does same thing as gain card,
  //But increment numCards past 2
  exchangeGainCard(card) {
    this.cards.push(card);
    ++this.numCards;
  }
  //Find card and makes new array without it
  newArray(cardArray, card) {
    let foundCard = false;
    let newArray = [];
    cardArray.forEach((elem) => {
      if (foundCard) {
        newArray.push(elem);
      } else if (elem != card) {
        newArray.push(elem);
      }
      if (elem == card) {
        foundCard = true;
      }
    });
    return newArray;
  }
  //sets this.cards equal to a new array
  // Without the specified card passed in
  exchangeLoseCard(cardArray, card) {
    let foundCard = false;
    let newArray = [];
    cardArray.forEach((elem) => {
      if (foundCard) {
        newArray.push(elem);
      } else if (elem != card) {
        newArray.push(elem);
      }
      if (elem == card) {
        foundCard = true;
      }
    });
    this.numCards -= 1;
    this.cards = newArray;
  }
  //Takes in a card and adds it to the Cards array
  gainCard(card) {
    this.cards.push(card);
    this.out = false;
    if (this.numCards < 2) {
      ++this.numCards;
    }
  }
  //returns the index of the card in the player's hand
  findCard(card) {
    if (this.numCards == 2) {
      if (card === this.cards[0]) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }
  switchCards() {
    if (this.numCards === 2) {
      const buffer = this.cards[0];
      this.cards[0] = this.cards[1];
      this.cards[1] = buffer;
    } else {
    }
  }
  // Takes in an action
  //Returns true if the player lied and false if they are telling the truth
  lying(action) {
    let firstCard = this.cards[0];
    let secondCard = this.cards[1];
    if (
      action === "Tax" ||
      action === "block-Foreign Aid" ||
      action === "block-Tax"
    ) {
      if (firstCard === "duke" || secondCard === "duke") {
        return false;
      } else {
        return true;
      }
    } else if (action === "Assassinate") {
      if (firstCard === "assassin" || secondCard === "assassin") {
        return false;
      } else {
        return true;
      }
    } else if (action === "Exchange") {
      if (firstCard === "ambassador" || secondCard === "ambassador") {
        return false;
      } else {
        return true;
      }
    } else if (action === "Steal") {
      if (firstCard === "captain" || secondCard === "captain") {
        return false;
      } else {
        return true;
      }
    } else if (action === "block-Assassination") {
      if (firstCard === "contessa" || secondCard === "contessa") {
        return false;
      } else {
        return true;
      }
    } else if (action === "block-Stealing") {
      if (
        firstCard === "captain" ||
        firstCard === "ambassador" ||
        secondCard === "captain" ||
        secondCard === "ambassador"
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
  // Same as lying, but for block-steal only
  stealLying(card) {
    let firstCard = this.cards[0];
    let secondCard = this.cards[1];

    if (card === "ambassador") {
      if (firstCard === "ambassador" || secondCard === "ambassador") {
        return false;
      } else {
        return true;
      }
    } else if (card === "captain") {
      if (firstCard === "captain" || secondCard === "captain") {
        return false;
      } else {
        return true;
      }
    }
  }
  //resets the number of cards to 2
  resetNumCards(cards) {
    this.numCards = cards;
  }

  // Returns true if player is out
  // Returns false otherwise
  isOut() {
    return this.out;
  }
  getName() {
    return this.name;
  }
  setNumber(num) {
    this.number = num;
  }
  getCards() {
    return this.cards;
  }
  getCoins() {
    return this.coins;
  }
  getNumber() {
    return this.number;
  }
  getId() {
    return this.id;
  }
  getNumCards() {
    return this.numCards;
  }
  printHand() {
    console.log(this.cards);
  }
  printStuff() {
    console.log(this.out);
    console.log(this.numCards);
  }
}
module.exports = Player;
// let player = new Player(1, "Justin");
// player.gainCard("ambassador");
// player.gainCard("captain");
// player.loseCard("captain");
// player.printHand();
// console.log(player.lying("steal"));
// console.log("!!!!!!!!!!!!!!!!!!!!");
// player.loseCard("assassin");
// player.loseCard("contessa");
// player.printHand();
// player.printStuff();
