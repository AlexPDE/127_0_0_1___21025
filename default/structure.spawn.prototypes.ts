import * as _ from "lodash"
import MemoryRole from "./memory.creep"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (maxSize: boolean, spawn:StructureSpawn, creepType:creepType, flagId?)=>{
        let body = creepType.baseBody 
        if(maxSize){
            let room = spawn.room
            let energyBody = 0
            for(let i = 0; i < body.length;i++){
                energyBody = energyBody + BODYPART_COST[body[i]]
            }
            let availableEnergy = spawn.room.energyCapacityAvailable-energyBody
            let costBodyAddition = 0
            for (let i = 0; i < creepType.body.length;i++){
                costBodyAddition = costBodyAddition + BODYPART_COST[creepType.body[i]]
            }

            

            //console.log(availableEnergy/costBodyAddition)
        }


        if(creepType.role == MemoryRole.MINER||creepType.role == MemoryRole.BUILDER){
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(body,creepType.name+Game.time   , {memory: {role: creepType.role, state:creepType.state, flagId: flagId, base:spawn.room.name}})
        }else{
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(body,creepType.name+Game.time, {memory: {role: creepType.role, state:creepType.state, base:spawn.room.name}})
        }
        return spawnCreepReturn
    }
}

export default initStructureSpawnPrototypes


