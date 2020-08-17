// noprotect
const password = prompt("Enter the password");
if (password != "belter") {
  document.getElementById("deck").innerHTML = "";
  document.getElementById("coins").innerHTML = "";
  document.getElementById("player").innerHTML = "Incorrect Password";
  let username;
} else {
  username = prompt("Enter a username");
  document.getElementById(
    "deck"
  ).innerHTML = `<img class="deck-of-cards" src="./card.png"/>`;
  document.getElementById(
    "coins"
  ).innerHTML = `<img class="pile-of-coins" src="./coin.png"/>`;
  document.getElementById(
    "player"
  ).innerHTML += `<h1 class="player-0">Waiting on other players to join the game...</h1>`;
}

const socketURL = "https://chickenonaraft01235.herokuapp.com/";
const socket = io(socketURL, {
  query: {
    username,
  },
});

let newUsernames = [];
let newCardz;
socket.on("changeName", (username) => {
  document.getElementById("player-1").innerHTML = username;
});
socket.on("changeOtherNames", (usernames, numClients) => {
  console.log(usernames);
  for (let i = 2; i <= numClients; ++i) {
    document.getElementById(`player-${i}`).innerHTML = usernames[i - 1];
  }
});
socket.on("changeOtherName", (usernames, numClients, name) => {
  newUsernames = [];
  console.log(name + "!!!!!!!!!");
  console.log(usernames);
  let offBy = 0;
  let passed = false;
  usernames.forEach((username) => {
    if (username === name) {
      passed = true;
    } else if (!passed) {
      offBy++;
    }
  });
  //console.log("This user is off by: " + offBy);
  let i = (offBy + 1) % numClients;
  while (newUsernames.length != numClients - 1) {
    newUsernames.push(usernames[i]);
    i = (i + 1) % numClients;
  }
  //console.log(newUsernames);
  for (let i = 2; i <= numClients; ++i) {
    document.getElementById(`player-${i}`).innerHTML = newUsernames[i - 2];
  }
});
let num;
socket.on("numClients", (numClients) => {
  console.log("HOW MANY TIMES IS NUMCLIENTS BEING CALLED");
  if (numClients === 1) {
    num = "one";
  }

  if (numClients === 2) {
    num = "two";
  } else if (numClients === 3) {
    num = "three";
  } else if (numClients === 4) {
    num = "four";
  } else if (numClients === 5) {
    num = "five";
  } else if (numClients === 6) {
    num = "six";
  } else if (numClients === 7) {
    num = "seven";
  }
  function remove() {
    //console.log("The button was clicked");
    document.getElementById("start-game").innerHTML = "";
    //console.log("The button was clicked!!!!!!");
    console.log("HOW MANY TIMES IS StartGame BEING CALLED!!!!!!!!!");
    socket.emit("startGame", socket.id);
    socket.emit("addCards");
  }
  document.getElementById("player").className = `${num}-players`;
  //When the # of clients is 2 or greater, display the start game button
  if (numClients >= 1) {
    document.getElementById("start-game").innerHTML =
      "<button id ='start-game-button' class = 'none' type = 'button'> Start Game <button>";
  }
  if (numClients >= 2 && numClients < 7) {
    document.getElementById("start-game").innerHTML =
      "<button id ='start-game-button' class = 'start-game' type = 'button'> Start Game <button>";
  }
  if (numClients >= 7) {
    socket.emit("moreThanSeven");
  }
  socket.on("removeButton", () => {
    document.getElementById("start-game").innerHTML = "";
  });
  socket.on("deleteButton", () => {
    document.getElementById("start-game").innerHTML = "";
    document.getElementById("deck").innerHTML = "";
    document.getElementById("coins").innerHTML = "";
  });

  //Add a click listener to the button and emit the event to the server. Also remove the button.

  document
    .getElementById("start-game-button")
    .addEventListener("click", remove);
  socket.on("addStartingCards", (clientNumber) => {
    // add the starting face down cards as well as the starting number of coins
    document.getElementById("start-game").className = `cards-${clientNumber}`;
    // console.log("schtuff");
    for (let i = 2; i <= clientNumber; ++i) {
      document.getElementById(
        "start-game"
      ).innerHTML += `<img src ="./card.png" id = "first-card-${i}"class = "card-1-${i}"> <img src ="./card.png" id = "second-card-${i}"class = "card-2-${i}">`;
    }
  });
  socket.on("addStartingCoins", (clientNumber) => {
    document.getElementById("player-coins").className = `coins-${clientNumber}`;
    //console.log("The number of clients is " + clientNumber);
    for (let i = 1; i <= clientNumber; ++i) {
      let two = 2;
      document.getElementById(
        "player-coins"
      ).innerHTML += `<h1 class="coin-${i}">Coins:</h1> <h1 id = "coins-${i}"class ="coin-num-${i}">2</h1>`;
    }
  });
});

socket.on("disconnection", (numClients) => {
  if (numClients === 1) {
    num = "one";
  }
  if (numClients === 2) {
    num = "two";
  } else if (numClients === 3) {
    num = "three";
  } else if (numClients === 4) {
    num = "four";
  } else if (numClients === 5) {
    num = "five";
  } else if (numClients === 6) {
    num = "six";
  }
  document.getElementById("player").className = `${num}-players`;
});

//Listening for "deal" event to show each player their two starting cards
socket.on("deal", (cards) => {
  // console.log(cards[0]);
  document.getElementById(
    "player-cards"
  ).innerHTML += `<img id = "deal0" class = "deal0" src ="${cards[0]}.jpg">`;
  document.getElementById(
    "player-cards"
  ).innerHTML += `<img id = "deal1" class = "deal1" src ="${cards[1]}.jpg">`;
});

