import {addSpawnRequest} from "./baseManager";



let diedCreepManager:Function;

diedCreepManager = () => {
    for(let i in Memory.creeps){
        if(!Game.creeps[i]){
            console.log(`creep ${i} has died`)
            let creepMemory = Memory.creeps[i]
            if(creepMemory.base){
                switch(creepMemory.role){
                        case"miner":
                            if(creepMemory.base){
                                addSpawnRequest(true,"miner", Game.rooms[creepMemory.base],creepMemory.targetId)
                                delete Memory.creeps[i]
                            }
                            break;


                        case"hauler":
                            addSpawnRequest(true,"hauler",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break;

                        case"builder":
                            addSpawnRequest(true,"builder",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break;

                        case"upgrader":
                            addSpawnRequest(false,"upgrader",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break

                        case"scout":
                            addSpawnRequest(false,"scout",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break

                        default:
                            console.log(`creep has died that has no clarification in diedCreepManagment creepRole: ${creepMemory.role}`)
                    }
                }
        }
    }
}



export default diedCreepManager