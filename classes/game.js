const Player = require("./player");
const Deck = require("./deck");
//Takes in a a number a name and an id a returns a new player
function newPlayer(number, name, id) {
  let player = new Player(number, name, id);
  return player;
}
class Game {
  constructor(numPlayers, namesArray, idArray, newGame) {
    this.numPlayers = numPlayers;
    this.deck = new Deck();
    this.players = [];
    this.idArray = idArray;
    this.namesArray = namesArray;

    for (let i = 0; i < this.numPlayers; ++i) {
      this.players.push(newPlayer(i, this.namesArray[i], this.idArray[i]));
    }

    console.log(this.players);
  }
  deal() {
    this.deck.reset();
    this.deck.shuffle();
    for (let i = 0; i < 2; ++i) {
      this.players.forEach((player) => {
        player.gainCard(this.deck.dealCard());
      });
    }
  }
  // Returns true if
  gameOver() {
    let out = 0;
    this.players.forEach((player) => {
      if (player.isOut()) {
        ++out;
      }
    });
    if (out === this.numPlayers - 1) {
      return true;
    }
    return false;
  }
  //Returns the name of the Player who won
  whoWon() {
    let name;
    this.players.forEach((player) => {
      if (!player.isOut()) {
        console.log("THE PLAYER WHO WON IS..... " + player.getName());
        name = player.getName();
      }
    });
    return name;
  }
  //Returns the top two cards from the deck
  // And then deletes them from the deck
  exchange() {
    return this.deck.ambassador();
  }
  //returns the id of the next player not out
  nextPlayerNotOutId(i, numClients, players) {
    let j = (i + 1) % numClients;
    while (players[j % numClients].isOut()) {
      j = (j + 1) % numClients;
    }
    return players[j].getId();
  }
  getPlayers() {
    return this.players;
  }
  getDeck() {
    return this.deck;
  }
  addToBack(card) {
    this.deck.addCard(card);
  }
  getNumPlayers() {
    return this.numPlayers;
  }
  getNames() {
    let names = [];
    this.players.forEach((player) => {
      names.push(player.getName());
    });
    return names;
  }
  getNamesWithoutPlayer(name) {
    let names = [];
    this.players.forEach((player) => {
      if (player.getName() != name && !player.isOut()) {
        names.push(player.getName());
      }
    });
    return names;
  }
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PRINTING STUFF !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  printPlayers() {
    this.players.forEach((element) => {
      console.log(element);
    });
  }
  printPlayersHands() {
    this.players.forEach((player) => {
      player.printHand();
      console.log("------------------------");
    });
  }
  printDeck() {
    console.log(this.deck.printDeck());
  }
  // Resets everything in the game
  restartGame() {
    this.players.forEach((player) => {
      player.resetPlayer();
    });
    this.deck.reset();
  }
}
module.exports = Game;
//let game = new Game(3);
//game.deal();
// game.printDeck();
// console.log("$$$$$$$$$$$$$$$$$$$$$");
//game.printPlayersHands();
//game.printPlayers();
