//console.log("--------------------------------------------------------------------------------" + Game.time + "------------------------------------------------------------------------------------------------------------------------")
var Flag = require('flagPrototype');
//------------------------------running Test-------------------------------------

//Game.flags["test"].updateConstructionFlag(STRUCTURE_CONTAINER)

//deleteEverything()



//------------------------------deleteMemory-------------------------------------

var creepNamesInGame = Object.keys(Game.creeps);



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
    }
}




// Iterate through the Memory.creeps object
for (var creepName in Memory.creeps) {
    // Check if the creep's name is not in the list of creeps in the game
    if (!creepNamesInGame.includes(creepName)) {
        // The creep is not in the game, so delete its memory
        if (creepName.role == "miner"){
            try{
                delete Game.flags[creep.memory.assignedFlag].updateSourceFlag()
            }catch(error){

            }

        }

        delete Memory.creeps[creepName];
        console.log(`Deleted memory for creep: ${creepName}`);
    }
}


//------------------------------flags------------------------------------------

/*
allFlags = Game.flags
console.log(delete Memory.flags)
for (let flag in allFlags){
    allFlags[flag].remove()
}
*/


//------------------------------------initzial flag inisalitation at start of the game-------------------------------------

flags = Game.flags
if(!Memory.flags){
    room = Game.spawns["Spawn1"].room
    let baseFlag = Game.spawns["Spawn1"].pos.createFlag("Base" + room.name,COLOR_BLUE)
    
    if(baseFlag == -3){
        
    }else{
        Game.flags[baseFlag].memory = {
            miningLocation: [],
            haulerTaskList: {},
            requiredHaulerParts: [],
            spawnRequest:[],
            assignedHaulers:[],
            pickUpTask:[],
            deliveryTasks: {[baseFlag]: "deliverToBase"},
            freeHaulers: [],
            generatedEnergy: 0,
            prospectedEnergyOutput: 0,
            energyStoreTarget: 0,
            energyStore:0,
            energySpawn:300,
            targetScouts:0,
            upgraderWorkParts:0,
            assignedEnergyDeliveries:{},
            hasContainer:false,
            hasStorage:false

        }

        //------------------------------------------------------------------------>>>>>>>>>>>>______________ remove this and add the room fuction.
        sources = room.find(FIND_SOURCES)
        for(sourceId in sources){
            pathStep = sources[sourceId].pos.findPathTo(Game.flags[baseFlag])
            let flagName = room.getPositionAt(pathStep[0].x, pathStep[0].y).createFlag(sources[sourceId].id, COLOR_CYAN)
            if(flagName != -3){
                let flag = Game.flags[flagName]
                flag.initialiseSourceFlag(baseFlag) 
            }
        }

        controller = room.controller
        pathStep = controller.pos.findPathTo(Game.flags[baseFlag])
        let flagName = room.getPositionAt(pathStep[2].x, pathStep[2].y).createFlag(controller.id, COLOR_ORANGE)
            if(flagName != -3){
                let flag = Game.flags[flagName]
                flag.initialiseControllerFlag(baseFlag) 
            }
    }
}

//------------------------------- spawn-----------------------------------------------

// Find all flags with COLOR_BLUE
var baseFlag = _.filter(Game.flags, flag => flag.color === COLOR_BLUE);
const baseManager = require('baseManager');


const creepSpawner = require('spawnLogic');
for (i in baseFlag){
    baseManager.manageBase(baseFlag[i])    
    requestedSpawn = baseFlag[i].memory.spawnRequest[0]
    if(requestedSpawn){
        spawn = baseFlag[i].room.find(FIND_MY_SPAWNS)[0]
        var result = creepSpawner.spawnCreep (spawn,requestedSpawn,{})
        if (result === OK){
            baseFlag[i].memory.spawnRequest.splice(0,1)
        }
    }
}

    removeAssignedMiner = function(flagName,creepId){
    delete Game.flags[flagName].memory.assignedMiner[creepId]
}


// ------------------------------ running roles ---------------------------------------------

const miner = require('miner');
const upgrader = require('upgrader');
const hauler = require('hauler');
const scout = require('scout');
const builder = require('builder');

for (const creepName in Game.creeps) {
    let creep = Game.creeps[creepName];
    //if (creep.memory.role === 'harvester') {
    //    harvester.run(creep); // Execute the 'harvester' role logic for this creep
    //}
    
    
    if (creep.memory.role === 'miner') {
        miner.run(creep); // Execute the 'miner' role logic for this creep
    }

    if (creep.memory.role === 'upgrader') {
        upgrader.run(creep); // Execute the 'upgrader' role logic for this creep
    }

    if (creep.memory.role === 'hauler') {
        hauler.run(creep); // Execute the 'hauler' role logic for this creep
    }

    if (creep.memory.role === 'scout') {
        scout.run(creep); // Execute the 'hauler' role logic for this creep
    }

    if (creep.memory.role === 'builder') {
        builder.run(creep); // Execute the 'hauler' role logic for this creep
    }

}

//console.log(`used CPU : ${Game.cpu.getUsed()}`)
