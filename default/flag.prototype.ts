import * as _ from "lodash"

import { forEach, keys } from "lodash"

let initFlagPrototypes:Function

let updateAllFlags:Function

updateAllFlags = () => {
    for (let flagName of keys(Game.flags)){
        let flag = Game.flags[flagName]
        switch (flag.memory.type){
            case"base": 
                flag.updateSpawnFlag(flag)
                break;
            case"source":
                flag.updateEnergySupplyFlag(flag)
                break;

            default: console.log(`Update all flags is not defined for type: ${Game.flags[flagName].memory.type}`)
        }
    }
}

export {updateAllFlags}

initFlagPrototypes= ()=>{

    Flag.prototype.updateEnergySupplyFlag = (flag:Flag) =>{
        if(flag.room){

            
            var scheduledPickupSum = 0
            if(!flag.memory.scheduledPickups){
                flag.memory.scheduledPickups = []
            }
            if(!flag.memory.energyAvailable){
                flag.memory.energyAvailable = 0
            }
            
            for (let i in flag.memory.scheduledPickups){
                // add all scheduled pickups here. 
            }
            var energyAvailable = 0
            let container = flag.pos.lookFor(LOOK_STRUCTURES)[0]
            if (container instanceof StructureContainer){
                energyAvailable = energyAvailable+container.store.getUsedCapacity(RESOURCE_ENERGY)
            }
            var groundEnergy = flag.pos.lookFor(LOOK_ENERGY)
            if(groundEnergy[0]){
                energyAvailable = energyAvailable + groundEnergy[0].amount
            }
            let miner = flag.pos.lookFor(LOOK_CREEPS)[0]
            if(miner){
                energyAvailable = miner.store.getUsedCapacity(RESOURCE_ENERGY)+energyAvailable
            }
            energyAvailable = energyAvailable - scheduledPickupSum
            flag.memory.energyAvailable = energyAvailable
        }
    }
    
    Flag.prototype.removeConstructionFlag = (flag:Flag) =>{
        if(flag.memory.assignedBase){
            let requestFlags = Memory.baseManager[flag.memory.assignedBase].energyRequests
            if(requestFlags){
                for (let i= 0;i< requestFlags.length;i++){
                    if (requestFlags[i] == flag.name){
                        requestFlags.splice(i,1)
                        flag.remove()
                    }
                }
            }
        }

        
    }

    Flag.prototype.updateUpgraderFlag = (flag:Flag) =>{
        let container = flag.pos.lookFor(LOOK_STRUCTURES)[0]
        if (container instanceof StructureContainer){
            flag.memory.energyRequired = container.store.getFreeCapacity(RESOURCE_ENERGY)
        }
    }


    Flag.prototype.updateSpawnFlag = (flag:Flag) =>{
        // check the energy required
        let scheduledDeliverys = flag.memory.scheduledDeliverys
        let eneryOnRoute = 0
        if(scheduledDeliverys){        
            for (let i = 0 ; i < scheduledDeliverys.length;i++){
                let creep = Game.getObjectById(scheduledDeliverys[i].creepId)
                if(creep ===null){
                    if(scheduledDeliverys[i]){}
                    scheduledDeliverys.splice(i,1);

                }
                else{
                    eneryOnRoute = eneryOnRoute + scheduledDeliverys[i]["amount"]
                }
            }
        }
        if(flag.room){
            flag.memory.energyRequired = flag.room.energyCapacityAvailable-flag.room?.energyAvailable - eneryOnRoute
        }
        

        //add Extensions to the room 
        if(flag.room){
            let extensions = flag.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType ==STRUCTURE_EXTENSION})
            for (let i = 0 ; i < extensions.length ; i++){
                let willAdd = true
                for (let k of flag.memory.extensions){
                    if (k == extensions[i].id){
                        willAdd = false
                    }
                }
                if(willAdd){
                    flag.memory.extensions.push(extensions[i].id)
                    //addEnergyRequestFlag(extensions[i].pos, extensions[i].room, extensions[i].id, "extension")
                }
            }
            
        }
    }
}

export default initFlagPrototypes

