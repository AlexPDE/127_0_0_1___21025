import * as _ from "lodash"
import MemoryRole from "./memory.creep"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (body:BodyPartConstant[], spawn:StructureSpawn, role:string, flagId?)=>{

        if(role == MemoryRole.MINER||role == MemoryRole.BUILDER){
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(body,role+Game.time   , {memory: {role: role, state:"justSpawned", flagId: flagId, base:spawn.room.name}})
        }else{
            var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(body,role+Game.time, {memory: {role: role, state:"justSpawned", base:spawn.room.name}})
        }
        return spawnCreepReturn
    }
}

export default initStructureSpawnPrototypes