//Listen for "yourTurn" event to update the dom for the player's turn
// Send back an event to the server saying that the player did their turn
socket.on("firstTurn", (i, numClients, newGame) => {
  console.log("I IS ....." + i);
  console.log("NUMCLIENTS IS ....." + numClients);
  console.log("THE FIRST TURN WAS ENTERED INTO");
  const income = document.getElementById("income");
  const foreignAid = document.getElementById("foreign-aid");
  const coup = document.getElementById("coup");
  const tax = document.getElementById("tax");
  const assassinate = document.getElementById("assassinate");
  const exchange = document.getElementById("exchange");
  const steal = document.getElementById("steal");
  income.innerHTML =
    "<button id = 'income-button' class='income'>Income</button>";
  foreignAid.innerHTML =
    "<button id = 'foreign-aid-button' class='foreign-aid'>Foreign Aid</button>";
  coup.innerHTML =
    "<button id = 'coup-button' class='coup-dark'>Coup</button1>";
  tax.innerHTML = "<button id = 'tax-button' class='tax'>Tax</button>";
  assassinate.innerHTML =
    "<button id = 'assassinate-button' class='assassinate-dark'>Assassinate</button>";
  exchange.innerHTML =
    "<button id = 'exchange-button' class='exchange'>Exchange</button>";
  steal.innerHTML = "<button id = 'steal-button' class='steal'>Steal</button>";
  const incomeButton = document.getElementById("income-button");
  const foreignAidButton = document.getElementById("foreign-aid-button");
  const coupButton = document.getElementById("coup-button");
  const taxButton = document.getElementById("tax-button");
  const assassinateButton = document.getElementById("assassinate-button");
  const exchangeButton = document.getElementById("exchange-button");
  const stealButton = document.getElementById("steal-button");
  incomeButton.addEventListener("click", action);
  foreignAidButton.addEventListener("click", action);
  taxButton.addEventListener("click", action);
  exchangeButton.addEventListener("click", action);
  stealButton.addEventListener("click", action);
  function action(event) {
    const actions = event.target.innerHTML;
    //console.log(event.target.innerHTML);
    // console.log("NEXT TURN");
    //TO DO handle clicked on action
    //handleAction(actions);
    socket.emit("action", actions, i, numClients);
    incomeButton.removeEventListener("click", action);
    foreignAidButton.removeEventListener("click", action);
    taxButton.removeEventListener("click", action);
    exchangeButton.removeEventListener("click", action);
    stealButton.removeEventListener("click", action);
    coupButton.removeEventListener("click", action);
    assassinateButton.removeEventListener("click", action);
    income.innerHTML = "";
    foreignAid.innerHTML = "";
    coup.innerHTML = "";
    tax.innerHTML = "";
    assassinate.innerHTML = "";
    exchange.innerHTML = "";
    steal.innerHTML = "";
    if (newGame) {
      socket.emit("newNextTurn", i + 1, numClients, socket.id);
    } else {
      socket.emit("nextTurn", i + 1, numClients, socket.id);
    }
    console.log(i + " THE FIRST TURN WAS CLICKED");
  }
});
socket.on("takeTurn", (i, numClients, coins, player, gameOver) => {
  console.log(
    "****************************************************************************"
  );
  console.log(i + "{{{{{{{{{{{{{{{{{{{{");
  console.log(coins + "{{{{{{{{{{{{{{{{{{{{");
  console.log(numClients + "{{{{{{{{{{{{{{{{{{{{");
  console.log(player);
  const income = document.getElementById("income");
  const foreignAid = document.getElementById("foreign-aid");
  const coup = document.getElementById("coup");
  const tax = document.getElementById("tax");
  const assassinate = document.getElementById("assassinate");
  const exchange = document.getElementById("exchange");
  const steal = document.getElementById("steal");
  income.innerHTML =
    "<button id = 'income-button'class='income'>Income</button>";
  foreignAid.innerHTML =
    "<button id= 'foreign-aid-button'class='foreign-aid'>Foreign Aid</button>";
  tax.innerHTML = "<button id = 'tax-button'class='tax'>Tax</button>";
  if (coins < 3) {
    assassinate.innerHTML =
      "<button id = 'assassinate-button' class='assassinate-dark'>Assassinate</button>";
  }
  if (coins >= 3) {
    assassinate.innerHTML =
      "<button id = 'assassinate-button' class='assassinate-light'>Assassinate</button>";
    const assassinateButton = document.getElementById("assassinate-button");
    assassinateButton.addEventListener("click", action);
  }
  if (coins < 7) {
    coup.innerHTML =
      "<button id = 'coup-button' class='coup-dark'>Coup</button1>";
  }
  if (coins >= 7) {
    coup.innerHTML =
      "<button id = 'coup-button' class='coup-light'>Coup</button1>";
    const coupButton = document.getElementById("coup-button");
    coupButton.addEventListener("click", action);
  }
  exchange.innerHTML =
    "<button id = 'exchange-button'class='exchange'>Exchange</button>";
  steal.innerHTML = "<button id = 'steal-button'class='steal'>Steal</button>";
  const incomeButton = document.getElementById("income-button");
  const foreignAidButton = document.getElementById("foreign-aid-button");
  const coupButton = document.getElementById("coup-button");
  const taxButton = document.getElementById("tax-button");
  const assassinateButton = document.getElementById("assassinate-button");
  const exchangeButton = document.getElementById("exchange-button");
  const stealButton = document.getElementById("steal-button");
  incomeButton.addEventListener("click", action);
  foreignAidButton.addEventListener("click", action);
  taxButton.addEventListener("click", action);
  exchangeButton.addEventListener("click", action);
  stealButton.addEventListener("click", action);
  function action(event) {
    const actions = event.target.innerHTML;
    //TO DO -- handle clicked on action
    //handleAction(actions);
    socket.emit("removeCounter");
    socket.emit("action", actions, i, numClients);
    incomeButton.removeEventListener("click", action);
    foreignAidButton.removeEventListener("click", action);
    taxButton.removeEventListener("click", action);
    exchangeButton.removeEventListener("click", action);
    stealButton.removeEventListener("click", action);
    coupButton.removeEventListener("click", action);
    assassinateButton.removeEventListener("click", action);
    income.innerHTML = "";
    foreignAid.innerHTML = "";
    coup.innerHTML = "";
    tax.innerHTML = "";
    assassinate.innerHTML = "";
    exchange.innerHTML = "";
    steal.innerHTML = "";
    i = (i + 1) % numClients;
    // console.log(i + " **************");
    console.log("TEST IS GETTING CALLED!!!!!!!!!!!!!!!!!!!");
    socket.emit("test", i, numClients);
  }
  if (gameOver) {
    income.removeEventListener("click", action);
    foreignAid.removeEventListener("click", action);
    tax.removeEventListener("click", action);
    exchange.removeEventListener("click", action);
    steal.removeEventListener("click", action);
    coup.removeEventListener("click", action);
    assassinate.removeEventListener("click", action);
    income.innerHTML = "";
    foreignAid.innerHTML = "";
    coup.innerHTML = "";
    tax.innerHTML = "";
    assassinate.innerHTML = "";
    exchange.innerHTML = "";
    steal.innerHTML = "";
  }
});
socket.on("green", (numClients, name) => {
  for (let i = 1; i <= numClients; ++i) {
    if (document.getElementById(`player-${i}`).innerHTML == name) {
      document.getElementById(`player-${i}`).className += " green";
    }
  }
});
socket.on("greenOff", (numClients, name) => {
  for (let i = 1; i <= numClients; ++i) {
    if (document.getElementById(`player-${i}`).innerHTML == name) {
      document.getElementById(`player-${i}`).className = `player-${i}`;
    }
  }
});
socket.on("income", (coins) => {
  // console.log(coins + "!!!!!!!!!!!!!");
  document.getElementById("coins-1").className += " z";
  document.getElementById("coins-1").innerHTML = `${coins}`;
});
socket.on("incomeOther", (coins, numClients, names, name, number) => {
  // console.log(coins);
  let index = numClients;
  let found = false;
  let offBy = 0;
  let i = number;
  if (i === numClients) {
    i = 0;
  }
  let count = 0;
  while (count < numClients) {
    if (names[i] === name) {
      found = true;
    } else if (!found) {
      ++offBy;
    }
    ++count;
    i = (i + 1) % numClients;
  }
  index = numClients - offBy;
  document.getElementById(`coins-${index}`).className += " z";
  document.getElementById(`coins-${index}`).innerHTML = `${coins}`;
});
socket.on("incomeAll", (name, action) => {
  const announcement = document.getElementById("announcement");
  if (action === "Income") {
    announcement.innerHTML = `<h1 class = "announcement"> ${name} took one coin, like a bitch</h1>`;
  } else if (action === "Foreign Aid") {
    announcement.innerHTML = `<h1 class = "announcement-right"> ${name} took two coins</h1>`;
  } else if (action === "Tax") {
    announcement.innerHTML = `<h1 class = "announcement-left"> ${name} took three coins with su duke </h1>`;
  }
});

