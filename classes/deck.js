class Deck {
  constructor() {
    this.deck = [
      "assassin",
      "assassin",
      "assassin",
      "duke",
      "duke",
      "duke",
      "contessa",
      "contessa",
      "contessa",
      "captain",
      "captain",
      "captain",
      "ambassador",
      "ambassador",
      "ambassador",
    ];
    this.PACK_SIZE = 15;
  }
  // Returns card on top of deck
  dealCard() {
    const card = this.deck[0];
    this.deck.shift();
    return card;
  }
  //Returns an array of the top two cards in the deck

  ambassador() {
    const topTwo = [this.deck[0], this.deck[1]];
    return topTwo;
  }
  //Returns the top card of the deck
  // And deletes the top card off the deck
  exchange() {
    let card = this.deck[0];
    this.deck.shift();
    return card;
  }
  //Returns the top two cards from the deck
  // And then deletes them from the deck
  ambassador() {
    let cards = [];
    cards.push(this.deck[0]);
    cards.push(this.deck[1]);
    this.deck.shift();
    this.deck.shift();
    return cards;
  }
  //Puts all the cards back in the deck unshuffled
  reset() {
    this.deck = [
      "assassin",
      "assassin",
      "assassin",
      "duke",
      "duke",
      "duke",
      "contessa",
      "contessa",
      "contessa",
      "captain",
      "captain",
      "captain",
      "ambassador",
      "ambassador",
      "ambassador",
    ];
  }
  //Shuffles the deck
  //Sets next to 0
  shuffle() {
    let numArray = [];
    let cardArray = [];
    for (let i = 0; i < this.PACK_SIZE; ++i) {
      let num = Math.floor(Math.random() * 15);
      let added = true;
      while (added) {
        if (!numArray.includes(num)) {
          numArray.push(num);
          cardArray.push(this.deck[num]);
          added = false;
        } else {
          num = Math.floor(Math.random() * 15);
        }
      }
    }
    for (let i = 0; i < this.PACK_SIZE; ++i) {
      this.deck[i] = cardArray[i];
    }
  }
  //Pushes card donto back of the deck
  addCard(card) {
    this.deck.push(card);
  }
  printDeck() {
    return this.deck;
  }
}

module.exports = Deck;
//let deck = new Deck();
//Testing Schtuff

//console.log(deck.dealCard());
// let arr = deck.ambassador();
// arr.forEach((a) => {
//   console.log(a);
// });
// deck.shuffle();
// deck.printDeck();
// console.log("!!!!!!!!!!!!!!!!!!!!!!");
// let card = deck.dealCard();
// deck.printDeck();
// deck.addCard(card);
// console.log("!!!!!!!!!!!!!!!!!!!!!!");
// deck.printDeck();
