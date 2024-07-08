import * as _ from "lodash"

let initStructureSpawnPrototypes:Function

initStructureSpawnPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (spawn:StructureSpawn, creepType:creepType)=>{
        spawn.spawnCreep(creepType.body,creepType.name, {memory: {role: creepType.role, state:creepType.state}})
    }
}

export default initStructureSpawnPrototypes

