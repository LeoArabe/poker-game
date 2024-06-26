const cardImg = document.getElementById('card-img');
const tableSection = document.getElementById('table-section');
const actionButton = document.getElementById('get-card-button');
const boardUI = document.getElementById('board-section');
const highHandUI = document.getElementById('high-hand');

class Card {
    constructor(rank, suit, weight) {
        this.rank = rank;
        this.suit = suit;
        this.weight = weight;
    }
}

class Deck {
    constructor() {
        this.deck = [];
    }

    deckCreator() {

        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const hearts = '♥'
        const diamonds = '♦'
        const spades = '♣'
        const clubs = '♠'
        const suits = [hearts, spades, diamonds, clubs];


        for (let suit of suits) {
            ranks.forEach((rank, index) => {
                this.deck.push(new Card(rank, suit, index));
            }
            )
        };
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
        this.weightHand = 0; //0:highCard 1:onePair 2:twoPair 3:threeOfaKing 4:straight 5:flush 6:fullHouse 7:fouraKing 8:straightFlush 9:royalFlush
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
        this.gameManagement = new GameManagement(this, this.dealer);
        this.betManager = new BetManager();
        this.ruleManager = new RuleManager(this, this.roomPlayers, this.board);
        this.winnerManager = new WinnerManager();
        this.playerManager = new PlayerManager();
        this.eventManager = new EventManager();
    }

    addPlayers(player) {
        this.roomPlayers.push(players[player.name]);
        players[player.name].updatePlayerUI();  // Asumindo que isto é definido em algum lugar.
    }

    updateBoardUI() {
        boardUI.innerText = `${this.board.map(card => `${card.rank}${card.suit}`).join(' | ')}`;
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

    straight() {
        this.ruleManager.flush();
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
            for (let player of players) {
                player.currentHand.push(this.deck.getCard());
                player.updatePlayerUI();
            }
        }
    }

    showFlop() {
        //descarte
        this.deck.getCard();

        const flop = this.deck.getFlop();
        flop.forEach(card => { this.room.board.push(card) });
        this.room.updateBoardUI();
        for (const player of this.room.roomPlayers) {
            flop.forEach(card => { player.currentHand.push(card) });
        }
    }

    showTurn() {
        //descarte
        this.deck.getCard();

        const turn = this.deck.getCard();
        this.room.board.push(turn);
        this.room.updateBoardUI();
        for (const player of this.room.roomPlayers) {
            player.currentHand.push(turn);
        }


    }

    showRiver() {
        //descarte
        this.deck.getCard();

        const river = this.deck.getCard();
        this.room.board.push(river);
        this.room.updateBoardUI();
        for (const player of this.room.roomPlayers) {
            player.currentHand.push(river);
        }
    }



}

class GameManagement {
    constructor(room, dealer) {
        this.room = room;
        this.dealer = dealer;
    }
}

class BetManager {
    initializeBettingRound(players) {
        // Setup betting for the round
    }

    processBettingRound(players) {
        // Process bets
    }

    distributePot(winner) {
        // Handle pot distribution
    }
}

class RuleManager {
    constructor(room, players, board) {
        this.room = room;
        this.players = players;
        this.board = board;
        this.bestHands = {};

    }

    flush() {
        let playeros = [
            { name: 'pedro', currentHand: [{ weight: '♦', }, { weight: '♦', }, { weight: '♥', }, { weight: '♦', }, { weight: '♥', }, { weight: '♦', }, { weight: '♦', }] },
            { name: 'leandro', currentHand: [{ weight: '♥', }, { weight: '♥', }, { weight: '♠', }, { weight: '♠', }, { weight: '♣', }, { weight: '♣', }, { weight: '♠', }] },
            { name: 'jose', currentHand: [{ weight: '♥', }, { weight: '♣', }, { weight: '♣', }, { weight: '♠', }, { weight: '♠', }, { weight: '♠', }, { weight: '♠', }] },
            { name: 'paulo', currentHand: [{ weight: '♥', }, { weight: '♠', }, { weight: '♠', }, { weight: '♣', }, { weight: '♠', }, { weight: '♣', }, { weight: '♠', }] },
        ];

        let hand = [];

        playeros.forEach(player => {
            const suits = [];
            player.currentHand.forEach(handSuit => {
                let i = suits.findIndex(suit => suit.naipe === handSuit.weight);
                if (i >= 0) {
                    suits[i].quantie += 1;
                } else {
                    suits.push({ naipe: handSuit.weight, quantie: 1 });
                }
            })
            hand.push({ player: player.name, hand: suits })
        });

        
        console.log(hand)
    }

