class Card
{
    constructor(name, actions, advancing, retreating, effect) {
        this.name = name
        this.actions = actions
        this.advancing = advancing
        this.retreating = retreating
        this.effect = effect
    }
}

export const sunriseDeck = [
    new Card("Armenian Volunteer Units", 2, ["arab", "caucasus", "sinai"]),
    new Card("Senussi Revolt", 2, ["mesopotamia", "galipoli"], ["sinai"]),
    new Card("Goeben dominates Black Sea", 2, ["arab", "sinai"], ["salonika", "caucasus"]),
    new Card("Bulgaria Joins the Central Powers", 1, ["mesopotamia", "sinai"]),
    new Card("Enver to The Front", 2, ["caucasus", "sinai"], []), // Both offensives against Caucasus
    new Card("Intelligence Bureau of the East", 1, ["mesopotamia"]), // Allow Intelligence
    new Card("Galipoli Landings", 2, ["arab", "caucasus"]), // +Gallipoli, -Seddulbahir (the narrows)
    new Card("Ghadar Conspiracy", 2, ["arab", "caucasus", "galipoli"]),
    new Card("Gorlice-Tarnow", 3, ["caucasus", "sinai"]), // eastern theater [2]
    new Card("Second Battle of Ypres", 1, ["caucasus", "sinai"]), // western [4]
    new Card("Grand Duke Nicholas Takes Control", 3, ["mesopotamia", "galipoli", "salonika"]), // set Caucasus to 3
    new Card("Turkish Minelaying", 2, ["arab", "caucasus"]), // free minefield, +1 to rolls vs Mesopotamia 
    new Card("Jihad Declared!", 2, ["mesopotamia", "caucasus", "sinai"]) // shuffle mid-day, +1 to all rolls
]