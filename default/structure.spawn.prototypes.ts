import * as _ from "lodash"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (spawn:StructureSpawn, creepType:creepType)=>{
        console.log(`creepType.name = ${creepType.name}`)
        var spawnCreepReturn:ScreepsReturnCode = spawn.spawnCreep(creepType.body,creepType.name, {memory: {role: creepType.role, state:creepType.state}})
        console.log(`spawnCreepReturn = ${spawnCreepReturn}`)
    }
}

export default initStructureSpawnPrototypes

