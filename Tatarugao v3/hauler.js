var Creep = require('creepPrototype');
// hauler.js
module.exports = {
    body: [CARRY, MOVE],
    memory: {
        role: "hauler",
        state: "notAssigned"

    },
    run: function(creep) {
        console.log("Hauler run function: switch  " + creep.memory.state)
        switch(creep.memory.state){
            case "notAssigned":
                if(!creep.spwawning){
                    console.log("Unassigned Hauler is gettign assigned: " + Game.flags[creep.memory.assignedBase])
                    Game.flags[creep.memory.assignedBase].memory.freeHaulers.push(creep.id)
                    creep.memory.state = "freeHauler"
                }
                
            break;

            case "freeHauler": 
                console.log(creep + " is available to work in run hauler fuction")
                for(var i; i < Game.flags[creep.memory.assignedBase].memory.unassignedHaulersTasks;i++){
                    if(task = Game.flags[creep.memory.assignedBase].memory.unassignedHaulersTasks[i].amount <= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                        task = Game.flags[creep.memory.assignedBase].memory.unassignedHaulersTasks[i]
                        creep.memory.state = task.type
                        creep.memory.assignedFlag = task.flagName
                        var arrayId = Game.flags[creep.memory.assignedBase].memory.freeHaulers.find(element => element === creep.id)
                        console.log(arrayId)
                    }                
                }
                
                
            break;

            case "pickUpFromSource":
                
                creep.moveTo(Game.flags[creep.memory.assignedFlag])

                creep.getEnergyfromFlag(creep.memory.assignedFlag)
            break;

            case "deliverEnergyToBase": 
                creep.deliverEnergyToBase([creep.memory.assignedBase])
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 ){
                    creep.memory.state = "freeHauler"
                    Game.flags[creep.memory.assignedBase].memory.freeHaulers.push(creep.id)
                }





        }
    }
}