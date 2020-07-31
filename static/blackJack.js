let blackJackGame ={
    'you': {'scoreSpan':'#black-jack-yourScore', 'div':'#your-box', 'score': 0},
    'dealer' : {'scoreSpan':'#black-jack-dealerScore','div':'#dealer-box', 'score': 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsValue': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11],},
    'wins' : 0,
    'losses': 0,
    'draws': 0,
    'isStand' : false,
    'turnsOver' : false,
};
const YOU = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];

// all audios
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');


let hitButton = document.getElementById('black-jack-hit-button');
if(hitButton){
    hitButton.addEventListener('click',blackjackHit);
}
function blackjackHit(){
    if(blackJackGame['isStand'] === false){

        let card = randomCard();
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
    }

}
function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackJackGame['cards'][randomIndex];
}



let dealButton = document.getElementById('black-jack-deal-button');
if(dealButton){
    dealButton.addEventListener('click',blackjackDeal);
}
function blackjackDeal(){
   
    if(blackJackGame['turnsOver'] === true){
        
        blackJackGame['isStand'] = false;
        let yourImage = document.querySelector('#your-box').querySelectorAll('img');
        for(i=0; i<yourImage.length; i++){
            yourImage[i].remove();
        }
        let dealerImage = document.querySelector('#dealer-box').querySelectorAll('img');
        for(i=0; i<dealerImage.length; i++){
            dealerImage[i].remove();
        }

        //set score to zero
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#black-jack-yourScore').textContent = 0;
        document.querySelector('#black-jack-dealerScore').textContent = 0;
        document.querySelector('#black-jack-yourScore').style.color = 'white';
        document.querySelector('#black-jack-dealerScore').style.color = 'white';
        
        //reset game result board to normal
        document.querySelector('#black-jack-result').textContent = "Let's Play";
        document.querySelector('#black-jack-result').style.color = 'white';
        blackJackGame['turnsOver'] = true;
    }
}

// MAIN GAME LOGIC
function dealerLogic(){
    blackJackGame['isStand'] = true;
    let card = randomCard();
    showCard(card,DEALER);
    updateScore(card,DEALER);
    showScore(DEALER);

    if(DEALER['score'] > 15){
        blackJackGame['turnsOver'] = true;
        let winner = findWinner();
        showResult(winner);
    }
}
let standButton = document.getElementById('black-jack-stand-button');
if(standButton){
    standButton.addEventListener('click',dealerLogic);
}



function showCard(card,user){
    if(user['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = "static/images/"+card+".png";
        document.querySelector(user['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function updateScore(card,user){
    if(card == 'A'){
        if(user['score'] + blackJackGame['cardsValue'][card][1] <= 21){
            user['score'] += blackJackGame['cardsValue'][card][1];
        }else{
            user['score'] += blackJackGame['cardsValue'][card][0];
        }
    }else{
        user['score'] += blackJackGame['cardsValue'][card];
        }
}

function showScore(user){
    if(user['score'] > 21){
        document.querySelector(user['scoreSpan']).textContent = "BUST!";
        document.querySelector(user['scoreSpan']).style.color = "red";
    }else{
        document.querySelector(user['scoreSpan']).textContent = user['score'];
    }
}



function findWinner(){
    let winner;
    // when your score is less than 21
    if(YOU['score'] <= 21){

        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            winner = YOU;
            blackJackGame['wins']++;
        }
        else if( YOU['score'] < DEALER['score'] ){
            winner = DEALER;
            blackJackGame['losses']++;
        }
        else if( YOU['score'] == DEALER['score']){
            blackJackGame['draws']++;
        }
    } // you bust, but dealer's score is less than 21
    else if( YOU['score'] > 21 && DEALER['score'] <= 21){
        winner = DEALER;
        blackJackGame['losses']++;
    }
    // when you and dealer both get bust
    else if( YOU['score'] > 21 && DEALER['score'] > 21){
        blackJackGame['draws']++;
    }
    console.log("The winner is "+ winner);
    return winner;
}

function showResult(winner){
    if(blackJackGame['turnsOver'] === true){
    if(winner === YOU){
        let element = document.querySelector('#win-result');
        if(element){
            element.textContent = blackJackGame['wins'];
        }
        message = "You Won!";
        messageColor = "green";
        winSound.play();
    }
    else if(winner === DEALER){
        let element = document.querySelector('#loss-result');
        if(element){
            element.textContent = blackJackGame['losses'];
        }
        message = "You Lost!";
        messageColor = "red";
        lossSound.play();
    }
    else{
        let element = document.querySelector('#draw-result');
        if(element){
            element.textContent = blackJackGame['draws'];
        }
        message = "There is a Draw!";
        messageColor = "orange";
    }

    document.querySelector('#black-jack-result').textContent = message;
    document.querySelector('#black-jack-result').style.color = messageColor;
    }
}