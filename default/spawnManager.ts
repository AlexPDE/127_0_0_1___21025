import MemoryRole from "./memory.creep"
import * as _ from "lodash"
import bodyTypes, { typeScout ,typeHauler, typeMiner, typeBuilder, typeUpgrader, typeFastfiller } from "./creepBodys";

let spawnManager:Function
let addRequestForFastFiller:Function
let addSpawnRequest: Function;
let dynamicSpawn:Function;

spawnManager = (room:Room) => {
    console.log("spawnManager is running")
    const fastFillers:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.FASTFILLER)
    if(Memory.baseManager[room.name].fastFillerActive){
        
    }
}


dynamicSpawn = (baseRoom:Room) =>{
    let spawning = false
    let request = Memory.baseManager[baseRoom.name].RecquestesSpawns
    let i = 0
    if(request[0]){
        for ( i; i < request.length; i++ ){
            if(!spawning){
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0] 
                let ret: ScreepsReturnCode =-1
                if(request[i].role == MemoryRole.MINER &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,typeMiner,request[i].target)
                }
                if(request[i].role == MemoryRole.HAULER &&!spawning){
                    let a:spawnRequestType
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,typeHauler)
                }
                if(request[i].role == MemoryRole.BUILDER &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,typeBuilder,request[i].target)
                }
                if(request[i].role == MemoryRole.UPGRADER &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,typeUpgrader)
                }
                if(request[i].role == MemoryRole.SCOUT &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,typeScout)
                }
                if(ret == OK){
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i,1)
                    let requiredEnergy = baseRoom.energyCapacityAvailable
                    Game.flags[baseRoom.memory.baseFlagName].memory.energyRequired = requiredEnergy
                }
            }  
        }   
    }
}   


addSpawnRequest = (body:BodyPartConstant[], role:string ,baseRoom:Room,target?:string) =>{
    if(target){
        let entry = {body:body, role:role,target:target}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }else{
        let entry = {body:body,role}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }
}



addRequestForFastFiller = (size:string, typeFastfiller:creepType,baseRoom:Room) =>{
    switch(size){
        case bodyTypes.MAXFASTFILLER:
            addSpawnRequest(bodyTypes.MAXFASTFILLER ,typeFastfiller,baseRoom) 
            break
    }
    
}

export {addSpawnRequest}
export {dynamicSpawn}
export {spawnManager}