class Card
{
    constructor(name, description, actions, advancing, retreating, effect) {
        this.name = name
        this.description = description
        this.actions = actions
        this.advancing = advancing
        this.retreating = retreating
        this.effect = effect
    }
}

export const duskDeck = [
    new Card("King Constantine Flees Greece", "-1 против Салоники", 3, ["caucasus", "galipoli", "salonika"], [], (gs)=>{modifierAgainst(gs, "salonika", -1)}), // -1 to salonika
    new Card("SANDSTORMS", "Кубик 1-3: Месоп. отступает, 4-6: Синай отступает, никакой атаки против них", 1, ["arab"], [], sandstorms), // die 1-3: retreat mes, 4-6: sinai, no offence vs them
    new Card("Kaiserschlacht!", "Кайзершляхт. +1 против всех", 4, ["caucasus", "mesopotamia"], []), // TODO kaiserchlacht enabled, +1 vs all incl. KS
    new Card("U-Boat Campaign", "Битва на море (4)", 3, ["arab", "mesopotamia", "sinai"], [],(gs)=>{battle(gs, 'sea', 4);}), // sea [4]
    new Card("Lawrence Stirs the Arabs", "Сила Арабов=3", 1, ["caucasus"], [],(gs)=>{setStrength(gs, "arab", 3);}), // arab = 3
    new Card("Galipoli Evacuation", "Галиполи эвакуирует, сила Салоники=3", 3, ["mesopotamia", "sinai"], [], (gs)=>{gs.removeTrack("galipoli"); setStrength(gs, "salonika", 3);}), // remove galipoli, if on-map salonika=3
    new Card("Victorio Venero", "Битва на востоке (4)", 3, ["arab", "galipoli", "salonika"], [],(gs)=>{battle(gs, 'east', 4);}), // eastern [4]
    new Card("Hoffman Offensive", "+1 против Кавказа", 3, ["arab", "sinai"], [],(gs)=>{modifierAgainst(gs, "caucasus")}), // +1 vs caucasus
    new Card("Army of Islam", "+1 против всех", 2, ["arab", "mesopotamia", "sinai"], [],(gs)=>{modifierAll(gs)}), // +1 vs all
    new Card("War Weariness", "-1 против внешних битв, случайный фронт двигается. Никаких действий", 0, [], [], warweariness), // war weariness (-1 to foreign)
                                            // die roll: 1-sinai, 2-mesopotamia, 3/4-arab, 5/6-galipoli+salonika
    new Card("Balfour Declaration", "+1 против Синай", 2, ["arab", "galipoli", "mesopotamia"], [],(gs)=>{modifierAgainst(gs, "sinai")}), // +1 vs sinai
    new Card("Allenby Takes the Helm", "Сила Синая=4", 2, ["caucasus", "arab"], [],(gs)=>{setStrength(gs, "sinai", 4);}), // sinai = 4
    new Card("Dunsterforce", "-2 действия или -1 мораль", 2, ["arab", "sinai"], [], dunsterforce), //  skip a turn, or -1 morale
    new Card("Bolshevik Revolution", "Уберите Кавказ", 2, ["arab", "salonika", "sinai"], [], (gs)=>{gs.removeTrack("caucasus")}), // remove caucasus
]