socket.on("blockWithDuke", (id, i, action) => {
  let stealPlayer;
  if (action === "Foreign Aid") {
    if (socket.id === id) {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-other'>Block with Duke</h1> <button id = 'counter-button'class ='counter-button-other'>Block</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    } else {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text'>Block with Duke</h1> <button id = 'counter-button' class ='counter-button'>Block</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    }
  } else if (action === "Tax") {
    console.log(socket.id);
    console.log(id);
    if (socket.id === id) {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-other'>Call BS on Duke</h1> <button id = 'counter-button'class ='counter-button-other'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    } else {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text'>Call BS on Duke</h1> <button id = 'counter-button' class ='counter-button'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    }
  } else if (action === "Exchange") {
    if (socket.id === id) {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-other'>Call BS on Ambassador</h1> <button id = 'counter-button'class ='counter-button-other'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    } else {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-left'>Call BS on Ambassador</h1> <button id = 'counter-button' class ='counter-button'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    }
  } else if (action === "Steal") {
    if (socket.id === id) {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-other-steal'>Call BS on Steal Attempt</h1> <button id = 'counter-button'class ='counter-button-other-steal'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    } else {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-steal'>Call BS on Steal Attempt</h1> <button id = 'counter-button' class ='counter-button-steal'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    }
    if (
      document.getElementById("counter-captain").innerHTML.includes("Don't")
    ) {
      stealPlayer = socket.id;
    } else {
      stealPlayer = null;
    }
  } else if (action === "Assassinate") {
    if (socket.id === id) {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text-other'>Call BS on Assassin</h1> <button id = 'counter-button'class ='counter-button-other'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    } else {
      document.getElementById("counter").innerHTML =
        "<h1 class = 'counter-text'>Call BS on Assassin</h1> <button id = 'counter-button' class ='counter-button'>BS</button>";
      document
        .getElementById("counter-button")
        .addEventListener("click", counter);
    }
    console.log(document.getElementById("counter-captain").innerHTML);
    console.log(
      document.getElementById("counter-captain").innerHTML.includes("Challenge")
    );
    if (
      document.getElementById("counter-captain").innerHTML.includes("Challenge")
    ) {
      stealPlayer = socket.id;
      console.log(stealPlayer + "((((((((((((((())))))))))))");
    } else {
      stealPlayer = null;
    }
  }
  function counter() {
    //  console.log("countered");
    document
      .getElementById("counter-button")
      .removeEventListener("click", counter);
    document.getElementById("counter").innerHTML = "";
    document.getElementById("counter-captain").innerHTML = "";
    if (action === "Steal" || action === "Assassinate") {
      console.log(stealPlayer + " @@@@@@@@@@@@@@@@@@");
      socket.emit(
        "ForeignAidCounterAttempt",
        socket.id,
        i,
        action,
        stealPlayer
      );
    } else {
      socket.emit("ForeignAidCounterAttempt", socket.id, i, action);
    }
  }
});
socket.on("middleStep", (i, playerNum, id, action, stealPlayer) => {
  console.log(stealPlayer + " ######################");
  if (action === "Steal" || action === "Assassinate") {
    console.log(stealPlayer + " %%%%%%%%%%%%%%%%%%%%%%%%");
    socket.emit(
      "challengeChoice",
      i,
      playerNum,
      "Challenge",
      id,
      action,
      null,
      null,
      stealPlayer
    );
  } else {
    socket.emit("challengeChoice", i, playerNum, "Challenge", id, action);
  }
});
socket.on("messageToAll", (callsBsName, playerName, action) => {
  if (action === "Tax") {
    document.getElementById("counter").innerHTML = "";
    document.getElementById(
      "announcement"
    ).innerHTML = `<h1 class = "announcement-left"> ${callsBsName} Calls BS on ${playerName}'s Duke</h1>`;
  } else if (action === "Exchange") {
    document.getElementById("counter").innerHTML = "";
    document.getElementById(
      "announcement"
    ).innerHTML = `<h1 class = "announcement-left"> ${callsBsName} Calls BS on ${playerName}'s Ambassador</h1>`;
  } else if (action === "Steal") {
    document.getElementById("counter").innerHTML = "";
    document.getElementById(
      "announcement"
    ).innerHTML = `<h1 class = "announcement-left"> ${callsBsName} Calls BS on ${playerName}'s Captain</h1>`;
  } else if (action === "Assassinate") {
    document.getElementById("counter").innerHTML = "";
    document.getElementById(
      "announcement"
    ).innerHTML = `<h1 class = "announcement-left"> ${callsBsName} Calls BS on ${playerName}'s Assassin</h1>`;
  }
});
socket.on(
  "ForeignAidCounterAttemptAll",
  (name, i, playerNum, id, action, firstName, isLying, stealBlockChoice) => {
    // console.log(action + " &&&&&&&&&&&&&");
    // console.log(stealBlockChoice);
    if (action === "Foreign Aid") {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement-more-left"> ${name} Blocks ${firstName}'s Foreign Aid with Duke</h1>`;
    } else if (action === "Steal") {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement-more-left"> ${name} Blocks ${firstName}'s Steal with a ${stealBlockChoice}</h1>`;
    } else if (action === "Assassinate") {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement-more-left-small"> ${name} Blocks ${firstName}'s Assassination with a Contessa</h1>`;
    }
    document.getElementById("counter").innerHTML = "";
    socket.emit(
      "counterBack",
      i,
      playerNum,
      id,
      action,
      isLying,
      stealBlockChoice
    );
  }
);
socket.on("pauseGame", () => {
  document.getElementById("block-click").innerHTML =
    "<h1 class= 'block-click'></h1>";
});
socket.on(
  "challenge",
  (i, playerNum, id, action, isLying, stealBlockChoice) => {
    //console.log(stealBlockChoice + "___________________");
    document.getElementById("challenge").innerHTML =
      "<button id = 'challenge-button' class='challenge'>Challenge</button> <button id ='no-challenge-button'class='no-challenge'>Don't Challenge</button>";
    document
      .getElementById("challenge-button")
      .addEventListener("click", challenge);
    document
      .getElementById("no-challenge-button")
      .addEventListener("click", challenge);
    function challenge(event) {
      // console.log("CHALLENGED");
      const choice = event.target.innerHTML;
      document.getElementById("challenge").innerHTML = "";
      socket.emit(
        "challengeChoice",
        i,
        playerNum,
        choice,
        id,
        action,
        isLying,
        stealBlockChoice
      );
    }
    //Add event listeners.
    // Send response back to server.
    //update players accordingly
    // io.emit what happened to everyone else
    //Check if the game ended or not
  }
);

socket.on(
  "challenge?",
  (name, challenge, challengerName, action, assassinate) => {
    if (!challenge) {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement-left"> ${name} did not challenge ${challengerName}, like a bitch</h1>`;
      if (action === "Assassinate" && assassinate) {
      } else {
        document.getElementById("block-click").innerHTML = "";
      }
    }
    if (challenge) {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement"> ${name} challenges ${challengerName}'s block attempt</h1>`;
    }
  }
);

