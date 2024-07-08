import * as _ from "lodash"

let initPrototypes:Function

initPrototypes= ()=>{
    StructureSpawn.prototype.spawnTypeCreep = (spawn:StructureSpawn, creepType:creepType)=>{
        spawn.spawnCreep(creepType.body,creepType.name, {memory: {role: creepType.role, state:creepType.state}})
    }
}

export default initPrototypes

