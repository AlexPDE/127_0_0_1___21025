import MemoryRole from "./memory.creep"
import * as _ from "lodash"
import bodyTypes, { typeScout ,typeHauler, typeMiner, typeBuilder, typeUpgrader, typeFastfiller } from "./creepBodys";

let spawnManager:Function
let addRequestForFastFiller:Function
let addSpawnRequest: Function;
let dynamicSpawn:Function;
let addMaxSizeRequest:Function
let addRequestForMiner:Function
let addRequestForHauler:Function

spawnManager = (room:Room) => {
    console.log("spawnManager is running")
    const fastFillers:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.FASTFILLER)
    if(Memory.baseManager[room.name].fastFillerActive){
        
    }
}


dynamicSpawn = (baseRoom:Room) =>{
    let spawning = false
    let request = Memory.baseManager[baseRoom.name].requestedSpawns
    let i = 0
    if(request[0]){
        for ( i; i < request.length; i++ ){
            if(!spawning){
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0] 
                let ret: ScreepsReturnCode
                if(request[i].target){
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,request[i].role,request[i].target)
                }else{
                    ret = spawn.spawnTypeCreep(request[i].body,spawn,request[i].role,spawn)
                }             
                
                // if(request[i].role == MemoryRole.MINER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeMiner,request[i].target)
                // }
                // if(request[i].role == MemoryRole.HAULER &&!spawning){
                //     let a:spawnRequestType
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeHauler)
                // }
                // if(request[i].role == MemoryRole.BUILDER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeBuilder,request[i].target)
                // }
                // if(request[i].role == MemoryRole.UPGRADER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeUpgrader)
                // }
                // if(request[i].role == MemoryRole.SCOUT &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeScout)
                // }
                if(ret == OK){
                    spawning = true;
                    Memory.baseManager[baseRoom.name].requestedSpawns.splice(i,1)
                    let requiredEnergy = baseRoom.energyCapacityAvailable
                    Game.flags[baseRoom.memory.baseFlagName].memory.energyRequired = requiredEnergy
                }
            }  
        }   
    }
}   


addSpawnRequest = (body:BodyPartConstant[], role:string ,baseRoom:Room,target?:string) =>{
    console.log("addSpawnRequest is running")
    console.log("target", target)
    if(target){
        console.log("add spawn has target ",target)
        let entry = {body:body, role:role,target:target}
        console.log("add spawn has targer ")
        console.log("Memory.baseManager[baseRoom.name] ", Memory.baseManager[baseRoom.name])
        Memory.baseManager[baseRoom.name].requestedSpawns.push(entry)
    }else{
        let entry = {body:body,role}
        Memory.baseManager[baseRoom.name].requestedSpawns.push(entry)
    }
}

addRequestForMiner = (baseRoom:Room, target:string) => {
        let body = addMaxSizeRequest(typeMiner, baseRoom)
        console.log("typeMiner" , typeMiner.role)
        addSpawnRequest(body, typeMiner.role,baseRoom,target) 
}

addRequestForHauler = (size:string,baseRoom:Room) =>{
    switch(size){
        case "min":
            addSpawnRequest(typeHauler.baseBody, typeHauler.role,baseRoom) 
    }
}


addRequestForFastFiller = (size:string,baseRoom:Room) =>{
    switch(size){
        case bodyTypes.MAXFASTFILLER:
            let body = addMaxSizeRequest(typeFastfiller, baseRoom)
            addSpawnRequest(body, typeFastfiller.role,baseRoom) 
            break;

        default: console.log(`in addRequestForFastFiller a bodyType is asked for that doesn´t exist ${size}`)
    }
    
}

addMaxSizeRequest = (creepBodyType: creepType, baseRoom:Room)=>{
    
    let body = []
    let bodyToAdd = []
    let basebody = creepBodyType.baseBody
    let costBody = 0
    let costBodyToAdd = 0 
    
    for (let i = 0 ; i <basebody.length; i++){
            body.push(basebody[i])
            costBody = costBody + BODYPART_COST[basebody[i]]
    }

    let addBody = creepBodyType.body
    for (let k = 0 ; k<addBody.length;k++){
        bodyToAdd.push(addBody[k])
        costBodyToAdd = costBodyToAdd + BODYPART_COST[addBody[k]]
    }

    let numbBodyToAddMaxRoom = Math.floor((baseRoom.energyCapacityAvailable - costBody)/costBodyToAdd)
    let numbBodyToAdd = Math.min(numbBodyToAddMaxRoom,creepBodyType.max)

    for ( let i = 0 ; i < numbBodyToAdd ; i++){
        for ( let k = 0 ; k < bodyToAdd.length; k++){
            body.push(bodyToAdd[k])
        }
    }
    
    return body
}

        

export {addRequestForFastFiller, addRequestForMiner, addRequestForHauler}
export {addSpawnRequest}
export {dynamicSpawn}
export {spawnManager}