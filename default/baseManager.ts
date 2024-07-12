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
let addConstructionFlag:Function

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
                    ret = spawn.spawnTypeCreep(spawn,typeMiner,request[i].target)
                }
                if(request[i].role == MemoryRole.HAULER &&!spawning){
                    ret = spawn.spawnTypeCreep(spawn,typeHauler)
                }
                if(request[i].role == MemoryRole.BUILDER &&!spawning){
                    ret = spawn.spawnTypeCreep(spawn,typeBuilder,request[i].target)
                }
                if(ret == OK){
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i,1)
                    let requiredEnergy = baseRoom.energyCapacityAvailable
                    console.log(baseRoom.energyCapacityAvailable ,baseRoom.energyAvailable,requiredEnergy)
                    Game.flags[baseRoom.memory.baseFlagName].memory.energyRequired = requiredEnergy

                }
            }  
        }   
    }
}   



addSpawnRequest = (type: string,baseRoom:Room,target?:string) =>{
    if(target){
        let entry = {role:type,target:target}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }else{
        let entry = {role:type}
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry)
    }
}


addBaseFlag = (spawn:StructureSpawn)=>{

    let flagName = spawn.pos.createFlag(spawn.id, COLOR_GREEN)
    if(flagName != -3 &&flagName != -10){
        Memory.baseManager[spawn.pos.roomName].energyRequests.push(flagName)
        Game.flags[flagName].memory.type = "base"
        spawn.room.memory.baseFlagName = flagName
    }
}


addSourceFlagsForRoom = (room:Room, baseRoom:Room) =>{
    console.log(room)
    var sources = room.find(FIND_SOURCES)
    console.log(sources)
    for (let source of sources){
        let baseFlag = Game.flags[baseRoom.memory.baseFlagName]
        if(baseFlag){
            let path:PathStep[] = source.pos.findPathTo(baseFlag,{ignoreCreeps:true})
            let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)

            if((flagName!= -3 && -10)&&Memory.baseManager){
                addSpawnRequest(MemoryRole.MINER,baseRoom,flagName)
                addSpawnRequest(MemoryRole.HAULER,baseRoom)
                Memory.baseManager[baseRoom.name].sources.push(source.id)
                Game.flags[flagName].memory.hasMiner = false
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
                sources: [],
                energyRequests: [Game.spawns["Spawn1"].id],
                RecquestesSpawns:[]
            }
        }
        addBaseFlag(Game.spawns["Spawn1"])
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom,baseRoom)
        addUpgraderFlag(room)
        
        Flag

    }else{
        //------------------------------------------this is only for testing puposes--------------------------------------------
        //addSpawnRequest(MemoryRole.HAULER,Game.rooms["W8N3"])
        //addUpgraderFlag(Game.rooms["W8N3"])
        //removeEnergyRequestFlag("1bc30772347c388")
        // removeSourceFlag(Game.flags["26f20772347f879"],Game.spawns["Spawn1"].room)
        // removeSourceFlag(Game.flags["71ac0772347ffe6"],Game.spawns["Spawn1"].room)
        
        // delete Memory.baseManager
    }

    //--------------------------------------------------------------------------------------------------------
//     var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})
//     if(!baseflag[0]){
//         console.log(`there is no base flag`)

//     var sourceflags = room.find(FIND_FLAGS,{filter:{color:COLOR_ORANGE}})
//             for ( var i in sourceflags){
//                 sourceflags[i].updateEnergySupplyFlag(sourceflags[i])
//             }
//         var demandFlags = room.find(FIND_FLAGS,{filter:{color:COLOR_YELLOW}})
//         if(!demandFlags[0]){
//             if(room.controller){
//                 let path:PathStep[] = room.controller.pos.findPathTo(baseflag[0],{ignoreCreeps:true})
//                 let flagName = room.createFlag(path[0].x,path[0].y,room.controller.id, COLOR_YELLOW)
//                 Game.flags[flagName].memory.energyRequired = 0
//                 Game.flags[flagName].memory.scheduledDeliverys = []
//                 if((flagName!= -3 && -10)&&Memory.baseManager){
//                     addSpawnRequest(MemoryRole.UPGRADER,room,flagName)
//                 }
//             }        
//         }

//     }
 }

baseManager = (room:Room) =>{
    initBaseManager(room)
    dynamicSpawn(room)
    const harvester:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HARVESTER)
    const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
    
    const miner:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.MINER)
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
    let constructionFlag = room.find(FIND_FLAGS,{filter:{color:COLOR_BROWN}})[0]
    let constructionsSite = room.find(FIND_MY_CONSTRUCTION_SITES)[0]
    if(!constructionFlag &&constructionsSite){
        addConstructionFlag(constructionsSite, room)
        if(builder.length == 0){
            addSpawnRequest(MemoryRole.BUILDER,room,constructionsSite.id)
        }
    }


    // let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    // var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})[0]
    // if(!spawn.spawning){
    //     if(baseflag){
    //         if(baseflag.memory.BaseManager){
    //             let i: keyof typeof baseflag.memory.BaseManager.requestedCreeps
    //             for(i in baseflag.memory.BaseManager.requestedCreeps){
                    
    //                 var request = baseflag.memory.BaseManager.requestedCreeps[i]
    //                 for (var k in request){
    //                     if( i == "minerRequest"){
    //                         console.log(`miner is requested for source ${request}`)
    //                         var ret = spawn.spawnTypeCreep(spawn,typeMiner,request[k])
    //                         if(ret===OK){
    //                             var index = request.indexOf(request[k]);
    //                             if (index !== -1) {
    //                                 baseflag.memory.BaseManager.requestedCreeps[i].splice(index, 1);
    //                             }
    //                         }
    //                     }
    //                 }
                    
    //             }
    //         }
    //     }else
        // if (harvester.length <1){
        //     console.log(`trying to spawn harvester currently ${harvester.length} exist`)
        //     spawn.spawnTypeCreep(spawn,typeHarvester)
        // }else
        // if (miner.length <1){
        //     console.log(`trying to spawn upgrader currently ${builder.length} exist`)
        //     spawn.spawnTypeCreep(spawn,typeMiner)
        // }else
        // if (upgrader.length <1){
        //     console.log(`trying to spawn upgrader currently ${upgrader.length} exist`)
        //     spawn.spawnTypeCreep(spawn,typeUpgrader)
        // }else
        //  if (builder.length <1){
        //      console.log(`trying to spawn upgrader currently ${builder.length} exist`)
        //     spawn.spawnTypeCreep(spawn,typeBuilder)
        //  }
    }
    

export default baseManager


