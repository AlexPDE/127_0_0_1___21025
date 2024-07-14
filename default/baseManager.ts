import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";
import { typeMiner } from "./role.miner";
import { typeHauler } from "./role.Hauler";
import EnergyRequestFlagTypes from "./energyRequestFlagTypes";
import { initialiseAnalytics } from "./analytics";
import { typeScout } from "./creepBodys";

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
let addRoomToExploration:Function;
let enableMiningFlag: Function;
let estimateResourcesRequired:Function;

initBaseManager = (room:Room) =>{
    if(!Memory.baseManager){
        //initialisation first tick. 
        console.log(`base Memory is initiated, this should only happen on the first tick.`)
        initialiseAnalytics()
        let baseName = room.name
        let baseRoom = room
        Memory.baseManager = {
            [baseName]:{
                RCL:1,
                sources: [],
                potentialSources: [],
                energyRequests: [],
                RecquestesSpawns:[],
                strategy: "initiate",
                imidiateGoal: "expandSources",
                exploredRooms:{},
                unexploredRooms: {},
            }
        }
        addBaseFlag(Game.spawns["Spawn1"].pos)
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom,baseRoom,true)
        addUpgraderFlag(room)
    }else{
        //------------------------------------------this is only for testing puposes--------------------------------------------
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

addBaseFlag = (pos:RoomPosition)=>{
    try {
        console.log(`base flag is added in room ${pos.roomName}`)
        let flagName = pos.createFlag(pos.roomName, COLOR_GREEN)
        if(flagName != -3 &&flagName != -10){
            //Memory.baseManager[pos.roomName].energyRequests.push(flagName)
            Game.flags[flagName].memory.energyRequired = 0
            Game.flags[flagName].memory.type = "base"
            Game.flags[flagName].memory.extensions = []
            Game.flags[flagName].memory.scheduledDeliverys = []
            Game.flags[flagName].memory.estimatedCPUUsage = 0
            Game.flags[flagName].memory.estimatedEnergyUsage = 0
            Game.flags[flagName].memory.estimatedSpawnUsage = 0
            Game.flags[flagName].memory.energyRequired = 300
            addEnergyRequestFlag()
        }
    } catch (error) {
        console.log("error in add baseFlag")
    }
}


addSourceFlagsForRoom = (room:Room, baseRoom:Room, enableMining:boolean) =>{
    console.log("addSourceFlagsForRoom is running")
    var sources = room.find(FIND_SOURCES)
    for (let source of sources){
        console.log(`add SourceFlagg for ${source}`)
        let baseFlag = Game.flags[baseRoom.name]
        if(baseFlag){
            let path:PathStep[] = source.pos.findPathTo(baseFlag,{ignoreCreeps:true})
            let roomsToTravers = Game.map.findRoute(baseRoom, room)
            let numbRoomsToTravers = 0 
            if(roomsToTravers instanceof Array){
                numbRoomsToTravers = roomsToTravers.length
            }
            let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)

            if((flagName!= -3 && -10)&&Memory.baseManager){
                let flag = Game.flags[flagName]
                flag.memory.type = "source"
                flag.memory.distanceToBase =numbRoomsToTravers*50 + path.length
                flag.memory.estimatedCPUUsage = 5
                flag.memory.estimatedEnergyUsage = 1500/1500
                flag.memory.estimatedSpawnUsage = 15/1500
                flag.memory.assignedBase = baseRoom.name
                Memory.baseManager[baseRoom.name].potentialSources.push(flag.name)
                if(enableMining){
                    enableMiningFlag(flag)
                }
            }
        }
    }	
}

export {addSourceFlagsForRoom}


enableMiningFlag = (flag:Flag) =>{
    try {
        if(flag.memory.assignedBase){
            let baseRoom = Game.rooms[flag.memory.assignedBase]
            console.log(`enable mining for source  ${flag.name}`)
            addSpawnRequest(true,MemoryRole.MINER,baseRoom,flag.name)
            addSpawnRequest(false,MemoryRole.HAULER,baseRoom)
            Memory.baseManager[baseRoom.name].sources.push(flag.name)
            for (let i in Memory.baseManager[baseRoom.name].potentialSources){
                if(Memory.baseManager[baseRoom.name].potentialSources[i] == flag.name){
                    if(Memory.baseManager[baseRoom.name].potentialSources[i]){
                        Memory.baseManager[baseRoom.name].potentialSources.splice(i,1)
                    }
                    
                }
            }
            flag.memory.type = "source"
        }
        
       
    } catch (error) {
        console.log(`error in enableMininfFlag`)
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
        Game.flags[flagName].memory.estimatedCPUUsage = 0
        Game.flags[flagName].memory.estimatedEnergyUsage = 0 
        Game.flags[flagName].memory.estimatedSpawnUsage = 0 
        Game.flags[flagName].memory.scheduledDeliverys = []
    }
}



