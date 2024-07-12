import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";
import { typeMiner } from "./role.miner";
import { typeHauler } from "./role.Hauler";
import EnergyRequestFlagTypes from "./energyRequestFlagTypes";

let baseManager: Function;
let initBaseManager:Function;
let addBaseFlag:Function;
let addSourceFlagsForRoom:Function;
let removeSourceFlag:Function;
let addEnergyRequestFlag:Function;
let addSpawnRequest: Function;
let dynamicSpawn:Function;
let addUpgraderFlag:Function;
let removeEnergyRequestFlag:Function;
let addConstructionFlag:Function;
let removeConstructionFlag:Function;

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



addSpawnRequest = (maxSize:boolean, type: string,baseRoom:Room,target?:string) =>{
    if(target){
        let entry = {maxSize:maxSize, role:type,target:target}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }else{
        let entry = {maxSize:maxSize,role:type}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }
}

export {addSpawnRequest}




addBaseFlag = (spawn:StructureSpawn)=>{

    let flagName = spawn.pos.createFlag(spawn.id, COLOR_GREEN)
    if(flagName != -3 &&flagName != -10){
        Memory.baseManager[spawn.pos.roomName].energyRequests.push(flagName)
        Game.flags[flagName].memory.type = "base"
        Game.flags[flagName].memory.extensions = []
        spawn.room.memory.baseFlagName = flagName
    }

}

addSourceFlagsForRoom = (room:Room, baseRoom:Room) =>{
    var sources = room.find(FIND_SOURCES)
    for (let source of sources){
        let baseFlag = Game.flags[baseRoom.memory.baseFlagName]
        if(baseFlag){
            let path:PathStep[] = source.pos.findPathTo(baseFlag,{ignoreCreeps:true})
            let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)

            if((flagName!= -3 && -10)&&Memory.baseManager){
                addSpawnRequest(true,MemoryRole.MINER,baseRoom,flagName)
                addSpawnRequest(false,MemoryRole.HAULER,baseRoom)
                Memory.baseManager[baseRoom.name].sources.push(source.id)
                Game.flags[flagName].memory.hasMiner = false
                Game.flags[flagName].memory.type = "source"
                Game.flags[flagName].pos.createConstructionSite(STRUCTURE_CONTAINER)
            }
        }
    }	
}


removeSourceFlag = (flag:Flag,baseRoom:Room) =>{
    if(Memory.baseManager){
        let memEntry: string
        if(flag){
            flag.remove()
        }else{
            console.log(`remove Source Flag is trying to remove flag ${flag} that does't exist.`)
        }  
    }
}

addConstructionFlag = (constructionsSite: ConstructionSite,baseRoom:Room) =>{
    let flagName = constructionsSite.pos.createFlag(constructionsSite.id,COLOR_BROWN)
    Memory.baseManager[baseRoom.name].energyRequests.push(constructionsSite.id)
    if(flagName != -3 &&flagName != -10){
        Game.flags[flagName].memory.energyRequired = constructionsSite.progressTotal
        Game.flags[flagName].memory.type = "construction"
        Game.flags[flagName].memory.assignedBase = baseRoom.name
    }
}




addEnergyRequestFlag=(pos:RoomPosition, baseRoom:Room, name:string, type:string)=>{
    let flagName = pos.createFlag(name,COLOR_YELLOW)
    if((flagName!= -3 && -10)&&Memory.baseManager){
        let flag = Game.flags[flagName]
        flag.memory.assignedBase = baseRoom.name
        flag.memory.type = type
        Memory.baseManager[baseRoom.name].energyRequests.push(name)
    }
}
export {addEnergyRequestFlag}

removeEnergyRequestFlag = (name:string) =>{
    let flag = Game.flags[name]
    if(flag.memory.assignedBase){
        for(let i = 0; i < Memory.baseManager[flag.memory.assignedBase].energyRequests.length;i++)
            if(Memory.baseManager[flag.memory.assignedBase].energyRequests[i] == name){
                Memory.baseManager[flag.memory.assignedBase].energyRequests.splice(i,1)
            }
    }
    flag.remove()
}



