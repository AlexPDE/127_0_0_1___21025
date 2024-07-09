import initStructureSpawnPrototypes from "./structure.spawn.prototypes"
import initCreepPrototypes from "./creep.prototype"
import initFlagPrototypes from "./flag.prototype"

let initPrototypes: Function

initPrototypes= ()=>{
    initStructureSpawnPrototypes()
    initCreepPrototypes()
    initFlagPrototypes()
}

export default initPrototypes