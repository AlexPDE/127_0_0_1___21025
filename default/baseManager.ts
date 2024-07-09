import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";

let baseManager: Function;
let initBaseManager:Function;

initBaseManager = (room:Room) =>{
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
                }
            }
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
                }
            }
        }
    }
}

baseManager = (room:Room) =>{
    initBaseManager(room)
    console.log(`base Manager is running`)
    const harvester:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.HARVESTER)
    const upgrader:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.UPGRADER)
    const builder:Creep[] = _.filter(Game.creeps, (creep:Creep): boolean => creep.memory.role == MemoryRole.BUILDER)


    let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    if (harvester.length <4){
        console.log(`trying to spawn harvester currently ${harvester.length} exist`)
        spawn.spawnTypeCreep(spawn,typeHarvester)
    }else
    if (upgrader.length <3){
        console.log(`trying to spawn upgrader currently ${upgrader.length} exist`)
        spawn.spawnTypeCreep(spawn,typeUpgrader)
    }else
    if (builder.length <1){
        console.log(`trying to spawn upgrader currently ${builder.length} exist`)
        spawn.spawnTypeCreep(spawn,typeBuilder)
    }
};

export default baseManager
