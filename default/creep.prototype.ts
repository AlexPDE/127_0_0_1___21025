import * as _ from "lodash"

let initCreepPrototypes:Function

initCreepPrototypes= ()=>{
    Creep.prototype.getEnergy = (creep:Creep) =>{
        type source= Source
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0]
        if(creep.harvest(source)===ERR_NOT_IN_RANGE){
            creep.moveTo(source)
        }   
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.state = "hasEnergy"
        }
    }
}

export default initCreepPrototypes