var Flag = require('flagPrototype');
const { result } = require('lodash');


/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner');
 * mod.thing == 'a thing'; // true
 */

// miner.js
module.exports = {
    body: [WORK, CARRY, MOVE],
    memory: {
        role: "miner",
        state: "assigning",

    },

    run: function(creep) {
        switch(creep.memory.state){
            case "moveToTarget": 
                let target = Game.flags[creep.memory.assignedFlag]
                creep.moveTo(target)
                if(creep.pos.inRangeTo(target,1)){
                    otherCreep = target.pos.lookFor(LOOK_CREEPS)[0]
                    if(otherCreep){
                        if(otherCreep.memory.role =="miner"){
                            otherCreep.memory.state = "dynamicMiner"
                        }
                        otherCreep.moveTo(creep.pos)
                    }
                        
                }

                if(creep.pos.isEqualTo(target)){
                    creep.memory.state = "stationaryHarvest"
                }
            break;

            case "assigning": 
            if(!creep.spawning){
                Game.flags[creep.memory.assignedFlag].addMinerToSourceFlag(creep.id)
                creep.memory.state ="moveToTarget"
                Game.flags[creep.memory.assignedFlag].memory.miningEnable = true

            }  
            break;

            case "stationaryHarvest": creep.harvest(Game.getObjectById(creep.memory.assignedFlag))
            break;

            case "dynamicMiner": if(creep.harvest(Game.getObjectById(creep.memory.assignedFlag))==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.assignedFlag))
            }
            break;

        }


        /*
        if (!creep.memory.target) {
            let target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
            creep.memory.target = target.id;
        } else {
            let target = Game.getObjectById(creep.memory.target);
            if (target) {
                if (target) {
                    // Find all structures of type STRUCTURE_CONTAINER adjacent to the target
                    const nearByContainers = target.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: structure => structure.structureType === STRUCTURE_CONTAINER
                    });
                
                    // nearbyContainers now contains an array of containers adjacent to the target
                    if(!nearByContainers[0] && creep.store[RESOURCE_ENERGY] == 50){
                        const nearbyContainerConstructionSites = target.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                                filter: site => site.structureType === STRUCTURE_CONTAINER
                        });
                        if(!nearbyContainerConstructionSites[0]){
                            creep.memory.state = "placeContainer"
                        }else{
                            creep.memory.state = "buildContainer"
                        }
                        
                    };
                }
                
                switch(creep.memory.state){
                    case "buildContainer":
                        console.log("I want to build a container");
                        const containerSite = target.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                            filter: site => site.structureType === STRUCTURE_CONTAINER
                        })[0];
                        
                        if (containerSite) {
                            creep.build(containerSite);
                        }
                        
                        if(creep.store[RESOURCE_ENERGY] == 0){
                            creep.memory.state = "mine"
                        }
                        break;
                        
                    case "placeContainer": creep.pos.createConstructionSite(STRUCTURE_CONTAINER)
                        break;
                    
                    
                }
                let harvestResult = creep.harvest(target);
                if (harvestResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (harvestResult === ERR_NOT_ENOUGH_RESOURCES || harvestResult === ERR_BUSY) {
                    // Handle these errors accordingly or perform other actions.
                }
            }
        }
        if(!creep.memory.assignedSource){
            let spawn = Game.getObjectById(creep.memory.assignedSpawn)
            const miningPositions = spawn.memory.miningPositions
            for (const sourceId in miningPositions) {
                const miningPosition = miningPositions[sourceId];
                if (miningPosition.MinerID==null) {
                    console.log("There is no Miner assigned to this source, therefore the miner will be assigned now")
                    //Update the mining position with the assigned creep's ID
                    miningPosition.MinerID = creep.id;
                    break;
                }
            }
        }
    */
    }
};