const express = require("express");
const socketio = require("socket.io");
const Game = require("./classes/game");
const e = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(process.env.PORT || 4000);
const io = socketio(expressServer, { pingTimeout: 63000 });

//console.log("Node is running on port 4000...");
let socketId = [];
let usernames = [];
let newUsernames = [];
let players = [];
let names = [];
let game;
//On connections
io.on("connect", (socket) => {
  console.log("A CLIENT CONNNECTERD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  const username = socket.handshake.query.username;

  socket.emit("changeName", username);
  usernames.push(username);
  //console.log(usernames);
  socketId.push(socket.id);
  //console.log(socketId);
  let numClients;
  //Get the # of clients and emit it to client.js
  io.clients((error, clients) => {
    //console.log(clients.length);
    numClients = clients.length;
    io.emit("numClients", numClients);
  });
  socket.on("moreThanSeven", () => {
    io.emit("removeButton");
  });
  //Intializ a game object and deal the cards
  //Happens when the Start Game button is clciked

  socket.on("startGame", (id) => {
    players = [];
    newUsernames = [];
    console.log("HOW MANY TIMES IS STARTGAME BEING CALLED");
    // console.log(usernames + " ###########################");
    // console.log(socketId + " ###########################");
    // console.log(players + " ###########################");
    io.emit("deleteButton");
    socket.on("addCards", () => {
      io.clients((error, clients) => {
        io.emit("addStartingCoins", clients.length);
        io.emit("addStartingCards", clients.length);
      });
    });
    //console.log("The button was clicked");
    io.clients((error, clients) => {
      let numClients = clients.length;
      //(numClients + "*******************");

      game = new Game(numClients, usernames, socketId);

      //console.log(usernames + " usernames $$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      //console.log(socketId + " socketId $$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      // console.log(
      //   "***********************************************************"
      // );
      // console.log(socket.id);
      // console.log(socketId);

      game.deal();

      //console.log(game);
      // game.printPlayers();
      // game.printDeck();
      //game.printPlayersHands();
      //game.printPlayers();
      // Send the player's cards to each client to display on the browser
      game.getPlayers().forEach((player) => {
        //console.log(player.getCards());
        //console.log(player.getNumber());

        if (socket.id === player.getId()) {
          console.log("THE NAME OF THE PLAYER IS " + player.getName());
          socket.emit("deal", player.getCards());
        }

        socket.to(player.getId()).emit("deal", player.getCards());
      });

      //("The socket that started the game was " + id);
      game.getPlayers().forEach((player) => {
        if (player.getId() === id) {
          players.push(player);
        }
      });

      game.getPlayers().forEach((player) => {
        if (player.getId() != id) {
          players.push(player);
        }
      });

      for (let i = 0; i < numClients; ++i) {
        // console.log(numClients);
        players[i].setNumber(i + 1);
      }

      players.forEach((player) => {
        newUsernames.push(player.getName());
      });

      socket.emit("changeOtherNames", newUsernames, numClients);
      // console.log(numClients);
      players.forEach((player) => {
        socket
          .to(player.getId())
          .emit("changeOtherName", newUsernames, numClients, player.getName());
      });
      io.emit("sendPlayers", players);
      //console.log(newUsernames);
      //console.log(players);
      //console.log(socketId);

      // console.log(numClients);
      let i = 0;
      //console.log(players[i].getId());
      //console.log(players);      console.log("FIRST TURN IS GETTING CALLED $$$$$$$$$$$$$$$$$$$$$");
      socket.emit("firstTurn", i, numClients);
      console.log("FIRST TURN GOT CALLED $$$$$$$$$$$$$$$$$$$$$");
      console.log("GREEN IS GETTING CALLED $$$$$$$$$$$$$$$$$$$$$");
      io.emit("green", numClients, players[0].getName());
      console.log("GREEN GOT CALLED $$$$$$$$$$$$$$$$$$$$$");
      console.log("NEXT TURN IS GETTING CALLED $$$$$$$$$$$$$$$$$$$$$");
      socket.on("nextTurn", (i, numClients, id) => {
        console.log("THE ID ISSSSSSS: " + id);
        console.log("NEXT TURN GOT CALLED $$$$$$$$$$$$$$$$$$$$$");
        io.emit("greenOff", numClients, players[0].getName());
        //console.log("TAKE TURN IS GETTING CALLED *******************");
        console.log("TAKE TURN IS GETTING CALLED $$$$$$$$$$$$$$$$$$$$$");
        io.emit(
          "sendPlayers",
          players,
          newUsernames,
          usernames,
          socketId,
          game
        );
        let num = 0;
        players.forEach((player) => {
          if (player.getId() === players[i].getId()) {
            num += 1;
          }
        });
        console.log("NUM IS " + num);
        console.log("THe Next Player Is " + players[i].getName());
        socket
          .to(players[i].getId())
          .emit("takeTurn", i, numClients, players[i].getCoins(), players[i]);
        console.log("TAKE TURN GOT CALLED $$$$$$$$$$$$$$$$$$$$$");
        io.emit("green", numClients, players[1].getName());
      });
    });
  });
  //If someone disconnects, update # of clients and send to client.js
  socket.on("disconnect", (reason) => {
    io.clients((error, clients) => {
      numClients = clients.length;
      // console.log("THE NUMBER OF CLIENTS IS: " + numClients);
      io.emit("disconnection", numClients);
      let newSocketId = [];
      let newUsernames = [];
      //console.log(socket.id + " disconnected");
      socketId.forEach((id) => {
        if (socket.id != id) {
          newSocketId.push(id);
        }
      });
      usernames.forEach((username) => {
        if (socket.handshake.query.username != username) {
          newUsernames.push(username);
        }
      });
      socketId = newSocketId;
      usernames = newUsernames;
      //console.log(usernames);
      //console.log(socketId);
      //Need to handle getting everything back if a client disconnects by accident
    });
  });
  socket.on("test", (i) => {
    console.log("I IS.......... " + i);
    io.emit("sendPlayers", players, newUsernames, usernames, socketId, game);
    console.log("I IS.......... " + i);
    //console.log("ANDDDDD THE FIRST I IS: " + i);
    io.clients((error, clients) => {
      let numClients = clients.length;
      while (players[i].isOut()) {
        i = (i + 1) % numClients;
        // console.log("ANDDDDD THE LOOP I's ARE: " + i);
      }
      // console.log("ANDDDDD THE I IS: " + i);
      //console.log(i + "   OOOOOOOOOUUUUUUUTTTTTTT");
      //console.log("TAKE TURN IS GETTING CALLED &&&&&&&&&&&&&&&&&&");

      socket
        .to(players[i].getId())
        .emit("takeTurn", i, numClients, players[i].getCoins(), players[i]);
      io.emit("green", numClients, players[i].getName());
      // console.log("i is: " + i);
      i = (i - 1 + numClients) % numClients;
      //  console.log("i AFTER is: " + i);
      while (players[i].isOut()) {
        i = (i - 1 + numClients) % numClients;
      }
      io.emit("greenOff", numClients, players[i].getName());
    });
  });
  socket.on("action", (action, i, numClients) => {
    //console.log("HOW MANY TIMES IS ACTION BEING CALLED");
    if (action === "Income") {
      players[i].gainOneCoin();
    } else if (action === "Foreign Aid") {
      players[i].gainTwoCoins();
      for (let j = 0; j < numClients; ++j) {
        if (j === i) {
        } else {
          if (!players[j].isOut())
            socket
              .to(players[j].getId())
              .emit(
                "blockWithDuke",
                game.nextPlayerNotOutId(i, numClients, players),
                i,
                action
              );
        }
      }
    } else if (action === "Tax") {
      //console.log(numClients);
      players[i].gainThreeCoins();
      for (let j = 0; j < numClients; ++j) {
        if (j === i) {
        } else {
          if (!players[j].isOut())
            socket
              .to(players[j].getId())
              .emit(
                "blockWithDuke",
                game.nextPlayerNotOutId(i, numClients, players),
                i,
                action
              );
        }
      }
    } else if (action === "Exchange") {
      io.emit("coupAnnouncement", players[i].getName(), "N/A", action);
      const newCards = game.exchange();
      //console.log(newCards + "????????????");
      game.printDeck();
      // console.log(
      //   "THE NUMBER OF CARDS IS: " +
      //     players[i].getNumCards() +
      //     " !!!!!!!!!!!!!!!!!!!"
      // );

      socket.emit(
        "exchange",
        i,
        newCards,
        players[i].getCards(),
        players[i].getNumCards(),
        numClients
      );
      //  // console.log(
      //     "THE NUMBER OF CARDS IS: " +
      //       players[i].getNumCards() +
      //       " !!!!!!!!!!!!!!!!!!!"
      //   );
      for (let j = 0; j < numClients; ++j) {
        if (j === i) {
        } else {
          if (!players[j].isOut())
            socket
              .to(players[j].getId())
              .emit(
                "blockWithDuke",
                game.nextPlayerNotOutId(i, numClients, players),
                i,
                action
              );
        }
      }
    } else if (action === "Coup") {
      players[i].loseSevenCoins();
      socket.emit(
        "displayPlayerNames",
        action,
        numClients,
        game.getNamesWithoutPlayer(players[i].getName()),
        i,
        game.getNamesWithoutPlayer(players[i].getName()).length
      );
    } else if (action === "Steal") {
      socket.emit(
        "displayPlayerNames",
        action,
        numClients,
        game.getNamesWithoutPlayer(players[i].getName()),
        i,
        game.getNamesWithoutPlayer(players[i].getName()).length
      );
    } else if (action === "Assassinate") {
      players[i].loseThreeCoins();
      socket.emit(
        "displayPlayerNames",
        action,
        numClients,
        game.getNamesWithoutPlayer(players[i].getName()),
        i,
        game.getNamesWithoutPlayer(players[i].getName()).length
      );
    }
    // console.log(players[i]);
    //console.log("WHO IS RESPONSIBLE FOR THIS MADNESS " + players[i].getName());
    socket.emit("income", players[i].getCoins());
    // console.log("THESE ARE THE PLAYER NAMES");
    // console.log(players);
    names = [];
    players.forEach((player) => {
      names.push(player.getName());
    });
    for (let j = 0; j < numClients; j++) {
      socket
        .to(players[j].getId())
        .emit(
          "incomeOther",
          players[i].getCoins(),
          numClients,
          names,
          players[i].getName(),
          players[j].getNumber()
        );
    }
    io.emit("incomeAll", players[i].getName(), action);
  });
  socket.on("ForeignAidCounterAttempt", (id, i, action, stealPlayer) => {
    //console.log(stealPlayer + " ^^^^^^^^^^^^^^^^^^^");
    io.clients((error, clients) => {
      let numClients = clients.length;
      //console.log(numClients);
      //console.log(numClients + "%%%%%%%%%%%%%%%%%");
      let j = (i + 1) % numClients;
      while (players[j].isOut()) {
        j = (j + 1) % numClients;
      }
      //console.log("J ISSSSSS: " + j);
      socket.to(players[j].getId()).emit("pauseGame");
      if (id === players[j].getId()) {
        socket.emit("pauseGame");
      }
      players.forEach((player) => {
        // console.log(i + " ..... " + player.getNumber() - 1);
        if (player.getId() === id) {
          // console.log(numClients + " ===============");
          // console.log(player.getNumber() + " ===============");
          // console.log(player.getNumber() + " ===============");
          if (action === "Foreign Aid") {
            io.emit(
              "ForeignAidCounterAttemptAll",
              player.getName(),
              i,
              player.getNumber() - 1,
              id,
              action,
              players[i].getName()
            );
          } else if (action === "Tax") {
            socket.emit("middleStep", i, player.getNumber() - 1, id, action);
            io.emit(
              "messageToAll",
              player.getName(),
              players[i].getName(),
              action
            );
          } else if (action === "Exchange") {
            socket.emit("middleStep", i, player.getNumber() - 1, id, action);
            io.emit(
              "messageToAll",
              player.getName(),
              players[i].getName(),
              action
            );
          } else if (action === "Steal" || action === "Assassinate") {
            socket.emit(
              "middleStep",
              i,
              player.getNumber() - 1,
              id,
              action,
              stealPlayer
            );

            io.emit(
              "messageToAll",
              player.getName(),
              players[i].getName(),
              action
            );
          }
        }
      });
    });
  });
  socket.on(
    "counterBack",
    (i, playerNum, id, action, isLying, stealBlockChoice) => {
      // console.log("THIS MANY TIMES");
      if (action === "Foreign Aid")
        socket
          .to(players[i].getId())
          .emit("challenge", i, playerNum, id, action);
      else if (action === "Steal") {
        socket
          .to(players[i].getId())
          .emit(
            "challenge",
            i,
            playerNum,
            id,
            action,
            isLying,
            stealBlockChoice
          );
      } else if (action === "Assassinate") {
        socket
          .to(players[i].getId())
          .emit(
            "challenge",
            i,
            playerNum,
            id,
            action,
            isLying,
            stealBlockChoice
          );
      }
    }
  );
  socket.on(
    "challengeChoice",
    (
      i,
      playerNum,
      choice,
      id,
      action,
      isLying,
      stealBlockChoice,
      stealPlayer
    ) => {
      // console.log(stealPlayer + " ********************");
      //  console.log(stealBlockChoice + "Lllllllllll");
      // console.log("IS LYING IS: " + isLying);
      // console.log("stealBlockChoice IS: " + stealBlockChoice);
      io.clients((error, clients) => {
        let numClients = clients.length;
        // console.log("THESE ARE THE PLAYER NAMES");
        // console.log(players);
        names = [];
        players.forEach((p) => {
          names.push(p.getName());
        });
        let challenge = true;
        if (choice === "Don't Challenge") {
          challenge = false;
          if (action === "Foreign Aid") {
            players[i].loseTwoCoins();
          }
          //console.log(numClients);
          for (let j = 0; j < numClients; j++) {
            socket
              .to(players[j].getId())
              .emit(
                "incomeOther",
                players[i].getCoins(),
                numClients,
                names,
                players[i].getName(),
                players[j].getNumber(),
                action
              );
          }
          socket.emit("income", players[i].getCoins());
          io.emit(
            "challenge?",
            players[i].getName(),
            challenge,
            players[playerNum].getName(),
            action,
            false
          );
        }
        // console.log("???????????????????????");
        if (choice === "Challenge") {
          //console.log("CHALLENGE WAS TRUE");
          //console.log("@@@@@@@@@@@@@@@@@@@@");
          challenge = true;
          //Foreign Aid
          //if lying is false: i loses coins and chooses card to lose
          //if lying is true: player loses card and i keeps coins
          //Tax
          //If lying is false: player i keeps coins and playerNum
          //loses a card and player i gets to exchange card
          //Also reveal i's duke to everyone then cover it after
          // and announce that i had a duke
          //If lying is true: player i loses three coins and loses a card

          //Ambassador:
          //If !lying: playerNum loses card, i shows ambass
          // cover i's card and make announcement
          //If lying: i loses card and cards are returned to normal

          //Steal:
          //If lying playerNum loses two coins and a card
          //If !lying, coins stay the same and i loses a card and show the ambassador or captain
          // And playernum can exchange cards

          // Assassinate:
          //If lying, playerNum loses both cards
          //If not lying, show contessa, cover it, and i loses a card
          // console.log("IS LYING IS: " + isLying);
          let lying;
          if (action === "Foreign Aid") {
            lying = players[playerNum].lying("block-" + action);
          } else if (action === "Tax") {
            lying = players[i].lying("block-" + action);
          } else if (action === "Exchange") {
            lying = players[i].lying(action);
          } else if (action === "Steal" && isLying == null) {
            lying = players[i].lying(action);
          } else if (action === "Steal" && isLying != null) {
            lying = isLying;
          } else if (action === "Assassinate" && isLying == null) {
            lying = players[i].lying(action);
          } else if (action === "Assassinate" && isLying != null) {
            lying = isLying;
          }
          //(lying + " %%%%%%%%%%%%%%%%%%%%%%%%");
          //console.log(lying);
          //If action == "Steal" and !lying,
          // i gains two coins and playerNum loses two coins
          if (!lying) {
            if (
              (action === "Steal" && isLying != null) ||
              (action === "Assassinate" && isLying != null)
            ) {
              if (action === "Steal") {
                io.emit(
                  "announceReveal2",
                  players[playerNum].getName(),
                  players[playerNum].getName(),
                  stealBlockChoice,
                  false
                );
              }
              if (action === "Assassinate") {
                io.emit(
                  "announceReveal2",
                  players[playerNum].getName(),
                  players[playerNum].getName(),
                  "contessa",
                  false
                );
              }
              socket.emit(
                "loseCard",
                players[i].getNumCards(),
                players[i].getCards(),
                i,
                numClients,
                playerNum,
                lying,
                id,
                action,
                players[i].getCoins(),
                i,
                players[playerNum].getNumCards(),
                stealBlockChoice
              );
              players.forEach((player) => {
                socket
                  .to(player.getId())
                  .emit(
                    "revealCard",
                    stealBlockChoice,
                    numClients,
                    names,
                    players[playerNum].getName(),
                    player.getNumber(),
                    players[playerNum].getNumCards()
                  );
              });
              socket.emit(
                "revealCard",
                stealBlockChoice,
                numClients,
                names,
                players[playerNum].getName(),
                players[i].getNumber(),
                players[playerNum].getNumCards(),
                () => {
                  // console.log("CHALLENGED");
                }
              );
            }
            if (action === "Steal" && isLying == null) {
              io.emit(
                "announceReveal2",
                players[i].getName(),
                players[playerNum].getName(),
                "captain",
                false
              );
              if (stealPlayer) {
                if (players[playerNum].getCoins() === 0) {
                } else if (players[playerNum].getCoins() === 1) {
                  players[i].gainOneCoin();
                } else {
                  players[i].gainTwoCoins();
                }
                players[playerNum].loseTwoCoins();
              }
              for (let j = 0; j < numClients; j++) {
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[i].getCoins(),
                    numClients,
                    names,
                    players[i].getName(),
                    players[j].getNumber(),
                    action
                  );
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[playerNum].getCoins(),
                    numClients,
                    names,
                    players[playerNum].getName(),
                    players[j].getNumber(),
                    action
                  );
              }
              socket.emit(
                "incomeOther",
                players[i].getCoins(),
                numClients,
                names,
                players[i].getName(),
                players[playerNum].getNumber(),
                action
              );
              socket.emit("income", players[playerNum].getCoins());
            }
            if (action === "Foreign Aid") {
              players[i].loseTwoCoins();
              socket.emit("income", players[i].getCoins());
              for (let j = 0; j < numClients; j++) {
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[i].getCoins(),
                    numClients,
                    names,
                    players[i].getName(),
                    players[j].getNumber()
                  );
              }
              socket.emit(
                "loseCard",
                players[i].getNumCards(),
                players[i].getCards(),
                i,
                numClients,
                playerNum,
                lying,
                id,
                action,
                players[i].getCoins(),
                i,
                players[playerNum].getNumCards()
              );
              //console.log(id);
              // console.log(players[playerNum].getId());
              //Reveal card to everyone else
              players.forEach((player) => {
                socket
                  .to(player.getId())
                  .emit(
                    "revealCard",
                    "duke",
                    numClients,
                    names,
                    players[playerNum].getName(),
                    player.getNumber(),
                    players[playerNum].getNumCards()
                  );
              });
              socket.emit(
                "revealCard",
                "duke",
                numClients,
                names,
                players[playerNum].getName(),
                players[i].getNumber(),
                players[playerNum].getNumCards(),
                () => {
                  // console.log("CHALLENGED");
                }
              );

              io.emit(
                "announceReveal2",
                players[playerNum].getName(),
                players[playerNum].getName(),
                "duke",
                false
              );
            } else if (
              action === "Tax" ||
              action === "Exchange" ||
              (action === "Steal" && isLying == null) ||
              (action === "Assassinate" && isLying == null)
            ) {
              let cardType;
              if (action === "Tax") {
                cardType = "duke";
              } else if (action === "Exchange") {
                cardType = "ambassador";
              } else if (action === "Steal" && isLying == null) {
                cardType = "captain";
              } else if (action === "Assassinate" && isLying == null) {
                cardType = "assassin";
              }
              // console.log(players[playerNum].getId() + " +++++++++++++++++");
              // console.log(stealPlayer + " --------------------");
              if (
                (action === "Steal" || action === "Assassinate") &&
                players[playerNum].getId() != stealPlayer
              ) {
                socket.emit(
                  "loseCard",
                  players[playerNum].getNumCards(),
                  players[playerNum].getCards(),
                  playerNum,
                  numClients,
                  playerNum,
                  false,
                  id,
                  action,
                  players[playerNum].getCoins(),
                  i,
                  players[playerNum].getNumCards(),
                  null,
                  true
                );
              } else {
                socket.emit(
                  "loseCard",
                  players[playerNum].getNumCards(),
                  players[playerNum].getCards(),
                  playerNum,
                  numClients,
                  playerNum,
                  false,
                  id,
                  action,
                  players[playerNum].getCoins(),
                  i,
                  players[playerNum].getNumCards()
                );
              }
              players.forEach((player) => {
                socket
                  .to(player.getId())
                  .emit(
                    "revealCard",
                    cardType,
                    numClients,
                    names,
                    players[i].getName(),
                    player.getNumber(),
                    players[i].getNumCards()
                  );
              });
              socket.emit(
                "revealCard",
                cardType,
                numClients,
                names,
                players[i].getName(),
                players[playerNum].getNumber(),
                players[i].getNumCards(),
                () => {
                  //("CHALLENGED");
                }
              );
              io.emit(
                "announceReveal2",
                players[i].getName(),
                players[playerNum].getName(),
                cardType,
                false
              );
            }
          } else if (lying) {
            if (action === "Tax") {
              players[i].loseThreeCoins();
              for (let j = 0; j < numClients; j++) {
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[i].getCoins(),
                    numClients,
                    names,
                    players[i].getName(),
                    players[j].getNumber()
                  );
              }
              socket.emit(
                "incomeOther",
                players[i].getCoins(),
                numClients,
                names,
                players[i].getName(),
                players[playerNum].getNumber()
              );
            }
            if (action === "Assassinate" && isLying != null) {
              console.log("ASSASSINATE WAS ENTERED!!!!!!!!!!!!!!!!!!!");
              io.emit(
                "announceReveal2",
                players[playerNum].getName(),
                players[playerNum].getName(),
                stealBlockChoice,
                true
              );
              if (players[playerNum].getNumCards() === 1) {
                console.log("ASSASSINATE WAS ENTERED???????????????????");
                socket
                  .to(players[playerNum].getId())
                  .emit(
                    "loseCard",
                    players[playerNum].getNumCards(),
                    players[playerNum].getCards(),
                    playerNum,
                    numClients,
                    playerNum,
                    lying,
                    id,
                    action,
                    players[playerNum].getCoins(),
                    i,
                    players[playerNum].getNumCards()
                  );
              } else if (players[playerNum].getNumCards() === 2) {
                console.log("ASSASSINATE WAS ENTERED%%%%%%%%%%%%%%%%%%%");
                //When lying about having a contessa, it always makes both cards of i go dark, regardless of whether has contessa is true or not
                const card = players[playerNum].getCards()[0];
                players[playerNum].loseCard(card);
                io.emit(
                  "whichCardLost",
                  card,
                  players[playerNum].getName(),
                  i,
                  players[playerNum].getNumCards()
                );
                players.forEach((player) => {
                  socket
                    .to(player.getId())
                    .emit(
                      "revealLostCard",
                      card,
                      numClients,
                      names,
                      players[playerNum].getName(),
                      player.getNumber(),
                      players[playerNum].getNumCards()
                    );
                });
                socket.emit(
                  "revealLostCard",
                  card,
                  numClients,
                  names,
                  players[playerNum].getName(),
                  players[i].getNumber(),
                  players[playerNum].getNumCards()
                );
                socket
                  .to(players[playerNum].getId())
                  .emit(
                    "loseCardAssassin",
                    card,
                    playerNum,
                    action,
                    numClients
                  );
                socket
                  .to(players[playerNum].getId())
                  .emit(
                    "loseCard",
                    players[playerNum].getNumCards(),
                    players[playerNum].getCards(),
                    playerNum,
                    numClients,
                    playerNum,
                    isLying,
                    id,
                    action,
                    players[playerNum].getCoins(),
                    i,
                    players[playerNum].getNumCards(),
                    "somethin"
                  );
              }
            } else if (action === "Steal" && isLying != null) {
              // console.log("isLying was NOT null");
              io.emit(
                "announceReveal2",
                players[playerNum].getName(),
                players[playerNum].getName(),
                stealBlockChoice,
                true
              );
              players[playerNum].loseTwoCoins();
              players[i].gainTwoCoins();
              socket.emit("income", players[i].getCoins());
              socket.emit(
                "incomeOther",
                players[playerNum].getCoins(),
                numClients,
                names,
                players[playerNum].getName(),
                players[i].getNumber()
              );
              for (let j = 0; j < numClients; j++) {
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[playerNum].getCoins(),
                    numClients,
                    names,
                    players[playerNum].getName(),
                    players[j].getNumber()
                  );
                socket
                  .to(players[j].getId())
                  .emit(
                    "incomeOther",
                    players[i].getCoins(),
                    numClients,
                    names,
                    players[i].getName(),
                    players[j].getNumber()
                  );
              }
              socket
                .to(players[playerNum].getId())
                .emit(
                  "loseCard",
                  players[playerNum].getNumCards(),
                  players[playerNum].getCards(),
                  playerNum,
                  numClients,
                  playerNum,
                  lying,
                  id,
                  action,
                  players[i].getCoins(),
                  i,
                  players[playerNum].getNumCards()
                );
            }
            if (action === "Foreign Aid") {
              io.emit(
                "announceReveal2",
                players[playerNum].getName(),
                players[playerNum].getName(),
                "duke",
                lying
              );
              socket
                .to(players[playerNum].getId())
                .emit(
                  "loseCard",
                  players[playerNum].getNumCards(),
                  players[playerNum].getCards(),
                  playerNum,
                  numClients,
                  playerNum,
                  lying,
                  id,
                  action,
                  players[i].getCoins(),
                  i,
                  players[playerNum].getNumCards()
                );
            } else if (
              action === "Tax" ||
              action === "Exchange" ||
              (action === "Steal" && isLying == null) ||
              (action === "Assassinate" && isLying == null)
            ) {
              // console.log("isLying was null");
              let cardType;
              if (action === "Tax") {
                cardType = "duke";
              } else if (action === "Exchange") {
                cardType = "ambassador";
              } else if (action === "Steal") {
                cardType = "captain";
              } else if (action === "Assassinate") {
                cardType = "assassin";
              }
              io.emit(
                "announceReveal2",
                players[i].getName(),
                players[playerNum].getName(),
                cardType,
                lying
              );
              socket
                .to(players[i].getId())
                .emit(
                  "loseCard",
                  players[i].getNumCards(),
                  players[i].getCards(),
                  i,
                  numClients,
                  playerNum,
                  lying,
                  id,
                  action,
                  players[i].getCoins(),
                  i,
                  players[playerNum].getNumCards()
                );
            }
          }
        }
      });
    }
  );
  socket.on("removeCounter", () => {
    io.emit("removeCounterBack");
  });

  socket.on(
    "cardLost",
    (
      card,
      i,
      playerNum,
      lying,
      id,
      action,
      extraI,
      stealBlockChoice,
      numCards,
      stealPlayer
    ) => {
      // console.log(stealPlayer + " }}}}}}}}}}}}}}}}}}");
      // console.log(lying + " OOOOOOOOOOOO");
      io.clients((error, clients) => {
        let numClients = clients.length;
        // console.log("THESE ARE THE PLAYER NAMES");
        // console.log(players);
        names = [];
        players.forEach((player) => {
          names.push(player.getName());
        });
        players[i].loseCard(card);
        //(players[i]);

        if (!lying) {
          // console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}");
          // console.log(stealBlockChoice);
          if (players[i].getNumCards() === 0) {
            io.emit("deleteStealPlayer");

            setTimeout(function () {
              io.emit(
                "whichCardLost",
                card,
                players[i].getName(),
                i,
                players[i].getNumCards()
              );
            }, 2500);
          } else {
            io.emit(
              "whichCardLost",
              card,
              players[i].getName(),
              i,
              players[i].getNumCards()
            );
          }
          let playerWhoClicked;
          players.forEach((player) => {
            socket
              .to(player.getId())
              .emit(
                "revealLostCard",
                card,
                numClients,
                names,
                players[i].getName(),
                player.getNumber(),
                players[i].getNumCards()
              );
            players.forEach((player) => {
              if (player.getId() === id) {
                playerWhoClicked = player.getNumber() - 1;
              }
            });
            if (action === "Foreign Aid") {
              if (numCards === 1) {
                setTimeout(function () {
                  socket
                    .to(player.getId())
                    .emit(
                      "coverCard",
                      card,
                      numClients,
                      names,
                      players[playerWhoClicked].getName(),
                      player.getNumber(),
                      players[playerWhoClicked].getNumCards(),
                      action
                    );
                }),
                  2500;
              } else {
                socket
                  .to(player.getId())
                  .emit(
                    "coverCard",
                    card,
                    numClients,
                    names,
                    players[playerWhoClicked].getName(),
                    player.getNumber(),
                    players[playerWhoClicked].getNumCards(),
                    action
                  );
              }
            } else if (
              action === "Tax" ||
              action === "Exchange" ||
              (action === "Steal" && stealBlockChoice == null) ||
              (action === "Assassinate" && stealBlockChoice == null)
            ) {
              // console.log("######################");
              if (numCards === 1) {
                setTimeout(function () {
                  socket
                    .to(player.getId())
                    .emit(
                      "coverCard",
                      card,
                      numClients,
                      names,
                      players[extraI].getName(),
                      player.getNumber(),
                      players[extraI].getNumCards(),
                      action
                    );
                }),
                  2500;
              } else {
                socket
                  .to(player.getId())
                  .emit(
                    "coverCard",
                    card,
                    numClients,
                    names,
                    players[extraI].getName(),
                    player.getNumber(),
                    players[extraI].getNumCards(),
                    action
                  );
              }
            } else if (
              (action === "Steal" && stealBlockChoice != null) ||
              (action === "Assassinate" && stealBlockChoice != null)
            ) {
              // console.log("IT'S THESE BAD BOYS RIGHT HERE!!!!");
              // ITS THESE BAD BOYS RIGHT HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
              if (numCards === 1) {
                setTimeout(function () {
                  socket
                    .to(player.getId())
                    .emit(
                      "coverCard",
                      card,
                      numClients,
                      names,
                      players[playerNum].getName(),
                      player.getNumber(),
                      players[playerNum].getNumCards(),
                      action
                    );
                  socket.emit(
                    "coverCard",
                    card,
                    numClients,
                    names,
                    players[playerNum].getName(),
                    players[i].getNumber(),
                    players[playerNum].getNumCards(),
                    action
                  );
                }, 2500);
              } else {
                //  console.log("IT'S THESE GOOD BOYS RIGHT HERE!!!!");
                socket
                  .to(player.getId())
                  .emit(
                    "coverCard",
                    card,
                    numClients,
                    names,
                    players[playerNum].getName(),
                    player.getNumber(),
                    players[playerNum].getNumCards(),
                    action
                  );
                socket.emit(
                  "coverCard",
                  card,
                  numClients,
                  names,
                  players[playerNum].getName(),
                  players[i].getNumber(),
                  players[playerNum].getNumCards(),
                  action
                );
              }
            }
          });
          players.forEach((player) => {
            if (player.getId() === id) {
              playerWhoClicked = player.getNumber() - 1;
            }
          });
          // console.log(
          //   players[playerWhoClicked].getName() + "$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
          // );
          // console.log(
          //   players[playerWhoClicked].getNumCards() + "*************************"
          // );
          if (action === "Foreign Aid") {
            if (numCards === 1) {
              setTimeout(function () {
                socket.emit(
                  "coverCard",
                  card,
                  numClients,
                  names,
                  players[playerWhoClicked].getName(),
                  players[i].getNumber(),
                  players[playerWhoClicked].getNumCards(),
                  action
                );
              }, 2500);
            } else {
              socket.emit(
                "coverCard",
                card,
                numClients,
                names,
                players[playerWhoClicked].getName(),
                players[i].getNumber(),
                players[playerWhoClicked].getNumCards(),
                action
              );
            }
          } else if (
            action === "Tax" ||
            action === "Exchange" ||
            (action === "Steal" && stealBlockChoice == null) ||
            (action === "Assassinate" && stealBlockChoice == null)
          ) {
            if (numCards === 1) {
              setTimeout(function () {
                socket.emit(
                  "coverCard",
                  card,
                  numClients,
                  names,
                  players[extraI].getName(),
                  players[playerNum].getNumber(),
                  players[extraI].getNumCards(),
                  action
                );
              }, 2500);
            } else {
              socket.emit(
                "coverCard",
                card,
                numClients,
                names,
                players[extraI].getName(),
                players[playerNum].getNumber(),
                players[extraI].getNumCards(),
                action
              );
            }
          }
        } else if (lying) {
          // console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          //console.log(players[i].getName());
          io.emit(
            "whichCardLost",
            card,
            players[i].getName(),
            playerNum,
            players[i].getNumCards()
          );
          if (action === "Foreign Aid") {
            players.forEach((player) => {
              socket
                .to(player.getId())
                .emit(
                  "revealLostCard",
                  card,
                  numClients,
                  names,
                  players[playerNum].getName(),
                  player.getNumber(),
                  players[playerNum].getNumCards()
                );
            });
          } else if (
            action === "Tax" ||
            action === "Exchange" ||
            (action === "Steal" && stealBlockChoice == null) ||
            (action === "Assassinate" && stealBlockChoice == null)
          ) {
            // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            //console.log("YESSSIRRR!!!!!!!!!!!!!");
            players.forEach((player) => {
              socket
                .to(player.getId())
                .emit(
                  "revealLostCard",
                  card,
                  numClients,
                  names,
                  players[i].getName(),
                  player.getNumber(),
                  players[i].getNumCards()
                );
            });
            socket.emit(
              "revealLostCard",
              card,
              numClients,
              names,
              players[i].getName(),
              players[i].getNumber(),
              players[i].getNumCards()
            );
          }
        }
        socket.on("unPauseGame", (i, playerNum) => {
          io.emit("resumeGame");
        });
      });
      socket.on(
        "exchangeCard",
        (
          i,
          playerNum,
          numClients,
          action,
          extraI,
          stealBlockChoice,
          stealPlayer
        ) => {
          if (action === "Foreign Aid") {
            let card = game.getDeck().exchange();
            socket
              .to(players[playerNum].getId())
              .emit(
                "exchangeCard",
                playerNum,
                numClients,
                card,
                players[playerNum].getCards(),
                players[playerNum].getNumCards(),
                players[playerNum].findCard("duke"),
                extraI
              );
          } else if (
            (action === "Steal" && stealBlockChoice != null) ||
            (action === "Assassinate" && stealBlockChoice != null)
          ) {
            let card = game.getDeck().exchange();
            socket
              .to(players[playerNum].getId())
              .emit(
                "exchangeCard",
                playerNum,
                numClients,
                card,
                players[playerNum].getCards(),
                players[playerNum].getNumCards(),
                players[playerNum].findCard(stealBlockChoice),
                extraI
              );
          } else if (
            action === "Tax" ||
            action === "Exchange" ||
            (action === "Steal" && stealBlockChoice == null) ||
            (action === "Assassinate" && stealBlockChoice == null)
          ) {
            let cardType;
            if (action === "Tax") {
              cardType = "duke";
            } else if (action === "Exchange") {
              cardType = "ambassador";
            } else if (action === "Steal" && stealBlockChoice == null) {
              cardType = "captain";
            } else if (action === "Assassinate" && stealBlockChoice == null) {
              cardType = "assassin";
            }
            // console.log(extraI);
            //(playerNum + "::::::::::::::" + ExtraI);
            let card = game.getDeck().exchange();
            // console.log(players[extraI]);
            if (stealPlayer) {
              socket
                .to(players[extraI].getId())
                .emit(
                  "exchangeCard",
                  extraI,
                  numClients,
                  card,
                  players[extraI].getCards(),
                  players[extraI].getNumCards(),
                  players[extraI].findCard(cardType),
                  extraI,
                  stealPlayer
                );
            } else {
              socket
                .to(players[extraI].getId())
                .emit(
                  "exchangeCard",
                  extraI,
                  numClients,
                  card,
                  players[extraI].getCards(),
                  players[extraI].getNumCards(),
                  players[extraI].findCard(cardType),
                  extraI
                );
            }
          }
        }
      );
    }
  );
  socket.on(
    "exchangePick",
    (cardInHand, newCard, playerNum, numClients, numCards, cardIndex) => {
      players[playerNum].loseCard(cardInHand);
      game.getDeck().addCard(cardInHand);
      players[playerNum].gainCard(newCard);
      game.printDeck();
      //console.log("!!!!!!!!!!!!!!!!!!!!!");
      players[playerNum].printHand();
      if (cardIndex === 0) {
        players[playerNum].switchCards();
      }
      //console.log("!!!!!!!!!!!!!!!!!!!!!");
      players[playerNum].printHand();

      socket.emit(
        "updateExchangedCards",
        players[playerNum].getCards(),
        numCards,
        cardIndex,
        numClients
      );
    }
  );
  //emit process started back to i
  //if add: grab the whichCard of newCards and add that to hand, then delete it from new cards and emit both back to client
  //if delete: get the whichCard of cards, delete it from hand and add it to newCards
  socket.on(
    "exchangeClick",
    (
      processStarted,
      addOrDelete,
      whichCard,
      numCards,
      i,
      newCards,
      cards,
      initialCardNumber,
      numClients
    ) => {
      if (addOrDelete === "add") {
        players[i].exchangeGainCard(newCards[whichCard]);
        newCards = players[i].newArray(newCards, newCards[whichCard]);
        players[i].printHand();
      } else {
        players[i].exchangeLoseCard(cards, cards[whichCard]);
        //console.log(whichCard + "{{{{{{{{{{{{{{{");
        players[i].printHand();
        newCards.push(cards[whichCard]);
      }
      game.printDeck();
      socket.emit(
        "exchange",
        i,
        newCards,
        players[i].getCards(),
        numCards,
        numClients,
        processStarted,
        addOrDelete,
        initialCardNumber
      );
    }
  );
  socket.on("counterOff", () => {
    io.emit("counterOff");
  });
  socket.on("pauseGame", (i) => {
    socket.to(players[i].getId()).emit("pauseGame");
  });
  socket.on("unPauseGame", (i) => {
    io.emit("resumeGame");
  });
  socket.on("discard", (cards, i) => {
    cards.forEach((card) => {
      game.addToBack(card);
      game.printDeck();
      // console.log(cards);
    });
  });
  //Lose card to whoevers name was chosen
  // io emit what happened
  // resume the game
  socket.on("coup", (name, action, i, numClients) => {
    io.emit("coupAnnouncement", players[i].getName(), name, action);
    let playerNum = 0;
    players.forEach((player) => {
      if (player.getName() === name) {
        socket
          .to(player.getId())
          .emit(
            "loseCardCoup",
            player.getNumCards(),
            player.getCards(),
            playerNum,
            numClients,
            action,
            i
          );
      }
      ++playerNum;
    });
  });
  socket.on("cardLostCoup", (card, i, action, numClients) => {
    players[i].loseCard(card);
    io.emit(
      "whichCardLost",
      card,
      players[i].getName(),
      i,
      players[i].getNumCards()
    );
    players.forEach((player) => {
      socket
        .to(player.getId())
        .emit(
          "revealLostCard",
          card,
          numClients,
          names,
          players[i].getName(),
          player.getNumber(),
          players[i].getNumCards()
        );
    });
    socket.emit(
      "revealLostCard",
      card,
      numClients,
      names,
      players[i].getName(),
      players[i].getNumber(),
      players[i].getNumCards()
    );
  });
  socket.on("goToBlockWithDuke", (numClients, i, action) => {
    for (let j = 0; j < numClients; ++j) {
      if (j === i) {
      } else {
        if (!players[j].isOut())
          socket
            .to(players[j].getId())
            .emit(
              "blockWithDuke",
              game.nextPlayerNotOutId(i, numClients, players),
              i,
              action
            );
      }
    }
  });
  //Find the player with matching name
  // Determine whether they have a captain or ambassador
  //Emit to that client
  socket.on("steal", (name, action, i, numClients) => {
    players.forEach((player) => {
      if (player.getName() === name) {
        io.emit(
          "coupAnnouncement",
          players[i].getName(),
          player.getName(),
          action
        );
        socket.to(player.getId()).emit("steal", name, action, i, numClients);
      }
    });
  });
  //If counterChoice = "no", delete two coins from name, add two coins to i, and emit what happened,
  //If countered with ambassador or captain, emit something that uses the challenge that's already been made
  socket.on("stealAction", (name, action, i, numClients, counterChoice) => {
    let thePlayer;
    players.forEach((player) => {
      if (player.getName() === name) {
        thePlayer = player;
      }
    });
    // console.log("THE PLAYER WAS EMITTED");
    let lying = thePlayer.stealLying(counterChoice);
    // console.log("LYING IS::: " + lying);
    if (counterChoice === "no") {
      if (thePlayer.getCoins() === 0) {
      } else if (thePlayer.getCoins() === 1) {
        players[i].gainOneCoin();
      } else {
        players[i].gainTwoCoins();
      }
      thePlayer.loseTwoCoins();
      io.emit("challenge?", name, false, players[i].getName());
      //emit coins
      //Emit announcement
    }
    //Emit block with counterchoice,
    //Then emit to challenge and pass in lying
    else if (counterChoice === "ambassador" || counterChoice === "captain") {
      io.emit(
        "ForeignAidCounterAttemptAll",
        thePlayer.getName(),
        i,
        thePlayer.getNumber() - 1,
        players[(i + 1) % numClients].getId(),
        action,
        players[i].getName(),
        lying,
        counterChoice
      );
    }
    socket.emit("income", thePlayer.getCoins());
    // console.log("THESE ARE THE PLAYER NAMES");
    // console.log(players);
    names = [];
    players.forEach((player) => {
      names.push(player.getName());
    });
    for (let j = 0; j < numClients; j++) {
      socket
        .to(players[j].getId())
        .emit(
          "incomeOther",
          players[i].getCoins(),
          numClients,
          names,
          players[i].getName(),
          players[j].getNumber()
        );
    }
    for (let j = 0; j < numClients; j++) {
      socket
        .to(players[j].getId())
        .emit(
          "incomeOther",
          thePlayer.getCoins(),
          numClients,
          names,
          thePlayer.getName(),
          players[j].getNumber()
        );
    }
    socket.emit(
      "incomeOther",
      players[i].getCoins(),
      numClients,
      names,
      players[i].getName(),
      thePlayer.getNumber()
    );
  });
  //
  socket.on("assassinate", (name, action, i, numClients) => {
    players.forEach((player) => {
      if (player.getName() === name) {
        io.emit(
          "coupAnnouncement",
          players[i].getName(),
          player.getName(),
          action
        );
        socket
          .to(player.getId())
          .emit("assassinate", name, action, i, numClients);
      }
    });
  });
  // If conterChoice is no-- thePlayer loses a card
  // If counterChoice is block with contessa--
  // See if thePlayer is lying about having a contessa
  // Pass it into foreignAid stuff
  //In foreignAid --- if thePlayer lied about having contessa,
  //They will lose both cards
  socket.on(
    "assassinateAction",
    (name, action, i, numClients, counterChoice) => {
      let thePlayer;
      players.forEach((player) => {
        if (player.getName() === name) {
          thePlayer = player;
        }
      });
      //  console.log(thePlayer);
      let lying = thePlayer.lying("block-Assassination");
      if (counterChoice === "no") {
        // ("A CARD NEEDS TO BE LOST");
        socket.emit(
          "loseCardCoup",
          thePlayer.getNumCards(),
          thePlayer.getCards(),
          thePlayer.getNumber() - 1,
          numClients,
          action,
          i
        );
        io.emit("challenge?", name, false, players[i].getName(), action, true);
      } else if (counterChoice === "contessa") {
        io.emit(
          "ForeignAidCounterAttemptAll",
          thePlayer.getName(),
          i,
          thePlayer.getNumber() - 1,
          players[(i + 1) % numClients].getId(),
          action,
          players[i].getName(),
          lying,
          "contessa"
        );
      }
    }
  );
  socket.on("newCards", (newCards) => {
    io.emit("newCards", newCards);
  });
  socket.on("clearCounterCaptain", () => {
    io.emit("clearCounterCaptain");
  });
  socket.on("stealPauseGame", (i, numClients) => {
    // console.log("StealPAUSEGAME I IS " + i);
    // console.log(
    //   "THE PLAYYYYYYYYYYYYYYER ISSSSSSSS OUTTTTTT: " + players[i].isOut()
    // );
    while (players[i].isOut()) {
      i = (i + 1) % numClients;
    }
    socket.to(players[i].getId()).emit("pauseGame");
  });
  socket.on("i'sUntilOut", (i, numClients) => {
    let j = 1;
    while (players[i].isOut()) {
      i = (i + 1) % numClients;
      ++j;
      // console.log("J WAS INCREMENTED BY 1");
      // console.log(j);
    }
    socket.emit("I'sUntilOut", j);
  });
  socket.on("numUntilNextPersonIn", (i, numClients) => {
    let numUntilNextPersonIn = 1;
    while (players[i].isOut()) {
      i = (i + 1) % numClients;
      ++numUntilNextPersonIn;
      // console.log("NUMUNTILNEXTPERSON WAS INCREMENTED BY 1");
      // console.log(numUntilNextPersonIn);
    }
    socket.emit("numUntilNextPersonIn", numUntilNextPersonIn);
  });
  socket.on("discardOneCard", (card) => {
    //console.log(card + " THIS IS THE CARD$$$$$$$$$$$$$$$$$$$");
    game.addToBack(card);
  });
  socket.on("keepGamePaused", (i, numClients) => {
    // console.log("StealPAUSEGAME I IS " + i);
    // console.log(
    //   "THE PLAYYYYYYYYYYYYYYER ISSSSSSSS OUTTTTTT: " + players[i].isOut()
    // );
    while (players[i].isOut()) {
      i = (i + 1) % numClients;
    }
    socket.to(players[i].getId()).emit("keepGamePaused");
  });
  socket.on("unPauseKeepGamePaused", (i, playerNum, stealPlayer) => {
    io.emit("resumeGame", stealPlayer);
  });
  socket.on("removeStealBlockClick", (i, stealPlayer) => {
    if (!stealPlayer || stealPlayer == null) {
      io.to(players[i].getId()).emit("removeStealBlockClick");
    }
  });
  socket.on("checkGameOver", (i) => {
    if (game.gameOver()) {
      //console.log("SERVER GAME WHO WON " + game.whoWon());
      socket.emit("gameOver", game.whoWon());
      io.clients((error, clients) => {
        let numClients = clients.length;
        while (players[i].isOut()) {
          i = (i + 1) % numClients;
          // console.log("ANDDDDD THE LOOP I's ARE: " + i);
        }
        console.log("THE I ISSSSSS " + i);
        // console.log("ANDDDDD THE I IS: " + i);
        //console.log(i + "   OOOOOOOOOUUUUUUUTTTTTTT");
        //console.log("TAKE TURN IS GETTING CALLED &&&&&&&&&&&&&&&&&&");
      });
    }
  });
  socket.on("restartGame", (id) => {
    console.log(id);
    io.clients((error, clients) => {
      numClients = clients.length;
      // console.log("HOW MANY TIMES MAN");
      io.emit("clearGame", numClients, id);
      console.log(
        "NUMCLIENTS IS BEING CALLED??????!!!!!!!!!!??????????!!!!!!!!!!"
      );
    });
  });
  socket.on("callNewGame", (numClients, id) => {
    socket.emit("newGame", numClients, id);
    players.forEach((player) => {
      socket.to(player.getId()).emit("newGame", numClients);
    });
  });
  socket.on("startNewGame", (id) => {
    game.restartGame();
    players = [];
    newUsernames = [];
    game.getPlayers().forEach((player) => {
      if (player.getId() === id) {
        players.push(player);
      }
    });
    game.getPlayers().forEach((player) => {
      if (player.getId() != id) {
        players.push(player);
      }
    });
    for (let i = 0; i < numClients; ++i) {
      players[i].setNumber(i + 1);
    }
    socket.on("addNewCards", () => {
      io.emit("addNewStartingCoins", numClients);
      io.emit("addNewStartingCards", numClients);
    });
    players.forEach((player) => {
      newUsernames.push(player.getName());
    });

    socket.emit("changeOtherNames", newUsernames, numClients);
    // console.log(numClients);
    players.forEach((player) => {
      socket
        .to(player.getId())
        .emit("changeOtherName", newUsernames, numClients, player.getName());
    });
    game.deal();
    socket.emit("deal", players[0].getCards());
    for (let j = 1; j < numClients; ++j) {
      socket.to(players[j].getId()).emit("deal", players[j].getCards());
    }

    socket.emit("firstTurn", 0, numClients, true);
    io.emit("green", numClients, players[0].getName());
    socket.on("newNextTurn", (k, numClients) => {
      io.emit("greenOff", numClients, players[0].getName());
      socket
        .to(players[k].getId())
        .emit("takeTurn", k, numClients, players[k].getCoins());
      io.emit("green", numClients, players[1].getName());
    });
  });
});
