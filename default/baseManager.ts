import * as _ from "lodash"
import MemoryRole from "./memory.creep"
import {typeHarvester} from "./role.harvester";
import { typeUpgrader } from "./role.upgrader";
import { typeBuilder } from "./role.builder";
import { typeMiner } from "./role.miner";

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
                },
                requestedCreeps:{
                    minerRequest:[],
                    upgraderRequest:[],
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
                    if(typeof(flagName) === 'string'){
                        console.log(flagName)
                        baseflag[0].memory.BaseManager.requestedCreeps.minerRequest.push(flagName)
                    }
                    
                }
            }
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
