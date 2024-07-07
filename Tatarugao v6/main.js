//console.log("--------------------------------------------------------------------------------" + Game.time + "------------------------------------------------------------------------------------------------------------------------")
var Flag = require('./BaseManager/flagPrototype.js');
var Room = require('src/BaseManager/roomPrototype.js');

//------------------------------running Test-------------------------------------




function deleteEverything(){
    allFlags = Game.flags
    console.log(delete Memory.flags)
    constructionSites = Game.constructionSites
    for (let i in constructionSites){
        constructionSites[i].remove()
    }
    for (let flag in allFlags){
        allFlags[flag].remove()
    }
    for ( i in Game.creeps){
        Game.creeps[i].suicide()
    }
    if(Memory){
        delete Memory.creeps
        delete Memory.flags
    }
}
Game.
deleteEverything()

//------------------------------deleteMemory-------------------------------------

var creepNamesInGame = Object.keys(Game.creeps);

// Iterate through the Memory.creeps object
for (var creepName in Memory.creeps) {
    // Check if the creep's name is not in the list of creeps in the game
    if (!creepNamesInGame.includes(creepName)) {
        // The creep is not in the game, so delete its memory
        delete Memory.creeps[creepName];
        console.log(`Deleted memory for creep: ${creepName}`);
    }
}
// initial start of the game.
if(!Memory.creeps && !Memory.flags){
    Game.spawns["Spawn1"].room.initiateBase()
}

//runBaseManager


