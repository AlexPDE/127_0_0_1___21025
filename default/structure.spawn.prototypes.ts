import * as _ from "lodash"
import MemoryRole from "./memory.creep"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (spawn:StructureSpawn, creepType:creepType, targetId?)=>{
        if(creepType.role == MemoryRole.MINER){
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(creepType.body,creepType.name, {memory: {role: creepType.role, state:creepType.state, targetId: targetId}})
        }else{
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(creepType.body,creepType.name, {memory: {role: creepType.role, state:creepType.state}})
        }
        
        return spawnCreepReturn
    }
}

export default initStructureSpawnPrototypes

