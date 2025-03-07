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
    new Card("King Constantine Flees Greece", "", 3, ["caucasus", "galipoli", "salonika"], [], (gs)=>{modifierAgainst(gs, "salonika", -1)}), // -1 to salonika
    new Card("SANDSTORMS", "", 1, ["arab"], [], sandstorms), // die 1-3: retreat mes, 4-6: sinai, no offence vs them
    new Card("Kaiserschlacht!", "", 4, ["caucasus", "mesopotamia"], []), // TODO kaiserchlacht enabled, +1 vs all incl. KS
    new Card("U-Boat Campaign", "", 3, ["arab", "mesopotamia", "sinai"], [],(gs)=>{battle(gs, 'sea', 4);}), // sea [4]
    new Card("Lawrence Stirs the Arabs", "", 1, ["caucasus"], [],(gs)=>{setStrength(gs, "arab", 3);}), // arab = 3
    new Card("Galipoli Evacuation", "", 3, ["mesopotamia", "sinai"], [], (gs)=>{gs.removeTrack("galipoli"); setStrength(gs, "salonika", 3);}), // remove galipoli, if on-map salonika=3
    new Card("Victorio Venero", "", 3, ["arab", "galipoli", "salonika"], [],(gs)=>{battle(gs, 'east', 4);}), // eastern [4]
    new Card("Hoffman Offensive", "", 3, ["arab", "sinai"], [],(gs)=>{modifierAgainst(gs, "caucasus")}), // +1 vs caucasus
    new Card("Army of Islam", "", 2, ["arab", "mesopotamia", "sinai"], [],(gs)=>{modifierAll(gs)}), // +1 vs all
    new Card("War Weariness", "", 0, [], []), // TODO war weariness (-1 to foreign)
                                            // die roll: 1-sinai, 2-mesopotamia, 3/4-arab, 5/6-galipoli+salonika
    new Card("Balfour Declaration", "", 2, ["arab", "galipoli", "mesopotamia"], [],(gs)=>{modifierAgainst(gs, "sinai")}), // +1 vs sinai
    new Card("Allenby Takes the Helm", "", 2, ["caucasus", "arab"], [],(gs)=>{setStrength(gs, "sinai", 4);}), // sinai = 4
    new Card("Dunsterforce", "", 2, ["arab", "sinai"], []), //  TODO skip a turn, or -1 morale
    new Card("Bolshevik Revolution", "", 2, ["arab", "salonika", "sinai"], [], (gs)=>{gs.removeTrack("caucasus")}), // remove caucasus
]

export const middayDeck = [
    new Card("Yildrim", "", 1, ["caucasus", "salonika"], []), // TODO 3 tokens to stop mesopotamia/sinai
    new Card("Verdun", "", 1, ["caucasus", "mesopotamia"], [], (gs)=>{battle(gs, 'west', 4);}), // western [4]
    new Card("Arab Revolt","", 2, ["mesopotamia", "sinai"], [], (gs)=>{gs.showTrack("arab");}), // arab 2
    new Card("Erzurum Offensive","", 2, ["caucasus"], [], blockCaucasus), // no caucasus for turn
    new Card("Central Powers in Afghanistan","", 3, ["mesopotamia", "caucasus", "sinai"], [], (gs)=>{coup(gs,"afghanistan");}), // Afghan coup
    new Card("Yudenich Named Commander in Chief","", 2, ["arab","mesopotamia"], [], (gs)=>{setStrength(gs, "caucasus", 4);}), //  caucasus = 4
    new Card("Asia Korps","", 3, ["mesopotamia"],[]), // TODO Choose a front. +1 to all offensives there
    new Card("Wassmuss in Persia","Переворот в Персии", 2, ["caucasus", "galipoli"],[],(gs)=>{coup(gs,"persia");}), // Persia coup
    new Card("Landings at Salonika","", 1, ["caucasus"], [],(gs)=>{gs.showTrack("salonika");}), // salonika 2
    new Card("Provisional Government Takes Charge","", 2, ["galipoli", "salonika", "sinai"]), // TODO caucasus -1 permanently, retreat or place
    new Card("Brusilov Offensive","", 1, ["salonika"],[],(gs)=>{battle(gs, 'east', 3);}), // eastern [3]
    new Card("Jutland","", 2, ["galipoli", "salonika", "mesopotamia"], [],(gs)=>{battle(gs, 'sea', 5);}), // sea [5]
    new Card("Forcing the Narrows","", 2, ["arab", "caucasus"]), // TODO resolve FTN
    new Card("Fortification of Gaza-Beersheba line","", 2, ["arab", "salonika", "mesopotamia"]), // TODO can skip a turn to build if sinai < 2
    new Card("Mesopotamian Siege","", 1, ["caucasus", "salonika"], [], siegeOfKut), // +morale, mesopotamia back to 0 space, but str=4
    new Card("Armenian Massacres","", 3, ["galipoli", "salonika", "sinai"], [], blockCaucasus), // no caucasus for turn
    new Card("The Somme","", 1, ["galipoli", "salonika"], [], (gs)=>{battle(gs, 'west', 3);}), // western [3]
    new Card("German U-Boats","", 2, ["caucasus", "sinai"]), // TODO No FTN, +1 vs galipoli, +2 vs salonika
    new Card("Italy Joins the War","", 2, ["arab", "salonika"],[],(gs)=>{battle(gs, 'east', 3);}), // eastern [3]
    new Card("Suvla Landing","", 2, ["galipoli", "caucasus", "sinai"],[],(gs)=>{setStrength(gs, "galipoli", 3);}), // if on map galipoli = 3

    new Card("Sinai Pipeline","", 1, ["galipoli", "salonika"],[],buildPipeline) // pipeline built, arab 2 on map, shuffle dusk
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


function enver(gamestate)
{
    gamestate.forceCaucasus = true
}

function intelligence(gamestate)
{
    gamestate.intelligenceAllowed = true
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
        if (gamestate.roll() > 5)
            gamestate.changeMorale(+1) 
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
        if (gamestate.roll() + gamestate[`${theater}Res`] > strength)
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