export const middayDeck = [
    new Card("Yildrim", "3 раза можете остановить Месоп./Синай", 1, ["caucasus", "salonika"], []), // TODO 3 tokens to stop mesopotamia/sinai
    new Card("Verdun", "Битва на западе (4)", 1, ["caucasus", "mesopotamia"], [], (gs)=>{battle(gs, 'west', 4);}), // western [4]
    new Card("Arab Revolt","Арабы прибывают", 2, ["mesopotamia", "sinai"], [], (gs)=>{gs.showTrack("arab");}), // arab 2
    new Card("Erzurum Offensive","Нельзя атаковать Кавказ", 2, ["caucasus"], [], blockCaucasus), // no caucasus for turn
    new Card("Central Powers in Afghanistan","Переворот в Афганистане", 3, ["mesopotamia", "caucasus", "sinai"], [], (gs)=>{coup(gs,"afghanistan");}), // Afghan coup
    new Card("Yudenich Named Commander in Chief","Сила Кавказа=4", 2, ["arab","mesopotamia"], [], (gs)=>{setStrength(gs, "caucasus", 4);}), //  caucasus = 4
    new Card("Asia Korps","Выберите фронт. +1 против этого фронта", 3, ["mesopotamia"],[], chooseFront), // Choose a front. +1 to all offensives there
    new Card("Wassmuss in Persia","Переворот в Персии", 2, ["caucasus", "galipoli"],[],(gs)=>{coup(gs,"persia");}), // Persia coup
    new Card("Landings at Salonika","Салоника прибывает.", 1, ["caucasus"], [],(gs)=>{gs.showTrack("salonika");}), // salonika 2
    new Card("Provisional Government Takes Charge","Кавказ отступает и ослабевает", 2, ["galipoli", "salonika", "sinai"],[],provisional), // caucasus -1 permanently, retreat or place
    new Card("Brusilov Offensive","Битва на востоке (3)", 1, ["salonika"],[],(gs)=>{battle(gs, 'east', 3);}), // eastern [3]
    new Card("Jutland","Битва на море (5)", 2, ["galipoli", "salonika", "mesopotamia"], [],(gs)=>{battle(gs, 'sea', 5);}), // sea [5]
    new Card("Forcing the Narrows","Вторжение британцев!", 2, ["arab", "caucasus"],[],forcingTheNarrows), // resolve FTN
    
    // FIXME add visual
    new Card("Fortification of Gaza-Beersheba line","Потратьте 2 действия, чтобы соорудить крепость", 2, ["arab", "salonika", "mesopotamia"],[], buildFortress), // can skip a turn to build if sinai < 2
    
    new Card("Mesopotamian Siege","+Мораль, Месопотамия отступает", 1, ["caucasus", "salonika"], [], siegeOfKut), // +morale, mesopotamia back to 0 space, but str=4
    new Card("Armenian Massacres","Нельзя атаковать Кавказ", 3, ["galipoli", "salonika", "sinai"], [], blockCaucasus), // no caucasus for turn
    new Card("The Somme","Битва на западе (3)", 1, ["galipoli", "salonika"], [], (gs)=>{battle(gs, 'west', 3);}), // western [3]
    new Card("German U-Boats","Британцы не вторгнутся. +1 против Галлиполи, +2 Салоника", 2, ["caucasus", "sinai"],[],uboats), // No FTN, +1 vs galipoli, +2 vs salonika
    new Card("Italy Joins the War","Битва на востоке (3)", 2, ["arab", "salonika"],[],(gs)=>{battle(gs, 'east', 3);}), // eastern [3]
    new Card("Suvla Landing","Сила Галиполи=3", 2, ["galipoli", "caucasus", "sinai"],[],(gs)=>{setStrength(gs, "galipoli", 3);}), // if on map galipoli = 3

    new Card("Sinai Pipeline","Канал построен, арабы прибывают, замешать Закат", 1, ["galipoli", "salonika"],[],buildPipeline) // pipeline built, arab 2 on map, shuffle dusk
]

export const sunriseDeck = [
    new Card("Armenian Volunteer Units", "", 2, ["arab", "caucasus", "sinai"]),
    new Card("Senussi Revolt", "", 2, ["mesopotamia", "galipoli"], ["sinai"]),
    new Card("Goeben dominates Black Sea","", 2, ["arab", "sinai"], ["salonika", "caucasus"]),
    new Card("Bulgaria Joins the Central Powers","", 1, ["mesopotamia", "sinai"]),
    new Card("Enver to The Front","Вы обязаны атаковать Кавказ", 2, ["caucasus", "sinai"], [], enver), // Both offensives against Caucasus
    new Card("Intelligence Bureau of the East","Восточное Бюро доступно", 1, ["mesopotamia"], [], intelligence), // Allow Intelligence
    new Card("Galipoli Landings","Галлиполи высаживается.\nСеддулбахир уничтожен", 2, ["arab", "caucasus"],[], gallipoli), // +Gallipoli, -Seddulbahir (the narrows)
    new Card("Ghadar Conspiracy","Переворот в Индии", 2, ["arab", "caucasus", "galipoli"],[],(gs)=>{coup(gs,"india");}), // India coup
    new Card("Gorlice-Tarnow","Битва на востоке (2)", 3, ["caucasus", "sinai"], [], (gs)=>{battle(gs, 'east', 2);}), // eastern theater [2]
    new Card("Second Battle of Ypres","Битва на западе (4)", 1, ["caucasus", "sinai"],[], (gs)=>{battle(gs, 'west', 4);}), // western [4]
    new Card("Grand Duke Nicholas Takes Control","Сила Кавказа=3", 3, ["mesopotamia", "galipoli", "salonika"],[], (gs)=>{setStrength(gs, "caucasus", 3);}), // set Caucasus to 3
    new Card("Turkish Minelaying","Бесплатные Мины. +1 против Месопотамии", 2, ["arab", "caucasus"],[], (gs)=>{gs.addMine(); modifierAgainst(gs, "mesopotamia")}), // free minefield, +1 to rolls vs Mesopotamia 
    new Card("Jihad Declared!","Замешайте Полдень. +1 ко всем броскам", 3, ["mesopotamia", "caucasus", "sinai"],[], (gs)=>{gs.shuffleIn(middayDeck); modifierAll(gs);}) // shuffle mid-day, +1 to all rolls
]

