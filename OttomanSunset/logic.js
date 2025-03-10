import { sunriseDeck, middayDeck, duskDeck, battle } from "./cards.js";

function random(min,max) {
    return Math.floor((Math.random())*(max-min+1))+min;
}

const statusLabel = document.getElementById("statusLabel");
const cardBtn     = document.getElementById("cardBtn");
const rollBtn     = document.getElementById("rollBtn");
const defenceBtn  = document.getElementById("defenceBtn");
const mineBtn  = document.getElementById("mineBtn");
const resWestBtn  = document.getElementById("resWestBtn");
const resSeaBtn   = document.getElementById("resSeaBtn");
const resEastBtn  = document.getElementById("resEastBtn");
const intelBtn = document.getElementById("intelBtn");

const yesBtn= document.getElementById("yes");
const noBtn = document.getElementById("no");

const yildrimLabel = document.getElementById("yildrim")

const moraleLabel = document.getElementById("moraleLabel")

const eventCardDiv = document.getElementById("eventCard");

const die = document.getElementById("die");

const westResLabel = document.getElementById("west-res");
const eastResLabel = document.getElementById("east-res");
const seaResLabel = document.getElementById("sea-res");

const westBtn = document.getElementById("west-btn");
const eastBtn = document.getElementById("east-btn");
const seaBtn = document.getElementById("sea-btn");

const turkeyBtn = document.getElementById("turkey");
const indiaBtn = document.getElementById("india");
const afghanistanBtn = document.getElementById("afghanistan");
const persiaBtn = document.getElementById("persia");



let resourceLeft = 6
let morale = 0

let card

cardBtn.onclick = drawcard
resWestBtn.onclick = addWestResource
westBtn.onclick = removeWestResource
resEastBtn.onclick = addEastResource
eastBtn.onclick = removeEastResource
resSeaBtn.onclick = addSeaResource
seaBtn.onclick = removeSeaResource

intelBtn.onclick = () => {
    turkeyBtn.style.display = 'inline-block'
    indiaBtn.style.display = 'inline-block'
    afghanistanBtn.style.display = 'inline-block'
    persiaBtn.style.display = 'inline-block'
    gameState.isActionPhase = false
    disableall()
}

turkeyBtn.onclick = ()=>{moveIntel("turkey"); gameState.isActionPhase = true; gameState.hideExtraBtns(); spendAction();}
indiaBtn.onclick = ()=>{moveIntel("india"); gameState.isActionPhase = true; gameState.hideExtraBtns(); spendAction();}
afghanistanBtn.onclick = ()=>{moveIntel("afghanistan"); gameState.isActionPhase = true; gameState.hideExtraBtns(); spendAction();}
persiaBtn.onclick = ()=>{moveIntel("persia"); gameState.isActionPhase = true; gameState.hideExtraBtns(); spendAction();}

defenceBtn.onclick = () => {addDefence(3)}
mineBtn.onclick = () => {addMine()}

// 635 1073
// 662 1239
// 761 1097
// 815 1254
// 893 1096
// 966 1222
// 
// 715 1171
// 888 1169



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
 mineBtn     .disabled= true
 resWestBtn  .disabled= true
 resSeaBtn   .disabled= true
 resEastBtn  .disabled= true
 intelBtn    .disabled= true
}

