import initStructureSpawnPrototypes from "./structure.spawn.prototypes"
import initCreepPrototypes from "./creep.prototype"

let initPrototypes: Function

initPrototypes= ()=>{
    initStructureSpawnPrototypes()
    initCreepPrototypes()
}

export default initPrototypes