//IF two cards, create two buttons for which card to give up
//Create event listeners to see which one was chosen
//emit that to the server. Handle the class stuff
// io.emit it back and display the card to everyone
// put a thing over i's card so it looks blurred
socket.on(
  "loseCard",
  (
    numCards,
    cards,
    i,
    numClients,
    playerNum,
    lying,
    id,
    action,
    coins,
    extraI,
    playerNumCards,
    stealBlockChoice,
    stealPlayer
  ) => {
    let numUntilNextPersonIn;
    // console.log(stealBlockChoice + " $$$$$$$$$$$$$$$$$$$$$$$$$$");
    //console.log(action);
    //console.log(numCards + "||||||||||||||||||||||||||||||||||||");
    //console.log(newCardz);
    if (action === "Exchange") {
      socket.emit("discard", newCardz, i);
    }
    document.getElementById("exchange-card").innerHTML = "";
    document.getElementById("exchange-card-pic").innerHTML = "";
    document.getElementById("exchange-card-add-button").innerHTML = "";
    document.getElementById("exchange-card-delete-button").innerHTML = "";
    if (numCards === 1) {
      socket.emit(
        "numUntilNextPersonIn",
        (extraI + 1) % numClients,
        numClients
      );
      socket.on("numUntilNextPersonIn", (NumUntilNextPersonIn) => {
        numUntilNextPersonIn = NumUntilNextPersonIn;
      });
      socket.emit(
        "cardLost",
        cards[0],
        i,
        playerNum,
        lying,
        id,
        action,
        extraI,
        stealBlockChoice,
        numCards,
        stealPlayer
      );

      if (action === "Exchange" && !lying) {
      } else if (lying) {
        socket.emit("clearCounterCaptain");
        socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
      }
      document.getElementById("deal0").className += " lose-card";
      if (document.getElementById("player-cards").innerHTML.includes("deal1")) {
        document.getElementById("deal1").className += " lose-card";
      }
      if (!lying) {
        if (
          action === "Foreign Aid" ||
          action === "Tax" ||
          action === "Steal" ||
          action === "Assassinate"
        ) {
          console.log("STEAL PLAYER ISSSSSS....");
          if (stealPlayer) {
            socket.emit(
              "exchangeCard",
              i,
              playerNum,
              numClients,
              action,
              extraI,
              stealBlockChoice,
              stealPlayer
            );
          } else {
            socket.emit(
              "exchangeCard",
              i,
              playerNum,
              numClients,
              action,
              extraI,
              stealBlockChoice
            );
          }
        }
      }

      socket.emit("removeStealBlockClick", extraI, stealPlayer);
    }
    if (numCards === 2) {
      if (lying) {
        socket.emit("clearCounterCaptain");
      }
      document.getElementById(
        "lose-card"
      ).innerHTML = `<h1 class ="choose-lost-card">Choose a Card to Lose</h1><img id = "left-card"class='left-card' src ='${cards[0]}.jpg' alt ='${cards[0]}'> <img id= "right-card" class='right-card' src = '${cards[1]}.jpg' alt ='${cards[1]}'>`;
      document
        .getElementById("right-card")
        .addEventListener("click", (event) => {
          console.log(event.target.alt + "~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          socket.emit("chosenLostCard", event.target.alt);
          document.getElementById("lose-card").innerHTML = "";
          document.getElementById("deal1").className += " lose-card";
          socket.emit("removeStealBlockClick", extraI, stealPlayer);
          socket.emit(
            "cardLost",
            event.target.alt,
            i,
            playerNum,
            lying,
            id,
            action,
            extraI,
            stealBlockChoice,
            numCards
          );
          //only emit exchange card if lying is false
          if (!lying) {
            if (
              action === "Foreign Aid" ||
              action === "Tax" ||
              action === "Steal" ||
              action === "Assassinate"
            ) {
              if (stealPlayer) {
                socket.emit(
                  "exchangeCard",
                  i,
                  playerNum,
                  numClients,
                  action,
                  extraI,
                  stealBlockChoice,
                  stealPlayer
                );
              } else {
                console.log("IS EXCHANGE CARD WORKING!!!!!!!!!!!!!!!");
                socket.emit(
                  "exchangeCard",
                  i,
                  playerNum,
                  numClients,
                  action,
                  extraI,
                  stealBlockChoice
                );
              }
            }
          }
          //Move this to exchange card if card revealed is true. Otherwise, do it here
          if (action === "Exchange" && !lying) {
          } else if (lying) {
            socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
          }
        });
      document
        .getElementById("left-card")
        .addEventListener("click", (event) => {
          console.log(event.target.alt + "~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          socket.emit("chosenLostCard", event.target.alt);
          document.getElementById("lose-card").innerHTML = "";
          document.getElementById("deal0").className += " lose-card";
          socket.emit("removeStealBlockClick", extraI, stealPlayer);
          socket.emit(
            "cardLost",
            event.target.alt,
            i,
            playerNum,
            lying,
            id,
            action,
            extraI,
            stealBlockChoice,
            numCards
          );
          if (!lying) {
            if (
              action === "Foreign Aid" ||
              action === "Tax" ||
              action === "Steal" ||
              action === "Assassinate"
            ) {
              if (stealPlayer) {
                socket.emit(
                  "exchangeCard",
                  i,
                  playerNum,
                  numClients,
                  action,
                  extraI,
                  stealBlockChoice,
                  stealPlayer
                );
              }
              //console.log("EXCHANGGGEEE CARD");
              else {
                socket.emit(
                  "exchangeCard",
                  i,
                  playerNum,
                  numClients,
                  action,
                  extraI,
                  stealBlockChoice
                );
              }
            }
          }
          //Move this to exchange card if card revealed is true. Otherwise, do it here
          if (action === "Exchange" && !lying) {
          } else if (lying) {
            socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
          }
        });
    }
    socket.emit("i'sUntilOut", (extraI + 1) % numClients, numClients);
    socket.on("I'sUntilOut", (j) => {
      console.log("J ISSSSSS: " + j);
      console.log("I ISSSSSS: " + extraI);
      console.log("NUMUNTILNEXTPERSONIN IS: " + numUntilNextPersonIn);
      console.log(
        playerNum + " " + (extraI + (numUntilNextPersonIn % numClients))
      );
      console.log(numCards + " NUMCARDS ###############");
      console.log(playerNumCards + " PLAYERNUMCARDS ###############");
      let testFired = false;
      if (document.getElementById("income").innerHTML == "") {
        testFired = true;
      }
      console.log("TEST FIRED IS " + testFired + " !!!!!!!!!!!!!");
      console.log(
        playerNum === (numUntilNextPersonIn + extraI) % numClients &&
          numCards === 1 &&
          playerNumCards === 1 &&
          !testFired
      );
      if (
        playerNum === (numUntilNextPersonIn + extraI) % numClients &&
        numCards === 1 &&
        playerNumCards === 1 &&
        !testFired
      ) {
        console.log("TEST IS GETTING CALLED@@@@@@@@@@@@@@@@@@@@@@@");
        socket.emit("test", (extraI + j) % numClients);
        //console.log("IS LYING IS " + lying);
        if (!lying) {
          // console.log("THIS BETTER HAVE ENTERED THE IF STATEMENT");
          // console.log("I + J ISSSSS$$$$$$$$ " + ((extraI + j) % numClients));
          socket.emit("pauseGame", (extraI + j) % numClients);
        }
        document.getElementById("income").innerHTML = "";
        document.getElementById("foreign-aid").innerHTML = "";
        document.getElementById("coup").innerHTML = "";
        document.getElementById("tax").innerHTML = "";
        document.getElementById("assassinate").innerHTML = "";
        document.getElementById("exchange").innerHTML = "";
        document.getElementById("steal").innerHTML = "";
        if (action === "Exchange") {
          socket.emit("pauseGame", (extraI + j) % numClients);
        }
      }
    });
  }
);

socket.on("revealCard", (card, numClients, names, name, number, numCards) => {
  console.log(names + "######################");
  console.log(name + "######################");
  console.log(number + "######################");
  let index = numClients;
  let found = false;
  let offBy = 0;
  let i = number;
  if (i === numClients) {
    i = 0;
  }
  let count = 0;
  while (count < numClients) {
    if (names[i] === name) {
      found = true;
    } else if (!found) {
      ++offBy;
    }
    ++count;
    i = (i + 1) % numClients;
  }
  index = numClients - offBy;
  //console.log(index);
  if (index === 1) {
  } else {
    if (numCards === 2) {
      document.getElementById(`first-card-${index}`).className += " z";
      document.getElementById(`first-card-${index}`).src = `${card}.jpg`;
    } else {
      document.getElementById(`second-card-${index}`).className += " z";
      document.getElementById(`second-card-${index}`).src = `${card}.jpg`;
    }
  }
});
socket.on("announceReveal2", (iName, playerName, card, lying) => {
  if (!lying) {
    document.getElementById(
      "announcement"
    ).innerHTML += `<h1 class = "announcement-2">${iName}'s got a ${card}, bitch!</h1>`;
  } else {
    document.getElementById(
      "announcement"
    ).innerHTML += ` <br> <h1 class = 'announcement-2'>${iName} doesn't have a ${card}!</h1>`;
  }
});
// If no block is clicked, get rid of sit.
// Handle lose card

socket.on("removeCounterBack", () => {
  document.getElementById("counter").innerHTML = "";
});
socket.on("whichCardLost", (card, name, i, numCards) => {
  //console.log(name + " TELL ME THE NAME");
  if (numCards === 0) {
    setTimeout(function () {
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement">${name} gives up a ${card}</h1>`;
    }, 1500);
  } else {
    document.getElementById(
      "announcement"
    ).innerHTML = `<h1 class = "announcement">${name} gives up a ${card}</h1>`;
  }
  if (numCards === 0) {
    setTimeout(function () {
      //  console.log(name + " TELL ME THE NAME!!!!!!!!!!!!");
      document.getElementById(
        "announcement"
      ).innerHTML = `<h1 class = "announcement-right">${name} is out! </h1>`;
      socket.emit("checkGameOver", i);
    }, 3000);
  }
  //console.log(name + " TELL ME THE NAME%%%%%%%%%%%%%");
});
socket.on(
  "revealLostCard",
  (card, numClients, names, name, number, numCards) => {
    console.log(names + "######################");
    console.log(name + "######################");
    console.log(number + "######################");

    let index = numClients;
    let found = false;
    let offBy = 0;
    let i = number;
    if (i === numClients) {
      i = 0;
    }
    let count = 0;
    while (count < numClients) {
      if (names[i] === name) {
        found = true;
      } else if (!found) {
        ++offBy;
      }
      ++count;
      i = (i + 1) % numClients;
    }
    index = numClients - offBy;
    // console.log(index);
    if (index === 1) {
    } else {
      if (numCards === 1) {
        document.getElementById(`first-card-${index}`).className += " z ";
        document.getElementById(`first-card-${index}`).src = `${card}.jpg`;
      } else {
        document.getElementById(`second-card-${index}`).className += " z ";
        document.getElementById(`second-card-${index}`).src = `${card}.jpg`;
      }
    }
  }
);
socket.on("resumeGame", (stealPlayer) => {
  // console.log("H!!!!!!!!!!!!!!");
  document.getElementById("block-click").innerHTML = "";
  if (stealPlayer) {
    document.getElementById("keep-game-paused").innerHTML = "";
  }
});

socket.on(
  "coverCard",
  (card, numClients, names, name, number, numCards, action) => {
    // console.log("I should cover the card now");
    // console.log(numCards + "*******************");
    let index = numClients;
    let found = false;
    let offBy = 0;
    let i = number;
    if (i === numClients) {
      i = 0;
    }
    let count = 0;
    while (count < numClients) {
      if (names[i] === name) {
        found = true;
      } else if (!found) {
        ++offBy;
      }
      ++count;
      i = (i + 1) % numClients;
    }
    index = numClients - offBy;
    // console.log(index);
    if (index === 1) {
    } else {
      if (numCards === 2) {
        document.getElementById(`first-card-${index}`).className += " z ";
        document.getElementById(`first-card-${index}`).src = `card.png`;
      } else {
        document.getElementById(`second-card-${index}`).className += " z ";
        document.getElementById(`second-card-${index}`).src = `card.png`;
      }
    }
  }
);
socket.on(
  "exchangeCard",
  (
    playerNum,
    numClients,
    card,
    cards,
    numCards,
    cardIndex,
    extraI,
    stealPlayer
  ) => {
    //cards + " ^^^^^^^^^^^^^^^^";
    if (stealPlayer) {
      document.getElementById(
        "exchange-card-pic-steal"
      ).innerHTML = `<img class = 'exchange-card-pic-steal' id = "exchange-card-pic-steal-1" src = '${card}.jpg'>`;
      document.getElementById(
        "exchange-card-steal"
      ).innerHTML = `<h1 class ="exchange-card-steal">Would you like to exchange? </h1><button id = "exchange-yes-steal"class='exchange-yes-steal'> Yes </button><button id = "exchange-no-steal"class='exchange-no-steal'> No </button>`;
      document.getElementById("block-click-steal").innerHTML =
        "<h1 class= 'block-click-steal'></h1>";
      socket.emit("keepGamePaused", (extraI + 1) % numClients, numClients);
      //Make separate event listeners and only turn off keepGamePaused if its the one
      document
        .getElementById("exchange-yes-steal")
        .addEventListener("click", () => {
          socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
          socket.emit(
            "exchangePick",
            cards[cardIndex],
            card,
            playerNum,
            numClients,
            numCards,
            cardIndex
          );
          document.getElementById("exchange-card-pic-steal").innerHTML = "";
          document.getElementById("exchange-card-steal").innerHTML = "";
          socket.emit(
            "unPauseKeepGamePaused",
            (extraI + 1) % numClients,
            playerNum,
            stealPlayer
          );
        });
      document
        .getElementById("exchange-no-steal")
        .addEventListener("click", () => {
          socket.emit("discardOneCard", card);
          socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
          socket.emit(
            "unPauseKeepGamePaused",
            (extraI + 1) % numClients,
            playerNum,
            stealPlayer
          );
          document.getElementById("exchange-card-pic-steal").innerHTML = "";
          document.getElementById("exchange-card-steal").innerHTML = "";
        });
    } else {
      document.getElementById(
        "exchange-card-pic"
      ).innerHTML = `<img class = 'exchange-card-pic' src = '${card}.jpg'>`;
      document.getElementById(
        "exchange-card"
      ).innerHTML = `<h1 class ="exchange-card">Would you like to exchange? </h1><button id = "exchange-yes"class='exchange-yes'> Yes </button><button id = "exchange-no"class='exchange-no'> No </button>`;

      document.getElementById("exchange-yes").addEventListener("click", () => {
        socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
        socket.emit(
          "exchangePick",
          cards[cardIndex],
          card,
          playerNum,
          numClients,
          numCards,
          cardIndex
        );
        document.getElementById("exchange-card-pic").innerHTML = "";
        document.getElementById("exchange-card").innerHTML = "";
        document.getElementById("exchange-card-pic-steal").innerHTML = "";
        document.getElementById("exchange-card-steal").innerHTML = "";
        socket.emit("removeStealBlockClick", extraI, stealPlayer);
      });
      document.getElementById("exchange-no").addEventListener("click", () => {
        socket.emit("discardOneCard", card);
        socket.emit("unPauseGame", (extraI + 1) % numClients, playerNum);
        document.getElementById("exchange-card-pic").innerHTML = "";
        document.getElementById("exchange-card").innerHTML = "";
        document.getElementById("exchange-card-pic-steal").innerHTML = "";
        document.getElementById("exchange-card-steal").innerHTML = "";
        socket.emit("removeStealBlockClick", extraI, stealPlayer);
      });
    }
  }
);
socket.on("updateExchangedCards", (cards, numCards, cardIndex, numClients) => {
  if (numCards === 1) {
    if (document.getElementById("deal0").className != `deal1 lose-card`) {
      document.getElementById("deal0").src = `${cards[0]}.jpg`;
    } else {
      document.getElementById("deal1").src = `${cards[0]}.jpg`;
    }
  } else {
    if (cardIndex === 0)
      // console.log(cards);
      document.getElementById("deal0").src = `${cards[0]}.jpg`;
    else {
      document.getElementById("deal1").src = `${cards[1]}.jpg`;
    }
  }
});
//Need to do a loop based on the number of newCards and cards
socket.on(
  "exchange",
  (
    i,
    newCards,
    cards,
    numCards,
    numClients,
    processStarted = false,
    addOrDelete,
    firstNumCards
  ) => {
    console.log("THE PROCESS STARTED IS " + processStarted);
    // console.log("EXCHANGEEEEEEEEEEEEEEEEE");
    socket.emit("newCards", newCards);
    socket.emit("stealPauseGame", (i + 1) % numClients, numClients);
    let initialCardNumber;
    //If processStarted--- do the same thing as before, but loop through mini cards
    // Show the done button if numCards === realNumCards
    //Only emit to exchangeClick if done is not clicked
    const deleteButton = document.getElementById("exchange-card-delete-button");
    const addButton = document.getElementById("exchange-card-add-button");
    if (processStarted) {
      const exchange = document.getElementById("exchange-card-pic");
      // console.log(newCards);
      // console.log(cards);
      exchange.innerHTML = "";
      addButton.innerHTML = "";
      for (let i = 0; i < newCards.length; i++) {
        // console.log(newCards[i]);
        exchange.innerHTML += `<img class = 'exchange-card-pic-${i} z' src = '${newCards[i]}.jpg'>`;
        addButton.innerHTML += `<button class ='add-button-${i} z' id = 'add-card-${i}'> Add ${newCards[i]} to hand </button>`;
      }
      const player = document.getElementById("player-cards");
      player.innerHTML = "";
      deleteButton.innerHTML = "";
      for (let i = 0; i < cards.length; i++) {
        const exchange = document.getElementById("exchange-card-pic");
        deleteButton.innerHTML += `<button class ='delete-button-${i} z' id = 'delete-card-${i}'> Delete ${cards[i]} from hand </button>`;
        player.innerHTML += `<img id = "deal${i}" class = "deal${i}" src ="${cards[i]}.jpg">`;
      }
      console.log("THE FIRSTNUMCARDS IS " + firstNumCards);
      if (cards.length === firstNumCards) {
        document.getElementById(
          "exchange-card"
        ).innerHTML += `<button class ='done' id = 'done'> Done </button>`;
        document.getElementById("done").addEventListener("click", done);
      }
      if (cards.length != firstNumCards) {
        document.getElementById("exchange-card").innerHTML = "";
      }
      if (newCards.length === 0) {
      } else if (newCards.length === 1) {
        document
          .getElementById("add-card-0")
          .addEventListener("click", ambassador);
      } else if (newCards.length === 2) {
        document
          .getElementById("add-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-1")
          .addEventListener("click", ambassador);
      } else if (newCards.length === 3) {
        document
          .getElementById("add-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-1")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-2")
          .addEventListener("click", ambassador);
      } else if (newCards.length === 4) {
        document
          .getElementById("add-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-1")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-2")
          .addEventListener("click", ambassador);
        document
          .getElementById("add-card-3")
          .addEventListener("click", ambassador);
      }
      if (cards.length === 0) {
      } else if (cards.length === 1) {
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
      } else if (cards.length === 2) {
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-1")
          .addEventListener("click", ambassador);
      } else if (cards.length === 3) {
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-1")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-2")
          .addEventListener("click", ambassador);
      } else if (cards.length === 4) {
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-1")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-2")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-3")
          .addEventListener("click", ambassador);
      }
    }
    if (!processStarted) {
      initialCardNumber = numCards;
      console.log("NUMCARDS IS " + numCards + " !!!!!!!!!!!!!!");
      console.log(
        "INITIALCARDNUBMERIS IS " + initialCardNumber + " !!!!!!!!!!!!!!"
      );
      document.getElementById(
        "exchange-card"
      ).innerHTML += `<button class ='done' id = 'done'> Done </button>`;
      document.getElementById("done").addEventListener("click", done);

      const exchange = document.getElementById("exchange-card-pic");
      const deleteButton = document.getElementById(
        "exchange-card-delete-button"
      );
      const addButton = document.getElementById("exchange-card-add-button");
      exchange.innerHTML = `<img class = 'exchange-card-pic-0' src = ${newCards[0]}.jpg> <img class = 'exchange-card-pic-1' src = ${newCards[1]}.jpg>`;
      addButton.innerHTML += `<button class ='add-button-0' id = 'add-card-0'> Add ${newCards[0]} to hand </button> <button class ='add-button-1' id = 'add-card-1'> Add ${newCards[1]} to hand </button>`;
      if (numCards == 2) {
        deleteButton.innerHTML += `<button class ='delete-button-0' id = 'delete-card-0'> Delete ${cards[0]} from hand </button> <button class ='delete-button-1' id = 'delete-card-1'> Delete ${cards[1]} from hand </button>`;
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
        document
          .getElementById("delete-card-1")
          .addEventListener("click", ambassador);
      } else {
        deleteButton.innerHTML += `<button class ='delete-button-0' id = 'delete-card-0'> Delete ${cards[0]} from hand </button>`;
        document
          .getElementById("delete-card-0")
          .addEventListener("click", ambassador);
      }
      document
        .getElementById("add-card-0")
        .addEventListener("click", ambassador);
      document
        .getElementById("add-card-1")
        .addEventListener("click", ambassador);
      //emit: pass id (to know add or delete) and the card, to know which to delete. Also pass process started
      //emit back "exchange". if processStarted is true, update the dom and repeat process until done is clicked
    }
    function done() {
      //get the cards of newCards and put them to bottom of deck
      //if someone clicks bs, make everythign go away and still put cards at bottom
      document.getElementById("exchange-card-pic").innerHTML = "";
      document.getElementById("exchange-card-add-button").innerHTML = "";
      document.getElementById("exchange-card-delete-button").innerHTML = "";
      document.getElementById("exchange-card").innerHTML = "";
      socket.emit("unPauseGame", (i + 1) % numClients);
      socket.emit("discard", newCards, i);
      socket.emit("counterOff");
    }
    function ambassador(event) {
      processStarted = true;
      let addOrDelete;
      let whichCard;
      if (event.target.innerHTML.includes("Add")) {
        addOrDelete = "add";
      } else {
        addOrDelete = "delete";
      }
      for (let j = 0; j <= 3; ++j) {
        if (event.target.id.includes(`${j}`)) {
          whichCard = j;
        }
      }
      //  console.log(addOrDelete);
      // console.log(whichCard);
      if (firstNumCards != null) {
        socket.emit(
          "exchangeClick",
          processStarted,
          addOrDelete,
          whichCard,
          numCards,
          i,
          newCards,
          cards,
          firstNumCards,
          numClients
        );
      } else {
        socket.emit(
          "exchangeClick",
          processStarted,
          addOrDelete,
          whichCard,
          numCards,
          i,
          newCards,
          cards,
          initialCardNumber,
          numClients
        );
      }
      socket.emit("counterOff");
      socket.emit("stealPauseGame", (i + 1) % numClients, numClients);
    }
    //Display the cards
    //Have a button called "add ${card} to hand"
    //And "delete {card} from hand"
    //Keep switching the cards until the user presses done
    // Done should only light up if the # of cards in hand equals numCards
    // get rid of counter once a card switch is made/
    //Add event listeners to all buttons, change processStarted to true,
    //if processStarted is true, show done button if numCards is the same as started
  }
);
socket.on("counterOff", () => {
  document.getElementById("counter").innerHTML = "";
});
socket.on(
  "displayPlayerNames",
  (action, numClients, names, i, numClientsNotOut) => {
    console.log("ACTION IS...... " + action);
    console.log("NAMES IS...... " + names);
    console.log("I IS...... " + i);
    console.log("NUMCLIENTSNOTOUT IS...... " + numClientsNotOut);
    // console.log(numClientsNotOut + " ^^^^^^^^^^^^");
    if (action === "Coup") {
      socket.emit("stealPauseGame", (i + 1) % numClients, numClients);
      document.getElementById(
        "display-names"
      ).innerHTML += `<h1 class = 'display-coup' id = 'display-coup'>Who do you want to Coup?</h1>`;
    } else if (action === "Steal") {
      socket.emit("stealPauseGame", (i + 1) % numClients, numClients);
      document.getElementById(
        "display-names"
      ).innerHTML += `<h1 class = 'display-coup-steal' id = 'display-coup'>From whom would you like to Steal?</h1>`;
    } else if (action === "Assassinate") {
      socket.emit("stealPauseGame", (i + 1) % numClients, numClients);
      document.getElementById(
        "display-names"
      ).innerHTML += `<h1 class = 'display-coup' id = 'display-coup'>Who would you like to Assassinate?</h1>`;
    }
    for (let i = 0; i < names.length; ++i) {
      document.getElementById(
        "display-names"
      ).innerHTML += `<button class ='display-name-${i}' id = 'display-name-${i}'>${names[i]}</button>`;
    }
    console.log("NUMCLEINTSNOTOUT IS: " + numClientsNotOut);
    if (numClientsNotOut === 1) {
      console.log("THERE IS 1 PERSON TO DISPLAY!!!!!!!!!!!!!!!!!!!!!!");
      document.getElementById(`display-name-0`).addEventListener("click", coup);
    } else if (numClientsNotOut === 2) {
      console.log("THERE ARE 2 PEOPLE TO DISPLAY!!!!!!!!!!!!!!!!!!!!!!");
      document.getElementById(`display-name-0`).addEventListener("click", coup);
      document.getElementById(`display-name-1`).addEventListener("click", coup);
    } else if (numClientsNotOut === 3) {
      console.log("THERE ARE 3 PEOPLE TO DISPLAY!!!!!!!!!!!!!!!!!!!!!!");

      document.getElementById(`display-name-0`).addEventListener("click", coup);
      document.getElementById(`display-name-1`).addEventListener("click", coup);
      document.getElementById(`display-name-2`).addEventListener("click", coup);
    } else if (numClientsNotOut === 4) {
      console.log("THERE ARE 4 PEOPLE TO DISPLAY!!!!!!!!!!!!!!!!!!!!!!");

      document.getElementById(`display-name-0`).addEventListener("click", coup);
      document.getElementById(`display-name-1`).addEventListener("click", coup);
      document.getElementById(`display-name-2`).addEventListener("click", coup);
      document.getElementById(`display-name-3`).addEventListener("click", coup);
    } else if (numClientsNotOut === 5) {
      document.getElementById(`display-name-0`).addEventListener("click", coup);
      document.getElementById(`display-name-1`).addEventListener("click", coup);
      document.getElementById(`display-name-2`).addEventListener("click", coup);
      document.getElementById(`display-name-3`).addEventListener("click", coup);
      document.getElementById(`display-name-4`).addEventListener("click", coup);
    }

    function coup(event) {
      console.log("COUP EVENT LISTENER WAS ENTERED!!!!!!!!!!!!!!!!!!!!!!");

      let nameChosen = event.target.innerHTML;
      document.getElementById("display-names").innerHTML = "";
      if (action === "Steal") {
        socket.emit("steal", nameChosen, action, i, numClients);
        socket.emit("goToBlockWithDuke", numClients, i, action);
      } else if (action === "Coup") {
        socket.emit("coup", nameChosen, action, i, numClients);
      } else if (action === "Assassinate") {
        socket.emit("assassinate", nameChosen, action, i, numClients);
        socket.emit("goToBlockWithDuke", numClients, i, action);
      }
    }
  }
);
socket.on(
  "loseCardCoup",
  (numCards, cards, playerNum, numClients, action, i) => {
    if (numCards === 1) {
      socket.emit(
        "cardLostCoup",
        cards[0],
        playerNum,
        action,
        numClients,
        numCards
      );
      socket.emit("unPauseGame", (i + 1) % numClients);
      document.getElementById("deal0").className += " lose-card";
      document.getElementById("deal1").className += " lose-card";
    }
    if (numCards === 2) {
      document.getElementById(
        "lose-card"
      ).innerHTML = `<h1 class ="choose-lost-card">Choose a Card to Lose</h1><img id = "left-card"class='left-card' src ='${cards[0]}.jpg' alt ='${cards[0]}'> <img id= "right-card" class='right-card' src = '${cards[1]}.jpg' alt ='${cards[1]}'>`;
      document
        .getElementById("right-card")
        .addEventListener("click", (event) => {
          console.log(event.target.alt + "~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          socket.emit("chosenLostCard", event.target.alt);
          document.getElementById("lose-card").innerHTML = "";
          document.getElementById("deal1").className += " lose-card";
          socket.emit(
            "cardLostCoup",
            event.target.alt,
            playerNum,
            action,
            numClients,
            numCards
          );

          socket.emit("unPauseGame", (i + 1) % numClients);
        });
      document
        .getElementById("left-card")
        .addEventListener("click", (event) => {
          console.log(event.target.alt + "~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          socket.emit("chosenLostCard", event.target.alt);
          document.getElementById("lose-card").innerHTML = "";
          document.getElementById("deal0").className += " lose-card";
          socket.emit(
            "cardLostCoup",
            event.target.alt,
            playerNum,
            action,
            numClients,
            numCards
          );

          socket.emit("unPauseGame", (i + 1) % numClients);
        });
    }

    //console.log(playerNum + " " + (i + 1));
    if (playerNum === (i + 1) % numClients && numCards === 1) {
      console.log("TEST IS GETTING CALLED####################");
      socket.emit("test", (i + 1) % numClients);
      document.getElementById("income").innerHTML = "";
      document.getElementById("foreign-aid").innerHTML = "";
      document.getElementById("coup").innerHTML = "";
      document.getElementById("tax").innerHTML = "";
      document.getElementById("assassinate").innerHTML = "";
      document.getElementById("exchange").innerHTML = "";
      document.getElementById("steal").innerHTML = "";
    }
  }
);
socket.on("coupAnnouncement", (name, otherName, action) => {
  const announcement = document.getElementById("announcement");
  if (action === "Coup") {
    announcement.innerHTML = `<h1 class = "announcement"> ${name} Coups ${otherName}!</h1>`;
  } else if (action === "Steal") {
    announcement.innerHTML = `<h1 class = "announcement"> ${name} Steals two coins from ${otherName}!</h1>`;
  } else if (action === "Assassinate") {
    announcement.innerHTML = `<h1 class = "announcement"> ${name} Assassinates ${otherName}!</h1>`;
  } else if (action === "Exchange") {
    announcement.innerHTML = `<h1 class = "announcement-left"> ${name} Exchanges  with Ambassador! </h1>`;
  }
});
//Button for Block With Ambassador
// Button for Block with Captain
// Button for Don't Challenge
//Emit what happened back to the server along with lying
socket.on("steal", (name, action, i, numClients) => {
  const counter = document.getElementById("counter-captain");
  counter.innerHTML += `<button class = "steal-counter-ambassador" id = "steal-counter-ambassador"> Block with Ambassador</h1>`;
  counter.innerHTML += `<button class = "steal-counter-captain" id = "steal-counter-captain"> Block with Captain</h1>`;
  counter.innerHTML += `<button class = "steal-no-challenge" id = "steal-no-challenge"> Don't Challenge</h1>`;
  document
    .getElementById("steal-counter-ambassador")
    .addEventListener("click", steal);
  document
    .getElementById("steal-counter-captain")
    .addEventListener("click", steal);
  document
    .getElementById("steal-no-challenge")
    .addEventListener("click", steal);

  function steal(event) {
    let counterChoice = "";
    if (event.target.innerHTML.includes("Ambassador")) {
      counterChoice = "ambassador";
    } else if (event.target.innerHTML.includes("Captain")) {
      counterChoice = "captain";
    } else {
      counterChoice = "no";
      socket.emit("removeStealBlockClick", i);
    }
    //console.log(counterChoice);
    socket.emit("stealAction", name, action, i, numClients, counterChoice);
    counter.innerHTML = "";
    socket.emit("counterOff");
  }
});
socket.on("assassinate", (name, action, i, numClients) => {
  const counter = document.getElementById("counter-captain");
  counter.innerHTML += `<button class = "assassinate-counter-contessa" id = "assassinate-counter-contessa"> Block with Contessa</h1>`;
  counter.innerHTML += `<button class = "assassinate-no-challenge" id = "assassinate-no-challenge">Don't Challenge</h1>`;
  document
    .getElementById("assassinate-counter-contessa")
    .addEventListener("click", assassinate);
  document
    .getElementById("assassinate-no-challenge")
    .addEventListener("click", assassinate);

  function assassinate(event) {
    let counterChoice = "";
    if (event.target.innerHTML.includes("Contessa")) {
      counterChoice = "contessa";
    } else {
      counterChoice = "no";
      socket.emit("removeStealBlockClick", i);
    }
    // console.log(counterChoice);
    socket.emit(
      "assassinateAction",
      name,
      action,
      i,
      numClients,
      counterChoice
    );
    counter.innerHTML = "";
    socket.emit("counterOff");
  }
});
socket.on("loseCardAssassin", (card, playerNum, action, numClients) => {
  document.getElementById("deal1").className += " lose-card";
  socket.emit("cardLostCoup", card, playerNum, action, numClients, numCards);
});
socket.on("newCards", (newCards) => {
  newCardz = newCards;
});
socket.on("clearCounterCaptain", () => {
  document.getElementById("counter-captain").innerHTML = "";
});
socket.on("keepGamePaused", () => {
  document.getElementById("keep-game-paused").innerHTML =
    "<h1 class= 'block-click'></h1>";
});
socket.on("removeStealBlockClick", () => {
  document.getElementById("block-click-steal").innerHTML = "";
});
socket.on("deleteStealPlayer", () => {
  if (document.getElementById("exchange-card-steal").innerHTML != "") {
    document.getElementById("exchange-card-steal").innerHTML = "";
    let card;
    let pic = document.getElementById("exchange-card-pic-steal-1").src;
    if (pic.includes("duke")) {
      card = "duke";
    } else if (pic.includes("captain")) {
      card = "captain";
    } else if (pic.includes("contessa")) {
      card = "contessa";
    } else if (pic.includes("assassin")) {
      card = "assassin";
    } else if (pic.includes("ambassador")) {
      card = "ambassador";
    }
    console.log("THIS IS THE CARD " + card);
    socket.emit("discardOneCard", card);
    document.getElementById("exchange-card-pic-steal").innerHTML = "";
  }
  document.getElementById("keep-game-paused").innerHTML = "";
});
//socket.on(gameOver)
// Maybe do a eventTimeout on the server side
socket.on("gameOver", (name) => {
  console.log("THE GAME IS OVER &&&&&&&&&&&&&&&&&&");
  document.getElementById(
    "announcement"
  ).innerHTML = `<h1 class = "announcement"> ${name} Wins! The rest of you suck</h1>`;
  document.getElementById(
    "restart-game"
  ).innerHTML = `<button class = "restart-game" id = "restart-game-button"> New Game</h1>`;
  document
    .getElementById("restart-game-button")
    .addEventListener("click", restart);
  function restart() {
    console.log(socket.id);
    socket.emit("restartGame", socket.id);
  }
});
socket.on("clearGame", (numClients, id) => {
  document.getElementById("counter-captain").innerHTML = "";
  document.getElementById("counter").innerHTML = "";
  document.getElementById("lose-card").innerHTML = "";
  document.getElementById("exchange-card").innerHTML = "";
  document.getElementById("exchange-card-steal").innerHTML = "";
  document.getElementById("exchange-card-delete-button").innerHTML = "";
  document.getElementById("exchange-card-add-button").innerHTML = "";
  document.getElementById("exchange-card-pic").innerHTML = "";
  document.getElementById("exchange-card-pic-steal").innerHTML = "";
  document.getElementById("challenge").innerHTML = "";
  document.getElementById("announcement").innerHTML = "";
  document.getElementById("keep-game-paused").innerHTML = "";
  document.getElementById("block-click-steal").innerHTML = "";
  document.getElementById("block-click").innerHTML = "";
  document.getElementById("display-names").innerHTML = "";
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("player").className = `zero-players`;
  document.getElementById("player-coins").innerHTML = "";
  document.getElementById("start-game").innerHTML = "";
  document.getElementById("restart-game").innerHTML = "";
  document.getElementById("income").innerHTML = "";
  document.getElementById("foreign-aid").innerHTML = "";
  document.getElementById("coup").innerHTML = "";
  document.getElementById("tax").innerHTML = "";
  document.getElementById("assassinate").innerHTML = "";
  document.getElementById("exchange").innerHTML = "";
  document.getElementById("steal").innerHTML = "";
  for (let i = 1; i <= numClients; ++i) {
    document.getElementById(`player-${i}`).className = `player-${i}`;
  }
  if (socket.id == id) {
    socket.emit("callNewGame", numClients, id);
  }
});
socket.on("sendPlayers", (players, newUsernames, usernames, socketId, game) => {
  console.log(players);
  console.log(newUsernames);
  console.log(usernames);
  console.log(socketId);
  console.log(game);
});

socket.on("newGame", (numClients, id) => {
  if (numClients === 1) {
    num = "one";
  }
  if (numClients === 2) {
    num = "two";
  } else if (numClients === 3) {
    num = "three";
  } else if (numClients === 4) {
    num = "four";
  } else if (numClients === 5) {
    num = "five";
  } else if (numClients === 6) {
    num = "six";
  } else if (numClients === 7) {
    num = "seven";
  }

  document.getElementById("start-game").innerHTML = "";

  if (socket.id === id) {
    socket.emit("startNewGame", id);
  }
  socket.emit("addNewCards");

  document.getElementById("player").className = `${num}-players`;
  //When the # of clients is 2 or greater, display the start game button

  socket.on("addNewStartingCards", (clientNumber) => {
    // add the starting face down cards as well as the starting number of coins
    document.getElementById("start-game").className = `cards-${clientNumber}`;
    // console.log("schtuff");
    for (let i = 2; i <= clientNumber; ++i) {
      document.getElementById(
        "start-game"
      ).innerHTML += `<img src ="./card.png" id = "first-card-${i}"class = "card-1-${i}"> <img src ="./card.png" id = "second-card-${i}"class = "card-2-${i}">`;
    }
  });
  socket.on("addNewStartingCoins", (clientNumber) => {
    document.getElementById("player-coins").className = `coins-${clientNumber}`;
    //console.log("The number of clients is " + clientNumber);
    for (let i = 1; i <= clientNumber; ++i) {
      let two = 2;
      document.getElementById(
        "player-coins"
      ).innerHTML += `<h1 class="coin-${i}">Coins:</h1> <h1 id = "coins-${i}"class ="coin-num-${i}">2</h1>`;
    }
  });
});
