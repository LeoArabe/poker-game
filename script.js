class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Deck {
    constructor() {
        this.deck = [];
        this.deckCreator();
    }

    deckCreator() {
        let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        let suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];

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
}

const deck = new Deck();

deck.shuffle();
console.log(deck.deck);