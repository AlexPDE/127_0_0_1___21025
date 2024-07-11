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

dynamicSpawn = (baseRoom:Room) =>{
    let spawning = false
    let request = Memory.baseManager[baseRoom.name].RecquestesSpawns
    let i = 0
    if(request[0]){
        for ( i; i < request.length; i++ ){
            if(!spawning){
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0] 
                let ret: ScreepsReturnCode =-1
                if(request[i].role == MemoryRole.MINER){
                    ret = spawn.spawnTypeCreep(spawn,typeMiner,request[i].target)
                }
                if(request[i].role == MemoryRole.HAULER){
                    ret = spawn.spawnTypeCreep(spawn,typeHauler)
                }
                if(ret == OK){
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i,1)
                }
            }  
        }
    }
}



addBaseFlag = (pos:RoomPosition)=>{
    pos.createFlag(pos.roomName + " base", COLOR_GREEN)
}



addSpawnRequest = (type: string,baseRoom:Room,target?:string) =>{
    if(target){
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push({role:type,target})
    }else{
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push({role:type})
    }
}



addSourceFlagsForRoom = (room:Room, baseRoom:Room) =>{
    var sources = room.find(FIND_SOURCES)
    for (let source of sources){
        let baseFlagName = baseRoom.name +" base"
        let baseFlag = Game.flags[baseFlagName]
        if(baseFlag){
            let path:PathStep[] = source.pos.findPathTo(baseFlag,{ignoreCreeps:true})
            let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)
            addSpawnRequest(MemoryRole.MINER,baseRoom,flagName)
            addSpawnRequest(MemoryRole.HAULER,baseRoom)
            Memory.baseManager
            if((flagName!= -3 && -10)&&Memory.baseManager){
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



addEnergyRequestFlag=(pos:RoomPosition, baseRoom:Room, name:string, type:string)=>{
    let flagName = pos.createFlag(name,COLOR_YELLOW)
    console.log(flagName)
    if((flagName!= -3 && -10)&&Memory.baseManager){
        let flag = Game.flags[flagName]
        flag.memory.assignedBase = baseRoom.name
        flag.memory.type = type
        console.log(Memory.baseManager[baseRoom.name])
        Memory.baseManager[baseRoom.name].energyRequestsFlags.push(name)
    }
}

removeEnergyRequestFlag = (name:string) =>{
    let flag = Game.flags[name]
    if(flag.memory.assignedBase){
        for(let i = 0; i < Memory.baseManager[flag.memory.assignedBase].energyRequestsFlags.length;i++)
            if(Memory.baseManager[flag.memory.assignedBase].energyRequestsFlags[i] == name){
                Memory.baseManager[flag.memory.assignedBase].energyRequestsFlags.splice(i,1)
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
        let baseName = Game.spawns["Spawn1"].room.name
        let baseRoom = Game.spawns["Spawn1"].room
        Memory.baseManager = {
            [baseName]:{     
                sources: [],
                energyRequestsFlags: [],
                RecquestesSpawns:[]
            }
        }
        addBaseFlag(Game.spawns["Spawn1"].pos)
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom,baseRoom)
        addUpgraderFlag(room)

 
        
    }else{
        //------------------------------------------this is only for testing puposes--------------------------------------------
        addUpgraderFlag(Game.rooms["W8N3"])
        removeEnergyRequestFlag("1bc30772347c388")
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
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
    const miner:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.MINER)


    let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})[0]
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