function uboats(gamestate)
{
    gamestate.uboats = true
    modifierAgainst(gamestate,"salonika",2)
    modifierAgainst(gamestate,"galipoli",1)
}

function enver(gamestate)
{
    gamestate.forceCaucasus = true
}

function intelligence(gamestate)
{
    gamestate.intelligenceAllowed()
}

function blockCaucasus(gamestate)
{
    gamestate.noCaucasus = true
}

function gallipoli(gamestate)
{
    gamestate.showTrack("galipoli")
    // destroy defences
    gamestate.defences[0] = 0
    gamestate.breakSedulbahir()
}

function coup(gamestate, name)
{
    gamestate.statusLabel.textContent = `Переворот. Бросьте куб.`
    gamestate.cardBtn.disabled = true
    gamestate.rollBtn.disabled = false
    gamestate.rollBtn.onclick = () => {
        let roll = gamestate.roll()
        if (name == gamestate.bureau) roll += 2;

        if (roll > 5)
        {
            gamestate.statusLabel.textContent = `Успех! +1 Мораль`
            gamestate.changeMorale(+1) 
        } else gamestate.statusLabel.textContent = `Провал.`
        rollBtn.disabled = true;
        gamestate.cardBtn.disabled = false;
    }
}

function battle(gamestate, theater, strength)
{
    gamestate.statusLabel.textContent = `Битва. Бросьте куб.`
    gamestate.cardBtn.disabled = true
    gamestate.rollBtn.disabled = false
    gamestate.rollBtn.onclick = () => {
        let roll = gamestate.roll() + gamestate[`${theater}Res`]
        if (gamestate.warweariness) roll--;

        if (roll > strength)
        {
            gamestate.statusLabel.textContent = `Победа, +1 мораль`
            gamestate.changeMorale(+1) 
        }
        else {
            gamestate.statusLabel.textContent = `Поражение, -1 мораль`
            gamestate.changeMorale(-1)
        }
        rollBtn.disabled = true;
        gamestate.cardBtn.disabled = false;
    }
}

function setStrength(gamestate, track, newStr)
{
    gamestate.allTracks[track].setStrength(newStr);   
}

function modifierAgainst(gamestate, track, amount)
{
    if (!amount) amount = 1
    gamestate.allTracks[track].modifier = amount
}

function modifierAll(gamestate)
{
    gamestate.allTracks.arab.modifier=1
    gamestate.allTracks.caucasus.modifier=1
    gamestate.allTracks.galipoli.modifier=1
    gamestate.allTracks.mesopotamia.modifier=1
    gamestate.allTracks.salonika.modifier=1
    gamestate.allTracks.sinai.modifier=1
}

function sandstorms(gamestate)
{
    gamestate.statusLabel.textContent = `Песчаные бури. Бросьте куб.`
    gamestate.cardBtn.disabled = true
    gamestate.rollBtn.disabled = false
    gamestate.rollBtn.onclick = () => {
        if (gamestate.roll() < 4) {
            gamestate.statusLabel.textContent = `Никаких атак в Месопотамию.`
            gamestate.allTracks.mesopotamia.retreat()
            gamestate.noMesopotamia = true
        } else {
            gamestate.statusLabel.textContent = `Никаких атак в Синай.`
            gamestate.allTracks.sinai.retreat()
            gamestate.noSinai = true
        }
        rollBtn.disabled = true;
        gamestate.cardBtn.disabled = false;
    }
}

function siegeOfKut(gamestate)
{
    gamestate.changeMorale(+1);
    for (let i = 0; i < 6; i++)
        gamestate.allTracks.mesopotamia.retreat();
    gamestate.allTracks.mesopotamia.setStrength(4);
}

function buildPipeline(gamestate)
{
    gamestate.pipelineBuilt = true;
    gamestate.shuffleIn(duskDeck);
    gamestate.showTrack("arab")
}

function provisional(gamestate)
{
    if (gamestate.allTracks.caucasus.counterDiv)
        gamestate.allTracks.caucasus.retreat()
    else gamestate.showTrack("caucasus")

    gamestate.allTracks.caucasus.provisional();
}

function warweariness(gamestate)
{
    gamestate.statusLabel.textContent = `Киньте куб на случайное продвижение.`
    gamestate.warweariness = true
    gamestate.cardBtn.disabled = true
    gamestate.rollBtn.disabled = false

    gamestate.rollBtn.onclick = () => {
        const roll = gamestate.roll()
        if (roll == 1) {
            gamestate.statusLabel.textContent = `Месопотамия.`
            gamestate.allTracks.mesopotamia.advance()
        } else if (roll == 2) {
            gamestate.statusLabel.textContent = `Синай.`
            gamestate.allTracks.sinai.advance()
        } else if (roll <= 4) {
            gamestate.statusLabel.textContent = `Арабы.`
            gamestate.allTracks.arab.advance()
        } else {
            gamestate.statusLabel.textContent = `Салоника и Галиполи.`
            gamestate.allTracks.salonika.advance()
            gamestate.allTracks.galipoli.advance()
        }
        rollBtn.disabled = true;
        gamestate.cardBtn.disabled = false;
    }
}