addUpgraderFlag=(baseRoom:Room)=>{
    if(baseRoom.controller){
        let path:PathStep[] = baseRoom.controller.pos.findPathTo(Game.flags[baseRoom.name],{ignoreCreeps:true})
        let pos = new RoomPosition(path[0].x, path[0].y, baseRoom.name)
        addEnergyRequestFlag(pos, baseRoom, baseRoom.controller.id,EnergyRequestFlagTypes.UPGRADER)
        addSpawnRequest(false,MemoryRole.UPGRADER,baseRoom)
    }
}

initBaseManager = (room:Room) =>{
    if(!Memory.baseManager){
        //initialisation first tick. 
        console.log(`base Memory is initiated, this should only happen on the first tick.`)
        let baseName = room.name
        let baseRoom = room
        Memory.baseManager = {
            [baseName]:{
                RCL:1,
                sources: [],
                energyRequests: [Game.spawns["Spawn1"].id],
                RecquestesSpawns:[],
                strategy: "initiate",
            }
        }
        addBaseFlag(Game.spawns["Spawn1"])
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom,baseRoom)
        addUpgraderFlag(room)
    }else{
        //------------------------------------------this is only for testing puposes--------------------------------------------
    }
 }

baseManager = (room:Room) =>{
    initBaseManager(room)
    dynamicSpawn(room)

    // ---------------------------------------------- construction Management----------------------------------------------------
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
    let constructionFlag = room.find(FIND_FLAGS,{filter:{color:COLOR_BROWN}})[0]
    let constructionsSite = room.find(FIND_MY_CONSTRUCTION_SITES)[0]
    if(!constructionFlag &&constructionsSite){
        addConstructionFlag(constructionsSite, room)
        if(builder.length == 0){
            addSpawnRequest(true,MemoryRole.BUILDER,room,constructionsSite.id)
        }
    }
    //------------------------------------- base stategy -----------------------------------

    let strategy = Memory.baseManager[room.name].strategy
    let spawn = room.find(FIND_MY_SPAWNS)[0]
    let upgraderFlag = spawn.room.find(FIND_FLAGS,{filter:{color:COLOR_YELLOW}})[0]
    let spawnFlag = Game.flags[spawn.id]
    switch(strategy){
        case"initiate":
            Memory.baseManager[room.name].strategy = "waitForInitialCreeps"
            break;

        case"waitForInitialCreeps":
            const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
            const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
            const miner:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.MINER)
            const hauler:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HAULER)
            if (builder.length > 0 && upgrader.length > 0 && miner.length > 0 && hauler.length > 0){
                Memory.baseManager[room.name].strategy = "pushToRCL2"
                addSpawnRequest(false,MemoryRole.SCOUT,room)
            }

            break;

        case"pushToRCL2":
            if(room.controller){
                if(room.controller.level ==2){
                    
                    Memory.baseManager[room.name].strategy = "planRCL2Base"
                }
            }
            break;


        case"planRCL2Base":
            
            let extensionPos: RoomPosition
            extensionPos = new RoomPosition(spawn.pos.x +1, spawn.pos.y, room.name)
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION)
            extensionPos = new RoomPosition(spawn.pos.x +2, spawn.pos.y, room.name)
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION)
            extensionPos = new RoomPosition(spawn.pos.x +3, spawn.pos.y, room.name)
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION)
            extensionPos = new RoomPosition(spawn.pos.x +4, spawn.pos.y, room.name)
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION)
            extensionPos = new RoomPosition(spawn.pos.x +5, spawn.pos.y, room.name)
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION)
            Memory.baseManager[room.name].strategy = "buildRCL2BaseExtenstions"
            break;

        case"buildRCL2BaseExtenstions":
            if(spawn.room.energyCapacityAvailable == 550){
                Memory.baseManager[room.name].strategy = "planRCL2UpgraderContainer"
            }
            spawnFlag.updateSpawnFlag(spawnFlag)
            
            break;

        case"planRCL2UpgraderContainer":
            if(upgraderFlag){
                upgraderFlag.pos.createConstructionSite(STRUCTURE_CONTAINER)
            }
            Memory.baseManager[room.name].strategy = "buildRCL2UpgraderContainer"
            
            break;

        case"buildRCL2UpgraderContainer":
            upgraderFlag.updateUpgraderFlag(upgraderFlag)
            break;


        case"buildRCL2Base":
            Memory.baseManager[room.name].strategy = "buildRCL2BaseExtenstions"
            
            break;


        default:console.log(`strategy set in BaseManager for ${room.name} is not defined: ${strategy}`)
    }
}
    

export default baseManager



