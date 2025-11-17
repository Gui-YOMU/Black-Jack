class Card {
    constructor(symbol, color, value) {
        this.symbol = symbol,
            this.color = color,
            this.value = value
    }
}

let gameAudio = new Audio("../assets/sounds/gameAudio.mp3")
let drawCardAudio = new Audio("../assets/sounds/card-draw.mp3")

let rulesDisplay = document.querySelector("#rules")
let playerName = document.querySelector("#playerName")
let playerNameDisplay = document.querySelector("#playerNameDisplay")
let gameDisplay = document.querySelector("#game")
let bankDisplay = document.querySelector("#bankDisplay")
let bankCardsDisplay = document.querySelector("#bankCardsDisplay")
let bankScoreDisplay = document.querySelector("#bankScoreDisplay")
let buttonsDisplay = document.querySelector("#buttonsDisplay")
let playerDisplay = document.querySelector("#playerDisplay")
let playerCardsDisplay = document.querySelector("#playerCardsDisplay")
let playerScoreDisplay = document.querySelector("#playerScoreDisplay")
let endDisplay = document.querySelector("#endDisplay")
let winOrLose = document.querySelector("#winOrLose")
let finalScore = document.querySelector("#finalScore")

let cardValueArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let cardColorArray = ["♠", "♡", "♣", "♢"]
let orderedCardDeck = []
let shuffledCardDeck = []
let playerScore = 0
let playerAceCounter = 0
let bankAceCounter = 0
let bankScore = 0
let deckIndex = 0
let card
let blackJack

function createDeck() {
    let newCard
    for (let i = 0; i < cardValueArray.length; i++) {
        for (let j = 0; j < cardColorArray.length; j++) {
            if (cardValueArray[i] == "A") {
                newCard = new Card(cardValueArray[i], cardColorArray[j], 11)
                orderedCardDeck.push(newCard)
            } else if (cardValueArray[i] == "J" || cardValueArray[i] == "Q" || cardValueArray[i] == "K") {
                newCard = new Card(cardValueArray[i], cardColorArray[j], 10)
                orderedCardDeck.push(newCard)
            } else {
                newCard = new Card(cardValueArray[i], cardColorArray[j], parseInt(cardValueArray[i]))
                orderedCardDeck.push(newCard)
            }
        }
    }
}

function shuffleDeck(deck) {
    let random = 0
    while (deck.length > 0) {
        random = Math.floor(Math.random() * deck.length)
        shuffledCardDeck.push(deck[random])
        deck.splice(random, 1)
    }
}

function dealCards(deck) {
    for (let i = 0; i < 4; i++) {
        card = document.createElement("div")
        card.classList.add("card")
        card.textContent = `${deck[i].symbol} ${deck[i].color}`
        switch (deck[i].color) {
            case "♠":
                card.style.color = "black"
                break;
            case "♡":
                card.style.color = "red"
                break;
            case "♣":
                card.style.color = "blue"
                break;
            case "♢":
                card.style.color = "forestgreen"
                break;
        }
        if (i % 2 == 0) {
            if (deck[i].value == 11) {
                playerAceCounter++
            }
            playerCardsDisplay.appendChild(card)
            playerScore += deck[i].value
            playerScoreDisplay.textContent = `${playerScore}`
        } else if (i == 1) {
            if (deck[i].value == 11) {
                bankAceCounter++
            }
            bankCardsDisplay.appendChild(card)
            bankScore += deck[i].value
            bankScoreDisplay.textContent = `${bankScore}`
        } else {
            if (deck[i].value == 11) {
                bankAceCounter++
            }
            card.textContent = ""
            card.classList.add("hidden")
            bankCardsDisplay.appendChild(card)
        }
    }
    deckIndex = 4
    if (playerScore == 21) {
        endGame()
    } else if (playerScore > 21) {
        playerAceCounter--
        playerScore -= 10
        playerScoreDisplay.textContent = `${playerScore}`
    }
    blackJack = false
}

function drawCard(deck) {
    drawCardAudio.play()
    card = document.createElement("div")
    card.classList.add("card")
    card.textContent = `${deck[deckIndex].symbol} ${deck[deckIndex].color}`
    switch (deck[deckIndex].color) {
        case "♠":
            card.style.color = "black"
            break;
        case "♡":
            card.style.color = "red"
            break;
        case "♣":
            card.style.color = "blue"
            break;
        case "♢":
            card.style.color = "forestgreen"
            break;
    }
    return card
}

document.querySelector("#start").addEventListener("click", () => {
    rulesDisplay.style.display = "none"
    gameDisplay.style.display = "flex"
    gameAudio.play()
    playerNameDisplay.textContent = playerName.value
    createDeck()
    shuffleDeck(orderedCardDeck)
    dealCards(shuffledCardDeck)
})

