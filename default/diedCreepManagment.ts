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
                            console.log("miner has died")
                            if(creepMemory.base){
                                addSpawnRequest("miner", Game.rooms[creepMemory.base],creepMemory.targetId)
                                delete Memory.creeps[i]
                            }
                            break;


                        case"hauler":
                            addSpawnRequest("hauler",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break;

                        case"builder":
                            addSpawnRequest("builder",Game.rooms[creepMemory.base])
                            delete Memory.creeps[i]
                            break;

                        default:
                            console.log(`creep has died that has no clarification in diedCreepManagment creepRole: ${creepMemory.role}`)
                    }
                }
        }
    }
}


export default diedCreepManager