function chooseFront(gamestate)
{
    gamestate.statusLabel.textContent = `Выберите фронт: `
    gamestate.cardBtn.disabled = true
    for(let name of Object.keys(gamestate.allTracks))
    {
        gamestate.allTracks[name].button.style.display = 'inline-block';
        gamestate.allTracks[name].button.onclick = () => {
            modifierAgainst(gamestate, name);
            gamestate.cardBtn.disabled = false;
            for(let tr of Object.keys(gamestate.allTracks))
            {
                gamestate.allTracks[tr].button.style.display = 'none';
            }
        }
    }
}

function buildFortress(gamestate)
{
    if (gamestate.allTracks.sinai.currentPosition >= 2) return;
    gamestate.cardBtn.disabled = true

    gamestate.statusLabel.textContent = `Будете тратить 2 действия?`

    gamestate.yesBtn.style.display = 'inline-block'
    gamestate.yesBtn.onclick = () => {
        gamestate.spendAction();
        gamestate.spendAction();
        gamestate.gaza = 2
        gamestate.cardBtn.disabled = false
        gamestate.yesBtn.style.display = 'none'
        gamestate.noBtn.style.display = 'none'
    }

    gamestate.noBtn.style.display = 'inline-block'
    gamestate.noBtn.onclick = () => {
        gamestate.cardBtn.disabled = false
        gamestate.yesBtn.style.display = 'none'
        gamestate.noBtn.style.display = 'none'
    }
}

function dunsterforce(gamestate)
{
    gamestate.cardBtn.disabled = true
    gamestate.statusLabel.textContent = `Будете тратить 2 действия?`

    gamestate.yesBtn.style.display = 'inline-block'
    gamestate.yesBtn.onclick = () => {
        gamestate.spendAction();
        gamestate.spendAction();
        gamestate.cardBtn.disabled = false
        gamestate.yesBtn.style.display = 'none'
        gamestate.noBtn.style.display = 'none'
    }

    gamestate.noBtn.style.display = 'inline-block'
    gamestate.noBtn.onclick = () => {
        gamestate.changeMorale(-1);
        gamestate.cardBtn.disabled = false
        gamestate.yesBtn.style.display = 'none'
        gamestate.noBtn.style.display = 'none'
    }
}


function forcingTheNarrows(gamestate)
{
    if (gamestate.uboats) return;

    let fortitude = 4
    
    gamestate.cardBtn.disabled = true
    gamestate.rollBtn.disabled = false

    gamestate.defences.push(...gamestate.mines)

    gamestate.statusLabel.textContent = `Отвага: ${fortitude}. Защита: ${gamestate.defences[0]}. Кидайте куб`


    gamestate.rollBtn.onclick = () => {
        if (gamestate.roll() <= 4)
        {
            fortitude--;
            gamestate.statusLabel.textContent = `Отвага: ${fortitude}. Защита Стамбула! Кидайте куб`
        } else gamestate.lose();

        if (fortitude == 0){
            gamestate.statusLabel.textContent = `Британцы разбиты!`
            gamestate.defBtn.style.display = 'none';
            gamestate.mineBtn.style.display = 'none';
            gamestate.cardBtn.disabled = false
            gamestate.rollBtn.disabled = true
        }
    }

    let nextDef = 6
    for (let defence of gamestate.defences.reverse())
    {
        let curry = gamestate.rollBtn.onclick
        let d = defence
        let nextD = nextDef
        gamestate.rollBtn.onclick = () => {
            if (gamestate.roll() <= d)
            {
                fortitude--;
                console.log("couldn't break!")
                gamestate.statusLabel.textContent = `Отвага: ${fortitude}. Защита: ${d}. Кидайте куб`
            } else {
                console.log("moving on...")
                if (nextD < 6)
                    gamestate.statusLabel.textContent = `Отвага: ${fortitude}. Защита: ${nextD}. Кидайте куб`
                else gamestate.statusLabel.textContent = `Отвага: ${fortitude}. Защита Стамбула! Кидайте куб`
                gamestate.rollBtn.onclick = curry;
            }


            if (fortitude == 0){
                gamestate.statusLabel.textContent = `Британцы разбиты!`
                gamestate.defBtn.style.display = 'none';
                gamestate.mineBtn.style.display = 'none';
                gamestate.cardBtn.disabled = false
                gamestate.rollBtn.disabled = true
            }
        }
        nextDef = d
    }

    
}