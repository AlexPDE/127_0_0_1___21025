import * as _ from "lodash"
import MemoryRole from "./memory.creep"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (spawn:StructureSpawn, creepType:creepType, targetId?)=>{
        if(creepType.role == MemoryRole.MINER){
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(creepType.body,creepType.name+Game.time   , {memory: {role: creepType.role, state:creepType.state, targetId: targetId, base:spawn.room.name}})
        }else{
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(creepType.body,creepType.name+Game.time, {memory: {role: creepType.role, state:creepType.state, base:spawn.room.name}})
        }
        
        return spawnCreepReturn
    }
}

export default initStructureSpawnPrototypes

