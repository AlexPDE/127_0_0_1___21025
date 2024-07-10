import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";
import { typeMiner } from "./role.miner";

let baseManager: Function;
let initBaseManager:Function;
let addBaseFlag:Function;
let addSourceFlagsForRoom:Function;
let removeSourceFlag:Function;

addBaseFlag = (pos:RoomPosition)=>{
    pos.createFlag(pos.roomName + " base", COLOR_GREEN)
}

addSourceFlagsForRoom = (room:Room, baseRoom:Room) =>{
    var sources = room.find(FIND_SOURCES)
    for (let source of sources){
        let baseFlagName = baseRoom.name +" base"
        let baseFlag = Game.flags[baseFlagName]
        if(baseFlag){
            let path:PathStep[] = source.pos.findPathTo(baseFlag,{ignoreCreeps:true})
            let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)
            console.log(flagName)
            //if soucessfull add to baseManager the source Flag. And add removing function
        }
    }	
}

removeSourceFlag = (flag:Flag,baseRoom:Room) =>{
    
    if(Memory.baseManager){
        console.log(baseRoom.name)
        let memEntry: string
        Memory.baseManager["roomName"]
        console.log(Memory.baseManager)

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
                sources:[],
            }
        }
        addBaseFlag(Game.spawns["Spawn1"].pos)
        addSourceFlagsForRoom(baseRoom,baseRoom)
 
        
    }else{
        //------------------------------------------this is only for testing puposes--------------------------------------------
        
        removeSourceFlag(Game.flags["26f20772347f879"],Game.spawns["Spawn1"].room)
        delete Memory.baseManager
    }

    //--------------------------------------------------------------------------------------------------------
    var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})
    if(!baseflag[0]){
        console.log(`there is no base flag`)

        var spawn = room.find(FIND_MY_SPAWNS)[0]
        console.log(spawn)
        if(spawn){
            let baseFlagName =spawn.pos.createFlag(spawn.name,COLOR_GREEN)
            let baseflag = Game.flags[baseFlagName]
            let flagMemory:FlagMemory
            baseflag.memory.BaseManager={
                requiredScreeps:{
                    miner:0
                },
                requestedCreeps:{
                    minerRequest:[],
                    upgraderRequest:[],
                },
            }
            baseflag.memory.energyGainRate = 0
            baseflag.memory.energyRequired = 0
            baseflag.memory.scheduledDeliverys = []
            baseflag.memory.energyTransportTicket = []
            }
        }

    var sourceflags = room.find(FIND_FLAGS,{filter:{color:COLOR_ORANGE}})
    if(!sourceflags[0]){
        console.log(`there is no source flag`)
        var sources = room.find(FIND_SOURCES)
        for ( let source of sources){
            var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})
            if(baseflag){
                let path:PathStep[] = source.pos.findPathTo(baseflag[0],{ignoreCreeps:true})
                let flagName = room.createFlag(path[0].x,path[0].y,source.id, COLOR_ORANGE)
                Game.flags[flagName].pos.createConstructionSite(STRUCTURE_CONTAINER)
                Game.flags[flagName].memory.hasMiner = false
                Game.flags[flagName].memory.assignedBase = baseflag[0].name
                if(baseflag[0].memory.BaseManager){
                    baseflag[0].memory.BaseManager.requiredScreeps.miner = baseflag[0].memory.BaseManager.requiredScreeps.miner +1
                    if(typeof(flagName) === 'string'){
                        console.log(flagName)
                        baseflag[0].memory.BaseManager.requestedCreeps.minerRequest.push(flagName)
                    }
                }
            }
        }
    }else{
        for ( var i in sourceflags){
            sourceflags[i].updateEnergySupply(sourceflags[i])
        }
    }
    var demandFlags = room.find(FIND_FLAGS,{filter:{color:COLOR_YELLOW}})
    if(!demandFlags[0]){
        if(room.controller){
            let path:PathStep[] = room.controller.pos.findPathTo(baseflag[0],{ignoreCreeps:true})
            let flagName = room.createFlag(path[0].x,path[0].y,room.controller.id, COLOR_YELLOW)
            Game.flags[flagName].memory.energyRequired = 0
            Game.flags[flagName].memory.scheduledDeliverys = []
        }        
    }

}

baseManager = (room:Room) =>{
    initBaseManager(room)
    const harvester:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HARVESTER)
    const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)
    const miner:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.MINER)


    let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})[0]
    if(!spawn.spawning){
        if(baseflag){
            if(baseflag.memory.BaseManager){
                let i: keyof typeof baseflag.memory.BaseManager.requestedCreeps
                for(i in baseflag.memory.BaseManager.requestedCreeps){
                    
                    var request = baseflag.memory.BaseManager.requestedCreeps[i]
                    for (var k in request){
                        if( i == "minerRequest"){
                            console.log(`miner is requested for source ${request}`)
                            var ret = spawn.spawnTypeCreep(spawn,typeMiner,request[k])
                            if(ret===OK){
                                var index = request.indexOf(request[k]);
                                if (index !== -1) {
                                    baseflag.memory.BaseManager.requestedCreeps[i].splice(index, 1);
                                }
                            }
                        }
                    }
                    
                }
            }
        }else
        if (harvester.length <1){
            console.log(`trying to spawn harvester currently ${harvester.length} exist`)
            spawn.spawnTypeCreep(spawn,typeHarvester)
        }else
        if (miner.length <1){
            console.log(`trying to spawn upgrader currently ${builder.length} exist`)
            spawn.spawnTypeCreep(spawn,typeMiner)
        }else
        if (upgrader.length <1){
            console.log(`trying to spawn upgrader currently ${upgrader.length} exist`)
            spawn.spawnTypeCreep(spawn,typeUpgrader)
        }else
        if (builder.length <1){
            console.log(`trying to spawn upgrader currently ${builder.length} exist`)
            spawn.spawnTypeCreep(spawn,typeBuilder)
        }
    }
};

export default baseManager