addEnergyRequestFlag=(pos:RoomPosition, baseRoom:Room, name:string, type:string)=>{
    let flagName = pos.createFlag(name,COLOR_YELLOW)
    if((flagName!= -3 && -10)&&Memory.baseManager){
        let flag = Game.flags[flagName]
        flag.memory.assignedBase = baseRoom.name
        flag.memory.type = type
        flag.memory.estimatedCPUUsage = 0
        flag.memory.estimatedEnergyUsage = 0
        flag.memory.estimatedSpawnUsage = 0
        Game.flags[flagName].memory.scheduledDeliverys = []
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
    try {
        if(baseRoom.controller){
            let path:PathStep[] = baseRoom.controller.pos.findPathTo(Game.flags[baseRoom.name],{ignoreCreeps:true})
            let pos = new RoomPosition(path[0].x, path[0].y, baseRoom.name)
            addEnergyRequestFlag(pos, baseRoom, baseRoom.controller.id,EnergyRequestFlagTypes.UPGRADER)
            addSpawnRequest(false,MemoryRole.UPGRADER,baseRoom)
        } 
    } catch (error) {
        console.log(`error in addUpgraderFlag`)
    }
    
}




baseManager = (room:Room) =>{
try {
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
    let spawnFlag = Game.flags[spawn.room.name]
    switch(strategy){
        case"initiate":
            Memory.baseManager[room.name].strategy = "waitForInitialCreeps"
            break;

        case"waitForInitialCreeps":
            const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
            const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
            const miner:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.MINER)
            const hauler:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HAULER)
            if (miner.length > 0 && hauler.length > 0){
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

    //imideate goal managment like opening up new Mines or upgrading 
    switch(Memory.baseManager[room.name].imidiateGoal){
        case "expandSources":
            let isRequestingMiner = false
            let minDistance = 151
            let closestFlag = "noCloseFlagFound"
            for(let sourceId of Memory.baseManager[room.name].potentialSources){
                let distanceToBase = Game.flags[sourceId].memory.distanceToBase
                if (distanceToBase){
                    if(minDistance > distanceToBase){
                        minDistance = distanceToBase;
                        closestFlag = sourceId
                    }
                }
            }
            if(closestFlag !="noCloseFlagFound"){
                if(Game.flags[closestFlag]){
                    console.log(`the closest Source Flag ${Game.flags[closestFlag]} in room ${Game.flags[closestFlag].room  } will be enabled for mining`)
                    enableMiningFlag(Game.flags[closestFlag])
                }
            }
            Memory.baseManager[room.name].imidiateGoal = "evaluate"
            break;
    
            
        default: 
        console.log(`base manager has an imidiate goal that is undefined ${Memory.baseManager[room.name].imidiateGoal}`)
    }
    Memory.baseManager[room.name].RecquestesSpawns

    //evaluation how much energy is used------------------------
    let estimeteResourcesNow = estimateResourcesRequired(room)
    let cpuLimiting = false
    let energyLimiting = false
    let spawnLimiting = false
    if(estimeteResourcesNow[0]){
        if(estimeteResourcesNow[0] > 0.9){
            cpuLimiting = true
        }
    }
    if(estimeteResourcesNow[1]){
        if(estimeteResourcesNow[1] > 0.9){
            energyLimiting = true
        }
    }
    if(estimeteResourcesNow[2]){
        if(estimeteResourcesNow[2] > 0.9){
            spawnLimiting = true
        }
    }
    console.log(`CPU Estimation: ${estimeteResourcesNow[0]} cpuLimiting ${cpuLimiting} ||EnergyRequired Estimation: ${estimeteResourcesNow[1]} energyLimiting ${energyLimiting} ||Spawn time Estimation: ${estimeteResourcesNow[2]} spawnLimiting ${spawnLimiting}`)
    if(!(cpuLimiting) && !(energyLimiting) && !(spawnLimiting)){
        console.log(`botResources are not limitting. therefore expend mining operation`)
        Memory.baseManager[room.name].imidiateGoal = "expandSources"
    }

} catch (error) {
    console.log("error in baseManager",error)
}
    
}
export default baseManager

estimateResourcesRequired=(room:Room): [Number, Number, Number] =>{

    let sources = Memory.baseManager[room.name].sources
    let energyRequest = Memory.baseManager[room.name].energyRequests
    let ResourceUsers = [sources,energyRequest]
    let estimatedResourcesUse =[]
    let estimatedCPUUsage = 0 
    let estimatedEnergyUsage = 0
    let estimatedSpawnUsage = 0
    let totalEstimatedCPUUsage = 0 
    let totalEstimatedEnergyUsage = 0
    let totalEstimatedSpawnUsage = 0

    for (let i in ResourceUsers) {

        estimatedCPUUsage = 0
        estimatedEnergyUsage = 0
        estimatedSpawnUsage = 0 
        for(let k in ResourceUsers[i]){
            let flag = Game.flags[ResourceUsers[i][k]]
            estimatedCPUUsage = estimatedCPUUsage + flag.memory.estimatedCPUUsage
            estimatedEnergyUsage = estimatedEnergyUsage + flag.memory.estimatedEnergyUsage
            estimatedSpawnUsage = estimatedSpawnUsage + flag.memory.estimatedSpawnUsage
        }
        totalEstimatedCPUUsage = totalEstimatedCPUUsage + estimatedCPUUsage
        totalEstimatedEnergyUsage = totalEstimatedEnergyUsage + estimatedEnergyUsage
        totalEstimatedSpawnUsage = totalEstimatedSpawnUsage + estimatedSpawnUsage
        
    }
    //console.log(`totalEstimatedCPUUsage ${totalEstimatedCPUUsage}`)
    //console.log(`totalEstimatedEnergyUsage ${totalEstimatedEnergyUsage}`)  
    //console.log(`totalEstimatedSpawnUsage ${totalEstimatedSpawnUsage}`)        
    return [totalEstimatedCPUUsage/Game.cpu.limit,totalEstimatedEnergyUsage/Memory.analytics.energyGain.average100Ticks,totalEstimatedSpawnUsage]  
}