function enableall()
{
 defenceBtn  .disabled= false
 mineBtn     .disabled= false
 resWestBtn  .disabled= false
 resSeaBtn   .disabled= false
 resEastBtn  .disabled= false
 intelBtn    .disabled= false
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
        this.modifier = 0;
        this.button = document.getElementById(name)
    }

    provisional()
    {
        this.imgpath= "sprite/caucasus_provisional.png";
        this.isProvisional = true;
        this.counterDiv.childNodes[0].src = this.imgpath;
        this.setStrength(this.strength);
    }

    advance(forced)
    {
        if (!forced)
        {
            if (!gameState.pipelineBuilt && this.name == "sinai" && this.currentPos < 2)
                if (rollDie() >= this.strength)
                    return;
            if (gameState.gaza && this.name == "sinai" && this.currentPos == 1)
            {
                if (rollDie() >= this.strength)
                    return;
                else gameState.gaza--;
            }
            if ((this.name == "sinai" || this.name == "mesopotamia") && gameState.yildrim > 0)
            {
                this.justmoved = true;
                return;
            }
        }


        this.currentPos += 1;
        this.counterDiv.style.top = `${this.spaces[this.currentPos].y}px`;
        this.counterDiv.style.left = `${this.spaces[this.currentPos].x}px`;
        
        if (this.spaces[this.currentPos].vp)
        {
            if (this.name == "sinai" && this.currentPos == 4 && allTracks.arab.currentPos >= 4) {}
            else if (this.name == "arab" && this.currentPos == 4 && allTracks.sinai.currentPos >= 4) {}
            else changeMorale(-1)
        }
        if (this.currentPos >= this.spaces.length - 1)
        {
            gameState.lose();
            return
        }

        
        
    }

    retreat()
    {
        if (this.currentPos == 0) return;
        if (this.spaces[this.currentPos].vp)
        {
            if (this.name == "sinai" && this.currentPos == 4 && allTracks.arab.currentPos >= 4) {}
            else if (this.name == "arab" && this.currentPos == 4 && allTracks.sinai.currentPos >= 4) {}
            else changeMorale(+1)
        }
        this.currentPos -= 1
        this.counterDiv.style.top = `${this.spaces[this.currentPos].y}px`;
        this.counterDiv.style.left = `${this.spaces[this.currentPos].x}px`;
    }

    setStrength(newStr)
    {
        if (!this.counterDiv) return;
        if (this.isProvisional) newStr--;
        this.strength = newStr
        this.counterDiv.childNodes[1].textContent = newStr
    }
}

const allTracks = {
    mesopotamia: new Track("mesopotamia", 3, [
        {x:1390,y:590,vp:false},
        {x:1360,y:452,vp:false},
        {x:1235,y:428,vp:false},
        {x:1120,y:422,vp:true},
        {x:995,y:410,vp:true},
        {x:695,y:247,vp:false}
    ]),
    caucasus: new Track("caucasus", 2, [
        {x:1378,y:185,vp:false},
        {x:1255,y:259,vp:false},
        {x:1114,y:285,vp:false},
        {x:977,y:269,vp:true},
        {x:841,y:263,vp:true},
        {x:695,y:247,vp:false}
    ]),
    sinai: new Track("sinai", 3,[
        {x:500,y:910,vp:false},
        {x:650,y:910,vp:false},
        {x:769,y:793,vp:false},
        {x:843,y:667,vp:true},
        {x:819,y:534,vp:true},
        {x:753,y:394,vp:false},
        {x:695,y:247,vp:false}
    ]),
    galipoli: new Track("galipoli", 2,[
        {x:442,y:673,vp:false},
        {x:526,y:567,vp:false},
        {x:593,y:460,vp:true},
        {x:636,y:351,vp:false},
        {x:695,y:247,vp:false}
    ]),
    salonika: new Track("salonika", 2,[
        {x:181,y:430,vp:false},
        {x:248,y:278,vp:false},
        {x:381,y:181,vp:true},
        {x:508,y:208,vp:false},
        {x:695,y:247,vp:false}
    ]),
    arab: new Track("arab", 2,[
        {x:1374,y:854,vp:false},
        {x:1240,y:697,vp:false},
        {x:1079,y:804,vp:false},
        {x:986,y:653,vp:false},
        {x:919,y:534,vp:true},
        {x:853,y:394,vp:false},
        {x:695,y:247,vp:false}
    ])
}

const gameState =
{
    deck: [],
    defences: [], // could add 3,3,3
    mines: [], // 4,4
    actionsLeft: 0,
    westRes: 0,
    eastRes: 0,
    seaRes: 0,
    bureau: "turkey",

    yildrim:0,
    setYildrim(n)
    {
        this.yildrim = n;
        yildrimLabel.textContent = `${this.yildrim} Yildrim`;
    },

    // kaiserchlacht
    kaiser: false,
    ksProgress: 0,
    ksBattles: [3,3,4,4,5,5],
    ksResults: [0,0,0,0,0,0], // how much morale was gained in a particular battle

    forceCaucasus : false,
    noCaucasus: false,
    noMesopotamia: false,
    noSinai: false,
    
    lose: () => {
        window.alert("Османская Империя пала...");
        window.location.reload();
    },

    win: () => {
        window.alert("Османская Империя устояла!");
        window.location.reload();
    },

    pipelineBuilt: false,
    intelligenceAllowed : () => {intelBtn.style.display = 'inline-block';},
    statusLabel: statusLabel,
    cardBtn: cardBtn,
    rollBtn: rollBtn,
    defBtn: defenceBtn,
    mineBtn: mineBtn,
    showTrack: showTrack,
    roll: rollDie,
    changeMorale:changeMorale,
    allTracks:allTracks,
    addMine:addMine,
    removeTrack:removeTrack,
    spendAction: spendAction,
    yesBtn : yesBtn,
    noBtn : noBtn,
    isActionPhase: false,

    shuffleIn: (newDeck) => {gameState.deck.push(...newDeck); shuffle(gameState.deck);},
    breakSedulbahir: () => {document.getElementById("def0").textContent = "0";},

    hideExtraBtns(){
        turkeyBtn.style.display = 'none';
        indiaBtn.style.display = 'none';
        persiaBtn.style.display = 'none';
        afghanistanBtn.style.display = 'none';
    }
}