    straight() {
        const p = { playerName: 'jose', currentHand: [{ weight: 1, }, { weight: 1, }, { weight: 1, }, { weight: 1, }, { weight: 1, }, { weight: 1, }, { weight: 1, }], }
        let playeros = [
            { name: 'pedro', currentHand: [{ weight: 1, }, { weight: 1, }, { weight: 2, }, { weight: 3, }, { weight: 4, }, { weight: 5, }, { weight: 1, }] },
            { name: 'leandro', currentHand: [{ weight: 1, }, { weight: 2, }, { weight: 3, }, { weight: 4, }, { weight: 5, }, { weight: 1, }, { weight: 1, }] },
            { name: 'jose', currentHand: [{ weight: 7, }, { weight: 10, }, { weight: 1, }, { weight: 2, }, { weight: 3, }, { weight: 4, }, { weight: 5, }] },
            { name: 'paulo', currentHand: [{ weight: 3, }, { weight: 2, }, { weight: 5, }, { weight: 1, }, { weight: 2, }, { weight: 3, }, { weight: 4, }] },
        ];
        let flushHand = [{ highCard: '', weight: 5 }]
        let straight = [{ highCard: '', weight: 4 }]
        let moreThanOne = [
            { highPairRank: '', weight: 1 }, { highTwoPairRank: '', weight: 2 }, { highThreeRank: '', weight: 3 },
            { highFullHouseRank: '', weight: 6 }, { highFourRank: '', weight: 7 },
        ];

        let hand = [];

        for (const player of playeros) {
            player.currentHand.sort((a, b) => a.weight - b.weight);
            console.log(player)
            let i = 6;
            const test = (i) => {

                if (i > 3 && player.currentHand[i].weight === player.currentHand[i - 1].weight + 1) {
                    if (player.currentHand[i - 1].weight === player.currentHand[i - 2].weight + 1) {
                        if (player.currentHand[i - 2].weight === player.currentHand[i - 3].weight + 1) {
                            if (player.currentHand[i - 3].weight === player.currentHand[i - 4].weight + 1) {
                                console.log(`${player.name} tem sequência`)
                                hand.push = { name: player.name, playerHand: 'straight' };
                            }
                        }
                    } else {
                        i -= 2;
                        test(i);
                    }
                } else {
                    i--
                    test(i);
                }
            };
            test(i)
            console.log(hand)
        }
    }

    bestHand() {
        let flushHand = [{ highCard: '', weight: 5 }]
        let straight = [{ highCard: '', weight: 4 }]
        let moreThanOne = [
            { highPairRank: '', weight: 1 }, { highTwoPairRank: '', weight: 2 }, { highThreeRank: '', weight: 3 },
            { highFullHouseRank: '', weight: 6 }, { highFourRank: '', weight: 7 },
        ];

        let hand = [];

        for (const player of this.players) {
            player.currentHand.sort((a, b) => a.weight - b.weight);
            console.log(player)
            let i = 6;

            const test = (i) => {

                if (i > 0 && player.currentHand[i].rank === player.currentHand[i - 1].rank) {
                    if (i > 1 && player.currentHand[i - 1].rank === player.currentHand[i - 2].rank) {
                        if (i > 2 && player.currentHand[i - 2].rank === player.currentHand[i - 3].rank) {
                            console.log(`${player.name} tem quadra`)
                            hand.push = { name: player.name, four: `${player.currentHand[i].rank}` };
                            i = i - 2;
                        } else {
                            console.log(`${player.name} tem trinca`)
                            hand.push({ name: player.name, three: `${player.currentHand[i].rank}` });
                            i--
                        }
                    } else {
                        console.log(`${player.name} tem par`)
                        hand.push({ name: player.name, pair: `${player.currentHand[i].rank}` });
                    }
                    i--
                    test(i)
                } else if (i > 0) {
                    i--
                    test(i)
                }
            }
            test(i);
        };
        console.log(hand)
    }

    highHand() {
        let highRankPlayer = [{ weight: 0 }, { weight: 0 }, { weight: 0 }, { weight: 0 }, { weight: 0 }, { weight: 0 }, { weight: 0 }];
        let bestHandPlayer = '';

        for (const player of this.players) {
            console.log(player)
            let i = 6;
            player.currentHand.sort((a, b) => a.weight - b.weight);

            const test = (i) => {
                if (player.currentHand[i].weight > highRankPlayer[i].weight) {
                    highRankPlayer = player.currentHand;
                    console.log(highRankPlayer)
                    bestHandPlayer = player.name;

                } else if (player.currentHand[i].weight == highRankPlayer[i].weight && i > 1) {
                    i--
                    console.log(i)
                    test(i);
                } else if (i < 2) {
                    bestHandPlayer += ` e ${player.name}`
                }
            }
            test(i);
        };
        console.log(bestHandPlayer)
    }
}

class WinnerManager {
    determineWinner(players, board) {
        // Logic to determine the winner
        return winner;
    }
}

class PlayerManager {
    addPlayers(players) {
        // Add players to the game
    }

    removePlayer(player) {
        // Remove player from the game
    }
}

class EventManager {
    // Manage non-gameplay related events
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
        case 5:
            rooms[room].straight();
            //highHandUI.innerText = 'aaaaaaaaa';
            break;
    }
    turn++
}

