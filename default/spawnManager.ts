import MemoryRole from "./memory.creep"
import * as _ from "lodash"
import { typeScout ,typeHauler, typeMiner, typeBuilder, typeUpgrader, typeFastfiller } from "./creepBodys";

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
                    ret = spawn.spawnTypeCreep(request[i].maxSize,spawn,typeMiner,request[i].target)
                }
                if(request[i].role == MemoryRole.HAULER &&!spawning){
                    let a:spawnRequestType
                    ret = spawn.spawnTypeCreep(request[i].maxSize,spawn,typeHauler)
                }
                if(request[i].role == MemoryRole.BUILDER &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].maxSize,spawn,typeBuilder,request[i].target)
                }
                if(request[i].role == MemoryRole.UPGRADER &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].maxSize,spawn,typeUpgrader)
                }
                if(request[i].role == MemoryRole.SCOUT &&!spawning){
                    ret = spawn.spawnTypeCreep(request[i].maxSize,spawn,typeScout)
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


addSpawnRequest = (maxSize:string, role:string ,baseRoom:Room,target?:string) =>{
    if(target){
        let entry = {maxSize:maxSize, role:role,target:target}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }else{
        let entry = {maxSize:maxSize,role}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }
}



addRequestForFastFiller = (typeFastfiller:creepType,baseRoom:Room) =>{
    addSpawnRequest(typeFastfiller,baseRoom) 
}

export {addSpawnRequest}
export {dynamicSpawn}
export {spawnManager}