function start()
{
    

   showTrack("mesopotamia")
   showTrack("caucasus")
   showTrack("sinai")

   addDefence(4)
   addDefence(2)

   moveIntel("turkey")

   gameState.deck.push(...sunriseDeck)
   
   shuffle(gameState.deck)

   gameloop()
}

function changeMorale(delta)
{
    morale += delta;
    moraleLabel.textContent = `Мораль: ${morale}`;
    if (morale < -3)
        gameState.lose();
}

function showTrack(name)
{
    if (allTracks[name].counterDiv)
        return;

    let counter = document.createElement('div')
    counter.style.position = "absolute"
    counter.style.top = `${allTracks[name].spaces[0].y}px`
    counter.style.left = `${allTracks[name].spaces[0].x}px`
    counter.onclick = () => { startOffensive(allTracks[name]) }

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

function removeTrack(name)
{
    if (allTracks[name].counterDiv)
        document.getElementsByTagName("body")[0].removeChild(allTracks[name].counterDiv)
    allTracks[name].counterDiv = null
}



function gameloop()
{
    // reset flags
    gameState.forceCaucasus = false;
    gameState.noCaucasus = false;
    gameState.noMesopotamia = false;
    gameState.noSinai = false;

    allTracks.mesopotamia.justmoved = false;
    allTracks.sinai.justmoved = false;

    allTracks.arab.modifier=0
    allTracks.caucasus.modifier=0
    allTracks.galipoli.modifier=0
    allTracks.mesopotamia.modifier=0
    allTracks.salonika.modifier=0
    allTracks.sinai.modifier=0

    

    if (!gameState.kaiser)
    {
        statusLabel.textContent = "\tТяните карту"
            disableall()
            cardBtn.disabled = false
    } else {
        // KAISERSCHLACHT 
        // It's done at the start instead of end but I don't think it matters in any way
        // 3,3,4,4,5,5 in that order
        // after done with these 6, reroll random battle
        disableall()

        if (gameState.ksProgress < 6)
        {
            battle(gameState, "west", gameState.ksBattles[gameState.ksProgress], gameState.ksProgress);
            gameState.ksProgress++;
        }
        else
        {
            let randomId = rollDie() - 1
            changeMorale(-gameState.ksResults[randomId])
            gameState.ksResults[randomId] = 
                battle(gameState, "west", gameState.ksBattles[randomId], randomId);
        }


    }
}

function drawcard()
{
    
    card = gameState.deck.pop()

    if (!card)
        gameState.win();


    console.log(`Drawn ${card.name}`)

    // VERY ugly cleanup
    while (eventCardDiv.childNodes[1].firstChild && eventCardDiv.childNodes[1].childNodes.length > 2) {
        eventCardDiv.childNodes[1].removeChild(eventCardDiv.childNodes[1].lastChild);
    }
    while (eventCardDiv.childNodes[2].firstChild && eventCardDiv.childNodes[2].childNodes.length > 2) {
        eventCardDiv.childNodes[2].removeChild(eventCardDiv.childNodes[2].lastChild);
    }

    // Name
    eventCardDiv.childNodes[0].textContent = card.name

    // Advancing nations
    for (let advancingNation of card.advancing)
    {
        const advImg = document.createElement("img")
        advImg.src = allTracks[advancingNation].imgpath
        advImg.className = "halfsize"

        eventCardDiv.childNodes[1].appendChild(advImg)

        if (allTracks[advancingNation].counterDiv)
            allTracks[advancingNation].advance()
    }
    
    // Retreating nations
    if (card.retreating)
    for (let retreatingNation of card.retreating)
    {
        const retImg = document.createElement("img")
        retImg.src = allTracks[retreatingNation].imgpath
        retImg.className = "halfsize"

        eventCardDiv.childNodes[2].appendChild(retImg)

        if (allTracks[retreatingNation].counterDiv)
            allTracks[retreatingNation].retreat()
    }

    // Description
    eventCardDiv.childNodes[3].textContent = card.description;


    // Other card stuff
    disableall()

    cardBtn.textContent = "Продолжить"
    cardBtn.onclick = playerTurn
    cardBtn.disabled = false
    gameState.actionsLeft = card.actions


    console.log(allTracks.mesopotamia.justmoved)
    console.log(allTracks.sinai.justmoved)
    console.log(!allTracks.mesopotamia.justmoved && !allTracks.sinai.justmoved)



        if (!allTracks.mesopotamia.justmoved && !allTracks.sinai.justmoved)
        {
            if (card.effect) card.effect(gameState)
        }
        else {
            // yildrim
            cardBtn.disabled = true;
            let curry = () => {cardBtn.disabled = false; if (card.effect) card.effect(gameState);}
            if (allTracks.mesopotamia.justmoved)
            {
                let snapshot = curry;
                curry = () => { yesnoPrompt("Остановить Месопотамию? ", ()=>{
                    if (gameState.yildrim > 0)
                        gameState.setYildrim(gameState.yildrim-1)
                    else allTracks.mesopotamia.advance(true)
                    snapshot();
                }, () => {
                    allTracks.mesopotamia.advance(true)
                    snapshot();
                }) }
            }
            if (allTracks.sinai.justmoved)
            {
                let snapshot = curry;
                curry = () => { yesnoPrompt("Остановить Синай? ", ()=>{
                    if (gameState.yildrim > 0)
                        gameState.setYildrim(gameState.yildrim-1)
                    else allTracks.sinai.advance(true)
                    snapshot();
                }, () => {
                    allTracks.sinai.advance(true)
                    snapshot();
                }) }
            }
            curry();
        }
    
}

function playerTurn()
{
    cardBtn.disabled = true
    cardBtn.onclick = drawcard
    cardBtn.textContent = "Карта"
    gameState.isActionPhase = true;

    if (gameState.defences.length < 6)
        defenceBtn.disabled = false;
    if (gameState.mines.length < 2)
        mineBtn.disabled = false;  
    if (card.actions > 1)
    {
        if (resourceLeft > 0)
        {
            if (gameState.westRes < 2) resWestBtn.disabled = false; 
            if (gameState.seaRes < 2)resSeaBtn.disabled = false; 
            if (gameState.eastRes < 2)resEastBtn.disabled = false;
        }
    }
    intelBtn.disabled = false;

    if (gameState.forceCaucasus)
    {
        disableall()
        statusLabel.textContent = `Атакуйте Кавказ`
    } else statusLabel.textContent = `\tДелайте ${gameState.actionsLeft} действий`

    if (gameState.actionsLeft <= 0)
        spendAction();
}

function spendAction(no)
{
    if (no)
        gameState.actionsLeft++;
    else gameState.actionsLeft--;

    enableall()
    if (gameState.actionsLeft <= 0)
    {
        gameState.isActionPhase = false;
        gameloop()
        return;
    }
    if (gameState.actionsLeft < 2)
    {
        resWestBtn.disabled = true; 
        resSeaBtn.disabled = true; 
        resEastBtn.disabled = true;
    }
    if (gameState.westRes == 2) resWestBtn.disabled = true;
    if (gameState.eastRes == 2) resEastBtn.disabled = true; 
    if (gameState.seaRes == 2) resSeaBtn.disabled = true;  


    if (gameState.defences.length == 6)
        defenceBtn.disabled = true
    if (gameState.mines.length == 2)
        mineBtn.disabled = true

    if (gameState.forceCaucasus)
    {
        disableall()
        statusLabel.textContent = `Атакуйте Кавказ`
    }
    else statusLabel.textContent = `\tДелайте ${gameState.actionsLeft} действий`
}

function startOffensive(track)
{
    if (!gameState.isActionPhase)
        return;
    if (gameState.forceCaucasus && track.name != "caucasus")
        return; 
    if (gameState.noCaucasus && track.name == "caucasus")
        return;
    if (gameState.noMesopotamia && track.name == "mesopotamia")
        return;
    if (gameState.noSinai && track.name == "sinai")
        return;
    
    
    statusLabel.textContent = `\tКидайте куб`
    disableall()
    rollBtn.disabled = false
    rollBtn.onclick = () => {rollBtn.disabled = true; doOffensive(track); }
}

function doOffensive(track)
{
    if (rollDie() + track.modifier > track.strength)
    {
        track.retreat()
    }
    spendAction()
}

function rollDie()
{
    const side = random(1, 6)
    die.src = `sprite/die/${side}.png`
    return side
}




function addWestResource()
{
    resourceLeft--;
    gameState.westRes++;
    westResLabel.childNodes[0].textContent = gameState.westRes
    if (resourceLeft == 0 || gameState.westRes == 2) resWestBtn.disabled = true
    spendAction()
    spendAction()
}

function removeWestResource()
{
    if (gameState.westRes == 0) return;
    gameState.westRes--;
    westResLabel.childNodes[0].textContent = gameState.westRes
    spendAction(+1)
}

function addSeaResource()
{
    resourceLeft--;
    gameState.seaRes++;
    seaResLabel.childNodes[0].textContent = gameState.seaRes
    if (resourceLeft == 0 || gameState.seaRes == 2) resSeaBtn.disabled = true
    spendAction()
    spendAction()
}

function removeEastResource()
{
    if (gameState.eastRes == 0) return;
    gameState.eastRes--;
    eastResLabel.childNodes[0].textContent = gameState.eastRes
    spendAction(+1)
}

function addEastResource()
{
    resourceLeft--;
    gameState.eastRes++;
    eastResLabel.childNodes[0].textContent = gameState.eastRes
    if (resourceLeft == 0 || gameState.eastRes == 2) resEastBtn.disabled = true
    spendAction()
    spendAction()
}

function removeSeaResource()
{
    if (gameState.seaRes == 0) return;
    gameState.seaRes--;
    seaResLabel.childNodes[0].textContent = gameState.seaRes
    spendAction(+1)
}


const defencePos = 
[
    {x:635,y:1073},
    {x:662,y:1239},
    {x:761,y:1097},
    {x:815,y:1254},
    {x:893,y:1096},
    {x:966,y:1222}
]

function addDefence(strength)
{
    const id = gameState.defences.length

    const newDefence = document.createElement('div')
    newDefence.style.position = 'absolute'
    newDefence.style.top = `${defencePos[id].y}px` 
    newDefence.style.left = `${defencePos[id].x + 20}px` 
    newDefence.className = 'shadowText'
    gameState.defences.push(strength)

    newDefence.id = `def${id}`
    newDefence.textContent = strength

    document.body.appendChild(newDefence)

    spendAction()
}

const minePos = 
[
    {x:715,y:1171},
    {x:888,y:1169}
]

// 715 1171
// 888 1169

function addMine()
{
    const id = gameState.mines.length
    if (id >= minePos.length)
        return;

    const newDefence = document.createElement('div')
    newDefence.style.position = 'absolute'
    newDefence.style.top = `${minePos[id].y}px` 
    newDefence.style.left = `${minePos[id].x + 20}px` 
    newDefence.className = 'shadowText'
    
    gameState.mines.push(4)

    newDefence.textContent = 4

    document.body.appendChild(newDefence)

    spendAction()
}

const intelPos = {
    turkey : {x:1230,y:1052},
    afghanistan : {x:1388,y:1054},
    india : {x:1393,y:1202} ,
    persia : {x:1248,y:1207},
}

const intelImg = document.getElementById("intel")

function moveIntel(to)
{
    console.log(to)
    intelImg.style.top = `${intelPos[to].y}px` 
    intelImg.style.left = `${intelPos[to].x}px`  
    gameState.bureau = to
}

function yesnoPrompt(prompt, yesFun, noFun)
{
    cardBtn.disabled = true;

    statusLabel.textContent = prompt;

    yesBtn.style.display = 'inline-block'
    yesBtn.onclick = () => {
        cardBtn.disabled = false
        yesBtn.style.display = 'none'
        noBtn.style.display = 'none'
        yesFun();
    }

    noBtn.style.display = 'inline-block'
    noBtn.onclick = () => {
        cardBtn.disabled = false
        yesBtn.style.display = 'none'
        noBtn.style.display = 'none'
        noFun();
    }
}

start();
