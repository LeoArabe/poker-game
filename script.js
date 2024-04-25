const cardImg = document.getElementById('card-img');
const tableSection = document.getElementById('table-section');
const actionButton = document.getElementById('get-card-button');
const board = document.getElementById('board-section');

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Deck {
    constructor() {
        this.deck = [];
    }

    deckCreator() {

        let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const hearts = '♥'
        const diamonds = '♦'
        const spades = '♣'
        const clubs = '♠'
        let suits = [hearts, spades, diamonds, clubs];


        for (let suit of suits) {
            for (let rank of ranks) {
                this.deck.push(new Card(rank, suit));
            }
        }
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    shuffledDeck() {
        this.deckCreator();
        this.shuffle();
    }

    getCard() {
        return this.deck.pop();
    }

    getFlop() {
        return [this.getCard(), this.getCard(), this.getCard()];
    }
}

class Player {
    constructor(id, name, cash) {
        this.id = id;
        this.name = name;
        this.cash = cash;
    }
}

class Playing extends Player {
    constructor(id, name, cash, myStack) {
        super(id, name, cash)
        this.bettingPosition = 0;
        this.myStack = myStack;
        this.currentHand = [];
        this.playerUI = this.initPlayerUI(id);
    }

    initPlayerUI(playerId) {
        const playerFigure = document.createElement('figure');
        playerFigure.id = `${this.id}`;
        tableSection.appendChild(playerFigure);
        return playerFigure;
    }

    updatePlayerUI() {
        this.playerUI.innerText = `${this.name}: Cartas (mão): ${this.currentHand.map(card => `${card.rank}${card.suit}`).join(' | ')}`;
    }

}

class Room {
    constructor(id) {
        this.roomId = id;
        this.roomPlayers = [];
        this.board = [];
        this.dealer = new Dealer(this);
    }

    addPlayers(player) {
        this.roomPlayers.push(players[player.name]);
        console.log(players[player.name]);
        players[player.name].updatePlayerUI();  // Asumindo que isto é definido em algum lugar.
    }

    dealingACard() {
        this.dealer.dealingACard();
    }

    showFlop() {
        this.dealer.showFlop();
    }

    showTurn() {
        this.dealer.showTurn();
    }

    showRiver() {
        this.dealer.showRiver();
    }
}

class Dealer {
    constructor(room) {
        this.room = room;
        this.deck = new Deck();
        this.deck.shuffledDeck();
    }

    dealingACard() {
        //descarte
        this.deck.getCard();

        let players = this.room.roomPlayers;
        //distribuição
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < players.length; j++) {
                players[j].currentHand.push(this.deck.getCard());
                players[j].updatePlayerUI();
            }
        }

    }

    showFlop() {
        //descarte
        this.deck.getCard();

        const flop = this.deck.getFlop();

        console.log(flop);
    }

    showTurn() {
        //descarte
        this.deck.getCard();

        const turn = this.deck.getCard();
        console.log(turn);

    }

    showRiver() {
        //descarte
        this.deck.getCard();

        const river = this.deck.getCard();
        console.log(river);
    }

}

const getRandomNumber = () => {
    const max = 1000;
    return Math.floor(Math.random() * max).toString().padStart(4, '0');
}

const rooms = {};
const players = {};

const playerData = [
    { name: 'pedro', cash: 1000, stack: 500 },
    { name: 'leandro', cash: 2000, stack: 500 },
    { name: 'jose', cash: 1500, stack: 500 },
    { name: 'andré', cash: 500, stack: 500 },
    { name: 'paulo', cash: 3000, stack: 500 },
    { name: 'carlos', cash: 2500, stack: 500 },
];

playerData.forEach(player => {
    const randomNumber = getRandomNumber();
    players[player.name] = new Playing(randomNumber, player.name, player.cash, player.stack);

})

const newRoom = () => {
    const randomNumber = getRandomNumber();
    const roomId = `room${randomNumber}`;
    rooms[roomId] = new Room(`room${roomId}`);
    return roomId;
}

let numPlayersRoom = 0;
let room = newRoom();


let turn = 0;
actionButton.onclick = () => {

    switch (turn) {
        case 0:
            while (numPlayersRoom < playerData.length && numPlayersRoom < 3) {
                rooms[room].addPlayers(playerData[numPlayersRoom]);
                numPlayersRoom++
            }
            console.log(rooms);
            break;
        case 1:
            rooms[room].dealingACard();
            break;
        case 2:
            rooms[room].showFlop();
            break;
        case 3:
            rooms[room].showTurn();
            break;
        case 4:
            rooms[room].showRiver();
            break;
    }

    turn++
}