document.querySelector("#draw").addEventListener("click", () => {
    drawCard(shuffledCardDeck)
    playerCardsDisplay.appendChild(card)
    playerScore += shuffledCardDeck[deckIndex].value
    if (shuffledCardDeck[deckIndex].value == 11) {
        playerAceCounter++
    }
    playerScoreDisplay.textContent = `${playerScore}`
    if (playerScore > 21) {
        if (playerAceCounter > 0) {
            playerAceCounter--
            playerScore -= 10
            playerScoreDisplay.textContent = `${playerScore}`
        } else {
            endGame()
        }
    }
    deckIndex++
})

gameAudio.addEventListener("ended", function () {
    this.currentTime = 0
    this.play()
}, false)

document.querySelector("#stay").addEventListener("click", () => {
    buttonsDisplay.style.visibility = "hidden"
    bankDraw()
})

function bankDraw() {
    document.querySelector(".hidden").textContent = `${shuffledCardDeck[3].symbol} ${shuffledCardDeck[3].color}`
    bankScore += shuffledCardDeck[3].value
    bankScoreDisplay.textContent = `${bankScore}`
    if (bankScore > 21) {
        bankAceCounter--
        bankScore -= 10
        bankScoreDisplay.textContent = `${bankScore}`
    } else if (bankScore == 21) {
        blackJack = true
        endGame()
    }
    while (bankScore <= 16) {
        drawCard(shuffledCardDeck)
        bankCardsDisplay.appendChild(card)
        bankScore += shuffledCardDeck[deckIndex].value
        if (shuffledCardDeck[deckIndex].value == 11) {
            bankAceCounter++
        }
        bankScoreDisplay.textContent = `${bankScore}`
        if (bankScore > 21) {
            if (bankAceCounter > 0) {
                bankAceCounter--
                bankScore -= 10
                bankScoreDisplay.textContent = `${bankScore}`
            } else {
                endGame()
            }
        }
        deckIndex++
    }
    endGame()
}

function endGame() {
    if (blackJack) {
        if (playerScore == 21 && bankScore != 21) {
            winOrLose.textContent = "Black Jack !!!"
            finalScore.textContent = "Vous avez atteint 21 avec les deux cartes de départ. Quelle chance !"
            endDisplay.classList.add("win")
            endDisplay.showModal()
        } else if (playerScore != 21 && bankScore == 21) {
            winOrLose.textContent = "Black Jack !!!"
            finalScore.textContent = "La banque a atteint 21 avec les deux cartes de départ. Quelle malchance !"
            endDisplay.classList.add("lose")
            endDisplay.showModal()
        } else {
            winOrLose.textContent = "Black Jack !!!"
            finalScore.textContent = "La banque et vous avez atteint 21 avec les deux cartes de départ. Pas de gagnant sur cette manche."
            endDisplay.classList.add("draw")
            endDisplay.showModal()
        }
    } else {
        if (playerScore > 21) {
            winOrLose.textContent = "Vous avez perdu !"
            finalScore.textContent = "Vous avez dépassé la somme de 21."
            endDisplay.classList.add("lose")
            endDisplay.showModal()
        } else {
            if (bankScore > 21) {
                winOrLose.textContent = "Vous avez gagné !"
                finalScore.textContent = "La banque a dépassé la somme de 21."
                endDisplay.classList.add("win")
                endDisplay.showModal()
            } else {
                if (playerScore > bankScore) {
                    winOrLose.textContent = "Vous avez gagné !"
                    finalScore.textContent = `Vous avez obtenu la somme de ${playerScore}, contre ${bankScore} pour la banque.`
                    endDisplay.classList.add("win")
                    endDisplay.showModal()
                } else if (playerScore < bankScore) {
                    winOrLose.textContent = "Vous avez perdu !"
                    finalScore.textContent = `Vous avez obtenu la somme de ${playerScore}, contre ${bankScore} pour la banque.`
                    endDisplay.classList.add("lose")
                    endDisplay.showModal()
                } else {
                    winOrLose.textContent = "Partie nulle !"
                    finalScore.textContent = `La banque et vous avez obtenu la somme de ${playerScore}.`
                    endDisplay.classList.add("draw")
                    endDisplay.showModal()
                }
            }
        }
    }
}

document.querySelector("#restart").addEventListener("click", () => {
    playerCardsDisplay.replaceChildren()
    bankCardsDisplay.replaceChildren()
    playerScore = 0
    playerAceCounter = 0
    bankScore = 0
    bankAceCounter = 0
    blackJack = true
    shuffledCardDeck = []
    endDisplay.classList.remove("win", "lose", "draw")
    endDisplay.close()
    buttonsDisplay.style.visibility = "visible"
    createDeck()
    shuffleDeck(orderedCardDeck)
    dealCards(shuffledCardDeck)
})

document.querySelector("#quit").addEventListener("click", () => {
    endDisplay.close()
    gameAudio.pause()
    gameAudio.currentTime = 0
    window.location.reload()
})