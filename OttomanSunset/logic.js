import { sunriseDeck } from "./cards.js";

const statusLabel = document.getElementById("statusLabel");
const cardBtn = document.getElementById("cardBtn");
const rollBtn     = document.getElementById("rollBtn");
const defenceBtn = document.getElementById("defenceBtn");
const resWestBtn = document.getElementById("resWestBtn");
const resSeaBtn = document.getElementById("resSeaBtn");
const resEastBtn = document.getElementById("resEastBtn");


function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function disableall()
{
 cardBtn     .disabled= true
 rollBtn     .disabled= true
 defenceBtn  .disabled= true
 resWestBtn  .disabled= true
 resSeaBtn   .disabled= true
 resEastBtn  .disabled= true
}

function printMousePos(event)
{
    const rect =  document.getElementsByTagName("body")[0].getBoundingClientRect();
    console.log(`x=${event.clientX - rect.left} y=${event.clientY - rect.top}`)
}

document.addEventListener("click", printMousePos);

class Track
{
    name;
    spaces;
    currentPos;
    imgpath;
    strength;
    counterDiv;

    constructor(name, strength, spaces)
    {
        this.strength = strength
        this.name = name;
        this.spaces = spaces;
        this.imgpath = "sprite/"+name+".png";
        this.currentPos = 0;
    }

    advance()
    {
        this.currentPos += 1
        this.counterDiv.style.top = `${this.spaces[this.currentPos].y}px`;
        this.counterDiv.style.left = `${this.spaces[this.currentPos].x}px`;
    }

    retreat()
    {
        this.currentPos -= 1
        this.counterDiv.style.top = `${this.spaces[this.currentPos].y}px`;
        this.counterDiv.style.left = `${this.spaces[this.currentPos].x}px`;
    }
}

const allTracks = {
    mesopotamia: new Track("mesopotamia", 4, [
        {x:1390,y:590,vp:false},
        {x:1360,y:452,vp:false}
    ]),
    caucasus: new Track("caucasus", 2, [
        {x:1378,y:185,vp:false},
        {x:1255,y:259,vp:false}
    ]),
    sinai: new Track("sinai", 3,[
        {x:500,y:910,vp:false},
        {x:650,y:910,vp:false}
    ]),
    galipoli: new Track("galipoli", 2,[
        {x:442,y:673,vp:false}
    ])
}

const gameState =
{
    deck: []
}


function start()
{
    

   showTrack("mesopotamia")
   showTrack("caucasus")
   showTrack("sinai")

   gameState.deck.push(...sunriseDeck)
   shuffle(gameState.deck)
   gameloop()
}


function showTrack(name)
{
    let counter = document.createElement('div')
    counter.style.position = "absolute"
    counter.style.top = `${allTracks[name].spaces[0].y}px`
    counter.style.left = `${allTracks[name].spaces[0].x}px`

    let counterImg = document.createElement('img')
    counterImg.src = allTracks[name].imgpath
    counter.appendChild(counterImg)

    let counterStr = document.createElement('label')
    counterStr.style.position = "absolute";
    counterStr.style.top = "50%"
    counterStr.style.left = "50%"
    counterStr.style.transform = "translate(-50%, -50%)"
    counterStr.textContent = allTracks[name].strength
    counter.appendChild(counterStr)

    document.getElementsByTagName("body")[0].appendChild(counter);

    allTracks[name].counterDiv = counter
}


function gameloop()
{
    statusLabel.textContent = "Тяните карту."
    disableall()
    cardBtn.disabled = false
}

function drawcard()
{
    const card = gameState.deck.pop()
    console.log(card.name)
}



start();
